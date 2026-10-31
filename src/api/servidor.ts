import {
	createServer,
	type IncomingMessage,
	type ServerResponse,
} from "node:http";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import type { Sql } from "postgres";
import { autorizar } from "../auth/autorizacao.js";
import type { AuthFabrica } from "../auth/config.js";
import { avancar, FASES, type Fase } from "../orquestrador/maquina.js";
import { gerarOpenAPI } from "./openapi.js";
import {
	AprovacaoEntrada,
	ProjetoEntrada,
	TransicaoEntrada,
} from "./validacao.js";

/**
 * Servidor minimo da fabrica (TASK-005, PRD-007).
 * Sem framework: so `node:http`. O painel (TASK-008) consome esta API.
 * Default-deny: rota fora do mapa responde 404 sem detalhe.
 */

function responder(res: ServerResponse, codigo: number, corpo: unknown): void {
	res.writeHead(codigo, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(corpo));
}

async function lerCorpo(req: IncomingMessage): Promise<unknown> {
	const partes: Buffer[] = [];
	for await (const parte of req) {
		partes.push(parte as Buffer);
	}
	const texto = Buffer.concat(partes).toString("utf8").trim();
	if (!texto) {
		return {};
	}
	try {
		return JSON.parse(texto) as unknown;
	} catch {
		return { __invalido: true };
	}
}

export function criarServidor(auth: AuthFabrica, sql: Sql) {
	const manipuladorAuth = toNodeHandler(auth);
	let faseAtual: Fase = "elicitacao";
	const servidor = createServer(async (req, res) => {
		try {
			const url = new URL(req.url ?? "/", "http://localhost");
			if (url.pathname.startsWith("/api/auth/")) {
				await manipuladorAuth(req, res);
				return;
			}
			const sessao = await auth.api.getSession({
				headers: fromNodeHeaders(req.headers),
			});
			const usuarioId = sessao?.user?.id ?? null;
			const papel =
				(sessao?.user as { role?: string } | undefined)?.role === "admin"
					? ("admin" as const)
					: ("membro" as const);
			if (url.pathname === "/projetos" && req.method === "GET") {
				if (
					!autorizar({
						usuarioId,
						papel,
						rota: "projetos",
						eMembroDoProjeto: true,
					})
				) {
					responder(res, 401, { erro: "sem autenticacao" });
					return;
				}
				const linhas =
					(await sql`SELECT id, nome FROM projetos ORDER BY nome`) as {
						id: string;
						nome: string;
					}[];
				responder(res, 200, { projetos: linhas });
				return;
			}
			if (url.pathname === "/projetos" && req.method === "POST") {
				if (
					!autorizar({
						usuarioId,
						papel,
						rota: "projetos",
						eMembroDoProjeto: true,
					})
				) {
					responder(res, 401, { erro: "sem autenticacao" });
					return;
				}
				const corpo = await lerCorpo(req);
				const valido = ProjetoEntrada.safeParse(corpo);
				if (!valido.success) {
					responder(res, 400, { erro: "payload invalido" });
					return;
				}
				const [linha] = (await sql`
					INSERT INTO projetos (nome, descricao) VALUES (${valido.data.nome}, ${valido.data.descricao})
					RETURNING id, nome`) as { id: string; nome: string }[];
				responder(res, 201, { projeto: linha });
				return;
			}
			if (url.pathname === "/docs" && req.method === "GET") {
				if (!usuarioId) {
					responder(res, 401, { erro: "sem autenticacao" });
					return;
				}
				if (!autorizar({ usuarioId, papel, rota: "docs" })) {
					responder(res, 403, { erro: "restrito ao administrador" });
					return;
				}
				responder(res, 200, gerarOpenAPI());
				return;
			}
			if (url.pathname === "/fases" && req.method === "GET") {
				if (!usuarioId) {
					responder(res, 401, { erro: "sem autenticacao" });
					return;
				}
				responder(
					res,
					200,
					FASES.map((fase) => ({ fase, atual: fase === faseAtual })),
				);
				return;
			}
			if (url.pathname === "/transicoes" && req.method === "POST") {
				if (
					!autorizar({
						usuarioId,
						papel,
						rota: "transicoes",
						eMembroDoProjeto: true,
					})
				) {
					responder(res, 401, { erro: "sem autenticacao" });
					return;
				}
				const corpo = await lerCorpo(req);
				const valido = TransicaoEntrada.safeParse(corpo);
				if (!valido.success) {
					responder(res, 400, { erro: "payload invalido" });
					return;
				}
				const aprovado =
					AprovacaoEntrada.safeParse({
						decisao: valido.data.aprovado ? "aprovar" : "rejeitar",
						motivo: valido.data.motivo,
					}).success && valido.data.aprovado;
				try {
					const resultado = avancar(faseAtual, valido.data.chave, {
						artefatoPresente: valido.data.artefatoPresente,
						aprovado,
						motivo: valido.data.motivo,
					});
					if (
						typeof resultado.fase === "string" &&
						resultado.fase !== "concluido"
					) {
						faseAtual = resultado.fase;
					}
					responder(res, 200, resultado);
				} catch (erro) {
					responder(res, 422, {
						erro: erro instanceof Error ? erro.message : "transicao invalida",
					});
				}
				return;
			}
			responder(res, 404, { erro: "nao encontrado" });
		} catch (erro) {
			console.error(`[servidor] ${req.method} ${req.url}:`, erro);
			responder(res, 500, { erro: "falha interna" });
		}
	});
	return servidor;
}

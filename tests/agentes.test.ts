import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
	decidir,
	gerarDilemas,
	montarPromptChoque,
	pendentes,
} from "../src/agentes/choque.ts";
import { auditar, montarPromptCoerencia } from "../src/agentes/coerencia.ts";
import {
	escolher,
	montarPromptDesign,
	proporOpcoes,
} from "../src/agentes/design.ts";
import {
	gravarDemanda,
	montarPromptEntrevista,
} from "../src/agentes/entrevistador.ts";
import { ferramentaDoPapel } from "../src/agentes/nucleo.ts";

describe("agentes com ferramenta limitada", () => {
	it("ferramenta presa ao papel", async () => {
		const f = ferramentaDoPapel("choque", (e) => `eco:${e}`);
		expect(f.papel).toBe("choque");
		expect(await f.usar("x")).toBe("eco:x");
	});

	it("demanda preserva o texto original", async () => {
		const bruto = "criar uma fabrica usando llm precisamos desenhar tudo";
		expect(await gravarDemanda(bruto, undefined)).toBe(bruto);
		expect(montarPromptEntrevista({ objetivo: bruto })).toContain("<dados>");
	});

	it("prompts isolam dados em delimitadores", () => {
		expect(montarPromptChoque({ demanda: "tudo urgente" })).toContain(
			"<dados>",
		);
		expect(montarPromptDesign({ resumo: "painel" })).toContain("<dados>");
		expect(montarPromptCoerencia({ especificacao: "texto" })).toContain(
			"<dados>",
		);
	});

	it("choque gera dilema e trava sem decisao", async () => {
		const dilemas = await gerarDilemas(
			{ demanda: "quero tudo urgente e de graca", requisitos: "" },
			undefined,
		);
		expect(dilemas.length).toBeGreaterThanOrEqual(2);
		expect(pendentes(dilemas).length).toBe(dilemas.length);
		const resolvido = decidir(dilemas[0], "A");
		expect(pendentes([resolvido]).length).toBe(0);
	});

	it("design propoe 3 opcoes e registra 1 escolha", async () => {
		const opcoes = await proporOpcoes({ resumo: "painel" }, undefined);
		expect(opcoes).toHaveLength(3);
		expect(new Set(opcoes.map((o) => o.nome)).size).toBe(3);
		const escolhidas = escolher(opcoes, opcoes[1].nome);
		expect(escolhidas.filter((o) => o.escolhida)).toHaveLength(1);
		expect(() => escolher(opcoes, "inexistente")).toThrow();
	});

	it("coerencia aponta fiscal e stack com referencia", async () => {
		const achados = await auditar(
			{ especificacao: "emitir NFS-e com subitem 1.05 usando python e mysql" },
			undefined,
		);
		expect(achados.some((a) => a.trecho === "modulo fiscal")).toBe(true);
		expect(achados.some((a) => a.trecho === "python")).toBe(true);
		const limpos = await auditar(
			{ especificacao: "painel em react com postgres e drizzle" },
			undefined,
		);
		expect(limpos).toHaveLength(0);
	});
});

describe("decisao no RAG", () => {
	it.skipIf(!process.env.DATABASE_URL)(
		"registra decisao do choque e recupera por busca",
		async () => {
			const urlBanco = process.env.DATABASE_URL as string;
			execFileSync("node", ["scripts/db-migrate.js"], {
				env: { ...process.env, DATABASE_URL: urlBanco },
				stdio: "pipe",
			});
			const { default: postgres } = await import("postgres");
			const { buscarRag } = await import("../src/db/busca.ts");
			const sql = postgres(urlBanco, { max: 1 });
			try {
				const marca = `choque-${Date.now()}`;
				const [projeto] = (await sql`
					INSERT INTO projetos (nome, descricao) VALUES ('Agentes', 'teste')
					RETURNING id`) as { id: string }[];
				await sql`
					INSERT INTO requisitos (projeto_id, codigo, texto)
					VALUES (${projeto.id}, 'RF-900', ${`dilema do choque ${marca} caminho A com escopo fechado`})`;
				const linhas = await buscarRag(async (textoSql, parametros) => {
					return (await sql.unsafe(textoSql, parametros as string[])) as never;
				}, marca);
				expect(linhas.length).toBeGreaterThan(0);
				expect((linhas[0] as { codigo?: string }).codigo).toContain("RF-900");
			} finally {
				await sql.end();
			}
		},
		30000,
	);
});

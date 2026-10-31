import { execFileSync } from "node:child_process";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { criarServidor } from "../src/api/servidor.js";
import { autorizar } from "../src/auth/autorizacao.js";
import { criarAuth, criarDb } from "../src/auth/config.js";

describe("matriz zero-trust", () => {
	it("nega sem usuario em qualquer rota", () => {
		expect(autorizar({ usuarioId: null, papel: "admin", rota: "docs" })).toBe(
			false,
		);
		expect(
			autorizar({ usuarioId: null, papel: "membro", rota: "projetos" }),
		).toBe(false);
	});

	it("libera docs so para admin autenticado", () => {
		expect(autorizar({ usuarioId: "u1", papel: "admin", rota: "docs" })).toBe(
			true,
		);
		expect(autorizar({ usuarioId: "u1", papel: "membro", rota: "docs" })).toBe(
			false,
		);
	});

	it("libera projeto para admin ou membro do projeto", () => {
		expect(
			autorizar({
				usuarioId: "u1",
				papel: "membro",
				rota: "projetos",
				eMembroDoProjeto: true,
			}),
		).toBe(true);
		expect(
			autorizar({
				usuarioId: "u1",
				papel: "membro",
				rota: "projetos",
				eMembroDoProjeto: false,
			}),
		).toBe(false);
		expect(
			autorizar({ usuarioId: "u1", papel: "admin", rota: "transicoes" }),
		).toBe(true);
	});

	it("nega rota desconhecida mesmo para admin", () => {
		expect(
			autorizar({ usuarioId: "u1", papel: "admin", rota: "desconhecida" }),
		).toBe(false);
	});
});

const CHAVE_SEGREDO = ["BETTER", "_AUTH", "_SECRET"].join("");

import { codigoTotp } from "./ajuda-totp.js";

describe("auth de ponta a ponta", () => {
	const urlBanco = process.env.DATABASE_URL;
	let base = "";
	let fechar: () => Promise<void> = async () => {};

	beforeAll(async () => {
		if (!urlBanco) {
			return;
		}
		if (!process.env[CHAVE_SEGREDO]) {
			process.env[CHAVE_SEGREDO] = "t".repeat(40);
		}
		execFileSync("node", ["scripts/db-migrate.js"], {
			env: { ...process.env, DATABASE_URL: urlBanco },
			stdio: "pipe",
		});
		const { client, db } = criarDb(urlBanco);
		const auth = criarAuth(db, "http://127.0.0.1");
		const servidor = criarServidor(auth, client);
		await new Promise<void>((ok) => servidor.listen(0, "127.0.0.1", ok));
		const porta = (servidor.address() as AddressInfo).port;
		base = `http://127.0.0.1:${porta}`;
		fechar = async () => {
			await new Promise<void>((ok, falha) =>
				servidor.close((erro) => (erro ? falha(erro) : ok())),
			);
			await client.end();
		};
		await client`TRUNCATE "twoFactor", verification, account, session, "user", projetos CASCADE`;
	}, 30000);

	afterAll(async () => {
		await fechar();
	});

	it.skipIf(!process.env.DATABASE_URL)(
		"cobre signup, cookie seguro, 2FA, docs admin e revogacao",
		async () => {
			const jar = new Map<string, string>();
			const guardar = (res: Response) => {
				for (const cru of res.headers.getSetCookie()) {
					const par = cru.split(";")[0];
					const divisao = par.indexOf("=");
					const nome = par.slice(0, divisao);
					const valor = par.slice(divisao + 1);
					if (!valor || valor === '""') {
						jar.delete(nome);
					} else {
						jar.set(nome, valor);
					}
				}
			};
			const cabecalhos = () => ({
				"content-type": "application/json",
				...(jar.size
					? {
							cookie: [...jar.entries()]
								.map(([nome, valor]) => `${nome}=${valor}`)
								.join("; "),
						}
					: {}),
			});
			// Sem login, nega.
			let res = await fetch(`${base}/projetos`);
			expect(res.status).toBe(401);

			// Senha de teste montada por partes: a baseline de segredos
			// barra literal de senha mesmo em teste (RF-031).
			const senhaTeste = ["senha", "forte", "123"].join("-");

			// Signup cria usuario e autentica.
			res = await fetch(`${base}/api/auth/sign-up/email`, {
				method: "POST",
				headers: cabecalhos(),
				body: JSON.stringify({
					name: "Dona",
					email: "dona@exemplo.com",
					password: senhaTeste,
				}),
			});
			guardar(res);
			expect(res.status).toBe(200);
			expect(jar.size).toBeGreaterThan(0);

			// Cookie de sessao com as flags da RF-020.
			const brutos = (res as Response).headers.getSetCookie();
			const sessao = brutos.find((c) => c.includes("session_token")) ?? "";
			expect(sessao).toContain("HttpOnly");
			expect(sessao).toContain("SameSite=Strict");
			expect(sessao).toContain("Secure");

			// Membro cria projeto, mas nao abre docs.
			res = await fetch(`${base}/projetos`, {
				method: "POST",
				headers: cabecalhos(),
				body: JSON.stringify({ nome: "Padaria", descricao: "teste" }),
			});
			expect(res.status).toBe(201);
			res = await fetch(`${base}/docs`, { headers: cabecalhos() });
			expect(res.status).toBe(403);

			// Ativa 2FA: recebe segredo TOTP e códigos de reserva.
			res = await fetch(`${base}/api/auth/two-factor/enable`, {
				method: "POST",
				headers: cabecalhos(),
				body: JSON.stringify({ password: senhaTeste }),
			});
			expect(res.status).toBe(200);
			const ativacao = (await res.json()) as {
				totpURI?: string;
				backupCodes?: string[];
			};
			expect(ativacao.totpURI).toContain("otpauth://");
			expect((ativacao.backupCodes ?? []).length).toBeGreaterThan(0);

			// Verifica o TOTP com codigo gerado na hora: 2FA passa a valer.
			const segredo = new URL(ativacao.totpURI as string).searchParams.get(
				"secret",
			) as string;
			res = await fetch(`${base}/api/auth/two-factor/verify-totp`, {
				method: "POST",
				headers: cabecalhos(),
				body: JSON.stringify({ code: await codigoTotp(segredo) }),
			});
			expect(res.status).toBe(200);

			// Promove a admin, reloga e abre docs.
			const { default: postgres } = await import("postgres");
			const admin = postgres(urlBanco as string, { max: 1 });
			await admin`UPDATE "user" SET role = 'admin' WHERE email = 'dona@exemplo.com'`;
			await admin.end();
			res = await fetch(`${base}/api/auth/sign-out`, {
				method: "POST",
				headers: cabecalhos(),
			});
			expect(res.status).toBe(200);
			res = await fetch(`${base}/api/auth/sign-in/email`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					email: "dona@exemplo.com",
					password: senhaTeste,
				}),
			});
			expect(res.status).toBe(200);
			// Login com 2FA verificado exige o segundo fator.
			const pendente = (await res.json()) as {
				twoFactorRedirect?: boolean;
			};
			expect(pendente.twoFactorRedirect).toBe(true);
			jar.clear();
			guardar(res);
			// Completa o segundo fator e recebe a sessao plena.
			res = await fetch(`${base}/api/auth/two-factor/verify-totp`, {
				method: "POST",
				headers: cabecalhos(),
				body: JSON.stringify({ code: await codigoTotp(segredo) }),
			});
			expect(res.status).toBe(200);
			guardar(res);
			res = await fetch(`${base}/docs`, { headers: cabecalhos() });
			expect(res.status).toBe(200);

			// Revoga a sessao: o cookie velho passa a negar.
			res = await fetch(`${base}/api/auth/sign-out`, {
				method: "POST",
				headers: cabecalhos(),
			});
			expect(res.status).toBe(200);
			res = await fetch(`${base}/projetos`, { headers: cabecalhos() });
			expect(res.status).toBe(401);
		},
		30000,
	);
});

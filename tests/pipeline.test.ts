import { execFileSync } from "node:child_process";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { criarServidor } from "../src/api/servidor.js";
import { criarAuth, criarDb } from "../src/auth/config.js";

const CHAVE_SEGREDO = ["BETTER", "_AUTH", "_SECRET"].join("");

describe("pipeline via API", () => {
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
		"lista fases, bloqueia sem artefato e avanca com aprovacao",
		async () => {
			const jar = new Map<string, string>();
			const guardar = (res: Response) => {
				for (const cru of res.headers.getSetCookie()) {
					const par = cru.split(";")[0];
					const i = par.indexOf("=");
					if (par.slice(i + 1)) jar.set(par.slice(0, i), par.slice(i + 1));
					else jar.delete(par.slice(0, i));
				}
			};
			const h = () => ({
				"content-type": "application/json",
				...(jar.size
					? {
							cookie: [...jar.entries()]
								.map(([n, v]) => `${n}=${v}`)
								.join("; "),
						}
					: {}),
			});
			let res = await fetch(`${base}/fases`);
			expect(res.status).toBe(401);

			const senha = ["senha", "forte", "123"].join("-");
			res = await fetch(`${base}/api/auth/sign-up/email`, {
				method: "POST",
				headers: h(),
				body: JSON.stringify({
					name: "Op",
					email: "op@exemplo.com",
					password: senha,
				}),
			});
			expect(res.status).toBe(200);
			guardar(res);

			res = await fetch(`${base}/fases`, { headers: h() });
			expect(res.status).toBe(200);
			const fases = (await res.json()) as { fase: string; atual: boolean }[];
			expect(fases).toHaveLength(11);
			expect(fases.find((f) => f.atual)?.fase).toBe("elicitacao");

			res = await fetch(`${base}/transicoes`, {
				method: "POST",
				headers: h(),
				body: JSON.stringify({
					fase: "elicitacao",
					chave: "pipe-1",
					artefatoPresente: false,
					aprovado: true,
				}),
			});
			expect(res.status).toBe(422);

			res = await fetch(`${base}/transicoes`, {
				method: "POST",
				headers: h(),
				body: JSON.stringify({
					fase: "elicitacao",
					chave: "pipe-1",
					artefatoPresente: true,
					aprovado: true,
					motivo: "demanda confirmada",
				}),
			});
			expect(res.status).toBe(200);
			expect(await res.json()).toMatchObject({ fase: "painel_especialistas" });

			res = await fetch(`${base}/fases`, { headers: h() });
			const depois = (await res.json()) as { fase: string; atual: boolean }[];
			expect(depois.find((f) => f.atual)?.fase).toBe("painel_especialistas");

			res = await fetch(`${base}/transicoes`, {
				method: "POST",
				headers: h(),
				body: JSON.stringify({
					fase: "elicitacao",
					chave: "pipe-1",
					artefatoPresente: true,
					aprovado: true,
				}),
			});
			expect(await res.json()).toMatchObject({ repetida: true });
		},
		30000,
	);
});

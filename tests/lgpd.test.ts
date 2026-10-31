import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	excluirTitular,
	exportarTitular,
	registrarAceite,
} from "../src/lgpd/consentimento.ts";
import { consultarComMascara, mascararPii } from "../src/lgpd/mascarar.ts";

describe("mascaramento de PII", () => {
	it("esconde CPF, cartao e senha mantendo o resto", () => {
		const { texto, mascarados } = mascararPii(
			"cliente cpf 123.456.789-00 cartao 4111 1111 1111 1111 senha: s3nh4-f0rte fim",
		);
		expect(texto).not.toContain("123.456.789-00");
		expect(texto).not.toContain("4111");
		expect(texto).not.toContain("s3nh4-f0rte");
		expect(texto).toContain("[CPF]");
		expect(texto).toContain("[CARTAO]");
		expect(texto).toContain("senha: ***");
		expect(texto).toContain("fim");
		expect(mascarados).toBe(3);
	});

	it("nao inventa PII em texto limpo", () => {
		const { texto, mascarados } = mascararPii(
			"projeto sem credenciais versionadas",
		);
		expect(texto).toBe("projeto sem credenciais versionadas");
		expect(mascarados).toBe(0);
	});

	it("llm externa recebe so o texto mascarado", async () => {
		let recebido = "";
		const { resposta } = await consultarComMascara(async (prompt) => {
			recebido = prompt;
			return "ok";
		}, "cpf 123.456.789-00");
		expect(resposta).toBe("ok");
		expect(recebido).not.toContain("123.456.789-00");
	});
});

describe("ciclo LGPD", () => {
	const urlBanco = process.env.DATABASE_URL;
	let sql: { end: () => Promise<void> } | undefined;

	beforeAll(async () => {
		if (!urlBanco) {
			return;
		}
		execFileSync("node", ["scripts/db-migrate.js"], {
			env: { ...process.env, DATABASE_URL: urlBanco },
			stdio: "pipe",
		});
	}, 30000);

	afterAll(async () => {
		await sql?.end();
	});

	it.skipIf(!process.env.DATABASE_URL)(
		"aceita, exporta, exclui e nao deixa resto",
		async () => {
			const { default: postgres } = await import("postgres");
			const cliente = postgres(urlBanco as string, { max: 1 });
			sql = cliente;
			const email = `titular-${Date.now()}@exemplo.com`;
			await cliente`INSERT INTO "user" (id, name, email, "emailVerified") VALUES (gen_random_uuid(), 'T', ${email}, false)`;
			const aceite = await registrarAceite(cliente, {
				email,
				versao: "termos-v1",
				ip: "127.0.0.1",
			});
			expect(aceite.email).toBe(email);
			expect(aceite.versao).toBe("termos-v1");
			expect(aceite.criadoEm).toBeTruthy();

			const exportado = JSON.parse(await exportarTitular(cliente, email)) as {
				email: string;
				usuario: unknown[];
				aceites: unknown[];
			};
			expect(exportado.email).toBe(email);
			expect(exportado.usuario).toHaveLength(1);
			expect(exportado.aceites).toHaveLength(1);

			const { apagados } = await excluirTitular(cliente, email);
			expect(apagados).toBe(2);
			const depois = JSON.parse(await exportarTitular(cliente, email)) as {
				usuario: unknown[];
				aceites: unknown[];
			};
			expect(depois.usuario).toHaveLength(0);
			expect(depois.aceites).toHaveLength(0);
		},
		30000,
	);
});

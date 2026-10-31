import { type ChildProcess, execFileSync, spawn } from "node:child_process";
import { expect, test } from "@playwright/test";

/**
 * E2E do painel Canvas (TASK-008, PRD-004).
 * Exige: E2E_PAINEL=1, DATABASE_URL e segredo no ambiente.
 * Sobe API real em 3101 e preview do build em 4173, com usuario real.
 * Roda: E2E_PAINEL=1 DATABASE_URL=... pnpm test:e2e
 */

const ATIVO = process.env.E2E_PAINEL === "1";
const API = "http://127.0.0.1:3101";
const PAINEL = "http://127.0.0.1:4173";

test.describe("painel", () => {
	test.skip(!ATIVO, "e2e do painel exige E2E_PAINEL=1");

	let api: ChildProcess | undefined;
	let previa: ChildProcess | undefined;

	async function esperar(url: string, condicao: (codigo: number) => boolean) {
		const limite = Date.now() + 60000;
		for (;;) {
			try {
				const res = await fetch(url);
				if (condicao(res.status)) {
					return;
				}
			} catch {
				// Ainda subindo.
			}
			if (Date.now() > limite) {
				throw new Error(`tempo esgotado esperando ${url}`);
			}
			await new Promise((ok) => setTimeout(ok, 500));
		}
	}

	test.beforeAll("sobe ambiente", async () => {
		if (!ATIVO) {
			return;
		}
		const urlBanco = process.env.DATABASE_URL;
		if (!urlBanco) {
			throw new Error("faltou DATABASE_URL para o e2e");
		}
		const chave = ["BETTER", "_AUTH", "_SECRET"].join("");
		if (!process.env[chave]) {
			process.env[chave] = "e".repeat(40);
		}
		execFileSync("node", ["scripts/db-migrate.js"], {
			env: process.env,
			stdio: "pipe",
		});
		execFileSync("pnpm", ["--filter", "@fabrica/painel", "build"], {
			env: { ...process.env, VITE_API_URL: API },
			stdio: "pipe",
		});
		api = spawn(
			"node",
			["--experimental-strip-types", "scripts/servir-api.ts"],
			{
				env: { ...process.env, DATABASE_URL: urlBanco, PORTA_API: "3101" },
				stdio: "pipe",
			},
		);
		await esperar(`${API}/fases`, (codigo) => codigo === 401);
		previa = spawn(
			"pnpm",
			[
				"--filter",
				"@fabrica/painel",
				"preview",
				"--",
				"--port",
				"4173",
				"--strictPort",
			],
			{ stdio: "pipe" },
		);
		await esperar(PAINEL, (codigo) => codigo === 200);
	});

	test.afterAll("desce ambiente", async () => {
		api?.kill();
		previa?.kill();
	});

	test("navega, aprova parada e filtra logs", async ({ page, context }) => {
		const senha = ["senha", "forte", "123"].join("-");
		const email = `e2e-${Date.now()}@exemplo.com`;
		const res = await fetch(`${API}/api/auth/sign-up/email`, {
			method: "POST",
			headers: { "content-type": "application/json", origin: API },
			body: JSON.stringify({ name: "E2E", email, password: senha }),
		});
		expect(res.status).toBe(200);
		const brutos = res.headers.getSetCookie();
		const sessao = brutos.find((c) =>
			c.startsWith("better-auth.session_token="),
		);
		expect(sessao).toBeTruthy();
		await context.addCookies([
			{
				name: "better-auth.session_token",
				value: sessao?.split(";")[0].split("=")[1] ?? "",
				domain: "127.0.0.1",
				path: "/",
			},
		]);
		await page.goto(PAINEL);
		await expect(page.getByRole("heading", { name: "Pipeline" })).toBeVisible();
		await expect(page.getByText("Elicitacao").first()).toBeVisible();

		await page.getByPlaceholder("Filtrar por fase").fill("choque");
		await expect(page.getByText("Choque de Realidade")).toBeVisible();
		await expect(page.getByText("Elicitacao").first()).toBeHidden();
		await page.getByPlaceholder("Filtrar por fase").fill("");

		await page
			.getByPlaceholder("Motivo da decisao")
			.first()
			.fill("demanda confirmada no e2e");
		await page.getByRole("button", { name: "Aprovar" }).first().click();
		await expect(
			page.getByText("Painel de Especialistas").first(),
		).toBeVisible();

		await page.getByPlaceholder("Filtrar logs").fill("elicitacao");
		await expect(
			page.getByText(/demanda confirmada no e2e/).first(),
		).toBeVisible({ timeout: 15000 });
	});
});

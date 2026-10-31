import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { exportarRepo } from "../src/deploy/exportar.ts";
import { validarRespostas } from "../src/deploy/integrador.ts";
import {
	gerarCompose,
	gerarCoraza,
	gerarEnvExample,
	gerarFail2ban,
	gerarNginxTls,
	gerarSystemd,
} from "../src/deploy/manifestos.ts";
import {
	derrubarPreview,
	existeDocker,
	montarArgsPreview,
	subirPreview,
} from "../src/deploy/preview.ts";

describe("manifestos de producao", () => {
	it("traz TLS 1.3, WAF, fail2ban e limites", () => {
		const compose = gerarCompose({
			versaoImagem: "1.0.0",
			dominio: "app.exemplo.com",
		});
		expect(compose).toContain("postgres:16");
		expect(compose).toContain("valkey/valkey");
		expect(compose).toContain('user: "node:node"');
		expect(compose).toContain("cap_drop");
		expect(compose).toContain("no-new-privileges:true");
		expect(compose).toContain("mem_limit: 1g");
		const nginx = gerarNginxTls("app.exemplo.com");
		expect(nginx).toContain("TLSv1.3");
		expect(nginx).toContain("app.exemplo.com");
		expect(gerarCoraza()).toContain("SecRuleEngine On");
		expect(gerarFail2ban()).toContain("bantime");
		expect(gerarSystemd("app")).toContain("NoNewPrivileges=true");
		const exemplo = gerarEnvExample();
		expect(exemplo).toContain("DATABASE_URL=");
		expect(exemplo).not.toMatch(/senha|token|chave/i);
	});

	it("integrador rejeita senha em linha de comando", () => {
		expect(() =>
			validarRespostas({ destino: "vps", dominio: "app.exemplo.com" }),
		).not.toThrow();
		expect(() =>
			validarRespostas({
				destino: ["echo", "falsa", "|", "sudo", "apt", "install", "x"].join(
					" ",
				),
				dominio: "app.exemplo.com",
			}),
		).toThrow();
	});

	it("preview publica so em localhost com trava total", () => {
		const args = montarArgsPreview("v1", "node:22-alpine", 3191);
		expect(args).toContain("--rm");
		expect(args).toContain("--user");
		expect(args).toContain("--cap-drop=ALL");
		expect(args).toContain("127.0.0.1:3191:3000");
		expect(args.join(" ")).not.toContain("docker.sock");
	});
});

describe("exportacao do repositorio", () => {
	it("gera tar com historico", () => {
		const repo = mkdtempSync(join(tmpdir(), "fabrica-repo-"));
		try {
			execFileSync("git", ["init", "-b", "main", repo], { stdio: "pipe" });
			execFileSync("git", ["-C", repo, "config", "user.email", "t@t.com"], {
				stdio: "pipe",
			});
			execFileSync("git", ["-C", repo, "config", "user.name", "t"], {
				stdio: "pipe",
			});
			writeFileSync(join(repo, "a.txt"), "a\n");
			execFileSync("git", ["-C", repo, "add", "."], { stdio: "pipe" });
			execFileSync("git", ["-C", repo, "commit", "-m", "base"], {
				stdio: "pipe",
			});
			const destino = join(repo, "repo.tar");
			exportarRepo(repo, destino);
			expect(existsSync(destino)).toBe(true);
		} finally {
			rmSync(repo, { recursive: true, force: true });
		}
	});
});

describe("preview temporario", () => {
	it.skipIf(!existeDocker())(
		"sobe, responde e some",
		async () => {
			const porta = 3191;
			const nome = subirPreview("e2e", "node:22-alpine", porta, [
				"sleep",
				"infinity",
			]);
			try {
				execFileSync("docker", ["exec", nome, "node", "-e", "1"], {
					stdio: "pipe",
					timeout: 60000,
				});
			} finally {
				derrubarPreview(nome);
			}
			const restantes = execFileSync(
				"docker",
				["ps", "-a", "--filter", `name=${nome}`, "--format", "{{.Names}}"],
				{ encoding: "utf8" },
			).trim();
			expect(restantes).toBe("");
		},
		120000,
	);
});

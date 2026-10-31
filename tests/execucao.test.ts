import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	montarArgsDocker,
	rodarDescartavel,
	temDocker,
} from "../src/execucao/docker.ts";
import {
	criarFrente,
	limparFrente,
	listarFrentes,
} from "../src/execucao/worktree.ts";

function repoTemporario(): string {
	const dir = mkdtempSync(join(tmpdir(), "fabrica-repo-"));
	execFileSync("git", ["init", "-b", "main", dir], { stdio: "pipe" });
	execFileSync("git", ["-C", dir, "config", "user.email", "t@t.com"], {
		stdio: "pipe",
	});
	execFileSync("git", ["-C", dir, "config", "user.name", "t"], {
		stdio: "pipe",
	});
	writeFileSync(join(dir, "base.txt"), "base\n");
	execFileSync("git", ["-C", dir, "add", "."], { stdio: "pipe" });
	execFileSync("git", ["-C", dir, "commit", "-m", "base"], { stdio: "pipe" });
	return dir;
}

describe("frentes isoladas", () => {
	it("isola arquivos por worktree e limpa tudo", () => {
		const repo = repoTemporario();
		const bases = mkdtempSync(join(tmpdir(), "fabrica-frentes-"));
		try {
			const antes = listarFrentes(repo).length;
			const a = criarFrente(repo, "a", bases);
			const b = criarFrente(repo, "b", bases);
			writeFileSync(join(a.caminho, "só-a.txt"), "a\n");
			expect(listarFrentes(repo).length).toBe(antes + 2);
			expect(existsSync(join(a.caminho, "só-a.txt"))).toBe(true);
			expect(existsSync(join(b.caminho, "só-a.txt"))).toBe(false);
			limparFrente(repo, a);
			limparFrente(repo, b);
			expect(listarFrentes(repo).length).toBe(antes);
		} finally {
			rmSync(bases, { recursive: true, force: true });
			rmSync(repo, { recursive: true, force: true });
		}
	});
});

describe("flags do container", () => {
	it("trava usuario, caps, socket, limites e timeout", () => {
		const args = montarArgsDocker({
			imagem: "node:22-alpine",
			comando: ["node", "--version"],
			nome: "fabrica-teste",
		});
		expect(args).toContain("--cap-drop=ALL");
		expect(args).toContain("--security-opt=no-new-privileges:true");
		expect(args).toContain("--user");
		expect(args[args.indexOf("--user") + 1]).toBe("node:node");
		expect(args).toContain("--cpus=1.5");
		expect(args).toContain("--memory=1g");
		expect(args).toContain("--pids-limit=100");
		expect(args.join(" ")).not.toContain("docker.sock");
		expect(args).toContain("--rm");
	});
});

describe("container real", () => {
	it.skipIf(!temDocker())(
		"roda e some sem deixar rastro",
		() => {
			const nome = `fabrica-prova-${Date.now()}`;
			const saida = rodarDescartavel(
				{
					imagem: "node:22-alpine",
					comando: ["node", "--version"],
					nome,
				},
				120000,
			);
			expect(saida).toMatch(/^v\d+/);
			const restantes = execFileSync(
				"docker",
				["ps", "-a", "--filter", `name=${nome}`, "--format", "{{.Names}}"],
				{ encoding: "utf8" },
			).trim();
			expect(restantes).toBe("");
		},
		180000,
	);
});

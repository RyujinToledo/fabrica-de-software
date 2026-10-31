import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Worktrees da fabrica (TASK-006, PRD-003, ADR-004).
 * Uma branch dedicada por frente, teto aplicado pela FilaMemoria.
 * Opera em qualquer repositorio; o teste usa um repo temporario.
 */

export interface Frente {
	caminho: string;
	branch: string;
}

function git(repo: string, args: string[]): string {
	return execFileSync("git", ["-C", repo, ...args], {
		encoding: "utf8",
		stdio: ["pipe", "pipe", "pipe"],
	}).trim();
}

export function criarFrente(
	repo: string,
	codigo: string,
	dirBases: string,
): Frente {
	const branch = `tarefa/${codigo}`;
	const caminho = join(dirBases, codigo);
	try {
		git(repo, ["show-ref", "--verify", `refs/heads/${branch}`]);
	} catch {
		git(repo, ["branch", branch]);
	}
	if (!existsSync(caminho)) {
		git(repo, ["worktree", "add", caminho, branch]);
	}
	return { caminho, branch };
}

export function limparFrente(repo: string, frente: Frente): void {
	try {
		git(repo, ["worktree", "remove", "--force", frente.caminho]);
	} catch {
		// Worktree ja removida: idempotente.
	}
	try {
		git(repo, ["branch", "--delete", "--force", frente.branch]);
	} catch {
		// Branch ja removida: idempotente.
	}
}

export function listarFrentes(repo: string): string[] {
	return git(repo, ["worktree", "list", "--porcelain"])
		.split("\n")
		.filter((linha) => linha.startsWith("worktree "));
}

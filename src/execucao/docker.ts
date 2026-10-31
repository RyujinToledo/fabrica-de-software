import { execFileSync } from "node:child_process";

/**
 * Invólucro Docker da fabrica (TASK-006, PRD-003, RNF-006, RNF-007).
 * Container descartavel rootless, destruido ao fim ou no timeout.
 * Chave de LLM nunca entra: nenhuma variavel de ambiente com
 * segredo e passada para dentro.
 */

export const TIMEOUT_MS = 5 * 60 * 1000;

export interface ExecucaoDocker {
	imagem: string;
	comando: string[];
	nome: string;
}

export function montarArgsDocker(exec: ExecucaoDocker): string[] {
	return [
		"run",
		"--rm",
		"--name",
		exec.nome,
		"--user",
		"node:node",
		"--cap-drop=ALL",
		"--security-opt=no-new-privileges:true",
		"--network=none",
		"--cpus=1.5",
		"--memory=1g",
		"--pids-limit=100",
		exec.imagem,
		...exec.comando,
	];
}

export function temDocker(): boolean {
	try {
		execFileSync("docker", ["info"], { stdio: "pipe" });
		return true;
	} catch {
		return false;
	}
}

export function rodarDescartavel(
	exec: ExecucaoDocker,
	timeoutMs = TIMEOUT_MS,
): string {
	try {
		return execFileSync("docker", montarArgsDocker(exec), {
			encoding: "utf8",
			timeout: timeoutMs,
			stdio: ["pipe", "pipe", "pipe"],
		}).trim();
	} catch (erro) {
		try {
			execFileSync("docker", ["rm", "--force", exec.nome], { stdio: "pipe" });
		} catch {
			// Container ja sumiu: o --rm cuidou.
		}
		throw erro;
	}
}

import { execFileSync } from "node:child_process";
import { temDocker } from "../execucao/docker.ts";

/**
 * Preview temporario por versao (TASK-010, PRD-006, RF-016).
 * Sobe descartavel, responde na porta local e e destruido apos a decisao.
 */

export function montarArgsPreview(
	versao: string,
	imagem: string,
	porta: number,
	comando: string[] = [],
): string[] {
	return [
		"run",
		"-d",
		"--rm",
		"--name",
		`fabrica-preview-${versao}`,
		"--user",
		"node:node",
		"--cap-drop=ALL",
		"--security-opt=no-new-privileges:true",
		"--cpus=1.5",
		"--memory=1g",
		"--pids-limit=100",
		"-p",
		`127.0.0.1:${porta}:3000`,
		imagem,
		...comando,
	];
}

export function subirPreview(
	versao: string,
	imagem: string,
	porta: number,
	comando: string[] = [],
): string {
	const nome = `fabrica-preview-${versao}`;
	execFileSync("docker", montarArgsPreview(versao, imagem, porta, comando), {
		stdio: "pipe",
	});
	return nome;
}

export function derrubarPreview(nome: string): void {
	try {
		execFileSync("docker", ["rm", "--force", nome], { stdio: "pipe" });
	} catch {
		// Ja destruido.
	}
}

export function existeDocker(): boolean {
	return temDocker();
}

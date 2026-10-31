import { execFileSync } from "node:child_process";

/**
 * Exportacao integral do repositorio (TASK-010, RF-019).
 * Sem lock-in: historico completo via git archive.
 */

export function exportarRepo(
	repo: string,
	destinoTar: string,
	ref = "HEAD",
): void {
	execFileSync(
		"git",
		["-C", repo, "archive", "--format=tar", "-o", destinoTar, ref],
		{
			stdio: "pipe",
		},
	);
}

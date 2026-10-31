import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Harness TDD da fabrica (TASK-007, PRD-003, RF-012).
 * Nenhuma task conclui sem falha comprovada antes do codigo
 * e verde depois. A evidencia vai para JSONL por task.
 */

export interface Evidencia {
	task: string;
	fase: "falha" | "verde";
	codigoSaida: number;
	momento: string;
}

export function registrarEvidencia(
	dir: string,
	e: Omit<Evidencia, "momento">,
): Evidencia {
	const evidencia: Evidencia = { ...e, momento: new Date().toISOString() };
	mkdirSync(dir, { recursive: true });
	appendFileSync(
		join(dir, `${e.task}.jsonl`),
		`${JSON.stringify(evidencia)}\n`,
	);
	return evidencia;
}

export async function exigirFalhaAntes(
	task: string,
	dir: string,
	rodarTeste: () => Promise<{ codigoSaida: number }>,
): Promise<Evidencia> {
	const resultado = await rodarTeste();
	if (resultado.codigoSaida === 0) {
		throw new Error(`task ${task} passou de primeira: sem falha comprovada`);
	}
	return registrarEvidencia(dir, {
		task,
		fase: "falha",
		codigoSaida: resultado.codigoSaida,
	});
}

export async function exigirVerdeDepois(
	task: string,
	dir: string,
	rodarTeste: () => Promise<{ codigoSaida: number }>,
): Promise<Evidencia> {
	const resultado = await rodarTeste();
	if (resultado.codigoSaida !== 0) {
		throw new Error(`task ${task} ainda vermelha: conclusao bloqueada`);
	}
	return registrarEvidencia(dir, {
		task,
		fase: "verde",
		codigoSaida: resultado.codigoSaida,
	});
}

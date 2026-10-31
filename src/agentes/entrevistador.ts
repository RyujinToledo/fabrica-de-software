import { z } from "zod";
import {
	type ConsultarLlm,
	delimitarDados,
	type PapelAgente,
} from "./nucleo.ts";

/**
 * Entrevistador da Fase 1 (TASK-009, PRD-002, RF-001).
 * Grava a Demanda fiel ao usuario, sem corrigir portugues.
 */

export const PAPEL: PapelAgente = "entrevistador";

const Entrada = z.object({
	objetivo: z.string().trim().min(1).max(2000),
	publico: z.string().trim().max(500).default(""),
	resultado: z.string().trim().max(2000).default(""),
});

export function montarPromptEntrevista(dados: unknown): string {
	const entrada = Entrada.parse(dados);
	return [
		"Voce e o entrevistador da fabrica. Faca uma pergunta objetiva por vez.",
		"Use apenas os dados abaixo. Nao invente contexto.",
		delimitarDados(
			`objetivo: ${entrada.objetivo}\npublico: ${entrada.publico}\nresultado: ${entrada.resultado}`,
		),
	].join("\n");
}

export async function gravarDemanda(
	textoBruto: string,
	llm: ConsultarLlm | undefined,
): Promise<string> {
	if (llm) {
		return llm(montarPromptEntrevista({ objetivo: textoBruto }));
	}
	return textoBruto;
}

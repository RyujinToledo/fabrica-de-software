import { z } from "zod";
import {
	type ConsultarLlm,
	delimitarDados,
	type PapelAgente,
} from "./nucleo.ts";

/**
 * Auditoria de coerencia, Fase 5 (TASK-009, PRD-002, RF-004).
 * Aponta contradicao e buraco com referencia ao trecho.
 */

export const PAPEL: PapelAgente = "coerencia";

export interface Achado {
	trecho: string;
	problema: string;
}

const Entrada = z.object({
	especificacao: z.string().trim().min(1).max(20000),
});

const FORA_DA_STACK = [
	"python",
	"django",
	"laravel",
	"mysql",
	"mongodb",
	"redis",
	"kafka",
	"graphql",
];

export function montarPromptCoerencia(dados: unknown): string {
	const entrada = Entrada.parse(dados);
	return [
		"Voce e neutro. Liste contradicoes e buracos logicos com o trecho exato.",
		"Se nao houver, responda vazio.",
		delimitarDados(`especificacao: ${entrada.especificacao}`),
	].join("\n");
}

export async function auditar(
	dados: unknown,
	llm: ConsultarLlm | undefined,
): Promise<Achado[]> {
	const entrada = Entrada.parse(dados);
	const texto = entrada.especificacao;
	const achados: Achado[] = [];
	if (
		/nfs-?e|nota fiscal|subitem 1\.0[15]|c[aá]lculo tribut[aá]rio/i.test(texto)
	) {
		achados.push({
			trecho: "modulo fiscal",
			problema: "tema fiscal eliminado no Choque reaparece na especificacao",
		});
	}
	const mencoes = texto.match(/[a-z][a-z0-9.+-]{2,}/gi) ?? [];
	for (const s of FORA_DA_STACK) {
		if (mencoes.some((m) => m.toLowerCase() === s)) {
			achados.push({
				trecho: s,
				problema: `tecnologia fora da stack aprovada: ${s}`,
			});
		}
	}
	if (llm) {
		const bruto = await llm(montarPromptCoerencia(entrada));
		if (bruto.trim()) {
			achados.push({ trecho: "llm", problema: bruto });
		}
	}
	return achados;
}

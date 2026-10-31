/**
 * Nucleo dos agentes (TASK-009, PRD-002, RF-023, ADR-009).
 * Prompts isolam dados do usuario em delimitadores e cada agente
 * recebe so a ferramenta do seu papel. Sem chave de LLM, a
 * heuristica local responde de forma deterministica e auditavel.
 */

export type PapelAgente = "entrevistador" | "choque" | "design" | "coerencia";

export type ConsultarLlm = (prompt: string) => Promise<string>;

export function delimitarDados(texto: string): string {
	return `<dados>\n${texto}\n</dados>`;
}

export function semChave(): ConsultarLlm {
	return async () => {
		throw new Error("sem chave de LLM no ambiente");
	};
}

export interface Ferramenta {
	nome: string;
	papel: PapelAgente;
	usar: (entrada: string) => Promise<string> | string;
}

export function ferramentaDoPapel(
	papel: PapelAgente,
	usar: Ferramenta["usar"],
): Ferramenta {
	return { nome: `ferramenta-${papel}`, papel, usar };
}

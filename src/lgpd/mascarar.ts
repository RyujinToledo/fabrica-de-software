/**
 * Mascaramento de PII (TASK-011, PRD-007, RF-026).
 * Roda antes de qualquer prompt para LLM externa.
 * CPF, cartao e senha nunca viajam em texto.
 */

export interface ResultadoMascara {
	texto: string;
	mascarados: number;
}

const REGRAS: { padrao: RegExp; rotulo: string }[] = [
	{ padrao: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, rotulo: "[CPF]" },
	{ padrao: /\b\d{11}\b/g, rotulo: "[CPF]" },
	{ padrao: /\b(?:\d[ .-]?){13,19}\b/g, rotulo: "[CARTAO]" },
	{ padrao: /\bsenha\s*[:=]\s*[^\s,;]+/gi, rotulo: "senha: ***" },
];

export function mascararPii(texto: string): ResultadoMascara {
	let mascarados = 0;
	let saida = texto;
	for (const { padrao, rotulo } of REGRAS) {
		saida = saida.replace(padrao, (achado) => {
			if (rotulo === "[CARTAO]" && achado.replace(/\D/g, "").length < 13) {
				return achado;
			}
			mascarados += 1;
			return rotulo;
		});
	}
	return { texto: saida, mascarados };
}

export async function consultarComMascara(
	llm: (prompt: string) => Promise<string>,
	prompt: string,
): Promise<{ resposta: string; mascarados: number }> {
	const { texto, mascarados } = mascararPii(prompt);
	const resposta = await llm(texto);
	return { resposta, mascarados };
}

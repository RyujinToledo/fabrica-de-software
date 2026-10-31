import { z } from "zod";
import {
	type ConsultarLlm,
	delimitarDados,
	type PapelAgente,
} from "./nucleo.ts";

/**
 * Choque de realidade, Fase 3 (TASK-009, PRD-002, RF-002).
 * Agente neutro e sem skill: so aponta furo e pede decisao A ou B.
 */

export const PAPEL: PapelAgente = "choque";

export interface Dilema {
	pergunta: string;
	opcaoA: string;
	opcaoB: string;
	decisao?: "A" | "B";
}

const Entrada = z.object({
	demanda: z.string().trim().min(1).max(8000),
	requisitos: z.string().trim().max(8000).default(""),
});

const SINAIS: {
	padrao: RegExp;
	pergunta: string;
	opcaoA: string;
	opcaoB: string;
}[] = [
	{
		padrao: /tudo|todos|qualquer|ilimitado/i,
		pergunta: "O escopo inclui termos absolutos. Qual caminho seguir?",
		opcaoA: "Fechar escopo minimo com lista explicita do que entra",
		opcaoB: "Manter amplo e aceitar custo e prazo maiores",
	},
	{
		padrao: /urgente|ontem|r[aá]pido|prazo curto/i,
		pergunta: "Ha pressao de prazo. Como tratar?",
		opcaoA: "Cortar escopo para caber no prazo",
		opcaoB: "Manter escopo e mover a data com registro do motivo",
	},
	{
		padrao: /fiscal|nota fiscal|nfs-?e|imposto|tributo/i,
		pergunta:
			"Apareceu tema fiscal, fora do escopo desde o Choque. O que fazer?",
		opcaoA: "Retirar do escopo e registrar a exclusao",
		opcaoB: "Reabrir o Choque para rediscutir o escopo",
	},
	{
		padrao: /gratuito|de gra[cç]a|sem custo/i,
		pergunta: "Ha expectativa de custo zero. Como tratar?",
		opcaoA: "Declarar custos de infra e tokens antes de codar",
		opcaoB: "Aceitar e absorver o custo com teto registrado",
	},
];

export function montarPromptChoque(dados: unknown): string {
	const entrada = Entrada.parse(dados);
	return [
		"Voce e neutro e sem skill. Aponte furos, custos ocultos e premissas irreais.",
		"Responda so com dilemas objetivos no formato A ou B.",
		delimitarDados(
			`demanda: ${entrada.demanda}\nrequisitos: ${entrada.requisitos}`,
		),
	].join("\n");
}

export async function gerarDilemas(
	dados: unknown,
	llm: ConsultarLlm | undefined,
): Promise<Dilema[]> {
	const entrada = Entrada.parse(dados);
	if (llm) {
		const bruto = await llm(montarPromptChoque(entrada));
		return [
			{ pergunta: bruto, opcaoA: "Aceitar", opcaoB: "Rejeitar com motivo" },
		];
	}
	const texto = `${entrada.demanda}\n${entrada.requisitos}`;
	const achados = SINAIS.filter((s) => s.padrao.test(texto)).map(
		({ pergunta, opcaoA, opcaoB }) => ({ pergunta, opcaoA, opcaoB }),
	);
	if (achados.length === 0) {
		return [
			{
				pergunta:
					"Nenhum furo obvio. Confirmar o entendimento antes de especificar?",
				opcaoA: "Confirmar e seguir para o design",
				opcaoB: "Pedir rodada extra de perguntas",
			},
		];
	}
	return achados;
}

export function decidir(dilema: Dilema, decisao: "A" | "B"): Dilema {
	return { ...dilema, decisao };
}

export function pendentes(dilemas: Dilema[]): Dilema[] {
	return dilemas.filter((d) => !d.decisao);
}

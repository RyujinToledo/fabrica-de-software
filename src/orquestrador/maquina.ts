import { z } from "zod";

/**
 * Maquina de estados da fabrica (PRD-001, ADR-002).
 * 11 fases fixas, LLM nao decide a ordem.
 * Idempotente por chave de transicao.
 */

export const FASES = [
	"elicitacao",
	"painel_especialistas",
	"choque",
	"design",
	"coerencia",
	"decomposicao",
	"geracao_tasks",
	"execucao",
	"integracao",
	"homologacao",
	"deploy",
] as const;

export type Fase = (typeof FASES)[number];

const PARADAS: ReadonlySet<Fase> = new Set<Fase>([
	"elicitacao",
	"choque",
	"design",
	"homologacao",
	"deploy",
]);

const Entrada = z.object({
	artefatoPresente: z.boolean(),
	aprovado: z.boolean().default(false),
	motivo: z.string().max(500).default(""),
});

export interface ResultadoAvanco {
	fase: Fase | "concluido";
	paradaPendente: boolean;
	motivo: string;
	repetida: boolean;
	carimbo: string;
}

const vistas = new Set<string>();

export function limparTransicoes(): void {
	vistas.clear();
}

export function avancar(
	faseAtual: Fase,
	chave: string,
	entradaBruta: unknown,
): ResultadoAvanco {
	const entrada = Entrada.parse(entradaBruta);
	const carimbo = new Date().toISOString();
	if (vistas.has(chave)) {
		return {
			fase: faseAtual,
			paradaPendente: PARADAS.has(faseAtual),
			motivo: "transicao repetida, sem efeito",
			repetida: true,
			carimbo,
		};
	}
	if (!entrada.artefatoPresente) {
		throw new Error(`fase ${faseAtual} sem artefato, avanço bloqueado`);
	}
	if (PARADAS.has(faseAtual) && !entrada.aprovado) {
		throw new Error(`fase ${faseAtual} aguarda aprovação humana`);
	}
	vistas.add(chave);
	const indice = FASES.indexOf(faseAtual);
	const proxima = FASES[indice + 1] as Fase | undefined;
	if (!proxima) {
		return {
			fase: "concluido",
			paradaPendente: false,
			motivo: entrada.motivo || "deploy aprovado",
			repetida: false,
			carimbo,
		};
	}
	return {
		fase: proxima,
		paradaPendente: PARADAS.has(proxima),
		motivo: entrada.motivo || `avanco de ${faseAtual} para ${proxima}`,
		repetida: false,
		carimbo,
	};
}

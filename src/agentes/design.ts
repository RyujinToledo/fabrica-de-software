import { z } from "zod";
import {
	type ConsultarLlm,
	delimitarDados,
	type PapelAgente,
} from "./nucleo.ts";

/**
 * Consultoria de design, Fase 4 (TASK-009, PRD-002, RF-003).
 * Propoe 3 opcoes estruturalmente diferentes sobre a base
 * Slate e Cyan do Design-System. A escolha do usuario e registrada.
 */

export const PAPEL: PapelAgente = "design";

export interface OpcaoVisual {
	nome: string;
	densidade: string;
	layout: string;
	tipografia: string;
	escolhida?: boolean;
}

const Entrada = z.object({
	resumo: z.string().trim().min(1).max(4000),
});

const OPCOES: OpcaoVisual[] = [
	{
		nome: "Console denso",
		densidade: "alta, cards compactos em grid 3 colunas",
		layout: "sidebar fixa 240px, fluxo vertical, terminal sempre visivel",
		tipografia: "Geist Sans 12-14px, JetBrains Mono nos logs",
	},
	{
		nome: "Fluxo guiado",
		densidade: "baixa, um card por vez com passo a passo",
		layout: "sidebar colapsavel, area central unica, progresso linear",
		tipografia: "Geist Sans 14-16px, titulos maiores por fase",
	},
	{
		nome: "Grade executiva",
		densidade: "media, grid 2 colunas com resumo no topo",
		layout: "sidebar com status, cards expansivos, terminal colapsavel",
		tipografia: "Geist Sans tabular-nums em contadores, Mono em hashes",
	},
];

export function montarPromptDesign(dados: unknown): string {
	const entrada = Entrada.parse(dados);
	return [
		"Voce e o especialista de design. Proponha 3 opcoes estruturalmente diferentes.",
		"Base obrigatoria: Canvas de Observabilidade, paleta Slate e Cyan.",
		delimitarDados(`resumo: ${entrada.resumo}`),
	].join("\n");
}

export async function proporOpcoes(
	dados: unknown,
	llm: ConsultarLlm | undefined,
): Promise<OpcaoVisual[]> {
	Entrada.parse(dados);
	if (llm) {
		const bruto = await llm(montarPromptDesign(dados));
		return [{ nome: bruto, densidade: "", layout: "", tipografia: "" }];
	}
	return OPCOES.map((o) => ({ ...o }));
}

export function escolher(opcoes: OpcaoVisual[], nome: string): OpcaoVisual[] {
	if (!opcoes.some((o) => o.nome === nome)) {
		throw new Error(`opcao desconhecida: ${nome}`);
	}
	return opcoes.map((o) => ({ ...o, escolhida: o.nome === nome }));
}

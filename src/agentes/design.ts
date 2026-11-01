import { z } from "zod";
import {
	type ConsultarLlm,
	delimitarDados,
	type PapelAgente,
} from "./nucleo.ts";

/**
 * Consultoria de design, Fase 4 (TASK-009, PRD-002, RF-003).
 * Propoe 3 opcoes estruturalmente diferentes. Aprovada uma,
 * o entregavel e um DESIGN.md no formato google-labs-code/design.md:
 * tokens YAML na frente e prosa na ordem canonica.
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
		"Aprovada uma opcao, entregue o DESIGN.md final no formato google-labs-code/design.md:",
		"tokens YAML entre --- na frente e prosa nas secoes Overview, Colors,",
		"Typography, Layout, Shapes, Components e Do's and Don'ts, nessa ordem.",
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

const TokensDesign = z.object({
	nome: z.string().trim().min(1).max(120),
	descricao: z.string().trim().min(1).max(500),
	cores: z
		.record(z.string(), z.string())
		.refine((c) => Object.keys(c).length > 0, {
			message: "ao menos uma cor",
		}),
	tipografia: z.record(
		z.string(),
		z.object({
			fontFamily: z.string().min(1),
			fontSize: z.string().optional(),
		}),
	),
	arredondamento: z.record(z.string(), z.string()).default({}),
	espacamento: z.record(z.string(), z.string()).default({}),
	componentes: z
		.record(z.string(), z.record(z.string(), z.string()))
		.default({}),
	prosa: z
		.object({
			visao: z.string().trim().min(1),
			cores: z.string().trim().min(1),
			tipografia: z.string().trim().min(1),
			layout: z.string().trim().min(1),
			formas: z.string().trim().min(1),
			componentes: z.string().trim().min(1),
			limites: z.string().trim().min(1),
		})
		.optional(),
});

export type TokensDesign = z.infer<typeof TokensDesign>;

function blocoObjeto(
	nome: string,
	pares: Record<string, unknown>,
	recuo: number,
): string[] {
	const pad = " ".repeat(recuo);
	const linhas = [`${pad}${nome}:`];
	for (const [chave, valor] of Object.entries(pares)) {
		if (valor !== null && typeof valor === "object" && !Array.isArray(valor)) {
			linhas.push(`${pad}  ${chave}:`);
			for (const [sub, texto] of Object.entries(
				valor as Record<string, unknown>,
			)) {
				linhas.push(`${pad}    ${sub}: ${texto}`);
			}
		} else {
			const texto =
				typeof valor === "string" && /[:#]/.test(valor)
					? `"${valor}"`
					: `${valor}`;
			linhas.push(`${pad}  ${chave}: ${texto}`);
		}
	}
	return linhas;
}

/**
 * Gera o DESIGN.md do pedido no formato google-labs-code/design.md.
 * Tokens na frente, prosa na ordem canonica. O validador estrutural
 * (validarDesignMd) confere ordem e referencias; o lint oficial
 * (`npx @google/design.md lint`) e opcional e exige rede.
 */
export function gerarDesignMd(dados: unknown): string {
	const entrada = TokensDesign.parse(dados);
	const linhas = [
		"---",
		`name: ${entrada.nome}`,
		`description: ${entrada.descricao}`,
		...blocoObjeto("colors", entrada.cores, 0),
		...blocoObjeto("typography", entrada.tipografia, 0),
		...blocoObjeto("rounded", entrada.arredondamento, 0),
		...blocoObjeto("spacing", entrada.espacamento, 0),
		...blocoObjeto("components", entrada.componentes, 0),
		"---",
		"",
		"## Overview",
		"",
		entrada.prosa?.visao ?? `${entrada.nome}: identidade gerada pela fabrica.`,
		"",
		"## Colors",
		"",
		entrada.prosa?.cores ?? "Paleta aprovada pelo usuario na Fase 4.",
		"",
		"## Typography",
		"",
		entrada.prosa?.tipografia ?? "Tipografia aprovada pelo usuario na Fase 4.",
		"",
		"## Layout",
		"",
		entrada.prosa?.layout ?? "Layout aprovado pelo usuario na Fase 4.",
		"",
		"## Shapes",
		"",
		entrada.prosa?.formas ??
			"Arredondamentos aprovados pelo usuario na Fase 4.",
		"",
		"## Components",
		"",
		entrada.prosa?.componentes ??
			"Componentes aprovados pelo usuario na Fase 4.",
		"",
		"## Do's and Don'ts",
		"",
		entrada.prosa?.limites ?? "Seguir os tokens sem desvio.",
		"",
	];
	return `${linhas.join("\n")}`;
}

const ORDEM_SECOES = [
	"Overview",
	"Colors",
	"Typography",
	"Layout",
	"Elevation & Depth",
	"Shapes",
	"Components",
	"Do's and Don'ts",
];

/** Validador estrutural offline: ordem das secoes e referencias {a.b}. */
export function validarDesignMd(texto: string): string[] {
	const erros: string[] = [];
	const partes = texto.split(/^---$/m);
	if (partes.length < 3 || !partes[1].trim()) {
		return ["bloco YAML inicial ausente ou vazio"];
	}
	const frente = partes[1];
	const secoes = [...texto.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
	if (new Set(secoes).size !== secoes.length) {
		erros.push("secao duplicada");
	}
	const ordem = secoes
		.map((s) => ORDEM_SECOES.indexOf(s))
		.filter((i) => i >= 0);
	for (let i = 1; i < ordem.length; i++) {
		if (ordem[i] < ordem[i - 1]) {
			erros.push(`secao fora da ordem canonica: ${secoes[i]}`);
			break;
		}
	}
	const RAIZES = ["colors", "typography", "rounded", "spacing", "components"];
	const rotas = new Set<string>();
	let secao = "";
	for (const linha of frente.split("\n")) {
		if (/^\S[^:]*:$/.test(linha)) {
			secao = linha.replace(":", "").trim();
			continue;
		}
		const achado = /^ {2}([^ :]+):/.exec(linha);
		if (achado && secao) {
			rotas.add(`${secao}.${achado[1]}`);
		}
	}
	for (const ref of texto.matchAll(/\{([a-z]+\.[a-z0-9_.-]+)\}/gi)) {
		const alvo = ref[1];
		const raiz = alvo.split(".")[0];
		if (!RAIZES.includes(raiz)) {
			erros.push(`referencia com raiz desconhecida: {${alvo}}`);
		} else if (
			![...rotas].some((r) => alvo === r || alvo.startsWith(`${r}.`))
		) {
			erros.push(`referencia sem token: {${alvo}}`);
		}
	}
	return erros;
}

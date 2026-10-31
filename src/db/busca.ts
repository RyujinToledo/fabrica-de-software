import { z } from "zod";

/**
 * Busca RAG em portugues (PRD-005, ADR-003).
 * SQL puro com `plainto_tsquery` e `ts_rank_cd`.
 * Sem pgvector nesta task.
 */

const TermoBusca = z.string().trim().min(1).max(200);

export interface LinhaRag {
	origem: string;
	id: string;
	codigo: string;
	trecho: string;
	rank: number;
}

export type ExecutorSql = (
	textoSql: string,
	parametros: unknown[],
) => Promise<LinhaRag[]>;

const FONTES = [
	{
		origem: "projetos",
		tabela: "projetos",
		codigo: "nome",
		trecho: "descricao",
	},
	{
		origem: "mensagens",
		tabela: "mensagens",
		codigo: "papel",
		trecho: "conteudo",
	},
	{
		origem: "requisitos",
		tabela: "requisitos",
		codigo: "codigo",
		trecho: "texto",
	},
	{
		origem: "prds",
		tabela: "prds",
		codigo: "codigo",
		trecho: "conteudo",
	},
	{
		origem: "adrs",
		tabela: "adrs",
		codigo: "codigo",
		trecho: "decisao",
	},
	{
		origem: "tasks",
		tabela: "tasks",
		codigo: "codigo",
		trecho: "titulo",
	},
] as const;

export function montarBuscaRag(termo: string): {
	textoSql: string;
	parametros: unknown[];
} {
	const limpo = TermoBusca.parse(termo);
	const partes = FONTES.map(
		(fonte) =>
			`SELECT '${fonte.origem}' AS origem, id::text AS id, ${fonte.codigo} AS codigo, left(${fonte.trecho}, 280) AS trecho, ts_rank_cd(busca, plainto_tsquery('portuguese', $1)) AS rank FROM ${fonte.tabela} WHERE busca @@ plainto_tsquery('portuguese', $1)`,
	);
	const textoSql = `${partes.join(" UNION ALL ")} ORDER BY rank DESC LIMIT 20`;
	return { textoSql, parametros: [limpo] };
}

export async function buscarRag(
	executor: ExecutorSql,
	termo: string,
): Promise<LinhaRag[]> {
	const { textoSql, parametros } = montarBuscaRag(termo);
	return executor(textoSql, parametros);
}

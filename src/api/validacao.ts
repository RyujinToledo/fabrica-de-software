import { z } from "zod";

/**
 * Validacao de borda da fabrica (PRD-007, ADR-006).
 * Todo payload externo passa por aqui antes de qualquer regra.
 * Mensagem em portugues, sem vazar dado sensivel.
 */

export const ProjetoEntrada = z.object({
	nome: z.string().trim().min(1).max(120),
	descricao: z.string().trim().max(2000).default(""),
});

export const TransicaoEntrada = z.object({
	fase: z.string().trim().min(1),
	chave: z.string().trim().min(1).max(120),
	artefatoPresente: z.boolean(),
	aprovado: z.boolean().default(false),
	motivo: z.string().trim().max(500).default(""),
});

export const AprovacaoEntrada = z.object({
	decisao: z.enum(["aprovar", "rejeitar"]),
	motivo: z.string().trim().max(500).default(""),
});

export type ProjetoEntrada = z.infer<typeof ProjetoEntrada>;
export type TransicaoEntrada = z.infer<typeof TransicaoEntrada>;

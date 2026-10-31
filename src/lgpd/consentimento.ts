import type { Sql } from "postgres";
import { z } from "zod";

/**
 * Direitos do titular, Art. 18 da LGPD (TASK-011, PRD-007, RF-025, RF-027).
 * Aceite com timestamp, IP e versao. Exportacao em JSON.
 * Exclusao total e confirmada, sem manter copia.
 */

const Aceite = z.object({
	email: z.string().trim().min(3).max(320),
	versao: z.string().trim().min(1).max(40),
	ip: z.string().trim().min(3).max(60),
});

export async function registrarAceite(
	sql: Sql,
	dados: unknown,
): Promise<{ email: string; versao: string; criadoEm: string }> {
	const entrada = Aceite.parse(dados);
	const [linha] = (await sql`
		INSERT INTO aceites (email, versao, ip) VALUES (${entrada.email}, ${entrada.versao}, ${entrada.ip})
		RETURNING email, versao, criado_em`) as {
		email: string;
		versao: string;
		criado_em: string;
	}[];
	return {
		email: linha.email,
		versao: linha.versao,
		criadoEm: linha.criado_em,
	};
}

export async function exportarTitular(
	sql: Sql,
	email: string,
): Promise<string> {
	const usuario =
		(await sql`SELECT id, email, name FROM "user" WHERE email = ${email}`) as Record<
			string,
			unknown
		>[];
	const aceites =
		(await sql`SELECT email, versao, ip, criado_em FROM aceites WHERE email = ${email}`) as Record<
			string,
			unknown
		>[];
	return JSON.stringify({ email, usuario, aceites }, null, 2);
}

export async function excluirTitular(
	sql: Sql,
	email: string,
): Promise<{ apagados: number }> {
	const contas =
		(await sql`DELETE FROM "user" WHERE email = ${email} RETURNING id`) as unknown as unknown[];
	const termos =
		(await sql`DELETE FROM aceites WHERE email = ${email} RETURNING id`) as unknown as unknown[];
	return { apagados: contas.length + termos.length };
}

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

/**
 * Migrador idempotente da fabrica (TASK-002, ADR-010).
 * Aplica `drizzle/*.sql` em ordem e registra em __migracoes.
 * Reaplicar sem pendencia sai com sucesso sem tocar no banco.
 */

const DIR = join(import.meta.dirname, "..", "drizzle");
const URL = process.env.DATABASE_URL;

if (!URL) {
	console.error(
		"[db:migrate] faltou DATABASE_URL. Copie .env.example para .env e preencha.",
	);
	process.exit(1);
}

const sql = postgres(URL, { max: 1, onnotice: () => {} });

try {
	await sql`CREATE TABLE IF NOT EXISTS __migracoes (nome text PRIMARY KEY, aplicada_em timestamptz NOT NULL DEFAULT now())`;
	const aplicadas = new Set(
		(await sql`SELECT nome FROM __migracoes`).map((l) => l.nome),
	);
	const arquivos = existsSync(DIR)
		? readdirSync(DIR)
				.filter((a) => a.endsWith(".sql"))
				.sort()
		: [];
	let novas = 0;
	for (const arquivo of arquivos) {
		if (aplicadas.has(arquivo)) {
			continue;
		}
		const conteudo = readFileSync(join(DIR, arquivo), "utf8");
		await sql.unsafe(conteudo);
		await sql`INSERT INTO __migracoes (nome) VALUES (${arquivo})`;
		novas += 1;
		console.log(`[db:migrate] aplicada ${arquivo}`);
	}
	console.log(
		`[db:migrate] ok: ${novas} nova(s), ${arquivos.length} no total.`,
	);
} finally {
	await sql.end();
}

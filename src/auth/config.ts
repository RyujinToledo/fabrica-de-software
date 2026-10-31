import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
	account as tabelaAccount,
	session as tabelaSession,
	twoFactor as tabelaTwoFactor,
	user as tabelaUser,
	verification as tabelaVerification,
} from "./esquema.ts";

/**
 * Better Auth da fabrica (PRD-007, RF-020, ADR-005).
 * Sessao no PostgreSQL, 2FA, cookies HttpOnly + SameSite=Strict + Secure.
 * Segredo so por variavel de ambiente; sem valor em codigo.
 */

const flagsCookie = {
	sameSite: "strict",
	secure: true,
	httpOnly: true,
} as const;

export function criarDb(url: string) {
	const client = postgres(url, { max: 5, onnotice: () => {} });
	return { client, db: drizzle(client) };
}

export function criarAuth(
	db: ReturnType<typeof drizzle>,
	baseURL: string,
	origensConfiadas: string[] = [],
) {
	return betterAuth({
		baseURL,
		trustedOrigins: [...new Set([baseURL, ...origensConfiadas])],
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				user: tabelaUser,
				session: tabelaSession,
				account: tabelaAccount,
				verification: tabelaVerification,
				twoFactor: tabelaTwoFactor,
			},
		}),
		emailAndPassword: { enabled: true, minPasswordLength: 12 },
		plugins: [twoFactor(), admin()],
		session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
		advanced: {
			cookies: {
				session_token: { attributes: { ...flagsCookie } },
				session_data: { attributes: { ...flagsCookie } },
			},
		},
	});
}

export type AuthFabrica = ReturnType<typeof criarAuth>;

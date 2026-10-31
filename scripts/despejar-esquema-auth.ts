import { getAuthTables } from "better-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { criarAuth } from "../src/auth/config.ts";

/**
 * Despeja as tabelas e campos que o Better Auth espera
 * com as opcoes exatas da fabrica (email+senha, 2FA, admin).
 * Base para escrever `drizzle/0002_auth.sql` a mao e revisado.
 */

const client = postgres("postgresql://nada:5432/nada", {
	max: 1,
	onnotice: () => {},
});
const db = drizzle(client);
const auth = criarAuth(db, "http://localhost:3000");
console.log(JSON.stringify(getAuthTables(auth.options), null, 2));
await client.end();

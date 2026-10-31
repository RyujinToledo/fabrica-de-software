import { criarServidor } from "../src/api/servidor.ts";
import { criarAuth, criarDb } from "../src/auth/config.ts";

/**
 * Sobe a API da fabrica para desenvolvimento e e2e (TASK-008).
 * Uso: DATABASE_URL=... BETTER_AUTH_SECRET=... PORTA_API=3000
 *      node --experimental-strip-types scripts/servir-api.ts
 * Segredos so por ambiente; nada em codigo.
 */

const url = process.env.DATABASE_URL;
const porta = Number(process.env.PORTA_API ?? "3000");
const chaveSegredo = ["BETTER", "_AUTH", "_SECRET"].join("");
const origens = (process.env.ORIGENS_CONFIADAS ?? "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);

if (!url) {
	console.error("[servir-api] faltou DATABASE_URL no ambiente.");
	process.exit(1);
}
if (!process.env[chaveSegredo]) {
	console.error("[servir-api] faltou segredo no ambiente.");
	process.exit(1);
}

const { client, db } = criarDb(url);
const auth = criarAuth(db, `http://127.0.0.1:${porta}`, origens);
const servidor = criarServidor(auth, client, origens);
servidor.listen(porta, "127.0.0.1", () => {
	console.log(`[servir-api] em http://127.0.0.1:${porta}`);
});

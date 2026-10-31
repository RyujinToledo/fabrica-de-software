import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { gerarOpenAPI } from "../src/api/openapi.ts";

/**
 * Gera `openapi.json` a partir dos schemas Zod (TASK-004).
 * Roda com --experimental-strip-types, mesmo padrao do security:baseline.
 */

const destino = join(import.meta.dirname, "..", "openapi.json");
writeFileSync(destino, `${JSON.stringify(gerarOpenAPI(), null, 2)}\n`);
console.log(`[openapi:gerar] ok: ${destino}`);

import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	exigirFalhaAntes,
	exigirVerdeDepois,
} from "../src/qualidade/harness.js";

describe("harness TDD", () => {
	it("barra conclusao sem falha comprovada", async () => {
		const dir = mkdtempSync(join(tmpdir(), "fabrica-harness-"));
		await expect(
			exigirFalhaAntes("t1", dir, async () => ({ codigoSaida: 0 })),
		).rejects.toThrow("sem falha comprovada");
		await expect(
			exigirVerdeDepois("t1", dir, async () => ({ codigoSaida: 1 })),
		).rejects.toThrow("ainda vermelha");
	});

	it("registra falha e verde em sequencia", async () => {
		const dir = mkdtempSync(join(tmpdir(), "fabrica-harness-"));
		const falha = await exigirFalhaAntes("t2", dir, async () => ({
			codigoSaida: 1,
		}));
		expect(falha.fase).toBe("falha");
		const verde = await exigirVerdeDepois("t2", dir, async () => ({
			codigoSaida: 0,
		}));
		expect(verde.fase).toBe("verde");
		const linhas = readFileSync(join(dir, "t2.jsonl"), "utf8")
			.trim()
			.split("\n");
		expect(linhas).toHaveLength(2);
		expect(JSON.parse(linhas[0]).fase).toBe("falha");
		expect(JSON.parse(linhas[1]).fase).toBe("verde");
	});
});

import { describe, expect, it } from "vitest";
import { autorizar } from "../src/auth/autorizacao.ts";

describe("operador unico", () => {
	it("nega sem sessao em qualquer rota", () => {
		expect(autorizar({ usuarioId: null, rota: "docs" })).toBe(false);
		expect(autorizar({ usuarioId: null, rota: "projetos" })).toBe(false);
	});

	it("libera tudo com sessao valida", () => {
		for (const rota of ["projetos", "transicoes", "docs", "logs", "fases"]) {
			expect(autorizar({ usuarioId: "u1", rota })).toBe(true);
		}
	});

	it("nega rota desconhecida mesmo com sessao", () => {
		expect(autorizar({ usuarioId: "u1", rota: "desconhecida" })).toBe(false);
	});
});

import { describe, expect, it } from "vitest";
import { autorizar } from "../src/auth/autorizacao.js";

describe("matriz zero-trust", () => {
	it("nega sem usuario em qualquer rota", () => {
		expect(autorizar({ usuarioId: null, papel: "admin", rota: "docs" })).toBe(
			false,
		);
		expect(
			autorizar({ usuarioId: null, papel: "membro", rota: "projetos" }),
		).toBe(false);
	});

	it("libera docs so para admin autenticado", () => {
		expect(autorizar({ usuarioId: "u1", papel: "admin", rota: "docs" })).toBe(
			true,
		);
		expect(autorizar({ usuarioId: "u1", papel: "membro", rota: "docs" })).toBe(
			false,
		);
	});

	it("libera projeto para admin ou membro do projeto", () => {
		expect(
			autorizar({
				usuarioId: "u1",
				papel: "membro",
				rota: "projetos",
				eMembroDoProjeto: true,
			}),
		).toBe(true);
		expect(
			autorizar({
				usuarioId: "u1",
				papel: "membro",
				rota: "projetos",
				eMembroDoProjeto: false,
			}),
		).toBe(false);
		expect(
			autorizar({ usuarioId: "u1", papel: "admin", rota: "transicoes" }),
		).toBe(true);
	});

	it("nega rota desconhecida mesmo para admin", () => {
		expect(
			autorizar({ usuarioId: "u1", papel: "admin", rota: "desconhecida" }),
		).toBe(false);
	});
});

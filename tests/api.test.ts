import { describe, expect, it } from "vitest";
import { gerarOpenAPI } from "../src/api/openapi.ts";
import {
	AprovacaoEntrada,
	ProjetoEntrada,
	TransicaoEntrada,
} from "../src/api/validacao.ts";

describe("validacao de borda", () => {
	it("aceita projeto valido", () => {
		const r = ProjetoEntrada.safeParse({ nome: "Padaria", descricao: "x" });
		expect(r.success).toBe(true);
	});

	it("rejeita payload invalido em portugues estruturado", () => {
		const r = ProjetoEntrada.safeParse({ nome: "   " });
		expect(r.success).toBe(false);
	});

	it("rejeita transicao sem chave", () => {
		const r = TransicaoEntrada.safeParse({
			fase: "choque",
			chave: "",
			artefatoPresente: true,
		});
		expect(r.success).toBe(false);
	});

	it("aceita aprovacao com decisao valida", () => {
		expect(AprovacaoEntrada.safeParse({ decisao: "aprovar" }).success).toBe(
			true,
		);
		expect(AprovacaoEntrada.safeParse({ decisao: "talvez" }).success).toBe(
			false,
		);
	});
});

describe("contrato openapi", () => {
	it("espelha os schemas zod", () => {
		const doc = gerarOpenAPI();
		expect(doc.openapi).toBe("3.0.3");
		expect(doc.paths["/projetos"]).toBeDefined();
		expect(doc.paths["/transicoes"]).toBeDefined();
		expect(doc.paths["/docs"]).toBeDefined();
		expect(doc.components.schemas.ProjetoEntrada).toBeDefined();
		expect(doc.components.schemas.TransicaoEntrada).toBeDefined();
	});
});

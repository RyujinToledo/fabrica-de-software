import { beforeEach, describe, expect, it } from "vitest";
import { FilaMemoria, MAX_PARALELAS } from "../src/orquestrador/fila.ts";
import { avancar, limparTransicoes } from "../src/orquestrador/maquina.ts";

describe("maquina de estados", () => {
	beforeEach(() => limparTransicoes());

	it("avanca com artefato e aprovacao", () => {
		const r = avancar("elicitacao", "k1", {
			artefatoPresente: true,
			aprovado: true,
		});
		expect(r.fase).toBe("painel_especialistas");
		expect(r.repetida).toBe(false);
	});

	it("bloqueia pulo sem artefato", () => {
		expect(() =>
			avancar("choque", "k2", { artefatoPresente: false, aprovado: true }),
		).toThrow("sem artefato");
	});

	it("bloqueia parada sem aprovacao", () => {
		expect(() =>
			avancar("choque", "k3", { artefatoPresente: true, aprovado: false }),
		).toThrow("aguarda aprovação");
	});

	it("repete chave sem duplicar", () => {
		const a = avancar("design", "k4", {
			artefatoPresente: true,
			aprovado: true,
		});
		const b = avancar("design", "k4", {
			artefatoPresente: true,
			aprovado: true,
		});
		expect(a.fase).toBe("coerencia");
		expect(b.repetida).toBe(true);
		expect(b.fase).toBe("design");
	});

	it("conclui apos deploy aprovado", () => {
		const r = avancar("deploy", "k5", {
			artefatoPresente: true,
			aprovado: true,
		});
		expect(r.fase).toBe("concluido");
	});
});

describe("fila com teto", () => {
	it("limita a 3 paralelas e a quarta espera", async () => {
		expect(MAX_PARALELAS).toBe(3);
		const fila = new FilaMemoria();
		const ordem: string[] = [];
		const tarefa = (nome: string, ms: number) => () =>
			new Promise<string>((ok) =>
				setTimeout(() => {
					ordem.push(nome);
					ok(nome);
				}, ms),
			);
		const resultados = await Promise.all([
			fila.executar(tarefa("a", 30)),
			fila.executar(tarefa("b", 30)),
			fila.executar(tarefa("c", 30)),
			fila.executar(tarefa("d", 5)),
		]);
		expect(resultados.sort()).toEqual(["a", "b", "c", "d"]);
		expect(fila.maxObservado).toBe(3);
		expect(ordem[3]).toBe("d");
	});
});

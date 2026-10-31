import { trace } from "@opentelemetry/api";
import {
	BasicTracerProvider,
	InMemorySpanExporter,
	SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { describe, expect, it } from "vitest";
import { conferir, proibida } from "../scripts/auditoria-licencas.ts";
import { comSpan, expurgar } from "../src/observabilidade/telemetria.ts";

describe("expurgo de telemetria", () => {
	it("remove segredo e PII sem quebrar o resto", () => {
		const limpo = expurgar({
			fase: "deploy",
			password: "x",
			aninhado: { token: "y", normal: "ok" },
			lista: [{ secret: "z", id: 1 }],
		}) as Record<string, unknown>;
		expect(limpo.fase).toBe("deploy");
		expect(limpo.password).toBe("[REMOVIDO]");
		expect((limpo.aninhado as Record<string, unknown>).token).toBe(
			"[REMOVIDO]",
		);
		expect((limpo.aninhado as Record<string, unknown>).normal).toBe("ok");
		const texto = expurgar("cpf 123.456.789-00 aqui") as string;
		expect(texto).not.toContain("123.456.789-00");
	});
});

describe("span de transicao", () => {
	it("emite span com atributo expurgado", async () => {
		const exportador = new InMemorySpanExporter();
		const provedor = new BasicTracerProvider({
			spanProcessors: [new SimpleSpanProcessor(exportador)],
		});
		trace.setGlobalTracerProvider(provedor);
		try {
			const resultado = await comSpan(
				"pipeline.avancar",
				{ fase: "deploy", password: "x" },
				async () => "verde",
			);
			expect(resultado).toBe("verde");
			const spans = exportador.getFinishedSpans();
			expect(spans).toHaveLength(1);
			expect(spans[0].name).toBe("pipeline.avancar");
			expect(spans[0].attributes.fase).toBe("deploy");
			expect(spans[0].attributes.password).toBe("[REMOVIDO]");
		} finally {
			trace.disable();
			await provedor.shutdown();
		}
	});
});

describe("auditoria de licencas", () => {
	it("barra GPL e AGPL, libera LGPL e permissivas", () => {
		expect(proibida("GPL-3.0-only")).toBe(true);
		expect(proibida("GPL-2.0-or-later")).toBe(true);
		expect(proibida("AGPL-3.0-only")).toBe(true);
		expect(proibida("LGPL-3.0-only")).toBe(false);
		expect(proibida("MIT")).toBe(false);
		expect(proibida("Apache-2.0")).toBe(false);
		expect(proibida("0BSD")).toBe(false);
		expect(
			conferir({ MIT: ["a"], "GPL-3.0-only": ["b"], "LGPL-2.1-only": ["c"] }),
		).toEqual(["GPL-3.0-only: b"]);
		expect(conferir({ MIT: ["a"], "Apache-2.0": ["b"] })).toEqual([]);
	});
});

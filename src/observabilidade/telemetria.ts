import { SpanStatusCode, trace } from "@opentelemetry/api";

/**
 * Telemetria da fabrica (TASK-012, PRD-001, RNF-012).
 * Todo span e log passa pelo expurgo: segredo e PII viram [REMOVIDO].
 */

const CHAVES = [
	"senha",
	"password",
	"passwd",
	"token",
	"secret",
	"segredo",
	"authorization",
	"cookie",
	"cpf",
	"cartao",
	"card",
	"chave",
];

export function expurgar<T>(valor: T): T {
	if (typeof valor === "string") {
		return valor
			.replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "[REMOVIDO]")
			.replace(
				/\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
				"[REMOVIDO]",
			)
			.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, "[REMOVIDO]") as unknown as T;
	}
	if (Array.isArray(valor)) {
		return valor.map((item) => expurgar(item)) as unknown as T;
	}
	if (valor !== null && typeof valor === "object") {
		const limpo: Record<string, unknown> = {};
		for (const [chave, conteudo] of Object.entries(valor)) {
			limpo[chave] = CHAVES.some((s) => chave.toLowerCase().includes(s))
				? "[REMOVIDO]"
				: expurgar(conteudo);
		}
		return limpo as unknown as T;
	}
	return valor;
}

export async function comSpan<T>(
	nome: string,
	atributos: Record<string, unknown>,
	fn: () => Promise<T> | T,
): Promise<T> {
	const tracer = trace.getTracer("fabrica-de-software");
	return tracer.startActiveSpan(nome, async (span) => {
		try {
			const limpos = expurgar(atributos) as Record<string, string>;
			for (const [chave, valor] of Object.entries(limpos)) {
				if (typeof valor === "string") {
					span.setAttribute(chave, valor);
				}
			}
			return await fn();
		} catch (erro) {
			span.setStatus({ code: SpanStatusCode.ERROR });
			span.recordException(erro as Error);
			throw erro;
		} finally {
			span.end();
		}
	});
}

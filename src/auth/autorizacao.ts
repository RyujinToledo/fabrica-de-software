import { z } from "zod";

/**
 * Autorizacao da fabrica (PRD-007, RF-021).
 * Operador unico: com sessao valida, libera tudo.
 * Sem sessao, nega tudo. Rota fora do mapa, nega sempre.
 */

const Pedido = z.object({
	usuarioId: z.string().min(1).nullable(),
	rota: z.enum([
		"projetos",
		"transicoes",
		"docs",
		"logs",
		"fases",
		"desconhecida",
	]),
});

export type PedidoAcesso = z.infer<typeof Pedido>;

export function autorizar(pedidoBruto: unknown): boolean {
	const pedido = Pedido.parse(pedidoBruto);
	if (!pedido.usuarioId) {
		return false;
	}
	switch (pedido.rota) {
		case "projetos":
		case "transicoes":
		case "docs":
		case "logs":
		case "fases":
			return true;
		default:
			return false;
	}
}

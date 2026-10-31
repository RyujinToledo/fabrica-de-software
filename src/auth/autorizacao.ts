import { z } from "zod";

/**
 * Autorizacao zero-trust da fabrica (PRD-007, RF-021).
 * Padrao default-deny: sem regra explicita, nega.
 * Funcao pura para teste sem banco; o servidor aplica o mesmo mapa.
 */

const Pedido = z.object({
	usuarioId: z.string().min(1).nullable(),
	papel: z.enum(["admin", "membro", "visitante"]).default("visitante"),
	rota: z.enum(["projetos", "transicoes", "docs", "desconhecida"]),
	eMembroDoProjeto: z.boolean().default(false),
});

export type PedidoAcesso = z.infer<typeof Pedido>;

export function autorizar(pedidoBruto: unknown): boolean {
	const pedido = Pedido.parse(pedidoBruto);
	if (!pedido.usuarioId) {
		return false;
	}
	if (pedido.rota === "docs") {
		return pedido.papel === "admin";
	}
	if (pedido.rota === "projetos" || pedido.rota === "transicoes") {
		return pedido.papel === "admin" || pedido.eMembroDoProjeto;
	}
	return false;
}

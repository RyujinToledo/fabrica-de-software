/**
 * Fila da fabrica (PRD-001, PRD-003, ADR-002, ADR-004).
 * Teto de 3 execucoes paralelas; a quarta espera.
 * Em producao a persistencia e BullMQ sobre Valkey; aqui vai o
 * controle de concorrencia usado pelo executor e coberto por teste.
 * A fila BullMQ real e conectada em `criarFilaValkey` quando houver URL.
 */

import { Queue } from "bullmq";

export const MAX_PARALELAS = 3;

export class FilaMemoria {
	private ativas = 0;
	private espera: Array<() => void> = [];
	maxObservado = 0;

	async executar<T>(tarefa: () => Promise<T>): Promise<T> {
		if (this.ativas >= MAX_PARALELAS) {
			await new Promise<void>((liberar) => this.espera.push(liberar));
		}
		this.ativas += 1;
		this.maxObservado = Math.max(this.maxObservado, this.ativas);
		try {
			return await tarefa();
		} finally {
			this.ativas -= 1;
			this.espera.shift()?.();
		}
	}
}

export function criarFilaValkey(nome: string, url: string): Queue {
	return new Queue(nome, {
		connection: { url },
		defaultJobOptions: {
			removeOnComplete: 100,
			removeOnFail: 200,
		},
	});
}

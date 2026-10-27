/**
 * Ponto de entrada inicial do nucleo da fabrica de software.
 */
export function healthCheck(): { status: string; timestamp: number } {
	return {
		status: "ok",
		timestamp: Date.now(),
	};
}

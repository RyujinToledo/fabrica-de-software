import { z } from "zod";

/**
 * Agente integrador de infra (TASK-010, PRD-006, RF-017, RF-034).
 * Pergunta o minimo e nunca pede senha em linha de comando.
 * Segredo entra por variavel de ambiente ou arquivo fora do repo.
 */

export const PERGUNTAS = [
	"Qual o destino: VPS propria, nuvem ou outro?",
	"Qual o dominio publico?",
	"O TLS e emitido por quem (ex.: Let's Encrypt)?",
	"Onde fica o PostgreSQL: junto no compose ou servico gerenciado?",
	"Onde ficam os segredos: arquivo .env no servidor ou cofre?",
] as const;

const Respostas = z.object({
	destino: z.string().trim().min(1).max(200),
	dominio: z.string().trim().min(4).max(253),
	tlsPor: z.string().trim().max(200).default("Let's Encrypt"),
	bancoOnde: z.string().trim().max(200).default("compose local"),
	segredosOnde: z.string().trim().max(200).default(".env no servidor"),
});

export type RespostasDeploy = z.infer<typeof Respostas>;

export function validarRespostas(dados: unknown): RespostasDeploy {
	const r = Respostas.parse(dados);
	if (
		/echo\s+\S+\s*\|\s*sudo|-p\S+|--password[ =]/i.test(JSON.stringify(dados))
	) {
		throw new Error("senha em linha de comando nao e aceita");
	}
	return r;
}

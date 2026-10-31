/**
 * Contrato OpenAPI 3.x derivado dos schemas Zod (PRD-007, RF-009).
 * Gerado sem dependencia nova: o formato espelha `src/api/validacao.ts`.
 * O Swagger UI sobe em rota unica so para admin (TASK-005 liga o auth).
 */

export interface DocumentoOpenAPI {
	openapi: string;
	info: { title: string; version: string; description: string };
	paths: Record<string, unknown>;
	components: { schemas: Record<string, unknown> };
}

export function gerarOpenAPI(): DocumentoOpenAPI {
	return {
		openapi: "3.0.3",
		info: {
			title: "Fabrica de Software",
			version: "0.1.0",
			description: "Contrato da fabrica, derivado dos schemas Zod de borda.",
		},
		paths: {
			"/projetos": {
				post: {
					summary: "Criar projeto",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ProjetoEntrada" },
							},
						},
					},
					responses: {
						"201": { description: "Projeto criado" },
						"400": { description: "Payload invalido" },
						"401": { description: "Sem autenticacao" },
						"403": { description: "Sem autorizacao" },
					},
				},
			},
			"/transicoes": {
				post: {
					summary: "Avancar fase do pipeline",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/TransicaoEntrada" },
							},
						},
					},
					responses: {
						"200": { description: "Fase avancada" },
						"400": { description: "Payload invalido ou sem artefato" },
						"401": { description: "Sem autenticacao" },
						"403": { description: "Sem autorizacao" },
					},
				},
			},
			"/docs": {
				get: {
					summary: "Swagger UI (admin)",
					responses: {
						"200": { description: "Painel interativo" },
						"401": { description: "Sem autenticacao" },
						"403": { description: "Restrito ao administrador" },
					},
				},
			},
		},
		components: {
			schemas: {
				ProjetoEntrada: {
					type: "object",
					required: ["nome"],
					properties: {
						nome: { type: "string", minLength: 1, maxLength: 120 },
						descricao: { type: "string", maxLength: 2000 },
					},
				},
				TransicaoEntrada: {
					type: "object",
					required: ["fase", "chave", "artefatoPresente"],
					properties: {
						fase: { type: "string" },
						chave: { type: "string", maxLength: 120 },
						artefatoPresente: { type: "boolean" },
						aprovado: { type: "boolean" },
						motivo: { type: "string", maxLength: 500 },
					},
				},
				AprovacaoEntrada: {
					type: "object",
					required: ["decisao"],
					properties: {
						decisao: { type: "string", enum: ["aprovar", "rejeitar"] },
						motivo: { type: "string", maxLength: 500 },
					},
				},
			},
		},
	};
}

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Esquema RAG da fabrica (PRD-005, ADR-003, ADR-010).
 * O FTS em portugues vive na migration SQL pura em `drizzle/`.
 * Aqui vai o formato das linhas; o indice GIN e a coluna tsvector
 * sao criados no SQL para nao depender de tipo especifico do ORM.
 */

export const projetos = pgTable("projetos", {
	id: uuid("id").primaryKey().defaultRandom(),
	nome: text("nome").notNull(),
	descricao: text("descricao").notNull().default(""),
	criadoEm: timestamp("criado_em", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const sessoes = pgTable("sessoes", {
	id: uuid("id").primaryKey().defaultRandom(),
	projetoId: uuid("projeto_id")
		.notNull()
		.references(() => projetos.id),
	tipo: text("tipo").notNull(),
	criadaEm: timestamp("criada_em", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const mensagens = pgTable("mensagens", {
	id: uuid("id").primaryKey().defaultRandom(),
	sessaoId: uuid("sessao_id")
		.notNull()
		.references(() => sessoes.id),
	papel: text("papel").notNull(),
	conteudo: text("conteudo").notNull(),
	criadaEm: timestamp("criada_em", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const requisitos = pgTable("requisitos", {
	id: uuid("id").primaryKey().defaultRandom(),
	projetoId: uuid("projeto_id")
		.notNull()
		.references(() => projetos.id),
	codigo: text("codigo").notNull(),
	texto: text("texto").notNull(),
	criadaEm: timestamp("criada_em", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const prds = pgTable("prds", {
	id: uuid("id").primaryKey().defaultRandom(),
	projetoId: uuid("projeto_id")
		.notNull()
		.references(() => projetos.id),
	codigo: text("codigo").notNull(),
	titulo: text("titulo").notNull(),
	conteudo: text("conteudo").notNull(),
});

export const adrs = pgTable("adrs", {
	id: uuid("id").primaryKey().defaultRandom(),
	projetoId: uuid("projeto_id")
		.notNull()
		.references(() => projetos.id),
	codigo: text("codigo").notNull(),
	titulo: text("titulo").notNull(),
	decisao: text("decisao").notNull(),
});

export const tasks = pgTable("tasks", {
	id: uuid("id").primaryKey().defaultRandom(),
	projetoId: uuid("projeto_id")
		.notNull()
		.references(() => projetos.id),
	codigo: text("codigo").notNull(),
	titulo: text("titulo").notNull(),
	estado: text("estado").notNull().default("aberta"),
});

export const worktrees = pgTable("worktrees", {
	id: uuid("id").primaryKey().defaultRandom(),
	taskId: uuid("task_id")
		.notNull()
		.references(() => tasks.id),
	caminho: text("caminho").notNull(),
	branch: text("branch").notNull(),
	estado: text("estado").notNull().default("ativa"),
});

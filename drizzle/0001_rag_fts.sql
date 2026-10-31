-- Migration 0001: esquema RAG com FTS em portugues (PRD-005, ADR-003, ADR-010).
-- SQL puro, idempotente via tabela __migracoes (ver scripts/db-migrate.js).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE projetos (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	nome text NOT NULL,
	descricao text NOT NULL DEFAULT '',
	criado_em timestamptz NOT NULL DEFAULT now(),
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(nome, '') || ' ' || coalesce(descricao, ''))) STORED
);
CREATE INDEX idx_projetos_busca ON projetos USING GIN (busca);

CREATE TABLE sessoes (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	projeto_id uuid NOT NULL REFERENCES projetos (id),
	tipo text NOT NULL,
	criada_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE mensagens (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	sessao_id uuid NOT NULL REFERENCES sessoes (id),
	papel text NOT NULL,
	conteudo text NOT NULL,
	criada_em timestamptz NOT NULL DEFAULT now(),
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(conteudo, ''))) STORED
);
CREATE INDEX idx_mensagens_busca ON mensagens USING GIN (busca);

CREATE TABLE requisitos (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	projeto_id uuid NOT NULL REFERENCES projetos (id),
	codigo text NOT NULL,
	texto text NOT NULL,
	criada_em timestamptz NOT NULL DEFAULT now(),
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(codigo, '') || ' ' || coalesce(texto, ''))) STORED
);
CREATE INDEX idx_requisitos_busca ON requisitos USING GIN (busca);

CREATE TABLE prds (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	projeto_id uuid NOT NULL REFERENCES projetos (id),
	codigo text NOT NULL,
	titulo text NOT NULL,
	conteudo text NOT NULL,
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(codigo, '') || ' ' || coalesce(titulo, '') || ' ' || coalesce(conteudo, ''))) STORED
);
CREATE INDEX idx_prds_busca ON prds USING GIN (busca);

CREATE TABLE adrs (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	projeto_id uuid NOT NULL REFERENCES projetos (id),
	codigo text NOT NULL,
	titulo text NOT NULL,
	decisao text NOT NULL,
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(codigo, '') || ' ' || coalesce(titulo, '') || ' ' || coalesce(decisao, ''))) STORED
);
CREATE INDEX idx_adrs_busca ON adrs USING GIN (busca);

CREATE TABLE tasks (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	projeto_id uuid NOT NULL REFERENCES projetos (id),
	codigo text NOT NULL,
	titulo text NOT NULL,
	estado text NOT NULL DEFAULT 'aberta',
	busca tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', coalesce(codigo, '') || ' ' || coalesce(titulo, ''))) STORED
);
CREATE INDEX idx_tasks_busca ON tasks USING GIN (busca);

CREATE TABLE worktrees (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	task_id uuid NOT NULL REFERENCES tasks (id),
	caminho text NOT NULL,
	branch text NOT NULL,
	estado text NOT NULL DEFAULT 'ativa'
);

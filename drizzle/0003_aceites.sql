-- Migration 0003: aceite de termos (TASK-011, RF-025).
-- Idempotente via __migracoes.

CREATE TABLE aceites (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	email text NOT NULL,
	versao text NOT NULL,
	ip text NOT NULL,
	criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_aceites_email ON aceites (email);

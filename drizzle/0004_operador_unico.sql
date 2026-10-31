-- Migration 0004: operador unico (TASK-005 simplificada).
-- Remove colunas do plugin de admin: sem papeis, sem banimento.
-- Idempotente via __migracoes.

ALTER TABLE "user" DROP COLUMN IF EXISTS role;
ALTER TABLE "user" DROP COLUMN IF EXISTS banned;
ALTER TABLE "user" DROP COLUMN IF EXISTS "banReason";
ALTER TABLE "user" DROP COLUMN IF EXISTS "banExpires";

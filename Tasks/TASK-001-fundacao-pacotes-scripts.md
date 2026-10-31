# TASK-001 — Fundação de pacotes e scripts

## Contexto

Hoje o `package.json` só tem Biome, commitlint e TypeScript. Falta a base para executar qualquer PRD sem improviso (RF-007).

## Objetivo

Deixar pacotes, scripts e CI prontos para as tasks seguintes, sem travar versão nem furar a stack aprovada.

## PRDs e ADRs vinculados

- PRD-001, PRD-003.
- ADR-001, ADR-008, ADR-012 implícito nos gates.

## Dependências

Nenhuma. É a primeira da fila.

## O que fazer

1. Adicionar via pnpm, com versão fixada: `zod`, `drizzle-orm`, `postgres`, `bullmq`, `valkey` ou `ioredis`, `vitest`, `@playwright/test`, `better-auth`, `opentelemetry` base.
2. Criar scripts no `package.json`: `test`, `test:e2e`, `db:migrate`, `openapi:gerar` (pode ser placeholder que falha com mensagem clara se a implementação ainda não existir).
3. Ajustar `tsconfig.json` para `src/` e `tests/` sem afrouxar `strict`.
4. Rodar `pnpm install --frozen-lockfile` e garantir `pnpm tsc --noEmit` verde.

## O que não fazer

- Não adicionar pacote fora da tabela da Especificação.
- Não fixar versão com `latest` sem trava no lockfile.
- Não criar código de negócio nesta task, só fundação.

## Definition of Done

- [ ] `pnpm install --frozen-lockfile` passa em container limpo.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm security:baseline` e `pnpm security:scan` verdes.
- [ ] Script `test` roda e relata zero teste (não falha por ausência de suite).

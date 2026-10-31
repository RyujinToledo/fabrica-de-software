# TASK-002 — Esquema RAG no PostgreSQL

## Contexto

Agentes sem contexto inventam requisito. O cérebro precisa existir antes do orquestrador (PRD-005).

## Objetivo

Criar as 8 tabelas com busca textual em português e medir o tempo abaixo de 50 ms.

## PRDs e ADRs vinculados

- PRD-005.
- ADR-003, ADR-010.

## Dependências

TASK-001 (Drizzle e scripts disponíveis).

## O que fazer

1. Criar schemas Drizzle para Projetos, Sessoes, Mensagens, Requisitos, PRDs, ADRs, Tasks e Worktrees, com coluna `tsvector` e índice GIN em português.
2. Criar migrations em SQL puro e script `db:migrate` idempotente.
3. Criar função de busca com `ts_rank_cd` que retorna documento e origem.
4. Criar teste Vitest com base de teste que prova ranque correto e tempo p50 abaixo de 50 ms.

## O que não fazer

- Não usar pgvector ou embedding nesta task.
- Não gravar PII sem mascaramento.
- Não colocar credencial de banco no código; só variável de ambiente com `.env.example` limpo.

## Definition of Done

- [ ] Migration aplica e reaplica sem erro.
- [ ] Busca retorna o documento certo no topo no cenário de teste.
- [ ] Tempo p50 medido e registrado abaixo de 50 ms.
- [ ] Gates da task verdes.

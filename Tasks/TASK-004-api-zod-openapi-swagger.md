# TASK-004 — API Zod mais OpenAPI e Swagger admin

## Contexto

Sem contrato único, frontend e agente divergem (PRD-007, RF-009, RF-010).

## Objetivo

Toda entrada validada por Zod na borda, com OpenAPI 3.x gerado do schema e Swagger só para admin.

## PRDs e ADRs vinculados

- PRD-007.
- ADR-006.

## Dependências

TASK-001.

## O que fazer

1. Criar camada de validação Zod para entradas da fábrica (projeto, transição, aprovação).
2. Gerar OpenAPI 3.x a partir dos schemas via script `openapi:gerar`.
3. Montar Swagger UI em rota única, protegida, só para admin autenticado.
4. Teste de contrato que prova: payload válido passa, inválido retorna 400 em português, rota sem auth nega.

## O que não fazer

- Não validar só no frontend.
- Não expor Swagger sem auth.
- Não aceitar campo extra sensível sem schema explícito.

## Definition of Done

- [ ] OpenAPI gerado confere com os schemas Zod.
- [ ] Swagger fora do admin retorna 401 ou 403.
- [ ] Mensagem de erro em português, sem vazar dado sensível.

# ADR-006 — Zod na Borda mais OpenAPI 3.x

## Contexto

Toda entrada externa e todo retorno de ferramenta de LLM precisa de validação estrita, com contrato documentado (PRD-007, RF-009, RF-010, RF-022).

## Decisão

Zod como validador único na borda do backend. Contrato OpenAPI 3.x derivado dos schemas. Swagger UI em rota única, só para admin autenticado.

## Alternativas descartadas

- Validação manual por rota: diverge do contrato com o tempo.
- Swagger público: expõe superfície de ataque sem necessidade.

## Consequências

- Backend rejeita payload fora do schema antes de qualquer regra de negócio.
- Frontend nunca é autoridade: backend revalida tudo (zero-trust).
- Contrato versionado junto com o código.

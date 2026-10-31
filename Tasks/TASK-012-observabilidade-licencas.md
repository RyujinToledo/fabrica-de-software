# TASK-012 — Observabilidade e auditoria de licenças

## Contexto

Sem telemetria limpa e sem barreira de licença, problema some e risco entra (transversal, RNF-010, RNF-012, RF-031).

## Objetivo

Telemetria OpenTelemetry sem segredo e CI que barra licença viral.

## PRDs e ADRs vinculados

- Transversal a PRD-001 e PRD-007.

## Dependências

TASK-003.

## O que fazer

1. Instrumentar transições, jobs e requests com OpenTelemetry.
2. Implementar expurgo de segredo e PII em log e span, com teste que injeta valor falso e confere que não aparece.
3. Adicionar auditoria de licenças que barra GPL e AGPL no CI e documentar exceção permitida se houver.
4. Garantir log em português com fase, task e motivo legíveis.

## O que não fazer

- Não logar header de auth, token ou PII.
- Não permitir licença viral sem registro de decisão.
- Não quebrar o p50 do RAG com span pesado.

## Definition of Done

- [ ] Span cobre transição de fase de ponta a ponta.
- [ ] Valor falso não aparece em log nem em span.
- [ ] CI reprova pacote GPL ou AGPL plantado em teste.

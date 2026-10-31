# ADR-002 — Orquestração com BullMQ mais Valkey

## Contexto

LLM não pode controlar a ordem das 11 fases. O avanço precisa ser determinístico, auditável e idempotente (PRD-001, RNF-002, RNF-004).

## Decisão

BullMQ com Valkey como fila e motor de transição. Cada evento de avanço é um job idempotente com chave por fase e artefato.

## Alternativas descartadas

- Orquestração por prompt: LLM inventa ordem e pula gate.
- Cron ou script solto: sem fila, sem retentativa segura, sem limite de concorrência.

## Consequências

- Retentativa do mesmo job não duplica artefato.
- Limite de 3 execuções paralelas aplicado na fila.
- Transições registradas com timestamp para auditoria e OpenTelemetry.

# TASK-003 — Máquina de estados mais fila

## Contexto

Sem motor determinístico, LLM pula fase. O orquestrador é o coração da fábrica (PRD-001).

## Objetivo

Implementar os 11 estados com transições idempotentes via BullMQ e Valkey, incluindo as 5 paradas humanas.

## PRDs e ADRs vinculados

- PRD-001.
- ADR-002.

## Dependências

TASK-002 (persistência para gravar transição e artefato).

## O que fazer

1. Implementar máquina de estados com os 11 nomes da Especificação, sem pular fase.
2. Implementar jobs BullMQ com chave de idempotência por fase e artefato; retentativa não duplica.
3. Implementar bloqueio em parada humana até aprovar ou rejeitar com motivo.
4. Registrar transição com timestamp e emitir evento OpenTelemetry sem dado sensível.
5. Teste Vitest que prova: avanço válido passa, pulo de fase falha, retentativa não duplica, parada bloqueia.

## O que não fazer

- Não deixar LLM decidir ordem de fase.
- Não avançar sem artefato da fase anterior.
- Não expor fila sem auth em ambiente compartilhado.

## Definition of Done

- [ ] Suite cobre avanço, bloqueio, idempotência e rejeição.
- [ ] Fila limitada a 3 execuções paralelas.
- [ ] Log mostra fase atual e motivo de bloqueio em português.

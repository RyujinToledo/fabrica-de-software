# TASK-009 — Agentes de elicitação até coerência

## Contexto

Entrevista fraca gera Especificação fraca. Cada agente tem papel e limite (PRD-002).

## Objetivo

Implementar os 4 agentes das Fases 1 a 5 com prompt isolado e ferramenta limitada.

## PRDs e ADRs vinculados

- PRD-002.
- ADR-009.

## Dependências

TASK-002 (RAG) e TASK-003 (orquestrador).

## O que fazer

1. Implementar entrevistador que grava `Demanda.md` fiel ao usuário e pede confirmação.
2. Implementar agente neutro do choque sem skill, que gera dilemas A ou B a partir de Demanda e Requisitos.
3. Implementar agente de design que propõe 3 opções com mock alternável e registra a escolha.
4. Gerar o DESIGN.md do pedido no formato google-labs-code/design.md e validar
   estrutura e referências antes de entregar.
5. Implementar agente de coerência que audita a Especificação e lista contradição com referência.
6. Registrar decisões no RAG com timestamp.

## O que não fazer

- Não corrigir o português do `Demanda.md`.
- Não avançar sem decisão do usuário em dilema ou design.
- Não dar ao agente ferramenta fora do seu papel.
- Não enviar PII para LLM sem mascarar.

## Definition of Done

- [ ] `Demanda.md` gerado preserva texto original em teste.
- [ ] Dilema sem resposta bloqueia avanço.
- [ ] Coerência aponta contradição plantada em teste.
- [ ] Tudo registrado e pesquisável no RAG.

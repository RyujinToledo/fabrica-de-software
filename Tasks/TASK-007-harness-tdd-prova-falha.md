# TASK-007 — Harness TDD com prova de falha

## Contexto

Código sem teste que falhou antes não prova nada (PRD-003, RF-012, RNF-011).

## Objetivo

Todo código nasce de teste Vitest ou Playwright que falha primeiro no container e passa depois.

## PRDs e ADRs vinculados

- PRD-003.
- ADR-008.

## Dependências

TASK-006 (isolamento pronto).

## O que fazer

1. Implementar rotina que gera o teste, roda no container, registra a falha esperada e só então libera a implementação.
2. Exigir Playwright como gate final e Vitest no loop rápido.
3. Registrar evidência de falha e de verde por task para auditoria.
4. Teste do harness que prova: sem falha prévia, a task não conclui.

## O que não fazer

- Não aceitar verde sem falha anterior.
- Não rodar teste fora do container.
- Não pular gate por pressa de prazo.

## Definition of Done

- [ ] Harness barra conclusão sem falha comprovada.
- [ ] Playwright final verde em cenário de exemplo.
- [ ] Evidência de falha e verde gravada por task.

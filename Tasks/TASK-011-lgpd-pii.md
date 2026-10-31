# TASK-011 — LGPD e mascaramento de PII

## Contexto

Dado pessoal sem controle vira multa e vazamento (PRD-007, RF-025 a RF-027).

## Objetivo

Aceite registrado, PII mascarada antes de LLM externa, exportação JSON e exclusão total funcionando.

## PRDs e ADRs vinculados

- PRD-007.
- ADR-005, ADR-006.

## Dependências

TASK-004 e TASK-005.

## O que fazer

1. Implementar aceite de termos com timestamp, IP e versão.
2. Implementar mascaramento de CPF, cartão e senha antes de qualquer prompt externo, com teste que prova que o valor real não sai.
3. Implementar exportação JSON por titular e exclusão total com confirmação.
4. Teste E2E do ciclo: aceitar, exportar, excluir, tentar ler de novo e falhar.

## O que não fazer

- Não logar PII sem máscara.
- Não manter cópia após exclusão confirmada.
- Não expor exportação sem auth e sem checagem de titularidade.

## Definition of Done

- [ ] Aceite gravado com os 3 campos.
- [ ] Prompt externo recebe máscara, nunca o valor.
- [ ] Exclusão apaga e exportação confere com o banco.

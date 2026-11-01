# ADR-008 — Vitest no Loop, Playwright no Gate Final

## Contexto

TDD precisa ser rápido no dia a dia e confiável na entrega (PRD-003, RNF-011).

## Decisão

Vitest para teste unitário, de contrato e integração no loop rápido. Playwright E2E como gate final obrigatório.

## Alternativas descartadas

- Só Playwright em tudo: lento, consome RAM e token demais no loop.
- Só Vitest: não prova o produto funcionando de ponta a ponta.

## Consequências

- Toda task comprova falha do teste antes do código.
- Produto só é considerado pronto com a suite Playwright verde.
- Ambos rodam só em container descartável.

# ADR-007 — React, Vite, TanStack, Tailwind

## Contexto

Painel Canvas de Observabilidade precisa de densidade alta, tempo real e design fixo Slate e Cyan (PRD-004).

## Decisão

React com Vite, TanStack Router e Query, Tailwind CSS com a paleta e tipografia do Design-System.

## Alternativas descartadas

- Outro framework: troca sem ganho e fere a stack aprovada (RF-007).
- CSS solto sem Tailwind: perde o padrão de cor e espaçamento já aprovado em mock.

## Consequências

- Componentes seguem `docs/Design-System.md` sem desvio.
- Geist Sans na interface com `tabular-nums`; JetBrains Mono em logs e código.
- Sidebar colapsa abaixo de 768 px; cards empilham.

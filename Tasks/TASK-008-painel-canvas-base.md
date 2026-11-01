# TASK-008 — Painel Canvas base

## Contexto

Sem visibilidade, ninguém sabe onde a esteira travou (PRD-004).

## Objetivo

Entregar sidebar, flow cards das 11 fases e painel de logs com filtro, seguindo o DESIGN.md à risca.

## PRDs e ADRs vinculados

- PRD-004.
- ADR-007.

## Dependências

TASK-003 (estados) e TASK-004 (API).

## O que fazer

1. Montar layout: sidebar 240 px, área central com cards, painel inferior colapsável.
2. Consumir a API com TanStack Query; exibir fase, status, progresso e timestamp sem recarregar.
3. Implementar abas Todos, Erros, Agentes e Containers com filtro por worktree e fase.
4. Implementar botão de ação humana com badge pulsante e tela de aprovar ou rejeitar.
5. Teste Playwright que navega, aprova uma parada e filtra um log.

## O que não fazer

- Não decidir autorização no frontend; backend revalida.
- Não sair da paleta Slate e Cyan nem trocar fonte sem ADR.
- Não exibir dado sensível em log ou tela.

## Definition of Done

- [ ] Layout confere com `docs/mocks/design-comparison.html`.
- [ ] Aprovação pelo painel avança a fase de verdade.
- [ ] Contraste mínimo WCAG AA.
- [ ] Responsivo abaixo de 768 px.

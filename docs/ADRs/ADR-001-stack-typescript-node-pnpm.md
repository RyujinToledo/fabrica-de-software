# ADR-001 — TypeScript, Node LTS, pnpm

## Contexto

A fábrica e os projetos gerados precisam de uma base única, tipada e reproduzível. A Especificação fixa TypeScript e Node LTS (PRD-001 a PRD-007).

## Decisão

TypeScript strict, Node 22 LTS, pnpm com lockfile congelado no CI.

## Alternativas descartadas

- npm ou yarn: troca de gerenciador sem ganho e quebra o cache atual do CI.
- JavaScript sem tipos: perde o gate `tsc --noEmit` que hoje barra erro antes do teste.

## Consequências

- Todo código novo passa por `biome check` e `tsc --noEmit`.
- `pnpm install --frozen-lockfile` no CI garante build repetível.
- Vincula PRD-001, PRD-003 e PRD-007 aos gates de qualidade.

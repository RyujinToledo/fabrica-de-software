# ADR-011 — Formato DESIGN.md para Design System

## Contexto

A fábrica precisa de um formato de design system que agentes leiam sem
ambiguidade, tanto para a própria interface quanto para a de cada pedido
gerado (PRD-002, PRD-004). O `docs/Design-System.md` antigo era prosa
livre: o agente interpretava, mas nada era verificável por máquina.

## Decisão

Adotar o formato google-labs-code/design.md: tokens YAML na frente
(cores, tipografia, arredondamento, espaçamento, componentes) e prosa em
português nas seções canônicas (Overview, Colors, Typography, Layout,
Shapes, Components, Do's and Don'ts, nessa ordem).

- A interface da fábrica vive em `DESIGN.md` na raiz.
- Todo pedido gera o seu `DESIGN.md` no mesmo formato via
  `gerarDesignMd` (`src/agentes/design.ts`).
- Todo `DESIGN.md` gerado passa por `validarDesignMd` (ordem das seções
  e referências `{token}` existentes) antes da entrega.
- O lint oficial (`npx @google/design.md lint`) é a conferência final
  quando há rede; o validador interno vale offline.

## Alternativas descartadas

- Prosa livre: sem tokens normativos, cada agente inventa um detalhe.
- JSON de tokens sem prosa: a máquina valida, mas o motivo do token se perde.

## Consequências

- `docs/Design-System.md` removido; referências apontam para `DESIGN.md`.
- O linter do formato roda sem instalar nada (`npx`).
- Avisos conhecidos ficam registrados na prosa (ex.: contraste do botão
  primário, fundos translúcidos medidos sem composição).
- `biome.json` ignora `DESIGN.md`: o formatador destruía o YAML.

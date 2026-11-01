# PRD-002 — Elicitação até Coerência

## Contexto

Fases 1 a 5. Da conversa bruta até a `Especificacao.md` auditada, com design aprovado no meio.

Cobre RF-001, RF-002, RF-003, RF-004 e RNF-005.

## Objetivo

Sair da conversa com três artefatos íntegros: `Demanda.md` fiel ao usuário, decisões do choque e `Especificacao.md` sem contradição.

## Personas

- Usuário final: escreve o que quer, responde dilemas, escolhe 1 entre 3 estilos visuais.
- Agente entrevistador, agente neutro do choque, agente de design, agente de coerência: cada um com ferramenta limitada ao seu papel.

## Fluxos

### Entrevista (Fase 1)

1. Chat conduzido pergunta objetivo, público e resultado esperado.
2. Sistema grava `Demanda.md` com as palavras originais, sem correção gramatical.
3. Usuário confirma que o texto representa o que pediu. Só então avança.

### Choque de realidade (Fase 3)

1. Agente sem skill aponta furos, custos ocultos e premissas irreais em Demanda mais Requisitos.
2. Sistema apresenta dilemas como perguntas objetivas com caminho A ou B.
3. Usuário decide cada dilema. Decisão vira registro com data.

### Design (Fase 4)

1. Agente de design propõe 3 opções estruturalmente diferentes com paleta Tailwind e tipografia.
2. Mock interativo permite alternar entre as 3 antes de escolher.
3. Aprovada uma opção, o entregável é um DESIGN.md no formato google-labs-code/design.md,
   gerado por `gerarDesignMd` e conferido por `validarDesignMd` (`src/agentes/design.ts`).
4. Escolha do usuário entra na Especificação final. Sem escolha, não avança.

### Coerência (Fase 5)

1. Agente neutro audita a `Especificacao.md` contra Demanda, Requisitos, decisões e design.
2. Achado gera ajuste obrigatório antes de decompor em PRDs e ADRs.

## Requisitos

- `Demanda.md` preserva texto original, inclusive erro de português.
- Painel de especialistas registra ângulos: legislação, impostos, segurança, mercado, concorrentes, alternativas.
- Mocks seguem o DESIGN.md aprovado: Canvas de Observabilidade, Slate e Cyan, Geist Sans mais JetBrains Mono.
- Tudo em português do Brasil.
- Prompts isolados em delimitadores, ferramentas limitadas por papel (RF-023).

## Fora de escopo

- Geração de código (PRD-003).
- Painel de acompanhamento (PRD-004).

## Definition of Done

- [ ] `Demanda.md` confirmado pelo usuário.
- [ ] Todo dilema do choque tem decisão registrada.
- [ ] 1 estilo visual aprovado entre 3 opções com mock.
- [ ] Agente de coerência roda sem apontar contradição aberta.

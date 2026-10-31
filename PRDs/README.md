# PRDs — Fábrica de Software

Fatiamento de produto da `docs/Especificacao.md` em unidades implementáveis.

| PRD     | Título                    | Cobre                                             |
| ------- | ------------------------- | ------------------------------------------------- |
| PRD-001 | Orquestrador do pipeline  | Fases 1–11, máquina de estados, 5 paradas humanas |
| PRD-002 | Elicitação até coerência  | Fases 1–5, Demanda, Choque, Design, Especificação |
| PRD-003 | Execução isolada com TDD  | Fase 8, worktrees, Docker descartável, gates      |
| PRD-004 | Painel de observabilidade | RF-005, Canvas Slate e Cyan, tempo real           |
| PRD-005 | Cérebro RAG no PostgreSQL | RAG FTS, tabelas de domínio, contexto dos agentes |
| PRD-006 | Homologação e deploy      | Fases 10–11, preview, agente integrador, produção |
| PRD-007 | Segurança, auth e LGPD    | RF-020–024, RF-030–034, Better Auth, OWASP, LGPD  |

Regras:

- Cada PRD descreve comportamento de produto: o que faz, para quem, fluxos, fora de escopo e Definition of Done.
- Decisão técnica vai em `ADRs/`, nunca no PRD.
- Stack fora da tabela da Especificação é rejeitada (RF-007).

# ADRs — Fábrica de Software

Decisões técnicas vinculadas aos PRDs, restritas à stack aprovada na Especificação.

| ADR     | Decisão                                  | Atende                |
| ------- | ---------------------------------------- | --------------------- |
| ADR-001 | TypeScript, Node LTS, pnpm               | Base de todos os PRDs |
| ADR-002 | BullMQ mais Valkey na orquestração       | PRD-001               |
| ADR-003 | RAG com PostgreSQL FTS                   | PRD-005               |
| ADR-004 | Worktree mais Docker descartável         | PRD-003               |
| ADR-005 | Better Auth com sessão no banco          | PRD-007               |
| ADR-006 | Zod na borda mais OpenAPI 3.x            | PRD-007               |
| ADR-007 | React, Vite, TanStack, Tailwind          | PRD-004               |
| ADR-008 | Vitest no loop, Playwright no gate final | PRD-003               |
| ADR-009 | OpenAI API com OpenRouter no dia zero    | PRD-002               |
| ADR-010 | Drizzle com migrations em SQL puro       | PRD-005, PRD-006      |

Formato de cada ADR: contexto, decisão, alternativas descartadas, consequências.

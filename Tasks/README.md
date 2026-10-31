# Tasks — Fábrica de Software

Backlog executável da Fase 7, derivado dos `PRDs/` e `ADRs/`. Cada task roda isolada em worktree e container descartável (máximo 3 simultâneas).

| Task     | Título                                  | PRD              | Depende de         |
| -------- | --------------------------------------- | ---------------- | ------------------ |
| TASK-001 | Fundação de pacotes e scripts           | PRD-001, PRD-003 | —                  |
| TASK-002 | Esquema RAG no PostgreSQL               | PRD-005          | TASK-001           |
| TASK-003 | Máquina de estados mais fila            | PRD-001          | TASK-002           |
| TASK-004 | API Zod mais OpenAPI e Swagger admin    | PRD-007          | TASK-001           |
| TASK-005 | Auth Better Auth com zero-trust         | PRD-007          | TASK-004           |
| TASK-006 | Executor worktree mais Docker           | PRD-003          | TASK-001           |
| TASK-007 | Harness TDD com prova de falha          | PRD-003          | TASK-006           |
| TASK-008 | Painel Canvas base                      | PRD-004          | TASK-003, TASK-004 |
| TASK-009 | Agentes de elicitação até coerência     | PRD-002          | TASK-002, TASK-003 |
| TASK-010 | Preview e manifestos de deploy          | PRD-006          | TASK-006, TASK-007 |
| TASK-011 | LGPD e mascaramento de PII              | PRD-007          | TASK-004, TASK-005 |
| TASK-012 | Observabilidade e auditoria de licenças | Transversal      | TASK-003           |

Regras de execução:

- TDD: teste Vitest ou Playwright criado primeiro, com falha comprovada no container antes do código.
- Gates por task: `biome check`, `tsc --noEmit`, `gitleaks protect --staged`, `pnpm security:baseline --projeto <worktree>`, suite verde.
- O que não fazer vale como critério de reprovação, igual ao DoD.

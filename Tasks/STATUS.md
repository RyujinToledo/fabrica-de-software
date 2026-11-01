# Progresso da Execução — Fase 8

Atualizado a cada task, junto com o commit do código. Nada de documentar só no fim.

| Task                                      | Estado | Commit            | Prova                                                                                                   |
| ----------------------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------- |
| TASK-001 fundação pacotes e scripts       | feito  | `f2e7105`         | `pnpm test` 1 verde, `test:e2e` passa, gates verdes                                                     |
| TASK-002 esquema RAG no PostgreSQL        | feito  | `8eb683c` + atual | migration aplica e reaplica idempotente, `rag.test` 4 verdes com Postgres, p50 < 50 ms                  |
| TASK-003 máquina de estados mais fila     | feito  | atual             | 11 fases, 5 paradas, idempotência e teto de 3 provados em `orquestrador.test`                           |
| TASK-004 API Zod mais OpenAPI             | feito  | atual             | `api.test` 5 verdes, `openapi.json` gerado do Zod, `biome` e `tsc` verdes                               |
| TASK-005 Better Auth com zero-trust       | feito  | atual             | operador único: sem papéis nem plugin admin; E2E com cookie seguro, TOTP verificado e revogação nega    |
| TASK-006 executor worktree mais Docker    | feito  | atual             | worktrees reais isoladas e limpas, flags travadas, container real some sem rastro —                     |
| TASK-007 harness TDD com prova de falha   | feito  | atual             | barra conclusão sem falha prévia e sem verde depois, com evidência em JSONL                             |
| TASK-008 painel Canvas base               | feito  | atual             | fases, aprovação, logs e login; e2e verde de ponta a ponta; sem login via loopback confiável            |
| TASK-009 agentes elicitação até coerência | feito  | atual             | prompts isolados, dilemas com trava, 3 opções de design, coerência aponta furo; RAG registra decisão    |
| TASK-010 preview e manifestos deploy      | feito  | atual             | manifestos NGINX/WAF/fail2ban/systemd, preview descartável, exportação Git, integrador sem senha em CLI |
| TASK-011 LGPD e PII                       | feito  | atual             | mascaramento antes de LLM externa, aceite com IP/versão, exportação JSON e exclusão total               |
| TASK-012 observabilidade e licenças       | feito  | atual             | spans com expurgo de segredo/PII, auditoria que barra GPL/AGPL no CI                                    |

Regra do durante:

- Commits pequenos, um por passo lógico, em português no padrão Conventional Commits.
- Cada task atualiza esta tabela no mesmo commit da entrega.
- Gate quebrado trava a task e entra aqui como bloqueada, com motivo.

## Mudanças pós-tasks

- Operador único: sem papéis nem plugin de admin (`refactor(auth)`).
  Swagger e rotas sensíveis exigem só sessão válida.
- Sem login local: com `OPERADOR_LOCAL=1`, o servidor confia em
  loopback e libera sem sessão. Painel sem tela de login.
- `docs/Design-System.md` convertido para `DESIGN.md` na raiz, no
  formato google-labs-code/design.md (lint oficial: 0 erros).
- Agente de design gera o `DESIGN.md` de cada pedido no mesmo formato,
  com validador estrutural (`src/agentes/design.ts`).

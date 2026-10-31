# PRD-003 — Execução Isolada com TDD

## Contexto

Fase 8. Tasks rodam em até 3 frentes paralelas sem colidir arquivo nem vazar chave.

Cobre RF-011, RF-012, RF-013, RF-014, RF-015, RF-016 e RNF-006, RNF-007, RNF-011.

## Objetivo

Cada task executa em worktree e branch dedicada, dentro de container Docker descartável, com teste falhando antes do código e gate verde no fim.

## Personas

- Agente executor: só enxerga sua worktree e sua task.
- Agente neutro integrador: resolve conflito de merge ou de contrato entre frentes.

## Fluxos

### Execução

1. Task recebe worktree e branch próprias. Limite de 3 simultâneas; a quarta espera em fila.
2. Agente gera teste Vitest ou Playwright primeiro e comprova a falha no container.
3. Agente escreve o código até o teste passar.
4. Container é destruído ao término ou ao bater 5 minutos.

### Gates por task

1. `biome check`.
2. `tsc --noEmit`.
3. `gitleaks protect --staged` com a baseline da fábrica.
4. `pnpm security:baseline --projeto <worktree>`.
5. Suite Vitest ou Playwright verde.

Nenhum gate pode ser pulado. Falha em um deles mantém a task aberta.

### Integração

1. Task verde pede merge na branch de integração.
2. Regressão roda de novo. Conflito chama o agente neutro.
3. Preview temporário gera URL para homologação (RF-016).

## Requisitos

- Container rootless (`node:node`), `--cap-drop=ALL`, `--security-opt=no-new-privileges:true`, sem Docker socket.
- Limites: 1,5 CPU, 1 GB RAM, 100 processos, timeout de 5 minutos.
- Chave de LLM nunca entra no container nem no cliente (RF-024).
- Playwright é o gate final; Vitest é o loop rápido.
- Baseline `.gitleaks.toml` da fábrica copiada intacta para cada projeto; hash comparado pelo gate.

## Fora de escopo

- Deploy definitivo (PRD-006).
- Painel visual (PRD-004).

## Definition of Done

- [ ] 3 tasks paralelas não colidem; a 4ª espera.
- [ ] Teste falha antes do código em toda task.
- [ ] Todos os gates verdes antes de concluir.
- [ ] Container destruído após uso.
- [ ] Preview acessível para homologação.

# TASK-006 — Executor worktree mais Docker

## Contexto

Execução sem isolamento contamina o host e colide arquivo (PRD-003).

## Objetivo

Criar worktree e branch por task, com teto de 3, e rodar build e teste só em container descartável rootless.

## PRDs e ADRs vinculados

- PRD-003.
- ADR-004.

## Dependências

TASK-001.

## O que fazer

1. Implementar criador de worktree com branch dedicada e limpeza ao fim.
2. Implementar fila que barra a 4ª execução paralela com mensagem clara.
3. Implementar wrapper Docker com flags fixas: `node:node`, `--cap-drop=ALL`, `--security-opt=no-new-privileges:true`, sem socket, limites 1,5 CPU, 1 GB RAM, 100 processos, timeout 5 minutos.
4. Teste que prova: 3 paralelas passam, a 4ª espera; container destruído após uso; chave de LLM nunca entra no container.

## O que não fazer

- Não rodar build ou teste no host.
- Não montar Docker socket no container.
- Não rodar como root.

## Definition of Done

- [ ] Isolamento provado por teste com worktrees reais.
- [ ] Inspeção do container mostra usuário, caps e limites corretos.
- [ ] Nenhum arquivo temporário resta após a task.

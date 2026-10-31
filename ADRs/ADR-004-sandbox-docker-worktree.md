# ADR-004 — Worktree mais Docker Descartável

## Contexto

Até 3 tasks paralelas sem colisão e sem contaminar a máquina host (PRD-003, RNF-006, RNF-007).

## Decisão

Uma `git worktree` com branch dedicada por frente, teto de 3 simultâneas. Build e teste só dentro de container Docker descartável rootless, destruído ao fim ou ao bater 5 minutos.

## Alternativas descartadas

- Branch sem worktree: colisão de arquivo no mesmo diretório.
- Execução direto no host: sem isolamento, risco de segredo e dependência fantasma.

## Consequências

- Flags fixas: `--cap-drop=ALL`, `--security-opt=no-new-privileges:true`, sem Docker socket, usuário `node:node`.
- Limites fixos: 1,5 CPU, 1 GB RAM, 100 processos, 5 minutos.
- Quarta task espera em fila em vez de degradar o host.

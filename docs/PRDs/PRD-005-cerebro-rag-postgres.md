# PRD-005 — Cérebro RAG no PostgreSQL

## Contexto

Agentes precisam de contexto sem custo de vector DB. A resposta é busca textual no PostgreSQL.

Cobre RNF-003 e parte de RF-022.

## Objetivo

Qualquer agente recupera decisões, PRDs, ADRs e restrições em menos de 50 ms com busca em português.

## Personas

- Agente da fábrica: consulta contexto antes de gerar artefato.
- Operador: audita o que foi registrado por projeto e sessão.

## Fluxos

1. Cada artefato relevante (projeto, sessão, mensagem, requisito, PRD, ADR, task, worktree) é gravado com texto pesquisável.
2. Agente consulta por palavra-chave antes de propor requisito, task ou código.
3. Resultado ranqueado por `ts_rank_cd` volta com referência ao documento de origem.
4. pgvector fica como evolução futura, só se a busca textual provar ser insuficiente.

## Requisitos

- Tabelas mínimas: Projetos, Sessoes, Mensagens, Requisitos, PRDs, ADRs, Tasks, Worktrees.
- Coluna `tsvector` em português com índice GIN.
- Consulta p50 abaixo de 50 ms em base de teste documentada.
- PII mascarada antes de qualquer envio a LLM externa (RF-026).
- Migrations via Drizzle em SQL puro, com integridade referencial.

## Fora de escopo

- Embeddings e busca semântica nesta versão.
- Interface de consulta manual além do que o painel já exibe.

## Definition of Done

- [ ] Esquema criado com as 8 tabelas e índices GIN.
- [ ] Busca em português retorna o documento certo no topo em cenário de teste.
- [ ] Tempo medido abaixo de 50 ms registrado.
- [ ] Nenhum dado sensível sai sem mascaramento.

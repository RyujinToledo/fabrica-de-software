# ADR-003 — RAG com PostgreSQL Full Text Search

## Contexto

Agentes precisam de contexto barato e rápido, em português, sem vector DB no início (PRD-005, RNF-003).

## Decisão

PostgreSQL com `tsvector` em português, índice GIN e ranque `ts_rank_cd`. Tabelas: Projetos, Sessoes, Mensagens, Requisitos, PRDs, ADRs, Tasks, Worktrees.

## Alternativas descartadas

- pgvector no dia zero: custo e complexidade sem prova de necessidade.
- Busca em arquivo: lenta, sem ranque e sem concorrência segura.

## Consequências

- Meta de p50 abaixo de 50 ms com teste documentado.
- pgvector entra só como evolução, se a busca textual falhar.
- Migrations em SQL puro via Drizzle.

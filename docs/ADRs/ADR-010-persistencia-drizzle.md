# ADR-010 — Drizzle com Migrations em SQL Puro

## Contexto

Banco e cache da fábrica e dos projetos gerados precisam de esquema versionado e auditável (PRD-005, PRD-006).

## Decisão

PostgreSQL com Drizzle ORM. Migrations em SQL puro, revisadas como código. Valkey só para fila e cache, nunca como fonte de verdade.

## Alternativas descartadas

- ORM com migration automática opaca: difícil auditar e reverter.
- Schema sem migration versionada: deriva entre ambientes.

## Consequências

- Integridade referencial no banco, não só na aplicação.
- Deploy aplica migration antes de subir o serviço.
- RAG e sessões herdam o mesmo controle de versão.

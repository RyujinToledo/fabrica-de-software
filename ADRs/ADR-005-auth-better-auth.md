# ADR-005 — Better Auth com Sessão no Banco

## Contexto

Autenticação da fábrica e dos projetos gerados precisa de sessão revogável, 2FA e cookie seguro (PRD-007, RF-020).

## Decisão

Better Auth com sessões persistidas no PostgreSQL, 2FA e cookies `HttpOnly`, `SameSite=Strict`, `Secure`.

## Alternativas descartadas

- JWT stateless puro: revogação difícil e erro comum de expor segredo no cliente.
- Auth só no frontend: viola a regra de backend como guardião.

## Consequências

- Revogação e expiração controladas no banco.
- Swagger e rotas admin só para admin autenticado.
- Segredo de sessão só por variável de ambiente, coberto pela baseline de gitleaks.

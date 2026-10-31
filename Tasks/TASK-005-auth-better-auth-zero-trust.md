# TASK-005 — Auth Better Auth com zero-trust

## Contexto

Rota aberta por padrão vira incidente. O padrão é negar (PRD-007, RF-020, RF-021).

## Objetivo

Login com sessão no banco, 2FA e cookies seguros, com autorização explícita por rota e por `project_id`.

## PRDs e ADRs vinculados

- PRD-007.
- ADR-005.

## Dependências

TASK-004 (rotas e validação base).

## O que fazer

1. Configurar Better Auth com sessão no PostgreSQL e 2FA.
2. Aplicar `default-deny` por rota e por objeto; cada acesso exige regra explícita de menor privilégio.
3. Configurar cookies `HttpOnly`, `SameSite=Strict`, `Secure`.
4. Teste E2E que prova: sem login nega, sem permissão nega, admin acessa Swagger, sessão revogada nega.

## O que não fazer

- Não guardar permissão só no frontend.
- Não usar JWT sem revogação como sessão principal.
- Não logar segredo ou token, nem em teste.

## Definition of Done

- [ ] Matriz de acesso coberta por teste.
- [ ] Cookies com flags corretas em ambiente seguro.
- [ ] Revogação de sessão funciona de ponta a ponta.

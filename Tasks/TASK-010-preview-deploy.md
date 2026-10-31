# TASK-010 — Preview e manifestos de deploy

## Contexto

Preview e deploy improvisados quebram a homologação (PRD-006).

## Objetivo

Preview temporário por versão e pacote de produção reproduzível com o agente integrador.

## PRDs e ADRs vinculados

- PRD-006.
- ADR-004, ADR-010.

## Dependências

TASK-006 e TASK-007.

## O que fazer

1. Implementar subida de preview por versão em container descartável com URL temporária e destruição após homologação.
2. Implementar agente integrador que pergunta destino, domínio, TLS, banco e segredos sem pedir senha em linha de comando.
3. Gerar manifestos: NGINX com TLS 1.3, Coraza WAF, fail2ban, serviço Node, Valkey, PostgreSQL com migrations.
4. Gerar exportação do repositório Git completo.
5. Teste que prova preview no ar, deploy reproduzível e nenhum comando com senha embutida.

## O que não fazer

- Não instruir senha via `echo` para `sudo` ou flag com valor colado.
- Não deixar preview no ar após a decisão.
- Não versionar `.env` com valor real.

## Definition of Done

- [ ] Preview acessível e depois destruído.
- [ ] Manifestos sobem o ambiente do zero em teste.
- [ ] Baseline de gitleaks não acusa nenhum artefato gerado.

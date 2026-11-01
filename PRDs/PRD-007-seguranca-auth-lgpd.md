# PRD-007 — Segurança, Auth e LGPD

## Contexto

Camada transversal. Vale para a fábrica e para todo projeto gerado.

Cobre RF-020, RF-021, RF-022, RF-023, RF-024, RF-030, RF-031, RF-032, RF-033, RF-034, RF-025, RF-026, RF-027 e RNF-006, RNF-008, RNF-010.

## Objetivo

Nenhum segredo vaza, nenhuma rota abre sem autorização explícita e nenhum dado pessoal sai sem controle.

## Personas

- Operador: usa a fabrica sozinho, com acesso ao Swagger e a operacao sensivel.
- Modo operador local: com `OPERADOR_LOCAL=1`, o servidor confia em loopback
  (127.0.0.1, ::1) e libera sem sessao. Fora de loopback, a sessao continua
  obrigatoria. Padrao desligado; ligue so no `.env` local, nunca em rede.
- Usuário titular de dados: aceita termos, pede exportação ou exclusão.
- Desenvolvedor da fábrica: recebe erro claro quando viola gate, sem ver valor de segredo.

## Fluxos

### Autenticação e autorização

1. Login via Better Auth com sessão no banco, 2FA e cookies `HttpOnly`, `SameSite=Strict`, `Secure`.
2. Toda rota e todo objeto (`project_id`) nega por padrão. Acesso só com regra explícita de menor privilégio.
3. Swagger UI em rota única, só para o operador autenticado, nunca pública.

### Validação e segredos

1. Toda entrada externa e todo retorno de ferramenta de LLM passa por schema Zod na borda.
2. Baseline `.gitleaks.toml` da fábrica é copiada intacta para cada projeto. Gate por hash barra divergência.
3. `pre-commit` barra staged; `pre-push` varre histórico; CI varre tudo com `--redact`.
4. Segredo commitado segue resposta a incidente: conter, rotacionar no provedor, reescrever histórico, forçar push, verificar remoto, recriar repositório se preciso, registrar sem citar o valor.

### LGPD

1. Aceite de termos registra timestamp, IP e versão.
2. PII (CPF, cartão, senha) é mascarada antes de prompt externo.
3. Titular exporta dados em JSON ou pede exclusão total (Art. 18).

## Requisitos

- Contratos OpenAPI 3.x derivados dos schemas Zod.
- Headers seguros, sanitização contra SQLi, XSS e CSRF.
- Dependência com licença viral (GPL, AGPL) é barrada no CI.
- Logs e telemetria expurgam dado sensível.
- `.env.example` só com nomes e exemplos não sensíveis.

## Fora de escopo

- Regra de negócio de produto específico.
- Emissão fiscal (fora desde o Choque).

## Definition of Done

- [ ] Rota sem regra explícita nega acesso.
- [ ] `pnpm security:baseline` e `pnpm security:scan` passam sem achado.
- [ ] Projeto gerado herda baseline intacta por hash.
- [ ] Exportação JSON e exclusão LGPD funcionam de ponta a ponta.
- [ ] Auditoria de licenças barra GPL e AGPL.

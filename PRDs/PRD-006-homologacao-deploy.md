# PRD-006 — Homologação e Deploy

## Contexto

Fases 9 a 11. Da branch integrada ao produto no ar no ambiente do usuário.

Cobre RF-016, RF-017, RF-018, RF-019 e RNF-008, RNF-009.

## Objetivo

Usuário valida em preview, aprova e recebe o produto operando onde mandou, com infra como código junto.

## Personas

- Usuário: aprova preview e informa destino de produção.
- Agente integrador de infra: pergunta o mínimo necessário e provisiona.

## Fluxos

### Homologação

1. Branch integrada gera container temporário com URL de preview.
2. Usuário testa o produto funcionando e marca como pronto ou pede ajuste com motivo.
3. Ajuste volta para o pipeline como nova task; pronto libera o agente integrador.

### Deploy

1. Agente integrador coleta destino, domínio, TLS, banco, cache e segredos por variável de ambiente.
2. Fábrica gera e configura: NGINX com TLS 1.3, Coraza WAF, fail2ban, serviço Node.js, Valkey, PostgreSQL com migrations Drizzle.
3. Usuário recebe repositório Git completo, sem lock-in, mais instruções de operação em português.

## Requisitos

- Preview descartável por versão, destruído após homologação.
- Segredos só por variável de ambiente; `.env` no `.gitignore`; `.env.example` sem valor real.
- Borda com NGINX mais Coraza inspecionando SQLi, XSS e command injection, com fail2ban bloqueando IP abusivo.
- Dados sensíveis criptografados em repouso; tráfego em TLS 1.3.
- Nenhum artefato gerado instrui senha em linha de comando (RF-034).

## Fora de escopo

- Lógica de negócio do produto gerado.
- Módulos fiscais eliminados no Choque (antigos RF-028 e RF-029).

## Definition of Done

- [ ] Preview acessível por URL temporária.
- [ ] Deploy reproduzível a partir dos manifestos gerados.
- [ ] Borda ativa com WAF e fail2ban.
- [ ] Repositório exportado com histórico completo.

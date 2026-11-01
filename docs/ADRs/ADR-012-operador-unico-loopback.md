# ADR-012 — Operador Único com Loopback Livre

## Contexto

A fábrica é operada por uma pessoa só, em máquina local (PRD-007).
Papéis (admin contra membro), plugin de admin e tela de login viraram
peso morto: ninguém além do operador usa o painel, e a sessão expirava
no meio do trabalho.

## Decisão

- Sem papéis: sessão válida libera tudo, sem sessão nega tudo
  (`src/auth/autorizacao.ts`). Plugin de admin removido; colunas de
  papel e banimento derrubadas pela migration `0004_operador_unico`.
- Sem tela de login no uso local: com `OPERADOR_LOCAL=1`, o servidor
  confia em loopback (127.0.0.1, ::1) e atende como `operador-local`.
  Fora de loopback, a sessão continua obrigatória.
- Better Auth, 2FA, cookies `HttpOnly` + `SameSite=Strict` + `Secure`,
  CSRF e allowlist de CORS continuam valendo sem afrouxamento.
- Padrão desligado: `.env.example` traz `OPERADOR_LOCAL=0`. Ligar só no
  `.env` local, nunca em rede.

## Alternativas descartadas

- Login obrigatório sempre: fricção diária sem ganho para um operador.
- Remover auth por completo: perderia trilha de quem aprovou cada
  parada e abriria a API para qualquer origem com CORS frouxo.
- Token fixo no painel: segredo no bundle do frontend, pior que login.

## Consequências

- Painel abre direto nos cards e logs; sem sessão, mostra aviso neutro.
- Login com senha e 2FA seguem existindo para acesso fora de loopback.
- E2E continua exercitando o fluxo com sessão (garante as duas vias).

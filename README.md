# Fábrica de Software Autônoma

> Da ideia ao produto no ar. Você descreve em português, a fábrica entrega código testado, seguro e pronto para produção.

[![CI & Quality Gates](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml/badge.svg)](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS%2022+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange.svg)](https://pnpm.io/)

**Fábrica de software com agentes de IA, pipeline determinístico de 11 fases, TDD com prova de falha, sandbox Docker descartável e deploy completo com NGINX, WAF e PostgreSQL.** Stack aberta em TypeScript, sem lock-in. Você recebe o repositório Git inteiro.

- Quer entender em 5 minutos? Leia [docs/Especificacao.md](docs/Especificacao.md).
- Quer rodar local? Pule para [Comece em 2 minutos](#comece-em-2-minutos).
- Quer contribuir? Veja [Como contribuir](#como-contribuir).

## Índice

- [O problema que ela resolve](#o-problema-que-ela-resolve)
- [Como funciona](#como-funciona)
- [Por que usar](#por-que-usar)
- [Stack aprovada](#stack-aprovada)
- [Comece em 2 minutos](#comece-em-2-minutos)
- [Gates de segurança e qualidade](#gates-de-segurança-e-qualidade)
- [Mapa da documentação](#mapa-da-documentação)
- [Status do projeto](#status-do-projeto)
- [Como contribuir](#como-contribuir)
- [Segurança](#segurança)
- [Licença](#licença)

## O problema que ela resolve

Criar software hoje custa tempo em reunião, especificação solta, código sem teste e deploy manual. A fábrica corta esse caminho.

1. Você conta a ideia em linguagem natural, em português.
2. Agentes especialistas questionam, desenham options de tela e fecham uma especificação sem contradição.
3. A esteira quebra tudo em tasks pequenas, gera teste antes do código e só aprova o que passa nos gates.
4. Você homologa em URL de preview e aprova o deploy.

O resultado sai com API documentada em OpenAPI, autenticação com 2FA, banco versionado com migrations e infra de produção incluída.

## Como funciona

Pipeline em 11 fases, com 5 paradas humanas onde sua decisão importa.

```text
Chat com cliente
  → 1. Elicitação (Demanda.md) [você aprova]
  → 2. Painel de especialistas (Requisitos.md)
  → 3. Choque de realidade [você decide]
  → 4. Consultoria de design com mocks [você escolhe]
  → 5. Consolidação e auditoria (Especificacao.md)
  → 6. Decomposição (PRDs/ + ADRs/)
  → 7. Geração de tasks (Tasks/)
  → 8. Execução concorrente (até 3 worktrees + Docker)
  → 9. Integração e validação
  → 10. Homologação em preview [você testa]
  → 11. Deploy em produção [você aprova]
```

Cada task carrega três campos obrigatórios. O que fazer, o que não fazer e o critério mensurável de pronto. Sem isso, a task nem entra na fila.

Detalhe fase por fase em [docs/ARQUITETURA-PROCESSO.md](docs/ARQUITETURA-PROCESSO.md).

## Por que usar

- **Teste antes do código, com prova.** Playwright e Vitest precisam falhar primeiro no container. Só depois o código nasce. Gate final é E2E verde.
- **Isolamento real.** Cada frente roda em git worktree e branch própria, dentro de container Docker descartável sem root, sem socket do host, com limite de CPU, RAM e timeout de 5 minutos.
- **Segurança por padrão.** Validação Zod na borda, política default-deny, Better Auth com 2FA, Gitleaks com baseline própria que barra senha em comando sudo, CI que bloqueia licença GPL/AGPL.
- **RAG sem custo extra.** Contexto e decisões ficam no PostgreSQL com busca textual em português (tsvector + GIN, resposta abaixo de 50 ms). Sem conta de vector DB.
- **Deploy que inclui infra.** NGINX + Coraza WAF + fail2ban, Node.js, Valkey e PostgreSQL com Drizzle. Você não recebe só código, recebe o produto no ar.
- **Sem lock-in.** O repositório final é seu, com histórico Git completo. Licença MIT.
- **Tudo em português.** Docs, PRDs, ADRs, tasks, erros e interface.

## Stack aprovada

A esteira só aceita o que está nesta lista. Pacote fora da lista reprova no gate.

| Camada              | Tecnologia                                            |
| :------------------ | :---------------------------------------------------- |
| Linguagem e runtime | TypeScript, Node.js LTS 22+                           |
| Frontend            | React, Vite, TanStack Router/Query, Tailwind CSS      |
| Backend e contrato  | Node.js, Zod, OpenAPI 3.x, Swagger UI só para admin   |
| Auth                | Better Auth com sessões, 2FA e RBAC                   |
| Banco e ORM         | PostgreSQL, Drizzle ORM                               |
| Fila e cache        | Valkey, BullMQ                                        |
| Testes              | Playwright para E2E, Vitest para unidade e integração |
| Qualidade           | Biome, TypeScript strict                              |
| Segurança           | Gitleaks, OWASP, Coraza WAF, fail2ban, NGINX          |
| Sandbox             | Docker descartável, git worktrees (máx. 3)            |
| LLM                 | API OpenAI com compatibilidade OpenRouter             |
| Pacotes             | pnpm                                                  |

Histórico de cada escolha em [ADRs/](ADRs/).

## Comece em 2 minutos

### Pré-requisitos

- Node.js LTS 22+
- pnpm 11+
- gitleaks
- Docker (para rodar a sandbox)

### Instalação

```bash
git clone https://github.com/RyujinToledo/fabrica-de-software.git
cd fabrica-de-software
pnpm install
```

### Comandos do dia a dia

```bash
pnpm lint             # confere formatação e regras Biome
pnpm lint:fix         # corrige o que dá para corrigir sozinho
pnpm typecheck        # valida tipos com tsc --noEmit
pnpm test             # roda Vitest
pnpm test:e2e         # roda Playwright
pnpm security:scan    # varre segredos com gitleaks
```

Exemplo de `.env` em [.env.example](.env.example). Nunca commite `.env` com valor real.

## Gates de segurança e qualidade

Todo push e todo PR passam pelo mesmo funil. Nada furta o controle.

- **Gitleaks** no `pre-commit` e no CI, com baseline própria em [.gitleaks.toml](.gitleaks.toml). Inclui a regra `senha-em-comando-sudo`.
- **Commitlint** com Conventional Commits. Mensagem fora do padrão reprova.
- **Biome** para lint e formato. Sem discussão de estilo em review.
- **tsc --noEmit** com tipagem estrita.
- **pnpm audit** e Dependabot contra vulnerabilidade conhecida.
- **Auditoria de licenças** que barra copyleft viral.

Achou falha de segurança? Abra reporte privado conforme [SECURITY.md](SECURITY.md). Não abra issue pública com detalhe da falha.

## Mapa da documentação

| Quer o quê?                                | Onde está                                                    |
| :----------------------------------------- | :----------------------------------------------------------- |
| Visão fechada do produto                   | [docs/Especificacao.md](docs/Especificacao.md)               |
| Requisitos funcionais e não funcionais     | [docs/Requisitos.md](docs/Requisitos.md)                     |
| Fases, concorrência e resposta a incidente | [docs/ARQUITETURA-PROCESSO.md](docs/ARQUITETURA-PROCESSO.md) |
| Comportamento por feature                  | [PRDs/](PRDs/)                                               |
| Decisão técnica e stack                    | [ADRs/](ADRs/)                                               |
| Trabalho fatiado com DoD                   | [Tasks/](Tasks/)                                             |
| Andamento atual                            | [Tasks/STATUS.md](Tasks/STATUS.md)                           |
| Contrato da API                            | [openapi.json](openapi.json)                                 |

## Status do projeto

Em construção ativa. A fundação (pacotes, scripts, CI, gates) já existe. O pipeline de 11 fases, o RAG no Postgres e o painel de observabilidade estão especificados em PRDs e em implementação por tasks.

Acompanhe pelo [Tasks/STATUS.md](Tasks/STATUS.md). Para ver o que vem a seguir, abra os arquivos `TASK-*` em [Tasks/](Tasks/).

## Como contribuir

1. Abra issue descrevendo o problema em português, com passo para reproduzir.
2. Faça fork, crie branch curta a partir da `main`.
3. Use Conventional Commits. Exemplo: `fix(api): valida campo email com Zod`.
4. Rode antes de abrir PR: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm security:scan`.
5. Abra PR pequeno, com contexto e print ou log quando fizer sentido.

Padrão de código e arquitetura valem os de [AGENTS.md](AGENTS.md). Dúvida sobre regra? Pergunte na issue antes de codar.

## Segurança

Política completa de reporte em [SECURITY.md](SECURITY.md). Resumo: reporte privado, sem prova pública de exploração, rotação de credencial antes de limpar histórico se algum segredo vazar.

## Licença

MIT. Veja [LICENSE](LICENSE). Pode usar, copiar, modificar e vender. Sem garantia.

---

_Palavras-chave: fábrica de software, agentes de IA, automação de desenvolvimento, pipeline CI/CD, TDD, testes E2E Playwright, Vitest, TypeScript Node.js, PostgreSQL RAG, Docker sandbox, OpenAPI Zod, Better Auth, deploy NGINX WAF, LGPD, projeto open source MIT._

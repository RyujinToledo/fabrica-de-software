# Peça como cliente. Receba pronto. Sem tocar em código.

> Você tem a ideia. A Fábrica de Software constrói, testa e coloca no ar para você.

[![CI & Quality Gates](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml/badge.svg)](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Atividade](https://img.shields.io/github/last-commit/RyujinToledo/fabrica-de-software?label=atividade)](https://github.com/RyujinToledo/fabrica-de-software/pulse)
[![Stars](https://img.shields.io/github/stars/RyujinToledo/fabrica-de-software?label=stars)](https://github.com/RyujinToledo/fabrica-de-software/stargazers)
[![Contribuidores](https://img.shields.io/github/contributors/RyujinToledo/fabrica-de-software?label=contribuidores)](https://github.com/RyujinToledo/fabrica-de-software/graphs/contributors)

A **Fábrica de Software Autônoma** transforma uma ideia em português em um sistema funcionando de verdade. Com teste, segurança e endereço na internet. Você não precisa saber programar. Você não precisa colar código da IA e torcer para funcionar.

Se você hoje faz "vibe coding", copia e cola resposta de chat e vive apagando incêndio, aqui o jogo muda. Você passa a ser o cliente. Você pede, acompanha e aprova. A fábrica executa.

A fábrica roda na sua máquina ou no seu servidor. O Git guarda versão, histórico e as worktrees da execução, e isso é local. O GitHub é só onde este código-fonte está publicado. Nada do que roda em produção depende dele.

- Quer pedir um software? Vá direto para [Como pedir um software](#como-pedir-um-software).
- Quer ver como a ideia vira produto? Veja [Como funciona](#como-funciona).
- É da área técnica? Pule para [Para quem é dev](#para-quem-é-dev).

## Índice

- [Para quem é](#para-quem-é)
- [Chega de vibe coding](#chega-de-vibe-coding)
- [Como funciona](#como-funciona)
- [O que você recebe](#o-que-você-recebe)
- [Como pedir um software](#como-pedir-um-software)
- [Quanto custa saber programar](#quanto-custa-saber-programar)
- [Perguntas comuns](#perguntas-comuns)
- [Para quem é dev](#para-quem-é-dev)
- [Segurança](#segurança)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)

## Para quem é

É para você que tem um negócio ou uma ideia e não sabe nada de software.

- Dono de loja, salão, clínica, escola ou restaurante que quer um sistema simples.
- Autônomo que controla tudo no caderno ou na planilha e quer organizar.
- Gente com ideia de aplicativo que não sabe por onde começar.
- Quem já tentou pedir para a IA gerar código e se perdeu no meio do caminho.

Não é para quem quer aprender a programar. Aqui você não vai ver código. Você vai ver o produto pronto.

## Chega de vibe coding

Vibe coding é pedir um código para a IA, colar no projeto e rezar. Funciona uma vez. Depois quebra, ninguém sabe arrumar e o prejuízo é seu.

Ser cliente da fábrica é o oposto.

| Vibe coding                      | Ser cliente da fábrica                     |
| :------------------------------- | :----------------------------------------- |
| Você cola código que não entende | Você descreve o que precisa em português   |
| Ninguém testa de verdade         | Todo pedido passa por teste antes de valer |
| Segurança fica para depois       | Segurança já vem ligada desde o começo     |
| Quando quebra, é você que arruma | Quando falha, a esteira barra e refaz      |
| No fim, o sistema é um rascunho  | No fim, o sistema está no ar e é seu       |

A regra é simples. Você cuida do negócio. A fábrica cuida do software.

## Como funciona

Tudo em 3 passos. Você só age onde sua opinião importa.

```text
1. VOCÊ CONTA
   Você responde uma conversa guiada em português.
   Exemplo: "quero um sistema para marcar horário
   no meu salão e mandar lembrete no WhatsApp".

        |
        v

2. A FÁBRICA CONSTRÓI
   Especialistas de IA perguntam, desenham telas
   para você escolher e montam tudo com teste.
   Você acompanha o progresso em um painel.

        |
        v

3. VOCÊ APROVA E USA
   Você testa em um link temporário.
   Gostou? A fábrica coloca no ar para valer.
   O código inteiro é seu, sem aluguel.
```

Por dentro, esse caminho tem 11 fases com 5 paradas para você decidir. Entrevista, choque de realidade, escolha do visual, homologação e aprovação do deploy. O detalhe técnico está em [docs/ARQUITETURA-PROCESSO.md](docs/ARQUITETURA-PROCESSO.md) e na [Especificação](docs/Especificacao.md).

## O que você recebe

- Sistema funcionando em um endereço na internet.
- Telas com a sua cara, escolhidas por você antes de construir.
- Testes automáticos que provam que o principal funciona.
- Login com senha e segunda camada de proteção quando precisa.
- Banco de dados organizado com cópia e regra de privacidade.
- Proteção contra invasão comum na entrada do site.
- Documentação simples do que foi entregue.
- Repositório Git completo, com histórico e sem lock-in. Pode ficar no GitHub, no GitLab ou no seu servidor. Sem mensalidade para a fábrica, o código é seu sob licença MIT.

## Como pedir um software

O pedido entra no painel da fábrica. O GitHub não participa do pedido nem da execução.

1. Suba a fábrica na sua máquina ou servidor. As instruções estão em [Para quem é dev](#para-quem-é-dev).
2. Abra o painel no navegador.
3. Descreva a ideia em português simples:
   - O que você quer resolver?
   - Quem vai usar?
   - O que o sistema precisa fazer? Liste com suas palavras.
   - O que ele não precisa fazer agora?
4. A fábrica segue com as perguntas que faltarem e depois com a proposta de telas. Você acompanha as fases, os logs e as aprovações no mesmo painel.

A conversa guiada de entrada ainda está em construção. Até ela ficar pronta, o pedido é registrado pela API local, em `POST /projetos`, com nome e descrição. O resto da esteira já roda.

Dica que ajuda muito. Escreva um exemplo real de uso. "Maria agenda corte terça 14h e recebe lembrete no dia". Isso vale mais que termo técnico.

## Quanto custa saber programar

Nada. Zero.

Você não precisa saber o que é banco de dados, API, deploy ou teste. Se aparecer uma palavra estranha no painel, pergunte. A obrigação de explicar é nossa.

Se você é curioso e quer aprender, os documentos em [docs/](docs/) explicam cada fase. Mas aprender é opcional.

## Perguntas comuns

**Preciso instalar alguma coisa?**
A fábrica precisa rodar na sua máquina ou em um servidor. Para pedir e acompanhar, só o navegador. Conta no GitHub não é necessária. Para usar o sistema pronto, só o link.

**E se eu não gostar do visual?**
Você escolhe entre opções de tela antes de construir. Nada vai para frente sem seu ok.

**E se der erro depois de pronto?**
O código tem teste e histórico completo. Qualquer dev consegue continuar de onde parou. Você não fica preso à fábrica.

**Meus dados ficam seguros?**
Sim. Login com proteção, validação de tudo que entra, varredura de segredos no código e regras de privacidade conforme a LGPD. Detalhe em [SECURITY.md](SECURITY.md).

**Posso vender o sistema que recebi?**
Pode. A licença é MIT. Pode usar, modificar e vender.

**Isso substitui um programador?**
Não. Isso muda seu papel. Em vez de tentar ser programador por uma tarde, você atua como cliente com pedido claro, teste e aceite. Profissional continua bem-vindo para evoluir o produto.

## Para quem é dev

Resumo rápido para você avaliar em 2 minutos.

Pipeline determinístico em 11 fases. Orquestração com BullMQ e Valkey. RAG estruturado no PostgreSQL com busca textual em português. Execução em até 3 git worktrees, que são do git local, com containers Docker descartáveis sem root. TDD com Vitest no loop rápido e Playwright como gate final. Contrato OpenAPI 3.x derivado de schemas Zod. Auth com Better Auth, 2FA e política default-deny. Deploy com NGINX, Coraza WAF, fail2ban, Node.js, Valkey e PostgreSQL com Drizzle. O GitHub só hospeda este código e roda o CI do repositório; não é runtime nem banco.

| Camada              | Tecnologia                                            |
| :------------------ | :---------------------------------------------------- |
| Linguagem e runtime | TypeScript, Node.js LTS 22+                           |
| Frontend            | React, Vite, TanStack Router/Query, Tailwind CSS      |
| Backend e contrato  | Node.js, Zod, OpenAPI 3.x, Swagger só para operador   |
| Auth                | Better Auth com sessões e 2FA, operador único         |
| Banco e ORM         | PostgreSQL, Drizzle ORM                               |
| Fila e cache        | Valkey, BullMQ                                        |
| Testes              | Playwright para E2E, Vitest para unidade e integração |
| Qualidade           | Biome, TypeScript strict                              |
| Segurança           | Gitleaks, OWASP, Coraza WAF, fail2ban, NGINX          |
| Sandbox             | Docker descartável, git worktrees, máx. 3             |
| LLM                 | API OpenAI com compatibilidade OpenRouter             |
| Pacotes             | pnpm                                                  |

Documentos fonte:

- [docs/Especificacao.md](docs/Especificacao.md)
- [docs/Requisitos.md](docs/Requisitos.md)
- [docs/ARQUITETURA-PROCESSO.md](docs/ARQUITETURA-PROCESSO.md)
- [PRDs/](docs/PRDs/), [ADRs/](docs/ADRs/), [Tasks/](Tasks/), [Tasks/STATUS.md](Tasks/STATUS.md)
- Contrato da API em [openapi.json](openapi.json)

Rodar local:

```bash
git clone <url-do-repositorio> fabrica-de-software
cd fabrica-de-software
pnpm install
pnpm lint && pnpm typecheck
pnpm test
```

A URL pode ser deste repositório no GitHub ou de qualquer espelho em GitLab, servidor próprio ou pasta local. O clone não cria dependência com o GitHub.

Subir a fábrica local (painel + API + banco):

```bash
docker run -d --name fabrica-local -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=fabrica -p 127.0.0.1:5432:5432 -v fabrica-dados:/var/lib/postgresql/data \
  postgres:16
cp .env.example .env
# edite o .env: DATABASE_URL, BETTER_AUTH_SECRET longo e OPERADOR_LOCAL=1
pnpm db:migrate
node --experimental-strip-types scripts/servir-api.ts
# em outro terminal:
VITE_API_URL=http://127.0.0.1:3000 pnpm --filter @fabrica/painel build
pnpm --filter @fabrica/painel preview -- --port 4173
```

Com `OPERADOR_LOCAL=1`, o uso via loopback dispensa login. Fora de loopback, a sessão continua obrigatória. Nunca ligue isso em rede.

Regras do projeto em [AGENTS.md](AGENTS.md). Commits no padrão Conventional Commits. Sem segredo no repo, o Gitleaks barra no pre-commit e no CI do repositório. Esse CI é só qualidade do código; a fábrica em execução não fala com o GitHub.

## Segurança

Para reportar falha de forma privada, siga [SECURITY.md](SECURITY.md). Não abra issue pública com detalhe da falha.

Resumo da proteção: validação na entrada, permissão negada por padrão, segredo fora do código, containers sem privilégio e auditoria de licenças que barra GPL e AGPL.

## Como contribuir

Abra uma issue primeiro, faça fork e envie um PR pequeno.

- Passo a passo, gates e checklist: [CONTRIBUTING.md](CONTRIBUTING.md)
- Falha de segurança: [SECURITY.md](SECURITY.md)
- Licença: [LICENSE](LICENSE)

## Licença

MIT. Veja [LICENSE](LICENSE). Pode usar, modificar e vender. Sem garantia.

---

_Palavras-chave: fábrica de software, criar aplicativo sem saber programar, tirar ideia do papel, transformar ideia em app, sistema sob encomenda, inteligência artificial para negócios, automação para pequenas empresas, software para salão, loja, clínica e restaurante, open source MIT._

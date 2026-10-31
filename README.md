# Peça como cliente. Receba pronto. Sem tocar em código.

> Você tem a ideia. A Fábrica de Software constrói, testa e coloca no ar para você.

[![CI & Quality Gates](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml/badge.svg)](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **Fábrica de Software Autônoma** transforma uma ideia em português em um sistema funcionando de verdade. Com teste, segurança e endereço na internet. Você não precisa saber programar. Você não precisa colar código da IA e torcer para funcionar.

Se você hoje faz "vibe coding", copia e cola resposta de chat e vive apagando incêndio, aqui o jogo muda. Você passa a ser o cliente. Você pede, acompanha e aprova. A fábrica executa.

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
- Repositório Git completo. Sem lock-in. Sem mensalidade para a fábrica, o código é seu sob licença MIT.

## Como pedir um software

Hoje o pedido entra como uma issue no GitHub. Em breve vai ter um chat guiado dentro do painel.

1. Abra a aba [Issues](https://github.com/RyujinToledo/fabrica-de-software/issues) do repositório.
2. Clique em **New issue** e escolha **Pedir um software**.
3. Responda em português simples:
   - O que você quer resolver?
   - Quem vai usar?
   - O que o sistema precisa fazer? Liste com suas palavras.
   - O que ele não precisa fazer agora?
4. Envie. A fábrica responde com perguntas e depois com a proposta de telas.

Dica que ajuda muito. Escreva um exemplo real de uso. "Maria agenda corte terça 14h e recebe lembrete no dia". Isso vale mais que termo técnico.

## Quanto custa saber programar

Nada. Zero.

Você não precisa saber o que é banco de dados, API, deploy ou teste. Se aparecer uma palavra estranha no painel, abra uma issue perguntando. A obrigação de explicar é nossa.

Se você é curioso e quer aprender, os documentos em [docs/](docs/) explicam cada fase. Mas aprender é opcional.

## Perguntas comuns

**Preciso instalar alguma coisa?**
Não. Para pedir, só precisa do navegador e de conta no GitHub. Para usar o sistema pronto, só do link.

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

Pipeline determinístico em 11 fases. Orquestração com BullMQ e Valkey. RAG estruturado no PostgreSQL com busca textual em português. Execução em até 3 git worktrees com containers Docker descartáveis sem root. TDD com Vitest no loop rápido e Playwright como gate final. Contrato OpenAPI 3.x derivado de schemas Zod. Auth com Better Auth, 2FA e política default-deny. Deploy com NGINX, Coraza WAF, fail2ban, Node.js, Valkey e PostgreSQL com Drizzle.

| Camada              | Tecnologia                                            |
| :------------------ | :---------------------------------------------------- |
| Linguagem e runtime | TypeScript, Node.js LTS 22+                           |
| Frontend            | React, Vite, TanStack Router/Query, Tailwind CSS      |
| Backend e contrato  | Node.js, Zod, OpenAPI 3.x, Swagger só para admin      |
| Auth                | Better Auth com sessões, 2FA e RBAC                   |
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
- [PRDs/](PRDs/), [ADRs/](ADRs/), [Tasks/](Tasks/), [Tasks/STATUS.md](Tasks/STATUS.md)
- Contrato da API em [openapi.json](openapi.json)

Rodar local:

```bash
git clone https://github.com/RyujinToledo/fabrica-de-software.git
cd fabrica-de-software
pnpm install
pnpm lint && pnpm typecheck
pnpm test
```

Regras do projeto em [AGENTS.md](AGENTS.md). Commits no padrão Conventional Commits. Sem segredo no repo, o Gitleaks barra no pre-commit e no CI.

## Segurança

Para reportar falha de forma privada, siga [SECURITY.md](SECURITY.md). Não abra issue pública com detalhe da falha.

Resumo da proteção: validação na entrada, permissão negada por padrão, segredo fora do código, containers sem privilégio e auditoria de licenças que barra GPL e AGPL.

## Como contribuir

1. Abra uma issue em português explicando o problema com exemplo real.
2. Faça fork e crie uma branch curta a partir da `main`.
3. Use Conventional Commits. Exemplo: `fix(painel): corrige texto do botão de aprovar`.
4. Antes do PR, rode `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm security:scan`.
5. Abra um PR pequeno, com contexto e print quando ajudar.

## Licença

MIT. Veja [LICENSE](LICENSE). Pode usar, modificar e vender. Sem garantia.

---

_Palavras-chave: fábrica de software, criar aplicativo sem saber programar, tirar ideia do papel, transformar ideia em app, sistema sob encomenda, inteligência artificial para negócios, automação para pequenas empresas, software para salão, loja, clínica e restaurante, open source MIT._

---
name: Canvas de Observabilidade
description: Interface da fabrica de software em Slate e Cyan para acompanhar o pipeline em tempo real.
colors:
  background: "#020617"
  surface: "#0f172a"
  surface-elevada: "#1e293b"
  border: "#334155"
  primary: "#06b6d4"
  primary-strong: "#0891b2"
  primary-text: "#22d3ee"
  secondary: "#38bdf8"
  success: "#2dd4bf"
  warning: "#fbbf24"
  error: "#fb7185"
  error-strong: "#e11d48"
  text-primary: "#f1f5f9"
  text-muted: "#94a3b8"
  text-disabled: "#475569"
  on-primary: "#ffffff"
typography:
  sans:
    fontFamily: Geist Sans
  mono:
    fontFamily: JetBrains Mono
  texto-xs:
    fontFamily: Geist Sans
    fontSize: 12px
  texto-sm:
    fontFamily: Geist Sans
    fontSize: 14px
  texto-base:
    fontFamily: Geist Sans
    fontSize: 16px
  texto-lg:
    fontFamily: Geist Sans
    fontSize: 18px
  texto-xl:
    fontFamily: Geist Sans
    fontSize: 20px
  codigo:
    fontFamily: JetBrains Mono
    fontSize: 12px
rounded:
  cartao: 8px
  controle: 6px
spacing:
  cartao: 16px
  sidebar: 240px
components:
  card-fase:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.cartao}"
    padding: "{spacing.cartao}"
  card-fase-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.cartao}"
    padding: "{spacing.cartao}"
  botao-primario:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.controle}"
    padding: 8px 16px
  botao-secundario:
    backgroundColor: "{colors.border}"
    textColor: "#e2e8f0"
    rounded: "{rounded.controle}"
    padding: 8px 16px
  botao-destrutivo:
    backgroundColor: "{colors.error-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.controle}"
    padding: 8px 16px
  input:
    backgroundColor: "{colors.surface-elevada}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.controle}"
    padding: 8px 12px
  badge-pendente:
    backgroundColor: "{colors.border}"
    textColor: "#cbd5e1"
    rounded: "{rounded.controle}"
  badge-progresso:
    backgroundColor: "#06b6d41a"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.controle}"
  badge-concluido:
    backgroundColor: "#2dd4bf1a"
    textColor: "{colors.success}"
    rounded: "{rounded.controle}"
  badge-bloqueado:
    backgroundColor: "#fbbf241a"
    textColor: "{colors.warning}"
    rounded: "{rounded.controle}"
  badge-erro:
    backgroundColor: "#fb71851a"
    textColor: "{colors.error}"
    rounded: "{rounded.controle}"
---

## Overview

Canvas de Observabilidade: sidebar fixa com navegacao e estado geral,
area central com flow cards que representam as fases do pipeline e painel
inferior colapsavel com o terminal de logs. Densidade alta, sem decoracao.
O agente deve reproduzir esse layout com os tokens abaixo, sem inventar
cores, fontes ou arredondamentos.

## Colors

Paleta Slate e Cyan (classes Tailwind entre parenteses).

- **background (#020617):** fundo da pagina (`bg-slate-950`).
- **surface (#0f172a):** fundo de cards e sidebar (`bg-slate-900`).
- **surface-elevada (#1e293b):** inputs e superficies sobre cards (`bg-slate-800`).
- **border (#334155):** bordas e fundo de botao secundario (`border-slate-700`, `bg-slate-700`).
- **primary (#06b6d4):** hover de acao primaria (`bg-cyan-500`).
- **primary-strong (#0891b2):** fundo do botao primario (`bg-cyan-600`).
- **primary-text (#22d3ee):** acoes, links e elementos ativos (`text-cyan-400`).
- **secondary (#38bdf8):** acento secundario (`text-sky-400`).
- **success (#2dd4bf):** sucesso e fases concluidas (`text-teal-400`).
- **warning (#fbbf24):** avisos e fases que aguardam acao (`text-amber-400`).
- **error (#fb7185):** erros e falhas (`text-rose-400`).
- **error-strong (#e11d48):** fundo do botao destrutivo (`bg-rose-600`).
- **text-primary (#f1f5f9):** texto principal (`text-slate-100`).
- **text-muted (#94a3b8):** texto secundario (`text-slate-400`).
- **text-disabled (#475569):** texto desabilitado (`text-slate-600`).
- **on-primary (#ffffff):** texto sobre botoes coloridos.

Regras: cyan para acoes primarias, links e elementos ativos. Teal para
sucesso. Amber para aviso. Rose para erro. Nunca usar cor fora desta
paleta sem aprovacao.

## Typography

- **sans (Geist Sans):** toda a interface. `tabular-nums` obrigatorio em
  numeros, contadores e cronometros.
- **mono (JetBrains Mono):** codigo, logs, hashes e IDs.
- **texto-xs (12px):** badges, terminal, IDs de container, timestamps.
- **texto-sm (14px):** corpo de cards, inputs, descricoes.
- **texto-base (16px):** titulos de cards, nomes de fases, navegacao.
- **texto-lg (18px):** titulo do projeto, status geral.
- **texto-xl (20px):** headings de pagina, com moderacao.
- **codigo (12px mono):** terminal de logs e hashes.

## Layout

Sidebar fixa a esquerda com `{spacing.sidebar}` de largura, colapsavel em
telas abaixo de 768px. Area central com flow cards em fluxo vertical ou
grid de 2 colunas conforme a largura. Cada card mostra numero da fase,
nome, status, progresso e timestamp; o card expandido revela agente,
artefatos com links, logs resumidos e botoes de acao. Conexoes visuais
entre cards indicam dependencias. Painel inferior colapsavel com terminal
em tempo real e tabs Todos, Erros, Agentes e Containers, com filtro por
worktree e por fase.

## Shapes

- **cartao (8px, `rounded-lg`):** cards de fase, com hover mudando a borda
  para `border-cyan-500/50`.
- **controle (6px, `rounded-md`):** botoes, inputs e badges, sempre com
  `transition-colors duration-150`.

## Components

- **card-fase:** fundo `{colors.surface}`, texto `{colors.text-primary}`,
  padding `{spacing.cartao}`, badge de status no canto superior direito.
  No hover so a borda muda (card-fase-hover).
- **botao-primario:** `bg-cyan-600 hover:bg-cyan-500 text-white`.
  Excecao conhecida de contraste (3.68:1 no par branco sobre
  `primary-strong`), mantida do design aprovado. Texto corrido sobre
  fundo mantem o minimo WCAG AA.
- **botao-secundario:** `bg-slate-700 hover:bg-slate-600 text-slate-200`.
- **botao-destrutivo:** `bg-rose-600 hover:bg-rose-500 text-white`.
- **input:** `bg-slate-800 border-slate-700`, foco em `border-cyan-500`
  com `ring-cyan-500/20`.
- **badge-pendente, badge-progresso, badge-concluido, badge-bloqueado,
  badge-erro:** fundo solido para pendente, fundos a 10% com borda a 30%
  para os demais, texto na cor semantica. Fundos translucidos se compoem
  sobre `{colors.surface}`; o linter mede sem composicao e acusa
  contraste, o render real passa.

## Do's and Don'ts

- Faca: densidade alta, informacao visivel sem scroll excessivo.
- Faca: hierarquia por contraste, ativo em cyan, inativo em slate muted.
- Faca: contraste minimo WCAG AA em todo texto sobre fundo.
- Faca: responsivo, sidebar colapsa e cards empilham em telas estreitas.
- Nao faca: animacoes decorativas, so transicao de cor e opacidade.
- Nao faca: cor, fonte ou raio fora dos tokens sem aprovacao.

# Design System: Interface da Fabrica de Software

Especificacao visual final aprovada pelo usuario. Estilo escolhido: **Canvas de Observabilidade**.

---

## 1. Arquitetura de Layout: Canvas de Observabilidade

Sidebar fixa a esquerda com navegacao e estado geral. Area central com flow cards que representam as fases do pipeline. Cada card mostra status, progresso e acoes disponiveis.

### Sidebar Esquerda (fixa, ~240px)

- Logotipo e nome do projeto ativo.
- Navegacao vertical: Dashboard, Pipeline, Artefatos, Logs, Configuracoes.
- Indicadores de status compactos: worktrees ativas (ate 3), containers rodando, alertas pendentes.
- Botao de acao humana quando o pipeline aguarda decisao (badge pulsante).

### Area Central (flow cards)

- Cards de fase dispostos em fluxo vertical ou grid 2 colunas, dependendo da largura.
- Cada card mostra: numero da fase, nome, status (pendente/em progresso/concluido/bloqueado), barra de progresso, timestamp do ultimo update.
- Card expandido revela: agente responsavel, artefatos gerados (links clicaveis), logs resumidos, botoes de acao (aprovar, rejeitar, inspecionar).
- Conexoes visuais entre cards indicam dependencias (linhas SVG ou bordas conectadas).

### Painel Inferior (colapsavel)

- Terminal de logs em tempo real (OpenTelemetry, Docker, testes).
- Tabs: Todos, Erros, Agentes, Containers.
- Filtro por worktree e por fase.

---

## 2. Paleta de Cores: Slate & Cyan (Tailwind CSS)

Paleta final aprovada:

- Background: `bg-slate-950` (#020617)
- Surface: `bg-slate-900` (#0f172a)
- Surface Elevada: `bg-slate-800` (#1e293b)
- Border: `border-slate-700` (#334155)
- Primary / Accent: `bg-cyan-500` / `text-cyan-400` (#06b6d4 / #22d3ee)
- Secondary: `text-sky-400` (#38bdf8)
- Success: `text-teal-400` (#2dd4bf)
- Warning: `text-amber-400` (#fbbf24)
- Error: `text-rose-400` (#fb7185)
- Text Primary: `text-slate-100` (#f1f5f9)
- Text Muted: `text-slate-400` (#94a3b8)
- Text Disabled: `text-slate-600` (#475569)

### Regras de uso

- Cyan para acoes primarias, links, e elementos interativos ativos.
- Teal para indicadores de sucesso e fases concluidas.
- Amber para avisos e fases que aguardam acao.
- Rose para erros e falhas.
- Nunca usar cores fora desta paleta sem aprovacao.

---

## 3. Tipografia

- **Interface geral (`font-sans`)**: Geist Sans. `tabular-nums` obrigatorio em numeros, contadores e cronometros.
- **Codigo, logs e hashes (`font-mono`)**: JetBrains Mono.
- **Escala de tamanho**:
  - `text-xs` (12px): badges de status, logs do terminal, IDs de container, timestamps.
  - `text-sm` (14px): corpo de texto em cards, inputs, descricoes de tarefas.
  - `text-base` (16px): titulos de cards, nomes de fases, labels de navegacao.
  - `text-lg` (18px): titulo do projeto, status geral do pipeline.
  - `text-xl` (20px): headings de pagina (usado com moderacao).

---

## 4. Componentes Padrao

### Cards de Fase

- Fundo: `bg-slate-900`, borda `border-slate-700`, `rounded-lg`.
- Hover: borda muda para `border-cyan-500/50`.
- Status badge no canto superior direito com cor semantica.
- Padding interno: `p-4`.

### Botoes

- Primario: `bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-4 py-2`.
- Secundario: `bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md px-4 py-2`.
- Destrutivo: `bg-rose-600 hover:bg-rose-500 text-white rounded-md px-4 py-2`.
- Todos com `transition-colors duration-150`.

### Inputs

- `bg-slate-800 border-slate-700 text-slate-100 rounded-md focus:border-cyan-500 focus:ring-cyan-500/20`.

### Badges de Status

- Pendente: `bg-slate-700 text-slate-300`.
- Em progresso: `bg-cyan-500/10 text-cyan-400 border border-cyan-500/30`.
- Concluido: `bg-teal-500/10 text-teal-400 border border-teal-500/30`.
- Bloqueado: `bg-amber-500/10 text-amber-400 border border-amber-500/30`.
- Erro: `bg-rose-500/10 text-rose-400 border border-rose-500/30`.

---

## 5. Principios

- Densidade alta: informacao visivel sem scroll excessivo.
- Hierarquia por contraste: elementos ativos em cyan, inativos em slate muted.
- Animacoes minimas: transicoes de cor e opacidade. Sem animacoes decorativas.
- Acessibilidade: contraste minimo WCAG AA em todos os textos sobre fundos.
- Responsividade: sidebar colapsa em telas < 768px, flow cards empilham verticalmente.

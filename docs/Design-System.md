# Design System: Interface da Fabrica de Software

Recomendacoes e especificacoes visuais formuladas pelo Agente Especialista de Design para a interface web interna.

---

## 1. Arquitetura de Layout: Cockpit Modular de Engenharia

Layout de tela cheia dividido em tres paineis de alta densidade sem espaco desperdicado:

1. **Painel Esquerdo (Fluxo e Dialogo)**:
   - Chat interativo com a esteira e agentes.
   - Trilha visual com a timeline das 11 fases do processo.
   - Alertas de tarefas que aguardam decisao humana.

2. **Painel Central (Inspecao de Artefatos)**:
   - Visualizacao e edicao de documentos gerados (`Demanda.md`, `Requisitos.md`, `Especificacao.md`, PRDs, ADRs e Tasks).
   - Abas rapidas e alternancia entre visualizacao renderizada e modo diff.

3. **Painel Direito / Inferior (Operacao e Telemetria)**:
   - Terminal virtualizado de logs em tempo real (OpenTelemetry, Docker, Biome, Vitest, Playwright, Gitleaks).
   - Monitoramento das ate 3 worktrees concorrentes com consumo de CPU, RAM e tempo de execucao.

---

## 2. Paletas de Cores Semanticas (Tailwind CSS)

### Opcao 1: Zinc & Emerald (Recomendada)

- Background: `bg-zinc-950` (#09090b)
- Surface: `bg-zinc-900` (#18181b)
- Surface Elevada: `bg-zinc-800` (#27272a)
- Border: `border-zinc-800` (#27272a)
- Primary / Accent: `bg-emerald-500` / `text-emerald-400` (#10b981 / #34d399)
- Success: `text-emerald-400` (#34d399)
- Warning: `text-amber-400` (#fbbf24)
- Error: `text-rose-500` (#f43f5e)
- Text Primary: `text-zinc-50` (#fafafa)
- Text Muted: `text-zinc-400` (#a1a1aa)

### Opcao 2: Terminal Industrial

- Background: `bg-neutral-950` (#0a0a0a)
- Surface: `bg-neutral-900` (#171717)
- Surface Elevada: `bg-neutral-850` (#1f1f1f)
- Border: `border-neutral-800` (#262626)
- Primary / Accent: `bg-amber-500` / `text-amber-400` (#f59e0b / #fbbf24)
- Success: `text-emerald-500` (#10b981)
- Warning: `text-yellow-400` (#facc15)
- Error: `text-red-500` (#ef4444)
- Text Primary: `text-neutral-100` (#f5f5f5)
- Text Muted: `text-neutral-400` (#a3a3a3)

### Opcao 3: Dark Slate & Cyan

- Background: `bg-slate-950` (#020617)
- Surface: `bg-slate-900` (#0f172a)
- Surface Elevada: `bg-slate-800` (#1e293b)
- Border: `border-slate-800` (#1e293b)
- Primary / Accent: `bg-cyan-500` / `text-cyan-400` (#06b6d4)
- Success: `text-teal-400` (#2dd4bf)
- Warning: `text-amber-400` (#fbbf24)
- Error: `text-rose-400` (#fb7185)
- Text Primary: `text-slate-100` (#f1f5f9)
- Text Muted: `text-slate-400` (#94a3b8)

---

## 3. Tipografia e Hierarquia

- **Interface geral (`font-sans`)**: Inter ou Geist Sans com `tabular-nums` ativo em todos os numeros, contadores e cronometros.
- **Codigo, logs e hashes (`font-mono`)**: JetBrains Mono.
- **Escala de tamanho**:
  - `text-xs` (12px): badges de status, logs do terminal, identificadores de container e tempo.
  - `text-sm` (14px): corpo de chat, inputs e descricoes de tarefas.
  - `text-base` (16px): titulos de paineis e abas principais.
  - `text-lg` (18px): status geral da esteira e identificador do projeto.

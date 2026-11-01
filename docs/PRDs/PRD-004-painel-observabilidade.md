# PRD-004 — Painel de Observabilidade

## Contexto

Interface web da fábrica. Estilo Canvas de Observabilidade, paleta Slate e Cyan.

Cobre RF-005 e o Design-System aprovado.

## Objetivo

Mostrar em tempo real onde o pipeline está e pedir decisão humana só quando trava.

## Personas

- Dono do produto: acompanha fases, aprova paradas, abre preview.
- Operador: filtra logs por worktree e fase, identifica task bloqueada.

## Fluxos

### Acompanhamento

1. Sidebar fixa (~240 px) mostra projeto ativo, navegação (Dashboard, Pipeline, Artefatos, Logs, Configurações), worktrees ativas, containers e alertas.
2. Área central lista as 11 fases em cards com número, nome, status, progresso e timestamp.
3. Card expandido revela agente responsável, artefatos com link, resumo de logs e botões aprovar, rejeitar e inspecionar.
4. Botão de ação humana pulsa com badge quando há parada pendente.

### Logs

1. Painel inferior colapsável mostra terminal em tempo real.
2. Abas: Todos, Erros, Agentes, Containers.
3. Filtro por worktree e por fase.

## Requisitos

- Paleta exata: `bg-slate-950`, `bg-slate-900`, `bg-slate-800`, `border-slate-700`, `cyan-500` e `cyan-400` para ação, `sky-400` secundário, `teal-400` sucesso, `amber-400` aviso, `rose-400` erro.
- Tipografia: Geist Sans com `tabular-nums` na interface; JetBrains Mono em código e logs.
- Componentes padrão do Design-System: cards `bg-slate-900 rounded-lg p-4`, botões primário `bg-cyan-600`, secundário `bg-slate-700`, destrutivo `bg-rose-600`, inputs `bg-slate-800`.
- Badges: pendente, em progresso, concluído, bloqueado, erro.
- Responsivo: sidebar colapsa abaixo de 768 px; cards empilham.
- Frontend é vitrine: nenhuma autorização ou regra crítica só no cliente. Backend revalida tudo.

## Fora de escopo

- Motor do pipeline (PRD-001).
- Geração de preview em si (PRD-003, PRD-006).

## Definition of Done

- [ ] Fase atual, tasks em execução, containers e logs visíveis sem recarregar.
- [ ] Ação humana aprovável e rejeitável pelo painel com registro.
- [ ] Contraste mínimo WCAG AA.
- [ ] Layout confere com `docs/mocks/design-comparison.html`.

# PRD-001 — Orquestrador do Pipeline

## Contexto

A fábrica transforma demanda em linguagem natural em produto em produção por 11 fases fixas. LLM não decide a ordem. Quem decide é código determinístico.

Cobre RF-006, RF-008, RF-015 e RNF-002, RNF-004.

## Objetivo

Máquina de estados que avança de fase só quando a fase anterior entrega o artefato esperado e passa nos gates.

## Personas

- Dono do produto: acompanha fase atual e decide nas 5 paradas.
- Agente executor: recebe task com entrada e saída bem definidas, sem acesso a fase alheia.

## Fluxos

### Fluxo principal

1. Pipeline criado a partir de conversa inicial. Estado `fase=1`.
2. Cada transição grava no banco: fase anterior, artefato gerado, quem aprovou, carimbo de tempo.
3. Parada humana bloqueia avanço até aprovar ou rejeitar com motivo.
4. Falha em gate mantém a fase atual e marca a task como bloqueada com motivo legível.

### Paradas humanas obrigatórias

1. Entrevista de demanda (Fase 1).
2. Choque de realidade (Fase 3).
3. Consultoria de design (Fase 4).
4. Homologação em preview (Fase 10).
5. Aprovação de deploy (Fase 11).

## Requisitos

- Estados das 11 fases da Especificação, sem pular fase.
- Transição idempotente: repetir o mesmo evento não duplica artefato nem task (RNF-004).
- Fila BullMQ mais Valkey como motor de avanço, com retentativa segura.
- Cada task carrega: o que fazer, o que não fazer e Definition of Done mensurável (RF-008).
- Conflito entre frentes paralelas aciona agente neutro (RF-015).
- Telemetria de transição em OpenTelemetry sem dado sensível.

## Fora de escopo

- Interface visual (PRD-004).
- Execução em container (PRD-003).
- Regra de negócio de projeto gerado. O orquestrador governa a fábrica, não o produto final.

## Definition of Done

- [ ] Avanço só com artefato da fase anterior presente.
- [ ] 5 paradas bloqueiam de verdade sem aprovação.
- [ ] Retentativa do mesmo evento não cria duplicata.
- [ ] Log mostra fase atual, task em execução e motivo de bloqueio.

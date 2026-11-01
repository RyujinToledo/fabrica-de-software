# ADR-009 — OpenAI API com OpenRouter no Dia Zero

## Contexto

A demanda fixa OpenAI como padrão e pede compatibilidade com OpenRouter sem adapter novo (PRD-002, Choque-de-Realidade item 6).

## Decisão

Cliente HTTP compatível com o formato OpenAI API. Base URL e modelo por variável de ambiente. Chave só no servidor central.

## Alternativas descartadas

- SDK por provedor: fere o YAGNI e abre brecha para troca de stack por prompt.
- Chave no container ou no cliente: vazamento quase certo, barrado por RF-024.

## Consequências

- Troca de modelo sem trocar código.
- Prompts isolados em delimitadores; ferramenta limitada ao papel do agente.
- PII mascarada antes de qualquer chamada externa.

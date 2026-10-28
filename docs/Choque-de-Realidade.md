# Decisoes do Choque de Realidade

Registro das definicoes estrategicas e resolucao dos dilemas apontados pelo Agente Neutro.

---

## 1. Escopo e Finalidade do Produto

- **Decisao**: A Fabrica de Software e uma ferramenta de **uso interno** permanente para a nossa equipe construir solucoes com velocidade e rigor.
- **Impacto no Escopo**: Modulos fiscais, calculo tributario complexo e emissao de NFS-e (antigos RF-028 e RF-029) foram **completamente eliminados** do escopo inicial (KISS e YAGNI).

## 2. Ciclo de TDD e Posicionamento do Playwright

- **Decisao**: O Playwright E2E atua como **gate final** de homologacao e conclusao da funcionalidade integrada.
- **Impacto no Escopo**: O loop interno rapido de geracao de codigo pelo agente executor utiliza testes de contrato, schemas e integracao leves com **Vitest**, poupando memoria RAM, evitando quedas de OOM e reduzindo drasticamente o consumo de tokens da OpenAI.

## 3. Limite de Concorrencia da Esteira

- **Decisao**: O teto maximo de execucao paralela e fixado em **3 tarefas simultaneas** (`git worktrees` e containers Docker efemeros).
- **Impacto no Escopo**: Protege os recursos da maquina host (CPU, memoria e limites de taxa de chamadas concorrentes).

## 4. Estrategia de Deploy em Producao

- **Decisao**: A definicao do destino de producao e **completamente dinamica**.
- **Impacto no Escopo**: O **Agente Integrador de Infraestrutura** conduz uma conversa contextual com o usuario para adaptar a saida conforme a necessidade especifica (scripts de provisionamento, Docker Compose, configuracoes de VPS ou CI/CD de publicacao).

## 5. Human-in-the-Loop e Paradas de Validacao

- **Decisao**: Mantidas as 5 paradas formais de co-validacao humana (Entrevista, Choque de Realidade, Consultoria de Design, Homologacao em preview e Aprovacao de Deploy).
- **Impacto no Escopo**: Zero risco de desvio de escopo; o software final e validado formalmente pelo usuario em marcos criticos.

## 6. Provedor de LLM e Compatibilidade OpenRouter

- **Decisao**: Adocao do padrao de API da OpenAI no **dia zero com suporte nativo a OpenRouter**.
- **Impacto no Escopo**: Permite alternar modelos e roteadores sem trocar SDK nem introduzir novos adapters.

# Arquitetura do Processo: Fabrica de Software Autonoma

Documento mestre de especificacao da esteira, ciclo de vida e regras operacionais da fabrica de software.

---

## 1. Visao Geral e Principios

A fabrica de software transforma demandas em linguagem natural em produtos prontos rodando em producao.
O processo e governado por uma maquina de estados deterministica. As LLMs operam dentro de etapas engessadas, com ferramentas e guardrails fixos, sem liberdade para desviar da stack aprovada.

### Principios Fundamentais

1. **Spec Driven**: Nenhum codigo e escrito antes da aprovacao da especificacao, PRDs, ADRs e tasks.
2. **TDD Rigoroso com Foco E2E**: Testes ponta a ponta (Playwright) tem prioridade maxima sobre testes unitarios. O teste e gerado antes da implementacao e validado em falha antes de buscar o verde.
3. **Isolamento Total**:
   - Concorrencia de desenvolvimento via `git worktree` e branches isoladas.
   - Execucao e validacao de codigo exclusivamente em containers Docker descartaveis.
4. **OWASP e Seguranca por Padrao**: Validacao de entrada na borda (Zod), prevencao contra injecao, CSRF, XSS e zero vazamento de credenciais (Gitleaks).
5. **Transparencia de Infraestrutura**: Codigo e infraestrutura sao entregues juntos como um unico produto. O usuario final nao precisa gerenciar detalhes tecnicos de infraestrutura.
6. **Idioma Oficial**: Toda a documentacao, especificacoes, PRDs, ADRs, tasks, regras de negocio e mensagens de interface sao escritas exclusivamente em portugues do Brasil.

---

## 2. Pipeline do Processo (Fases de Execucao)

```
[Cliente no Chat Web]
        │
        ▼
1. Elicitacao de Requisitos ──────────► Demanda.md (Texto bruto do usuario)
        │
        ▼
2. Painel de Especialistas ───────────► Requisitos.md (Multidisciplinar)
   (Legislacao, Impostos, Seguranca,
    Mercado, Concorrentes, Alternativas)
        │
        ▼
3. Choque de Realidade ───────────────► Dúvidas e dilemas apresentados ao Cliente
   (Agente Neutro sem viés)
        │
        ▼ (Cliente responde)
4. Consultoria de Design ─────────────► Recomendacoes visuais (estilos, cores, fontes)
   (Agente Especialista de Design)          aprovadas pelo Cliente
        │
        ▼
5. Consolidacao e Coerencia ──────────► Especificacao.md (com Design incluso)
   (Agente de Coerência audita furos)
        │
        ▼
6. Decomposicao Tecnica ──────────────► PRDs/ (Produto) + ADRs/ (Arquitetura)
        │
        ▼
7. Geracao de Tasks ──────────────────► Tasks/ (O que fazer, o que NAO fazer, DoD)
        │
        ▼
8. Execucao Concorrente ──────────────► Git Worktrees + Docker descartaveis (TDD E2E)
        │
        ▼
9. Integracao e Validacao ────────────► Merge automatizado + Fallback de Agente Neutro
        │
        ▼
10. Homologacao do Cliente ───────────► Preview URLs via container Docker descartavel
        │
        ▼ (Cliente aprova versao final)
11. Agente Integrador e Deploy ───────► Produto no ar (NGINX + WAF Coraza + fail2ban + app)
```

---

## 3. Detalhamento de Cada Fase

### Fase 1: Elicitacao e Demanda Bruta

- A interacao inicial ocorre via interface web no formato de conversa/entrevista.
- O agente entrevistador foca em descobrir objetivos de negocio, publico-alvo e resultados esperados.
- O resultado e o arquivo `Demanda.md`, redigido exatamente como o cliente se expressou, preservando as palavras e eventuais erros de portugues originais.

### Fase 2: Painel Multidisciplinar de Especialistas

Agentes especializados analisam a `Demanda.md` em paralelo sob angulos distintos:
- **Legislacao**: Conformidade regulatoria, LGPD, termos e retencao de dados.
- **Impostos e Tributacao**: Regras fiscais, cobrancas, emissoes de notas e impactos operacionais.
- **Seguranca**: Modelagem de ameacas, fluxo de autenticacao e superficie de ataque.
- **Mercado e Tendencias**: Viabilidade comercial e expectativas do segmento.
- **Concorrentes**: Analise de solucoes existentes e diferenciais competitivos.
- **Alternativas**: Tecnologias, modelos de monetizacao e rotas de execucao.
- **Especialistas Dinamicos**: Criados sob demanda caso o nicho exija expertise particular.
  Todos os levantamentos sao consolidados no arquivo `Requisitos.md`.

### Fase 3: Choque de Realidade (Devil's Advocate)

- Um agente neutro, propositalmente desprovido de skills e vieses, confronta `Demanda.md` e `Requisitos.md`.
- Ele busca furos logicos, custos ocultos, premissas irreais e contradicoes de negocio.
- O resultado gera uma nova rodada de perguntas para o cliente decidir objetivamente por quais caminhos seguir.

### Fase 4: Consultoria e Decisao de Design

- O **Agente Especialista de Design** analisa a demanda e o levantamento de requisitos com olhar apurado de design taste.
- Formula propostas estruturadas de design system adequadas ao produto:
  - Estilos de interface (layout, densidade, bordas, espacamentos).
  - Paleta de cores semantica (Tailwind CSS: primarias, secundarias, neutras, estados e contrastes).
  - Tipografia (fontes para titulos, textos e interface com hierarquia clara).
- **Mocks Padronizados Obrigatorios**: O agente deve produzir dashboards/mockups interativos em HTML com alternancia em tempo real para que o usuario sinta o contraste, densidade e legibilidade antes de tomar a decisao.
- Apresenta as recomendacoes visuais para o usuario avaliar e decidir seu direcionamento favorito.

### Fase 5: Consolidacao e Auditoria de Coerencia

- Com as respostas do cliente e a identidade visual decidida, e gerado o documento `Especificacao.md` final.
- Um **Agente de Coerencia** valida todo o documento. Se houver qualquer contradicao, inconsistencia de design ou lacuna logica, o documento e ajustado antes de avancar.

### Fase 6: PRDs, ADRs e Decomposicao de Tasks

- **PRDs (Product Requirement Documents)**: Descrevem o comportamento esperado da feature, fluxos de usuarios, personas e as diretrizes de design aprovadas.
- **ADRs (Architecture Decision Records)**: Decisoes tecnicas diretas e justificadas, vinculadas aos PRDs.
  - A stack aprovada e o cardapio maximo permitido. Estar aprovada nao obriga o uso de todas as ferramentas, mas proibe qualquer ferramenta externa.
- **Fundações Obrigatorias**:
  1. **Modelagem de Dominio**: Entidades e regras de negocio puras.
  2. **Modelagem do Banco de Dados**: Schemas, migrations e integridade referencial no PostgreSQL.
  3. **Modelagem da API com OpenAPI**:
     - Contrato estrito no padrao **OpenAPI 3.x** derivado dos schemas de validacao Zod.
     - Painel interativo de documentacao (Swagger UI) centralizado em uma rota unica protegida, acessivel **exclusivamente pelo administrador autenticado**, nunca exposto publicamente.
  4. **Modelagem de Permissoes (Zero-Trust)**:
     - Politica rigorosa de controle de acesso: na duvida, o padrao e **Zero-Trust** com negacao por padrao (`default-deny`).
     - Principio do menor privilegio (`least privilege`) aplicado em cada endpoint, servico e operacao de banco.
  5. **Metricas Claras de Performance Monitoradas**: Latencia, throughput e queries lentas.
  6. **Regras Rigidas de OWASP**: Sanitizacao de inputs, protecao contra SQLi, XSS, CSRF, secrets fora do codigo e headers seguros de HTTP.
- **Tasks**:
  - Descricao e objetivo claro.
  - O que **nao deve ser feito** (guardrails negativos).
  - Provas e requisitos necessarios para ser considerado "feito" (Definition of Done).

### Fase 7: Execucao Concorrente com Git Worktrees e TDD

- Cada task ou conjunto de tasks independentes e atribuida a uma `git worktree` com branch dedicada.
- **TDD Rigoroso**: O agente cria primeiro o teste ponta a ponta (`Playwright`) ou de contrato/integracao (`Vitest`).
- A execucao ocorre dentro de um container Docker descartavel. O teste roda, falha comprovadamente, o codigo e desenvolvido e o ciclo se repete ate o verde.
- Gates da task no container:
  - `pnpm biome check`
  - `pnpm tsc --noEmit`
  - `gitleaks protect --staged`
  - `pnpm security:baseline --projeto <worktree>`
  - `vitest` / `playwright`

O `gitleaks` roda sempre com a baseline versionada na raiz da fabrica (`.gitleaks.toml`), copiada sem alteracao para cada projeto gerado. A baseline estende as regras padrao e inclui a regra `senha-em-comando-sudo`, que barra senha passada via `echo` em comando `sudo`.

O gate `pnpm security:baseline` fecha o ciclo em dois momentos. Sem argumentos, valida a baseline da fabrica: confere a regra, prova que ela detecta o padrao proibido e que nao acusa texto limpo. Com `--projeto <worktree>`, compara o `.gitleaks.toml` do projeto com o da fabrica por hash. Projeto sem o arquivo, ou com o arquivo alterado, reprova a task. O script vive so na fabrica e roda contra a worktree do projeto, para nao existir copia divergente da regra.

### Fase 8: Integracao e Homologacao

- Conclusao de tarefas dispara o merge na branch de integracao.
- A esteira executa a suite de testes de regressao e testes E2E.
- **Fallback de Conflitos**: Caso surjam conflitos de merge ou de contrato entre frentes paralelas, um **Agente Neutro Integrador** e acionado para solucionar a inconsistencia.
- URLs de homologacao sao geradas a partir de containers Docker descartaveis para o cliente validar o produto funcionando em tempo real.

### Fase 9: Producao e Deploy

- Quando o usuario sinaliza que a versao esta pronta para producao, entra o **Agente Integrador de Infraestrutura**.
- O agente formula os questionamentos necessarios sobre o destino do deploy.
- A fabrica empacota e provisiona a infraestrutura completa de producao:
  - Borda: NGINX + Coraza WAF + fail2ban
  - Banco e Cache: PostgreSQL + Valkey
  - Servico: Node.js LTS com Docker Compose / scripts / GitHub Actions
- O usuario recebe o produto operando no ambiente final.

---

## 4. Cerebro Operacional: PostgreSQL como RAG Estruturado

A fabrica gerencia seu proprio estado atraves de um banco PostgreSQL interno:
- **Tabelas de Dominio**: Projetos, Sessoes de Entrevista, Mensagens, Requisitos, PRDs, ADRs, Tasks e Worktrees.
- **Busca Textual e Semantica (RAG sem custo)**: Indices no PostgreSQL permitem que qualquer agente busque rapidamente decisoes anteriores, contextos de PRDs ou restricoes de negocio sem custo extra de APIs de embeddings dedicadas.

---

## 5. Stack Aprovada da Fabrica e dos Produtos Gerados

| Componente                 | Tecnologia Aprovada                                                     |
| :------------------------- | :---------------------------------------------------------------------- |
| **Linguagem & Runtime**    | TypeScript, Node.js LTS                                                 |
| **Frontend**               | React, Vite, TanStack (Router/Query), Tailwind CSS                      |
| **Backend & Validacao**    | Node.js, Zod (validacao de borda), OpenAPI 3.x, Swagger UI (admin-only) |
| **Autenticacao**           | Better Auth (sessoes, 2FA, RBAC)                                        |
| **Banco de Dados & ORM**   | PostgreSQL, Drizzle ORM (migrations em SQL puro)                        |
| **Cache & Filas**          | Valkey, BullMQ                                                          |
| **Armazenamento**          | S3-compatible (Cloudflare R2 / AWS S3) e arquivos estaticos locais      |
| **Comunicacao**            | Resend (email transacional), Twilio (SMS/WhatsApp sob demanda)          |
| **Telemetria & Metricas**  | OpenTelemetry                                                           |
| **Testes**                 | Playwright (E2E prioritario), Vitest (Unitarios/Integracao)             |
| **Qualidade & Estilo**     | Biome, TypeScript strict                                                |
| **Seguranca**              | Gitleaks, OWASP guardrails, Coraza WAF, fail2ban, NGINX                 |
| **Gerenciador de Pacotes** | pnpm                                                                    |
| **Sandbox & Execucao**     | Docker (containers descartaveis), Git Worktrees                         |
| **Provedor de LLM**        | OpenAI API (padrao exclusivo inicial)                                   |

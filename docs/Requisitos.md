# Requisitos do Sistema: Fabrica de Software Autonoma

Documento mestre de consolidacao dos levantamentos funcionais e nao-funcionais elaborados pelo Painel Multidisciplinar de Especialistas (Legislacao, Impostos, Seguranca e OWASP, Mercado, Concorrentes e Alternativas de Arquitetura).

---

## 1. Visao Geral dos Requisitos

A Fabrica de Software automatizada opera como uma plataforma de engenharia de software ponta a ponta. A consolidacao dos 6 angulos de analise orienta a construcao do nucleo do sistema, do orquestrador deterministico, da camada de isolamento e dos contratos de interface.

---

## 2. Requisitos Funcionais (RF)

### 2.1 Elicitacao, Concepcao e Interacao com o Usuario

- **RF-001 (Entrevista de Demanda Bruta)**: A interface web deve conduzir a entrevista inicial capturando os objetivos e expectativas do usuario sem filtros gramaticais, gerando o arquivo `Demanda.md`.
- **RF-002 (Rodada de Choque de Realidade)**: O sistema deve gerar automaticamente um conjunto de perguntas e desafios criticos apontando falhas, riscos e contradicoes da demanda para decisao do usuario antes de qualquer especificacao tecnica.
- **RF-003 (Consultoria e Aprovacao de Design)**: O sistema deve gerar recomendacoes visuais de paleta de cores semantica (Tailwind CSS), estilos de layout e tipografia para escolha e aprovacao do usuario antes de fechar a `Especificacao.md`.
- **RF-004 (Auditoria do Agente de Coerencia)**: Apos a integracao das respostas do choque de realidade e das escolhas visuais, um agente neutro deve auditar a `Especificacao.md` para garantir que nao ha lacunas logicas nem contradicoes.
- **RF-005 (Painel de Visibilidade em Tempo Real)**: A interface web deve exibir o progresso da esteira em tempo real, informando fase atual, tasks em execucao, status de containers e historico de logs.

### 2.2 Arquitetura, Decomposicao e Governanca de Tasks

- **RF-006 (Decomposicao em PRDs e ADRs)**: O sistema deve fatiar cada feature em documentos PRD (comportamento de produto) e ADR (justificativa tecnica restrita a stack aprovada).
- **RF-007 (Guardião Rigido da Stack)**: A esteira deve bloquear e rejeitar a inclusao de qualquer pacote, biblioteca ou tecnologia fora do cardapio aprovado (TypeScript, Node.js, React, Vite, TanStack, Tailwind, Postgres, Drizzle, Valkey, BullMQ, Playwright, Vitest, Biome, Gitleaks, Better Auth, Resend, Twilio, OpenTelemetry).
- **RF-008 (Geracao de Tasks com Guardrails)**: Cada tarefa gerada deve conter obrigatoriamente: o que deve ser feito, o que **nao** deve ser feito (escopo negativo) e as condicoes de aceite mensuraveis (Definition of Done).
- **RF-009 (Contrato OpenAPI 3.x Obrigatório)**: O backend gerado deve derivar contratos estritos no padrao OpenAPI 3.x a partir dos schemas de entrada e saida.
- **RF-010 (Swagger Administrativo Restrito)**: O painel interativo de documentacao da API deve ser montado em rota unica, protegido por autenticacao e liberado exclusivamente para administradores autenticados.

### 2.3 Execucao Concorrente, TDD e Sandbox Docker

- **RF-011 (Paralelismo por Git Worktree)**: Cada task paralela deve operar em branch propria e `git worktree` dedicada para evitar colisoes de arquivos.
- **RF-012 (TDD E2E com Prova de Falha Previa)**: A esteira deve validar que os testes Playwright ou Vitest foram gerados e falharam comprovadamente no container antes de autorizar a geracao do codigo de implementacao.
- **RF-013 (Sandbox Descartavel em Docker)**: Cada build e suite de testes deve rodar dentro de container Docker descartavel, com destruicao imediata ao termino ou ao atingir timeout.
- **RF-014 (Gates Automaticos por Task)**: Nenhuma tarefa e concluida sem aprovacao simultanea nos gates: `biome check`, `tsc --noEmit`, `gitleaks protect --staged` e testes verdes.
- **RF-015 (Agente Neutro Integrador)**: Caso ocorram conflitos de merge ou de contratos entre frentes paralelas na esteira, um agente neutro deve ser acionado automaticamente para resolver a divergencia.
- **RF-016 (URLs de Preview para Homologacao)**: O sistema deve subir containers temporarios e disponibilizar links de homologacao para o cliente validar o produto funcionando antes da versao de producao.

### 2.4 Deploy, Infraestrutura e Entrega

- **RF-017 (Agente Integrador de Infraestrutura)**: Quando o cliente marcar a versao como pronta para producao, um agente integrador deve coletar as definicoes do ambiente final e provisionar o software.
- **RF-018 (Pacote Completo de Producao)**: A entrega final deve gerar e configurar automaticamente os manifestos para NGINX, Coraza WAF, fail2ban, servico Node.js, Valkey e banco PostgreSQL com migrations Drizzle.
- **RF-019 (Exportacao Integral do Repositorio)**: O usuario tem acesso irrestrito ao repositorio Git completo com historico de commits, sem qualquer dependencia ou lock-in da fabrica.

### 2.5 Seguranca, Autenticacao e OWASP

- **RF-020 (Autenticacao Segura com Better Auth)**: Autenticacao robusta com suporte a sessoes no banco, 2FA e cookies `HttpOnly`, `SameSite=Strict` e `Secure`.
- **RF-021 (Zero-Trust de Permissoes)**: Politica de `default-deny` aplicada a nivel de rota e de objeto (`project_id`), exigindo autorizacao explicita pelo menor privilegio.
- **RF-022 (Validacao Estrita de Schemas com Zod)**: Toda requisicao externa, payload de API e retorno de ferramenta de LLM deve ser validado via schemas Zod.
- **RF-023 (Protecao contra Prompt Injection e Excesso de Agencia)**: Prompts de entrada devem ser isolados em delimitadores de dados e as ferramentas disponiveis para cada agente devem ser estritamente limitadas ao seu papel no pipeline.
- **RF-024 (Prevencao de Vazamento de Chaves)**: Chaves da OpenAI API residem exclusivamente no servidor central da fabrica; nenhum container descartavel ou cliente recebe chaves de IA.

### 2.6 Legislacao, LGPD e Conformidade Tributaria

- **RF-025 (Termos de Uso e Registro de Aceite)**: Coleta e registro formal de aceite de termos e politica de privacidade com carimbo de tempo, IP e identificador da versao.
- **RF-026 (Anonimizacao e Mascaramento de PII)**: Mascaramento previo de dados pessoais sensiveis (CPF, cartoes, senhas) antes do despacho de prompts para APIs de terceiros.
- **RF-027 (Direito a Exclusao e Portabilidade)**: Modulo que atende ao Art. 18 da LGPD, permitindo ao usuario excluir integralmente seus dados ou exporta-los em formato JSON aberto.
- **RF-028 (Metrificacao de Consumo com Markup Fiscal)**: Calculo do custo operacional de tokens e infraestrutura incluindo os tributos de importacao de servicos (IRRF, PIS/COFINS-Importacao, ISS e IOF).
- **RF-029 (Integracao de Faturamento e Emissao de NFS-e)**: Validacao de dados cadastrais fiscais (CNPJ/CPF, CEP/IBGE) e emissao de NFS-e sob o subitem 1.01/1.05 da LC 116/2003.

---

## 3. Requisitos Nao-Funcionais (RNF)

### 3.1 Arquitetura e Engenharia de Software

- **RNF-001 (KISS e YAGNI)**: A arquitetura prioriza componentes simples e objetivos, proibindo camadas desnecessarias de abstracao.
- **RNF-002 (Orquestracao Deterministica)**: O avanco de estados do pipeline e governado por codigo com BullMQ e Valkey; as LLMs nao controlam a ordem das fases.
- **RNF-003 (Cerebro no PostgreSQL sem Custo de Vector DB)**: O armazenamento e recuperacao de contexto (RAG) ocorre via PostgreSQL com indices textuais GIN (`tsvector` em portugues), garantindo consultas em menos de 50ms sem custo extra de embeddings.
- **RNF-004 (Idempotencia de Tasks)**: Todas as tarefas da esteira devem ser idempotentes, permitindo retentativa segura em caso de falha de execucao.
- **RNF-005 (Idioma Oficial Rigido)**: Todo o sistema, codigo de negocio, documentacoes, mensagens de erro e interfaces de usuario devem ser redigidos exclusivamente em portugues do Brasil.

### 3.2 Seguranca e Isolamento

- **RNF-006 (Execucao de Containers sem Privilegios)**: Containers descartaveis rodam obrigatoriamente sem root (`node:node`), com `--cap-drop=ALL`, `--security-opt=no-new-privileges:true` e sem acesso ao Docker socket do host.
- **RNF-007 (Limites Estritos de Recursos por Sandbox)**: Limites maximos por container de teste: 1.5 CPUs, 1 GB de memoria RAM, no maximo 100 processos concorrentes e timeout rigido de 5 minutos.
- **RNF-008 (Criptografia Ponta a Ponta)**: Trafego protegido por TLS 1.3 via NGINX e dados sensiveis no PostgreSQL e armazenamento em disco criptografados em repouso.
- **RNF-009 (Protecao de Borda Perimetral)**: NGINX com modulo Coraza WAF ativo inspecionando requisicoes contra SQLi/XSS/Command Injection, integrado ao fail2ban para bloqueio automatico de IPs abusivos.
- **RNF-010 (Auditoria Automatizada de Licencas)**: A esteira deve auditar licencas de pacotes pnpm em cada build, barrando licencas com copyleft viral (GPL/AGPL) que comprometam o codigo do cliente.

### 3.3 Performance e Telemetria

- **RNF-011 (Prioridade Maxima em Testes E2E)**: A esteira considera o produto funcional apenas se passar na suite completa de testes ponta a ponta com Playwright.
- **RNF-012 (Observabilidade Padronizada)**: Toda a telemetria, tempos de resposta de LLM, metricas de transicao e rastreamento de erros devem ser emitidos no padrao OpenTelemetry, expurgando automaticamente qualquer dado sensivel dos logs.

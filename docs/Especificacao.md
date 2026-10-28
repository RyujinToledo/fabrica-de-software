# Especificacao Tecnica: Fabrica de Software Autonoma

Documento consolidado e definitivo que unifica a demanda do usuario, os requisitos levantados pelo painel multidisciplinar, as decisoes do choque de realidade e o design system aprovado. Toda implementacao deve seguir esta especificacao como fonte unica de verdade.

---

## 1. Produto e Escopo

A Fabrica de Software e uma ferramenta **interna** que transforma demandas em linguagem natural em produtos de software prontos para producao. O processo e governado por uma maquina de estados deterministica onde LLMs operam em etapas rigidas com ferramentas e guardrails fixos.

### Dentro do escopo

- Pipeline completo de 11 fases: da elicitacao ate o deploy em producao.
- Interface web estilo Canvas de Observabilidade para acompanhamento em tempo real.
- Execucao concorrente de ate 3 tasks simultaneas via git worktrees e containers Docker descartaveis.
- TDD com Vitest no loop rapido e Playwright E2E como gate final.
- RAG estruturado via PostgreSQL Full Text Search (sem custo de vector DB).
- Comunicacao com LLMs via API OpenAI com compatibilidade OpenRouter no dia zero.

### Fora do escopo (eliminado no Choque de Realidade)

- Modulos fiscais, calculo tributario complexo e emissao de NFS-e (antigos RF-028 e RF-029).
- Venda ou comercializacao como SaaS para terceiros.
- Adapters para provedores de LLM alem do formato OpenAI.

---

## 2. Principios de Engenharia

1. **Spec Driven**: Nenhum codigo antes da aprovacao da especificacao, PRDs, ADRs e tasks.
2. **TDD com foco E2E**: Teste gerado antes da implementacao, validado em falha antes de buscar o verde. Playwright como gate final, Vitest no loop rapido.
3. **Isolamento total**: Worktrees e branches isoladas, execucao em containers Docker descartaveis.
4. **OWASP por padrao**: Validacao de entrada na borda (Zod), prevencao contra injecao, CSRF, XSS. Zero vazamento de credenciais (Gitleaks).
5. **Zero-Trust**: default-deny em todas as rotas e operacoes, menor privilegio em cada endpoint e servico.
6. **KISS e YAGNI**: Componentes simples e objetivos, sem camadas desnecessarias de abstracao.
7. **Idioma oficial**: Portugues do Brasil em toda documentacao, codigo de negocio, mensagens de erro e interfaces.

---

## 3. Requisitos Funcionais

### 3.1 Elicitacao e interacao com o usuario

- **RF-001**: Interface web conduz entrevista inicial e gera `Demanda.md` preservando as palavras originais do usuario.
- **RF-002**: Choque de realidade gera perguntas criticas sobre falhas e riscos para decisao do usuario.
- **RF-003**: Agente de design gera mocks interativos padronizados com 3 opcoes estruturalmente diferentes de estilo para aprovacao.
- **RF-004**: Agente de coerencia audita `Especificacao.md` buscando contradicoes e lacunas logicas.
- **RF-005**: Painel web exibe progresso da esteira em tempo real com fase atual, tasks em execucao, status de containers e logs.

### 3.2 Arquitetura e governanca de tasks

- **RF-006**: Features fatiadas em PRDs (comportamento de produto) e ADRs (decisoes tecnicas restritas a stack aprovada).
- **RF-007**: Esteira bloqueia qualquer pacote ou tecnologia fora da stack aprovada.
- **RF-008**: Cada task contem descricao, escopo negativo e Definition of Done mensuravel.
- **RF-009**: APIs seguem contrato OpenAPI 3.x derivado dos schemas Zod.
- **RF-010**: Swagger UI em rota unica, protegido por autenticacao, acessivel somente ao administrador.

### 3.3 Execucao, TDD e sandbox

- **RF-011**: Tasks paralelas operam em git worktree e branch dedicada (limite de 3 simultaneas).
- **RF-012**: Testes Vitest/Playwright gerados e com falha comprovada antes da geracao do codigo.
- **RF-013**: Cada build e suite de testes roda em container Docker descartavel com destruicao ao termino ou timeout.
- **RF-014**: Nenhuma task conclui sem aprovacao nos gates: biome check, tsc --noEmit, gitleaks protect --staged e testes verdes.
- **RF-015**: Agente neutro resolve conflitos de merge ou contratos entre frentes paralelas.
- **RF-016**: Containers temporarios geram URLs de preview para homologacao pelo usuario.

### 3.4 Deploy e entrega

- **RF-017**: Agente integrador coleta definicoes do ambiente final e provisiona o software quando o usuario marca a versao como pronta.
- **RF-018**: Entrega gera e configura manifestos para NGINX, Coraza WAF, fail2ban, servico Node.js, Valkey e PostgreSQL com migrations Drizzle.
- **RF-019**: Usuario tem acesso irrestrito ao repositorio Git completo sem lock-in da fabrica.

### 3.5 Seguranca e autenticacao

- **RF-020**: Autenticacao via Better Auth com sessoes no banco, 2FA e cookies HttpOnly, SameSite=Strict, Secure.
- **RF-021**: Politica default-deny a nivel de rota e de objeto (project_id), autorizacao explicita pelo menor privilegio.
- **RF-022**: Toda requisicao externa, payload e retorno de ferramenta de LLM validado via schemas Zod.
- **RF-023**: Prompts de entrada isolados em delimitadores de dados, ferramentas do agente limitadas ao seu papel.
- **RF-024**: Chaves da OpenAI residem no servidor central. Nenhum container descartavel ou cliente recebe chaves.
- **RF-030**: Todo projeto gerado herda o `.gitleaks.toml` da fabrica como baseline de deteccao de segredos, sem edicao manual. A baseline estende as regras padrao do gitleaks e adiciona a regra `senha-em-comando-sudo`, que barra senha passada via `echo` em comando `sudo`. A baseline roda no hook `pre-commit` e no pipeline de CI de cada projeto.

### 3.6 Conformidade e LGPD

- **RF-025**: Coleta e registro de aceite de termos e privacidade com timestamp, IP e versao.
- **RF-026**: Mascaramento de PII (CPF, cartoes, senhas) antes do envio de prompts para APIs de terceiros.
- **RF-027**: Modulo de exclusao e portabilidade de dados conforme Art. 18 da LGPD (exportacao em JSON).

---

## 4. Requisitos Nao-Funcionais

- **RNF-001 (KISS e YAGNI)**: Sem camadas desnecessarias de abstracao.
- **RNF-002 (Orquestracao deterministica)**: Pipeline governado por BullMQ + Valkey. LLMs nao controlam a ordem das fases.
- **RNF-003 (RAG no PostgreSQL)**: Contexto via tsvector/ts_rank_cd com configuracao para portugues e indices GIN. Consultas em menos de 50ms.
- **RNF-004 (Idempotencia)**: Todas as tasks da esteira sao idempotentes para retentativa segura.
- **RNF-005 (Idioma)**: Portugues do Brasil em todo o sistema.
- **RNF-006 (Containers sem privilegios)**: Rootless (node:node), --cap-drop=ALL, --security-opt=no-new-privileges:true, sem Docker socket.
- **RNF-007 (Limites de recursos)**: 1.5 CPUs, 1 GB RAM, 100 processos, timeout de 5 minutos por container.
- **RNF-008 (Criptografia)**: TLS 1.3 via NGINX, dados sensiveis criptografados em repouso.
- **RNF-009 (Protecao de borda)**: NGINX + Coraza WAF + fail2ban para bloqueio automatico de IPs abusivos.
- **RNF-010 (Auditoria de licencas)**: CI barra licencas copyleft virais (GPL/AGPL).
- **RNF-011 (E2E prioritario)**: Produto funcional apenas se passar na suite completa Playwright.
- **RNF-012 (Observabilidade)**: Telemetria no padrao OpenTelemetry, expurgando dados sensiveis dos logs.

---

## 5. Pipeline de Producao (11 Fases)

| Fase | Nome                     | Entrada                    | Saida               | Validacao Humana    |
| :--- | :----------------------- | :------------------------- | :------------------ | :------------------ |
| 1    | Elicitacao               | Conversa no chat           | Demanda.md          | Sim                 |
| 2    | Painel de Especialistas  | Demanda.md                 | Requisitos.md       | Nao                 |
| 3    | Choque de Realidade      | Demanda.md + Requisitos.md | Decisoes.md         | Sim                 |
| 4    | Consultoria de Design    | Requisitos + Decisoes      | Design-System.md    | Sim                 |
| 5    | Consolidacao e Coerencia | Todos os docs              | Especificacao.md    | Nao (agente audita) |
| 6    | Decomposicao Tecnica     | Especificacao.md           | PRDs/ + ADRs/       | Nao                 |
| 7    | Geracao de Tasks         | PRDs + ADRs                | Tasks/              | Nao                 |
| 8    | Execucao Concorrente     | Tasks/                     | Codigo + Testes     | Nao                 |
| 9    | Integracao e Validacao   | Branches                   | Branch integrada    | Nao                 |
| 10   | Homologacao              | Container preview          | URL de teste        | Sim                 |
| 11   | Deploy                   | Versao aprovada            | Produto em producao | Sim                 |

### Paradas humanas obrigatorias (5 no total)

1. Entrevista de demanda (Fase 1)
2. Choque de realidade (Fase 3)
3. Consultoria de design (Fase 4)
4. Homologacao em preview (Fase 10)
5. Aprovacao de deploy (Fase 11)

---

## 6. Fundacoes Obrigatorias por Projeto

Independente do tipo de projeto gerado pela fabrica, todos devem conter:

1. **Modelagem de dominio**: Entidades e regras de negocio puras.
2. **Modelagem do banco de dados**: Schemas, migrations e integridade referencial no PostgreSQL com Drizzle.
3. **Modelagem da API**: Contrato OpenAPI 3.x derivado dos schemas Zod. Swagger UI em rota unica restrita ao admin.
4. **Modelagem de permissoes**: Zero-Trust, default-deny, menor privilegio em cada endpoint e operacao.
5. **Metricas de performance**: Latencia, throughput e queries lentas monitoradas via OpenTelemetry.
6. **Gates de qualidade**: biome check, tsc --noEmit, gitleaks com a baseline da fabrica, testes verdes. A baseline e o `.gitleaks.toml` versionado na raiz da fabrica (regra `senha-em-comando-sudo` inclusa) e e copiada para cada projeto gerado.
7. **Gates de seguranca**: OWASP (sanitizacao de inputs, SQLi, XSS, CSRF), headers seguros, secrets fora do codigo.

---

## 7. Design System Aprovado: Canvas de Observabilidade

### Layout

- Sidebar fixa a esquerda (~240px): logotipo, navegacao vertical (Dashboard, Pipeline, Artefatos, Logs, Configuracoes), indicadores de status (worktrees, containers, alertas), botao de acao humana com badge pulsante.
- Area central: flow cards de fase em fluxo vertical ou grid 2 colunas. Cada card com numero, nome, status, progresso, timestamp. Card expandido revela agente, artefatos, logs e botoes de acao.
- Painel inferior colapsavel: terminal de logs em tempo real, tabs (Todos, Erros, Agentes, Containers), filtro por worktree e fase.

### Paleta (Tailwind CSS): Slate & Cyan

| Funcao           | Classe Tailwind             | Hex               |
| :--------------- | :-------------------------- | :---------------- |
| Background       | bg-slate-950                | #020617           |
| Surface          | bg-slate-900                | #0f172a           |
| Surface Elevada  | bg-slate-800                | #1e293b           |
| Border           | border-slate-700            | #334155           |
| Primary / Accent | bg-cyan-500 / text-cyan-400 | #06b6d4 / #22d3ee |
| Secondary        | text-sky-400                | #38bdf8           |
| Success          | text-teal-400               | #2dd4bf           |
| Warning          | text-amber-400              | #fbbf24           |
| Error            | text-rose-400               | #fb7185           |
| Text Primary     | text-slate-100              | #f1f5f9           |
| Text Muted       | text-slate-400              | #94a3b8           |
| Text Disabled    | text-slate-600              | #475569           |

### Tipografia

- Interface geral: Geist Sans com tabular-nums.
- Codigo e logs: JetBrains Mono.
- Escala: text-xs (12px) para badges/logs, text-sm (14px) para corpo, text-base (16px) para titulos de card, text-lg (18px) para titulo do projeto, text-xl (20px) para headings de pagina.

### Componentes padrao

- Cards de fase: bg-slate-900, border-slate-700, rounded-lg, hover border-cyan-500/50, p-4.
- Botao primario: bg-cyan-600 hover:bg-cyan-500 text-white.
- Botao secundario: bg-slate-700 hover:bg-slate-600 text-slate-200.
- Botao destrutivo: bg-rose-600 hover:bg-rose-500 text-white.
- Inputs: bg-slate-800 border-slate-700 focus:border-cyan-500.
- Badges: pendente (slate-700), em progresso (cyan-500/10), concluido (teal-500/10), bloqueado (amber-500/10), erro (rose-500/10).

---

## 8. Stack Aprovada

| Componente           | Tecnologia                                              |
| :------------------- | :------------------------------------------------------ |
| Linguagem e Runtime  | TypeScript, Node.js LTS                                 |
| Frontend             | React, Vite, TanStack (Router/Query), Tailwind CSS      |
| Backend e Validacao  | Node.js, Zod, OpenAPI 3.x, Swagger UI (admin)           |
| Autenticacao         | Better Auth (sessoes, 2FA, RBAC)                        |
| Banco de Dados e ORM | PostgreSQL, Drizzle ORM                                 |
| Cache e Filas        | Valkey, BullMQ                                          |
| Armazenamento        | S3-compatible e arquivos estaticos locais               |
| Comunicacao          | Resend (email), Twilio (SMS/WhatsApp sob demanda)       |
| Telemetria           | OpenTelemetry                                           |
| Testes               | Playwright (E2E), Vitest (unitarios/integracao)         |
| Qualidade            | Biome, TypeScript strict                                |
| Seguranca            | Gitleaks, OWASP, Coraza WAF, fail2ban, NGINX            |
| Pacotes              | pnpm                                                    |
| Sandbox              | Docker (containers descartaveis), git worktrees (max 3) |
| LLM                  | OpenAI API com compatibilidade OpenRouter               |

---

## 9. RAG Operacional

Cerebro da fabrica no PostgreSQL com busca textual via tsvector/ts_rank_cd em portugues.

- Tabelas de dominio: Projetos, Sessoes, Mensagens, Requisitos, PRDs, ADRs, Tasks, Worktrees.
- Cada agente consulta decisoes anteriores, contextos de PRDs e restricoes de negocio sem custo extra.
- pgvector pode ser adicionado depois se a busca semantica por embeddings se mostrar necessaria.

---

## 10. Decisoes Estrategicas Resolvidas

1. **Uso interno**: Ferramenta interna, modulos fiscais eliminados.
2. **TDD**: Vitest no loop rapido, Playwright como gate final.
3. **Concorrencia**: Maximo 3 worktrees/containers simultaneos.
4. **Deploy**: Completamente dinamico, conduzido pelo Agente Integrador.
5. **Human-in-the-loop**: 5 paradas formais mantidas.
6. **LLM**: OpenAI API com OpenRouter no dia zero.
7. **Design**: Canvas de Observabilidade com paleta Slate & Cyan e tipografia Geist Sans + JetBrains Mono.

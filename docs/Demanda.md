# Demanda Bruta: Fabrica de Software Autonoma

O cliente descreveu a demanda da fabrica com as seguintes palavras e requisitos originais:

---

criar uma fabrica de software "automatizada" usando llm precisamos desenhar todo o processo e fazer pesquisa PRIMEIRO antes de fazermos qualquer coisa de codigo

via interface web similar oque estamos fazendo o usuario escreve oque quer uma llm começa a entrevista descobrindo os objetivos e oque o usuario espera de resultado no final, para so depois começarmos todo o resto das tarefas

o "papel" do agent e relevante em outras partes temos que focar no processo todo nao estamos desenando um fluxo de quem faz oque e deixar as llms inventarem algo oque der para limitar e padronizar deve ser feito antes de "papeis"

dockers descartaveis sempre vamos limitar bastante para que a llm nao fique trocando de linguagem framework e pacotes so porque sim

tem que funcionar com as apis openai e ponto todos os demais adpters ao para outro momento

o "resultado" do produto pronto e ele em produçao onde o usuario mandar, prs, commits, link para teste faz parte do processo nao do resultao final

durante a entrevista o arquivo "Demanda.md" e escrito do modo que o cliente descreveu incluindo erros de portugues

depois das demandas diferentes agents fazem levantamento de Requisitos funcionais e nao funcionais sempre investigando os angulos de Lesgislaçao, Impostos, Segurança, Mercado, Concorrentes e Alternativas cada um dos angulos tem um agente unico especializado e qualquer outro algulo extra deve ser criado um novo agent expecialista a idiea e que no fim tenhamos um conjunto deles os requisitos levantados sao registrado em "Requisitos.md"

depois do requisitos levantados um agent separado sem skills vai fazer o choque de realidade questionando e desafiando cada ideia descrita em "Demanda.md e Requisitos.md" uma vez feito isso todas as falhas apontadas sao passadas para o usuario como um novo conjunto de perguntas que ele deve descidir por qual caminho seguir

uma vez respodida as questoes do choque de realidade ai criamos o "Especificacao.md" uma vez descrito um agente de "Coerencia" valida se tudo faz sentido e se nada esta contradizendo outra coisa e se nao tem nenhum "buraco" na logica

alem disso tudo deve ser escrito em portugues sempre, e devemos ter um agent especialista de desing que vai ler a especificaçao e com base no que ele entender vai "recomendar" estilos cores e letras para o usuarios descidir sobre antes de integrar na epecificacao.md final e continuarmos o processo

os requisitos que definem oque vai ser usado da stack aprovada, estar aprovado nao obriga usar tudo do stack e apenas as ferramentas que os agents tem opçao de escolha para usar uma vez existindo a "Especificacao.md" cada feature e dividida em PRDs e ADRs de acordo com a necessidade os PRDs devem descrever o "a feature/produto" oque faz oque o usuario espera de comportamento historias de como ela vai ser usadas as variaçoes do fluxo de uso de tipos de usuarios diferentes as ADRs sao dessiçoes tecnicas diretas relacionadas aos PRDs e o foco delas e justificar porque cada desiçao tecnica foi tomada e qual feature elas afetao ou estao relacionadas
adr/prd prontos ai sim e desenhada as tasks com descriçao e objetivo claro doque tem que ser feito oque nao deve ser feito e as provas e requisitos necessarios para ser considerado "feito"

tasks rodam em mais de uma frente usando a capacidade das worktress e branchs para mover o mais rapido possivel sem gerar conflitos, todo projeto idependente do tipo e porque deve ter o processo de modelagem de domino, modelagem do banco de dados, modelagem da api, metricas claras de performance monitoradas, gates de qualidade, gate de securança e REGRAS RIGIDAS de OWASP independente doque esta sendo feito

propia esteira faz os testes e a esteira segue TDD em todo o processo, e2e sempre e mais importante que tete unitarios ou de integraçao. como falback e usado um agent neutro para resver o problemas

testes sao feitos em dockers descartaveis e sao eles que devem ser usados para passar urls para o cliente, uma vez que uma versao seja definda como "pronta para produçao" pelo usuario ele deve reponder questionamentos de um agent integrador que ira lidar com o processo seja usado actions, scripts ou oque for necessario, infra e codigo sao produtos da fabrica e o usuario final nao deve precisar nem ter ideia doque sao

vamos controlar o processo em um banco de dados postgress pesquisavel pelos agents se necessario assim fazemos uma "RAG" sem custo para que todos os varios agents sempre tenhao acesso ao contexto necessario quando necessario

alem da stack sempre deve ser usado o padrao OpenAPI para apis, e um painel tipo sweguer deve existir em uma rota unica acessivel pelo admin do sistema
em "Fundações Obrigatorias:"
A modelagem de permissoes deve ser tratada de forma rigorosa ja que na duvida o "zero-trust" e o default

Stack:
typescript, postgressql, react, valkey, tanstack, tailwind, vite, pnpm, vitetest, playwrith, linters, gitleaks, nginx, fail2ban, corazawaf, nodejs, better auth, drizzle, s3 compatible e dados estaticos locais sem minio obrigatorio, resend, twilio, opentelemetry, openai api

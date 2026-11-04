# Como contribuir

Obrigado pelo interesse! Este documento explica como colaborar com nosso projeto e espero que ajude.

Este guia é para quem quer contribuir com o código, a documentação ou os testes. Para usar a fábrica, comece pelo [README](README.md).

## Antes de começar

- Leia o [README](README.md).
- Verifique se já existe issue aberta sobre o assunto.
- **Falha de segurança nunca vai para issue pública.** Leia o [SECURITY.md](SECURITY.md).

## Formas de contribuir

| O que você quer fazer | Como começar                                   |
| :-------------------- | :--------------------------------------------- |
| Reportar um bug       | Abra uma issue com passos para reproduzir      |
| Propor uma melhoria   | Abra uma issue explicando o problema           |
| Enviar código         | Abra uma issue primeiro. O PR só entra depois. |

**Falha de segurança nunca vai para issue pública.** Use o [Security Advisory](https://github.com/RyujinToledo/fabrica-de-software/security/advisories/new).

## Abrir uma issue

Toda issue é em português do Brasil. Inclua:

- O que você tentou fazer.
- O que esperava que acontecesse.
- O que aconteceu de fato.
- Como reproduzir, passo a passo, com um exemplo real.
- Bug no terminal: o comando que rodou, a saída inteira e o resultado de `node -v && pnpm -v`.
- Bug na tela: um print com a mensagem visível e o nome do navegador.

Uma issue por assunto. Não cole segredo, token, senha ou dado pessoal. Issue pública fica indexada.

## Enviar código

1. Abra uma issue e espere o retorno. PR sem issue aberta não é revisado.
2. Faça fork do repositório e clone o seu fork.
3. Crie uma branch curta a partir da `main`. Exemplo: `fix/painel-botao-aprovar`.
4. Instale as dependências com `pnpm install`.
5. Escreva o teste antes ou junto da mudança. O projeto segue TDD.
6. Rode os gates locais:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm security:scan
   pnpm licencas:auditar
   ```

7. Faça commits pequenos no padrão Conventional Commits.
8. Abra o pull request citando a issue. O template já traz o checklist; marque cada item depois de rodar os gates.

Se algum item do checklist não se aplicar, explique no PR. Não marque no automático.

## Padrão de commits

Formato: `tipo(escopo): o que mudou`.

Tipos aceitos: `feat`, `fix`, `docs`, `build`, `refactor`, `test`, `chore`, `perf`, `ci`.

Exemplos:

- `fix(painel): corrige texto do botão de aprovar`
- `docs(readme): explica como rodar o painel local`

O commitlint roda no hook `commit-msg` e barra commit fora do padrão.

O merge é squash: um PR vira um commit na `main`. O título do PR vira a mensagem desse commit, então use o mesmo padrão.

## Padrões de código

- TypeScript strict. Sem `any` sem justificativa.
- Validação de entrada com Zod na borda da API.
- Regra de negócio e autorização no backend. O frontend não decide permissão.
- Permissão padrão é negar. Toda rota nova precisa de autorização explícita.
- Biome cuida de lint e formatação. Não reformate arquivo fora do escopo do PR.
- Código, comentário e interface em português do Brasil.

## Uso de IA

Você nem leu o README, né? É bem óbvio que espero que use IA para tudo aqui. O projeto inteiro é uma fábrica de software movida por IA.

- Use IA para escrever código, teste, documentação, revisão e caçar bug.
- Não precisa pedir desculpa nem esconder que usou.
- Leia o que a IA gerou. Você responde pelo que envia.
- Se a IA copiou código de outro lugar, confira a licença antes de commitar.
- IA não assina o PR. Você assina.

## Segurança

- Nunca use `git commit --no-verify`. O hook existe para barrar segredo.
- Se um segredo entrar no histórico, avise pelo Security Advisory e rotacione a credencial. Apagar o commit não desfaz a exposição.
- Falha de segurança nunca vai para issue pública.

## Documentação

Se a mudança altera o comportamento, atualize o README. Comentário de código deve explicar o porquê, não repetir o que a linha faz.

## Revisão

- A revisão é feita só pelo dono do repositório. Hoje sou eu, [@RyujinToledo](https://github.com/RyujinToledo).
- A `main` é protegida. Nem o dono commita direto. Toda mudança entra por PR com squash.
- PR sem issue aberta não entra na fila de revisão.
- CI verde é obrigatório.
- Discordância técnica se resolve com dado, teste ou referência, não com preferência.
- Prazo de resposta: 1 a 2 dias úteis.

## Conduta

Não seja troll. Estamos aqui para fazer algo interessante, não para ofender pessoas.

- Não ligo se você não tem foto no perfil. O problema é usar o anonimato como escudo para cometer crime de ódio e fugir da responsabilidade. Quem faz isso não fica aqui.
- Duas pessoas podem estar completamente certas ao mesmo tempo. É por isso que existe revisão.
- Discutir implementação não é lutar pelo seu país. Uma vírgula no lugar errado não merece os dois anos de vida que você perdeu com estresse.
- A internet é grande demais para você perder tempo usando este projeto como mural de propaganda.
- Se eu algum dia achar que preciso te banir do repositório, me diz quanto tempo você levou para pensar em algo que justificasse. Porque duvido que o que você disse tenha saído "naturalmente".

## Licença

Ao contribuir, você concorda que sua contribuição fica sob a licença MIT. E você sabe que não estamos aqui para ficar ricos. Você veio pelo desafio, já que MIT significa **Money Isn't There**.

Não exigimos CLA. DCO é opcional: se você quiser assinar seus commits com `git commit -s`, o `Signed-off-by` é bem-vindo. Se não quiser, o PR entra do mesmo jeito.

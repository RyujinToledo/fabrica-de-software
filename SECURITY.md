# Politica de Seguranca

Este repositorio e publico e distribuido sob licenca MIT. A seguranca do projeto e prioridade.

## Como relatar uma vulnerabilidade

Caso descubra uma potencial vulnerabilidade de seguranca, **nao abra uma issue publica**.

Em vez disso:
1. Abra um [relatorio de seguranca confidencial (GitHub Security Advisory)](https://github.com/RyujinToledo/fabrica-de-software/security/advisories/new).
2. Se preferir contato direto por email, envie os detalhes para `ryujin.toledo@gmail.com`.

Inclua na mensagem:
- Descricao detalhada do problema.
- Passos ou script minimo para reproduzir a falha.
- Impacto potencial identificado.

Responderemos com agilidade para investigar e disponibilizar a correcao antes de qualquer divulgacao publica.

## Segredos e credenciais

Este repositorio e publico. Trate senha, token, chave de API e string de conexao como material que nunca entra em texto versionado.

- Nao cole segredo em issue, pull request, comentario de codigo, log, print de tela ou documentacao. Issue publica e indexada e nao tem como desfazer a leitura.
- Guarde o valor real no `.env` local, que fica no `.gitignore`. O `.env.example` versionado leva so nomes de variaveis e valores de exemplo nao sensiveis, nunca um segredo real.
- O hook `pre-commit` roda gitleaks nos arquivos staged e barra o commit. Nao contorne com `--no-verify`. Se o hook acusar falso positivo, ajuste a allowlist da baseline em um PR proprio.

### Rodar o gate local

```bash
pnpm security:baseline
pnpm security:scan
```

`security:baseline` valida a baseline `.gitleaks.toml` e, com `--projeto <diretorio>`, confere que um projeto gerado herdou o arquivo intacto. `security:scan` varre o repositorio e o historico do Git com a mesma baseline.

### Se um segredo foi commitado

Avise o mantenedor imediatamente pelo canal do Security Advisory e rotacione a credencial no provedor. Remover o commit ou reescrever o historico nao desfaz a exposicao: o valor pode ter sido copiado antes da limpeza. Rotacione primeiro, limpe depois. O procedimento completo esta na secao 6 de `docs/ARQUITETURA-PROCESSO.md`.

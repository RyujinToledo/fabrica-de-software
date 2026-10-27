# Regras do Projeto: Fabrica de Software

Repositorio publico sob licenca MIT. Qualquer codigo aqui ficara acessivel publicamente.

## Gates de Seguranca e Qualidade

1. **Segredos proibidos**: Jamais comitar arquivos `.env`, chaves de API, senhas ou tokens. O hook `gitleaks` barra commits locais e o workflow de CI bloqueia PRs e pushes.
2. **Conventional Commits**: Formato `tipo(escopo): mensagem` obrigatorio em todos os commits (ex: `feat(api): endpoint de autenticacao`). Validado pelo `commitlint`.
3. **Qualidade de Codigo**:
   - `pnpm lint` e `pnpm format` via Biome.
   - `pnpm typecheck` via TypeScript sem erros.
4. **Arquitetura e Seguranca (OWASP)**:
   - Backend e o guardiao dos dados e das regras. Validacao de schemas (ex: Zod) na entrada de qualquer dado externo.
   - Frontend e vitrine, nao motor. Nenhuma regra de autorizacao ou logica critica de negocio roda exclusivamente no frontend.

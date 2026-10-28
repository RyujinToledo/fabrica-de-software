# Fabrica de Software

Repositorio publico de desenvolvimento de software automatizado com gates de seguranca e qualidade.

[![CI & Quality Gates](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml/badge.svg)](https://github.com/RyujinToledo/fabrica-de-software/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Gates de Seguranca e Qualidade

Este repositorio adota controles automaticos de prevencao contra falhas e exposicao de dados:

- **Prevencao de vazamento de segredos**: `gitleaks` ativado em hooks locais (`pre-commit`) e no pipeline do GitHub Actions.
- **Padronizacao de commits**: `commitlint` validando mensagens no formato [Conventional Commits](https://www.conventionalcommits.org/).
- **Lint e Formatacao**: [Biome](https://biomejs.dev/) garantindo codigo consistente e sem smells.
- **Tipagem estrita**: TypeScript validando integridade em tempo de compilacao (`tsc --noEmit`).
- **Auditoria de dependencias**: Verificacao automatica de vulnerabilidades em dependencias com `pnpm audit` e Dependabot.

## Desenvolvimento Local

### Pre-requisitos

- Node.js LTS (v22+)
- pnpm (v11+)
- gitleaks (instalado pelo gerenciador de pacotes da sua distro ou binario oficial)

### Instalacao

```bash
# Instalar dependencias e sincronizar hooks git (Lefthook)
pnpm install
```

### Comandos disponiveis

```bash
# Validar formatacao e analise estatica
pnpm lint

# Aplicar correcoes automaticas de estilo e linter
pnpm lint:fix

# Verificar tipos do TypeScript
pnpm typecheck

# Escanear segredos no repositorio
pnpm security:scan
```

## Seguranca

Para relatar qualquer vulnerabilidade de seguranca de forma confidencial, consulte [SECURITY.md](SECURITY.md).

## Licenca

Distribuido sob a licenca MIT. Veja [LICENSE](LICENSE) para mais detalhes.

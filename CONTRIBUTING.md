# Contributing to Adjacent Atlas

Thanks for your interest in contributing.

## Prerequisites

- Node.js >= 20
- pnpm >= 9 (`corepack enable` is the simplest way to get it)

## Setup

```bash
git clone https://github.com/biswajitj998/adjacent-atlas.git
cd adjacent-atlas
pnpm install
```

## Working in the monorepo

The repository is managed with pnpm workspaces and Turborepo. Common commands
run from the root:

```bash
pnpm typecheck   # tsc across every package
pnpm build       # build libraries and the web app
pnpm test        # run package test suites
```

To target a single package, use a filter:

```bash
pnpm --filter @adjacent-atlas/engine test
```

## Changes that touch data contracts

Any change to `data/schemas` or to `packages/engine/src/types` affects every
downstream consumer. Update the schema and the TypeScript type together, and
add or adjust a test that exercises the new shape.

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/), e.g.
`feat(engine): add connectivity sub-score` or `fix(web): correct snapshot route`.

## Pull requests

- Keep PRs focused on one logical change.
- Ensure `pnpm typecheck`, `pnpm build`, and `pnpm test` pass.
- Describe what changed and why; link any related issue.

## License

By contributing, you agree that your contributions are licensed under the MIT
License.

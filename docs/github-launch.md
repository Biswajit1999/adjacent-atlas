# GitHub launch notes

Practical checklist and metadata for presenting the repository publicly. Nothing
here asserts metrics or status the project does not have.

Repository: https://github.com/Biswajit1999/adjacent-atlas

## Suggested repository description

> An observatory for the adjacent possible — ranking the methods, instruments,
> and concepts adjacent to a research field's frontier from public code and
> literature signals. Seeded with extreme-precision radial velocity (EPRV)
> instrumentation.

## Suggested topics

```
research-tools  knowledge-graph  scientometrics  data-visualization
threejs  nextjs  typescript  monorepo  astronomy  exoplanets
radial-velocity  adjacent-possible
```

Set topics under the repo's *About* panel (gear icon).

## About panel

- Description: use the line above.
- Website: your deployed URL (once live) — leave blank until then rather than
  linking a placeholder.
- Topics: as above.

## Pre-launch checklist

- [ ] `pnpm install && pnpm build && pnpm typecheck && pnpm test` all pass
- [ ] `LICENSE`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CITATION.cff`
      present and accurate
- [ ] Repo links in `package.json`, `README.md`, and `apps/web/content/site.ts`
      point at the real repository owner
- [ ] `.github/workflows/ci.yml` runs green on the default branch
- [ ] No build artifacts tracked (`node_modules`, `.next`, `dist`, `.turbo`)
- [ ] Screenshots captured from the local app (see `docs/screenshots.md`)

## Recommended repo settings

- Enable Issues.
- Enable Discussions (the issue-template `config.yml` links to it).
- Enable private vulnerability reporting (Settings → Security) — referenced by
  `SECURITY.md`.

## Owner handle

The repository and all in-repo references use the GitHub handle `Biswajit1999` (e.g. https://github.com/Biswajit1999/adjacent-atlas). If you migrate the repo to a different account, update the links in `package.json`, `README.md`, `apps/web/content/site.ts`, `CITATION.cff`, `CODEOWNERS`, `NOTICE`, `AUTHORS.md`, and the issue-template `config.yml`.

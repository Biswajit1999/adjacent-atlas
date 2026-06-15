# GitHub showcase

Copy-ready material for the repository's public presentation. Use real signals
only — no vanity badges, no invented numbers.

## About panel

- **Description:**
  > An observatory for the adjacent possible — ranking the methods, instruments,
  > and concepts adjacent to a research field's frontier from public code and
  > literature signals. Seeded with EPRV instrumentation.
- **Website:** your deployed URL once live; leave blank until then.
- **Topics:** `research-tools knowledge-graph scientometrics data-visualization threejs nextjs typescript monorepo astronomy exoplanets radial-velocity adjacent-possible`

## Optional badge

A CI badge is legitimate because the workflow exists; it renders once the repo is
on GitHub with Actions enabled. Avoid stars/downloads/coverage badges until those
numbers are real.

```markdown
[![CI](https://github.com/Biswajit1999/adjacent-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/Biswajit1999/adjacent-atlas/actions/workflows/ci.yml)
```

## Showcase block (drop into the top of README if desired)

```markdown
> **Adjacent Atlas** maps the *adjacent possible* in a research field: the
> methods, instruments, and concepts close enough to the current frontier to be
> worked on next, ranked from public code and literature signals and rendered as
> an interactive 3D atlas.
>
> Reference domain: extreme-precision radial velocity (EPRV) instrumentation.
> Status: early development (`0.1.0`).
```

## Screenshots in the README

Reference locally-captured images with relative paths once they exist, e.g.:

```markdown
![The atlas with a node selected](docs/images/atlas.png)
```

Do not commit placeholder or stock images. The capture procedure is in
`docs/screenshots.md`; a generated SVG social card is available via
`pnpm.cmd social-card`.

## Suggested pinned-repo blurb

> A 3D "observatory" that ranks what's adjacent to a research field's frontier
> from public signals. TypeScript, Next.js, Three.js. EPRV instrumentation as the
> seed domain.

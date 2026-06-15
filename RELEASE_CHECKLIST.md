# Release checklist

A manual, repeatable pass for cutting a version. This project does not tag or
publish automatically.

## 1. Verify

```bash
pnpm.cmd install
pnpm.cmd build
pnpm.cmd typecheck
pnpm.cmd test
```

All four must pass cleanly.

## 2. Repository hygiene

Confirm none of these are tracked:

```bash
git ls-files | findstr /R "node_modules .next dist .turbo .zip CLAUDE.md .claude"
```

(The command should print nothing.) Generated `data/raw`, `data/cache`,
`data/snapshots`, and `data/briefs` contents must be gitignored — only their
`.gitkeep` files are tracked.

## 3. Version consistency

- `package.json` (root) `version` matches the release.
- `CITATION.cff` `version` and `date-released` match.
- `CHANGELOG.md` has a dated section for the release.
- `docs/versioning.md` reflects the scheme.

## 4. Content honesty

- No invented data, papers, citations, authors, or metrics anywhere.
- Seed vs. ingested snapshots remain distinguishable (`eprv-seed-…` vs `eprv-…`).
- Repo links use the canonical owner handle (`Biswajit1999`).

## 5. Presentation

- README is accurate; screenshots (if any) are locally captured, not stock.
- Description and topics set on GitHub (`docs/github-launch.md`).

## 6. Commit (do not tag unless intended)

```bash
git add -A
git commit -m "chore(release): prepare v0.1.0"
git push
```

Create a tag and GitHub release only when you explicitly decide to:

```bash
git tag -a v0.1.0 -m "Adjacent Atlas v0.1.0"
git push origin v0.1.0
```

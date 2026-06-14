# Launch pack

A checklist for taking Adjacent Atlas from local build to a shareable project.

## Before pushing

- [ ] `pnpm install`
- [ ] `pnpm build`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm snapshot && pnpm snapshot:validate`

## Screenshots

Screenshots are generated from the local app, not committed as stock images.

1. Run `pnpm --filter @adjacent-atlas/web dev`.
2. Open `/` (hero + preview) and `/atlas` (full scene with a node selected).
3. Capture at 1440×900 on a dark background.
4. Save under `apps/web/public/social/` and reference them from the README.

## Social card

`pnpm tsx scripts/export-social-card.ts` writes an SVG card to
`apps/web/public/social/card.svg` from the current snapshot. No external service
is involved.

## Repository polish

- [ ] README screenshots in place
- [ ] Topics/labels set on GitHub
- [ ] `CITATION.cff` version bumped to match the release tag
- [ ] A tagged `0.1.0` release with notes drawn from `docs/commit-plan.md`

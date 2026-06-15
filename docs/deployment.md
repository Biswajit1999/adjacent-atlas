# Deployment

Adjacent Atlas is a Next.js 14 (app-router) application inside a pnpm + Turborepo
monorepo. It is **not** a static site: the `/api/snapshot` and `/api/brief`
routes are `force-dynamic`, and the pages read the snapshot from the filesystem
at request/build time. It therefore needs a Node server (or a platform that runs
one), not a static export.

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Build locally

```bash
pnpm install
pnpm build      # builds engine, ui, embed, then the web app
```

Turborepo builds the library packages before the web app, so a clean
`pnpm build` is all that is required.

## Environment

Copy `.env.example` and set your domain before deploying:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

`NEXT_PUBLIC_SITE_URL` is used by `app/robots.ts`, `app/sitemap.ts`, and the
Open Graph metadata. If unset, it falls back to a placeholder
(`https://adjacent-atlas.dev`), which you should not ship as-is.

## Vercel (recommended)

Two equivalent setups:

**A. Project root = `apps/web` (simplest).**
In the Vercel dashboard set the project's *Root Directory* to `apps/web`. Vercel
auto-detects Next.js and pnpm and builds the workspace. Add
`NEXT_PUBLIC_SITE_URL` under Environment Variables.

**B. Project root = repository root.**
Use the committed `vercel.json`, which sets:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next"
}
```

Either way, Vercel runs `pnpm install` automatically.

## Self-hosting (Node)

```bash
pnpm build
pnpm --filter @adjacent-atlas/web start   # runs `next start`
```

`next start` serves on port 3000 by default. Put it behind a reverse proxy
(nginx, Caddy) and set `NEXT_PUBLIC_SITE_URL` in the web app's environment.

## Snapshots in production

The app reads the newest file in `data/snapshots/`, and falls back to building a
snapshot from the seed graph when none exists (see `apps/web/lib/snapshot.ts`).
To ship a pre-built snapshot, run `pnpm snapshot` before building so a dated
snapshot is present. `data/snapshots/*.json` is gitignored by default; commit a
snapshot deliberately if you want it deployed.

# Integrating Adjacent Atlas into a personal website

Three honest options, from least to most involved. Pick based on how much of the
experience you want inline versus linked.

## 1. Link with a project card

Simplest and most reliable. On your site, add a project card that links to the
deployed app and the repository. Use the generated Open Graph image
(`/opengraph-image`) as the card visual so the preview matches the app.

Example card content:

> **Adjacent Atlas** — an observatory for the adjacent possible. Ranks the
> methods, instruments, and concepts adjacent to a research field's frontier
> from public signals. Built with TypeScript, Next.js, and Three.js.
> [Live](https://your-domain.example) · [Source](https://github.com/Biswajit1999/adjacent-atlas)

## 2. Embed the ranked view (React sites)

If your personal site is a React app, use the `@adjacent-atlas/embed` package to
render a compact ranked list inline, fed by the live snapshot API:

```tsx
import { AdjacentAtlasEmbed } from "@adjacent-atlas/embed";

async function load() {
  return fetch("https://your-domain.example/api/snapshot").then((r) => r.json());
}

export async function AtlasCard() {
  const snapshot = await load();
  return <AdjacentAtlasEmbed snapshot={snapshot} limit={8} title="Adjacent Atlas" />;
}
```

The embed bundles the engine and UI primitives; its only peer dependencies are
`react` and `react-dom`. See `docs/embedding.md`.

## 3. Inline the full atlas via iframe

To show the interactive 3D atlas inside your site without sharing a code
runtime, iframe the deployed `/atlas` route:

```html
<iframe
  src="https://your-domain.example/atlas"
  title="Adjacent Atlas"
  style="width:100%;height:640px;border:1px solid #1f2a37;border-radius:16px"
  loading="lazy"
></iframe>
```

This keeps the WebGL scene fully interactive while isolating it from your page.
It is heavier than the embed in option 2; prefer it only when the live scene is
the point.

## Notes

- The app needs a Node server (see `docs/deployment.md`); a static link target
  must be the deployed instance, not a static export.
- Set `NEXT_PUBLIC_SITE_URL` so the embedded/linked previews resolve correctly.


## Personal-website project card

A compact card for a projects page. Markdown:

```markdown
### Adjacent Atlas
An observatory for the adjacent possible — ranks the methods, instruments, and
concepts adjacent to a research field's frontier from public signals, rendered as
an interactive 3D atlas. Seeded with EPRV instrumentation.
TypeScript · Next.js · Three.js · [Source](https://github.com/Biswajit1999/adjacent-atlas)
```

Or as a self-contained HTML card (dark, matches the app):

```html
<a class="aa-card" href="https://github.com/Biswajit1999/adjacent-atlas"
   style="display:block;max-width:520px;padding:20px;border:1px solid #1f2a37;
          border-radius:16px;background:#121822;color:#e6edf3;text-decoration:none;
          font-family:Inter,system-ui,sans-serif">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
    <span style="width:12px;height:12px;border-radius:3px;background:#5eead4"></span>
    <strong>Adjacent Atlas</strong>
  </div>
  <p style="margin:0 0 12px;color:#8b98a9;font-size:14px;line-height:1.5">
    Ranks what is adjacent to a research field's frontier from public signals,
    as an interactive 3D atlas. Seeded with EPRV instrumentation.
  </p>
  <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#2c7a73">
    TypeScript · Next.js · Three.js
  </span>
</a>
```

If you deploy the app, point the card's `href` at the live site and keep a
secondary link to the source.

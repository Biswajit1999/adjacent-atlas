# Screenshots

Screenshots are produced from the running app, not committed as stock images.
This document is the procedure; no screenshot files are checked in until you
capture them.

## Capture procedure

1. Build the libraries and start the dev server:

   ```bash
   pnpm build
   pnpm --filter @adjacent-atlas/web dev
   ```

2. Open the app at `http://localhost:3000` and capture these views:

   | View      | Path      | What to show                                            |
   | --------- | --------- | ------------------------------------------------------- |
   | Home      | `/`       | Hero copy with the live 3D preview on the right         |
   | Atlas     | `/atlas`  | The rotated graph with one node selected (inspector open)|
   | Briefs    | `/briefs` | The brief grid                                          |
   | Method    | `/method` | The scoring equation and component definitions          |

3. Recommended capture settings:
   - Viewport ~1440×900, device pixel ratio 2 for crisp output.
   - Dark OS theme (the app is dark regardless).
   - For `/atlas`, drag to a pleasing angle and click a high-adjacency node so the
     inspector and selection halo are visible.

4. Save captures wherever you reference them (e.g. `docs/images/` or
   `apps/web/public/social/`). If you add an `images/` folder under `docs/`,
   reference the files from `README.md` with relative paths.

## Generated Open Graph card

The deployed app exposes a dynamic Open Graph image at `/opengraph-image` (see
`apps/web/app/opengraph-image.tsx`). For a static SVG variant you can commit or
post, run:

```bash
pnpm social-card     # writes apps/web/public/social/card.svg
```

The card is generated from the current snapshot (or the seed graph if no
snapshot exists) — it shows real ranked nodes, not placeholder text.

## What not to do

- Do not fabricate screenshots or mock UI that differs from the app.
- Do not stage fake data; the seed graph is clearly labelled as illustrative in
  `data/seeds/README.md` and on the About page.

# Performance

Lightweight notes on where the time and bytes go, with the real figures from a
production build of the seed app.

## Bundle size (from `next build`)

- Shared First Load JS: ~87 kB.
- `/atlas` (the heaviest route): ~229 kB First Load JS, of which Three.js is the
  dominant cost. Static content pages (`/about`, `/method`, `/briefs`) are
  ~87–88 kB.

Three.js is loaded only on routes that render the scene (`/` preview and
`/atlas`); the text pages do not pull it in.

## Layout

The force-directed layout is O(n^2) in the number of nodes per iteration. At
seed scale (single digits to low hundreds) this is negligible. It runs in a Web
Worker (`workers/layout.worker.ts`) so the main thread stays responsive, with a
synchronous fallback (`runLayoutSync`) when workers are unavailable. For larger
graphs the next step is a Barnes–Hut approximation; this is noted in the roadmap
rather than prematurely implemented.

## WebGL resource lifetime

`AtlasScene` owns its context explicitly and disposes everything on unmount:
point and line geometries, the shader and line materials, the halo texture and
sprite materials, and the renderer; the animation frame is cancelled and all DOM
listeners are removed via an `AbortController`. A `webglcontextlost` handler
calls `preventDefault()` so the browser can attempt to restore the context
rather than dropping it permanently.

## Data and caching

- The web app reads a single snapshot file (or builds one from seeds) and
  memoises it per process.
- The ingestion scripts cache every API response for 24 hours under
  `data/cache/`, so repeated runs make no network calls.
- The API routes are `force-dynamic`; everything else is statically prerendered,
  including the `/briefs/[id]` pages.

## What is not optimised (yet)

- No code-splitting of the scene beyond Next's route-level chunks.
- No image pipeline; the only images are the SVG icon and the generated OG
  image, both tiny.
- No service worker or offline support.

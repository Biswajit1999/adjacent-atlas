# Embedding

`@adjacent-atlas/embed` exposes a dependency-light way to put a ranked view of a
snapshot on another page.

## Data helper

```ts
import { rankSnapshot } from "@adjacent-atlas/embed";

const top = rankSnapshot(snapshot, 8);
// → [{ id, label, kind, adjacency }, ...] sorted by adjacency
```

`rankSnapshot` uses the snapshot's own scores when present and otherwise scores
the graph on the fly, so it works against raw graphs too.

## React component

```tsx
import { AdjacentAtlasEmbed } from "@adjacent-atlas/embed";

export function Sidebar({ snapshot }) {
  return <AdjacentAtlasEmbed snapshot={snapshot} limit={8} title="Adjacent Atlas" />;
}
```

The component bundles the engine and UI primitives, so the only peer
dependencies are React and React-DOM.

## Getting a snapshot

Fetch it from a running instance:

```ts
const snapshot = await fetch("https://your-host/api/snapshot").then((r) => r.json());
```

Or import a serialised snapshot from `data/snapshots/`.

/**
 * Generate a 1200x630 social card (SVG) from the current snapshot.
 * No external services are used.
 *
 *   pnpm tsx scripts/export-social-card.ts
 *
 * Output: apps/web/public/social/card.svg
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSnapshot,
  deserializeSnapshot,
  type AtlasEdge,
  type AtlasNode,
  type AtlasSnapshot,
} from "../packages/engine/src/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DOMAIN = "extreme-precision radial velocity instrumentation";

const KIND_COLOR: Record<string, string> = {
  concept: "#5eead4",
  method: "#7aa2f7",
  instrument: "#f5a97f",
  dataset: "#c3a6ff",
  repo: "#9ece6a",
  paper: "#f7768e",
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function loadSnapshot(): AtlasSnapshot {
  const dir = resolve(ROOT, "data/snapshots");
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
    const newest = files.at(-1);
    if (newest) return deserializeSnapshot(readFileSync(resolve(dir, newest), "utf8"));
  } catch {
    // fall through to seeds
  }

  const nodes = readJson<AtlasNode[]>(resolve(ROOT, "data/seeds/concepts.seed.json"));
  const edges = readJson<AtlasEdge[]>(resolve(ROOT, "data/seeds/edges.seed.json"));
  const periods = nodes.flatMap((n) => n.signals.activity.map((p) => p.period)).sort();
  const from = periods.at(0) ?? "1970-01";
  const to = periods.at(-1) ?? from;
  return buildSnapshot({
    id: "eprv-seed",
    domain: DOMAIN,
    nodes,
    edges,
    sourceWindow: { from: `${from}-01`, to: `${to}-28` },
    generatedAt: new Date(),
  });
}

function render(snapshot: AtlasSnapshot): string {
  const W = 1200;
  const H = 630;
  const nodeById = new Map(snapshot.nodes.map((n) => [n.id, n]));
  const top = [...snapshot.scores].sort((a, b) => b.adjacency - a.adjacency).slice(0, 5);

  const rows = top
    .map((score, i) => {
      const node = nodeById.get(score.nodeId);
      const label = escapeXml(node?.label ?? score.nodeId);
      const color = KIND_COLOR[node?.kind ?? "concept"] ?? "#8b98a9";
      const y = 300 + i * 56;
      const barWidth = (score.adjacency / 100) * 360;
      return `
    <g transform="translate(80 ${y})">
      <circle cx="8" cy="8" r="6" fill="${color}" />
      <text x="28" y="13" font-family="Inter, sans-serif" font-size="22" fill="#e6edf3">${label}</text>
      <rect x="560" y="3" width="360" height="10" rx="5" fill="#19212d" />
      <rect x="560" y="3" width="${barWidth.toFixed(1)}" height="10" rx="5" fill="#5eead4" />
      <text x="940" y="13" font-family="JetBrains Mono, monospace" font-size="18" fill="#8b98a9">${score.adjacency.toFixed(1)}</text>
    </g>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="wash" cx="78%" cy="-8%" r="70%">
      <stop offset="0%" stop-color="#5eead4" stop-opacity="0.10" />
      <stop offset="60%" stop-color="#0b0f14" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0b0f14" />
  <rect width="${W}" height="${H}" fill="url(#wash)" />
  <rect x="80" y="86" width="14" height="14" rx="3" fill="#5eead4" />
  <text x="106" y="100" font-family="Inter, sans-serif" font-weight="600" font-size="30" fill="#e6edf3">Adjacent Atlas</text>
  <text x="80" y="176" font-family="Inter, sans-serif" font-weight="650" font-size="52" fill="#e6edf3">The frontier, and what sits</text>
  <text x="80" y="236" font-family="Inter, sans-serif" font-weight="650" font-size="52" fill="#e6edf3">one step beyond it.</text>
  <text x="80" y="280" font-family="JetBrains Mono, monospace" font-size="18" fill="#2c7a73">${escapeXml(snapshot.meta.domain)}</text>
  ${rows}
  <text x="80" y="600" font-family="JetBrains Mono, monospace" font-size="16" fill="#8b98a9">snapshot ${escapeXml(snapshot.meta.id)} · ranked by adjacency</text>
</svg>
`;
}

function main(): void {
  const snapshot = loadSnapshot();
  const svg = render(snapshot);
  const outDir = resolve(ROOT, "apps/web/public/social");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "card.svg");
  writeFileSync(outPath, svg);
  console.log(`Wrote ${outPath} (${snapshot.meta.id})`);
}

main();

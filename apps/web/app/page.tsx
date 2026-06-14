import Link from "next/link";
import type { Route } from "next";
import { ScoreBar, Tag } from "@adjacent-atlas/ui";
import { getRanked, getSnapshot } from "@/lib/snapshot";
import { HeroAtlasPreview } from "@/components/marketing/HeroAtlasPreview";
import { kindVisual } from "@/lib/format";
import { HOME } from "@/content/site";

export default function HomePage(): JSX.Element {
  const snapshot = getSnapshot();
  const top = getRanked().slice(0, 5);

  return (
    <>
      <section className="hero container">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">{HOME.eyebrow}</p>
            <h1 className="hero__title">{HOME.title}</h1>
            <p className="lede">{HOME.lede}</p>
            <div className="button-row">
              <Link href={HOME.primary.href as Route} className="btn btn--primary">
                {HOME.primary.label}
              </Link>
              <Link href={HOME.secondary.href as Route} className="btn btn--ghost">
                {HOME.secondary.label}
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <HeroAtlasPreview snapshot={snapshot} />
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 96 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Snapshot {snapshot.meta.id} · top by adjacency
        </p>
        <div className="stack">
          {top.map((entry, index) => (
            <Link key={entry.node.id} href={"/atlas" as Route} className="entry entry--link">
              <div className="entry__rank">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="entry__head">
                  <span className="entry__title">{entry.node.label}</span>
                  <Tag label={kindVisual(entry.node.kind).label} tone="accent" />
                </div>
                <ScoreBar value={entry.score.adjacency} label="adjacency" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

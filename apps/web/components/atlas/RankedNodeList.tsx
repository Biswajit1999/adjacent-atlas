"use client";

import { ScoreBar, Tag } from "@adjacent-atlas/ui";
import type { RankedEntry } from "@/lib/filter";
import { kindVisual } from "@/lib/format";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { EmptyState } from "@/components/shared/EmptyState";

export interface RankedNodeListProps {
  entries: RankedEntry[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showBreakdown?: boolean;
}

export function RankedNodeList({
  entries,
  selectedId,
  onSelect,
  showBreakdown = true,
}: RankedNodeListProps): JSX.Element {
  if (entries.length === 0) {
    return <EmptyState title="No matching nodes" message="Loosen the filters to see more." />;
  }

  return (
    <div className="stack">
      {entries.map((entry, index) => {
        const interactive = Boolean(onSelect);
        const selected = selectedId === entry.node.id;
        return (
          <article
            id={entry.node.id}
            key={entry.node.id}
            className={`entry${selected ? " is-selected" : ""}${interactive ? " entry--interactive" : ""}`}
            onClick={onSelect ? () => onSelect(entry.node.id) : undefined}
            onKeyDown={
              onSelect
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(entry.node.id);
                    }
                  }
                : undefined
            }
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={interactive ? selected : undefined}
          >
            <div className="entry__rank">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div className="entry__head">
                <h3 className="entry__title">{entry.node.label}</h3>
                <Tag label={kindVisual(entry.node.kind).label} tone="accent" />
                {entry.node.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
              <p className="entry__summary">{entry.node.summary}</p>
              <div className="entry__adjacency">
                <ScoreBar value={entry.score.adjacency} label="adjacency" />
              </div>
              {showBreakdown ? <ScoreBreakdown breakdown={entry.score.breakdown} /> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

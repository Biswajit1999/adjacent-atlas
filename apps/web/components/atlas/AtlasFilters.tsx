"use client";

import type { NodeKind } from "@adjacent-atlas/engine";
import type { FilterState } from "@/lib/filter";
import { isFilterActive } from "@/lib/filter";
import { kindVisual } from "@/lib/format";

export interface AtlasFiltersProps {
  kinds: NodeKind[];
  tags: string[];
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

export function AtlasFilters({ kinds, tags, filter, onChange }: AtlasFiltersProps): JSX.Element {
  const toggleKind = (kind: NodeKind): void => {
    const has = filter.kinds.includes(kind);
    onChange({
      ...filter,
      kinds: has ? filter.kinds.filter((k) => k !== kind) : [...filter.kinds, kind],
    });
  };

  return (
    <div className="filters">
      <div className="filters__group">
        <span className="filters__label">Kind</span>
        <div className="chips">
          {kinds.map((kind) => {
            const active = filter.kinds.includes(kind);
            const visual = kindVisual(kind);
            return (
              <button
                key={kind}
                type="button"
                className={`chip${active ? " is-active" : ""}`}
                onClick={() => toggleKind(kind)}
                aria-pressed={active}
              >
                <span className="chip__dot" style={{ background: visual.color }} aria-hidden="true" />
                {visual.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filters__group">
        <span className="filters__label">
          Min adjacency <span className="mono">{filter.minScore}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={filter.minScore}
          onChange={(e) => onChange({ ...filter, minScore: Number(e.target.value) })}
          className="range"
          aria-label="Minimum adjacency"
        />
      </div>

      <div className="filters__group">
        <span className="filters__label">Tag</span>
        <select
          className="select"
          value={filter.tag ?? ""}
          onChange={(e) => onChange({ ...filter, tag: e.target.value || null })}
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {isFilterActive(filter) ? (
        <button
          type="button"
          className="filters__reset"
          onClick={() => onChange({ kinds: [], minScore: 0, tag: null })}
        >
          Reset filters
        </button>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import { ScoringEquation } from "@/components/method/ScoringEquation";
import { SUBSCORE_META } from "@/lib/format";
import { METHOD } from "@/content/site";

const DEFINITIONS: Record<string, string> = {
  Momentum:
    "Growth of the most recent activity window relative to the window before it, passed through a logistic so flat activity reads 0.5 and sustained growth approaches 1.",
  Recency: "Exponential decay from the last observed signal. Activity one half-life old reads 0.5.",
  Connectivity:
    "Total incident edge weight, normalised by the largest weighted degree in the graph. Hubs approach 1; isolated nodes read 0.",
  Novelty: "Younger entities score higher. Maturity of one half-life reads 0.5; a new entity reads 1.",
  Feasibility:
    "A saturating function of the count of public working implementations: zero reads 0, approaching 1 as implementations accumulate.",
};

export const metadata: Metadata = {
  title: "Method",
  description:
    "How Adjacent Atlas turns raw signals into an adjacency score: five components, transparent weights, no trained model.",
};

export default function MethodPage(): JSX.Element {
  return (
    <section className="page container">
      <header className="page-header">
        <h1 className="page-title">Method</h1>
        <p className="page-intro">{METHOD.intro}</p>
      </header>

      <ScoringEquation />

      <div className="prose">
        <h2>The five components</h2>
        <dl className="defn">
          {SUBSCORE_META.map((meta) => (
            <div key={meta.key} style={{ display: "contents" }}>
              <dt>{meta.label.toLowerCase()}</dt>
              <dd>{DEFINITIONS[meta.label]}</dd>
            </div>
          ))}
        </dl>

        <h2>Why a heuristic, and not a model</h2>
        <p>{METHOD.honesty}</p>

        <h2>From signals to a snapshot</h2>
        <p>
          The pipeline is a straight line: fetch code and literature signals, normalise them into
          nodes and weighted edges, score every node against the same graph, and serialise the
          result as a validated snapshot. The snapshot is the single artefact every surface reads —
          the atlas, the briefs, and the API all draw from it.
        </p>

        <p className="note">
          The weights in the equation above are read directly from the engine&apos;s
          <span className="mono"> DEFAULT_WEIGHTS</span>, so this page cannot drift out of step with
          the code that produces the scores.
        </p>
      </div>
    </section>
  );
}

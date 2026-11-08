"use client";

import { SITES, siteById } from "@/data/sites";
import type { Match } from "@/lib/match";

/** Ranked matches for the typed request. Click a card to fly to that café. Small, not a dashboard. */
export default function ResultsBar({
  matches,
  summary,
  mode,
  focusId,
  onPick,
  onClear,
  compact = false,
}: {
  matches: Match[];
  summary: string[];
  mode: "live" | "demo";
  focusId: string;
  onPick: (id: string) => void;
  onClear: () => void;
  compact?: boolean;
}) {
  return (
    <div className="chrome results" aria-live="polite">
      <div className="results-head">
        <span>
          Looking for: <b>{summary.length ? summary.join(" · ") : "a good café"}</b>
        </span>
        <span className={`mode ${mode}`}>{mode === "live" ? "AI read" : "Keyword read"}</span>
        <button onClick={onClear} aria-label="Clear search">✕</button>
      </div>
      {!compact && <div className="results-cards">
        {matches.map((m) => {
          const s = siteById(m.id);
          return (
            <button key={m.id} className={`card ${m.score >= 70 ? "hot" : m.score < 50 ? "dim" : ""} ${focusId === m.id ? "on" : ""}`} onClick={() => onPick(m.id)}>
              <span className="rank">{m.rank}</span>
              <span className="meta">
                <span className="nm">
                  {s.name} <i className="demo-tag">demo</i>
                </span>
                <span className="why">{(m.reasons[0] ?? m.caveats[0] ?? "").replace(/^[^:]+:\s*/, "")}</span>
              </span>
              <span className="pct">{m.score}%</span>
            </button>
          );
        })}
      </div>}
    </div>
  );
}
export { SITES };

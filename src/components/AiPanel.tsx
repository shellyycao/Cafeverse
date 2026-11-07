"use client";

import { useState } from "react";
import type { CafeAnalysis } from "@/lib/ai/schema";

export type AiState = {
  status: "idle" | "loading" | "done" | "error";
  mode: "live" | "demo";
  analysis?: CafeAnalysis;
  note?: string;
  changes?: string[];
  error?: string;
};

/** Small AI control: runs the analysis, labels demo vs live, and lists what changed in the scene. */
export default function AiPanel({ state, onAnalyze }: { state: AiState; onAnalyze: () => void }) {
  const [open, setOpen] = useState(false);
  const a = state.analysis;
  return (
    <div className="chrome ai-wrap">
      <div className="ai-row">
        <span className={`mode ${state.mode}`}>{state.mode === "live" ? "Live AI" : "Demo mode"}</span>
        <button className="pill ai-btn" disabled={state.status === "loading"} onClick={() => (state.status === "done" ? setOpen((o) => !o) : onAnalyze())}>
          {state.status === "loading" ? "Reading sources…" : state.status === "done" ? "✦ Scene updated · evidence" : "✦ Analyze café"}
        </button>
      </div>
      {state.status === "error" && <div className="ai-card">Couldn&apos;t analyze: {state.error}</div>}
      {open && a && (
        <div className="ai-card">
          {state.note && <p className="ai-note">{state.note}</p>}
          <h5>Changed in the scene</h5>
          <p>{state.changes && state.changes.length ? state.changes.join(" · ") : "Nothing — the sources didn't support new details."}</p>
          <h5>Evidence</h5>
          <ul>
            {a.evidence.slice(0, 4).map((e, i) => (
              <li key={i}>
                {e.claim} <small>({e.source}, {e.confidence})</small>
              </li>
            ))}
          </ul>
          {a.uncertainty.length > 0 && (
            <>
              <h5>Not known</h5>
              <ul>
                {a.uncertainty.slice(0, 3).map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </>
          )}
          <button className="ai-again" onClick={onAnalyze}>Run again</button>
        </div>
      )}
    </div>
  );
}

"use client";

import type { CafeStatus } from "@/lib/useCafeStatus";

export type Crowd = 0 | 1 | 2;
const CROWD_LABELS = ["Quiet", "Normal", "Busy"] as const;

/** Compact bottom dock: save / visited, and the demo crowd simulator. */
export default function Dock({
  name,
  status,
  onToggle,
  crowd,
  onCrowd,
}: {
  name: string;
  status: CafeStatus;
  onToggle: (k: keyof CafeStatus) => void;
  crowd: Crowd;
  onCrowd: (c: Crowd) => void;
}) {
  return (
    <div className="chrome dock" role="group" aria-label={`${name} actions`}>
      <div className="dock-seg">
        <button className={status.saved ? "on save" : ""} aria-pressed={status.saved} onClick={() => onToggle("saved")}>
          {status.saved ? "♥ Saved" : "♡ Save"}
        </button>
        <button className={status.visited ? "on visited" : ""} aria-pressed={status.visited} onClick={() => onToggle("visited")}>
          {status.visited ? "✓ Visited" : "○ Visited"}
        </button>
      </div>
      <div className="dock-seg crowd" title="Simulated crowd — not live data">
        <span className="dock-label">Crowd · demo simulation</span>
        {CROWD_LABELS.map((l, i) => (
          <button key={l} className={crowd === i ? "on" : ""} aria-pressed={crowd === i} onClick={() => onCrowd(i as Crowd)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

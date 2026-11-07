"use client";

import type { CafeStatus } from "@/lib/useCafeStatus";
import { fmtTime, phaseLabel, type Phase } from "@/lib/hours";

export type Crowd = 0 | 1 | 2;
const CROWD_LABELS = ["Quiet", "Normal", "Busy"] as const;

/** Compact bottom dock: save / visited, and the demo crowd simulator. */
export default function Dock({
  name,
  status,
  onToggle,
  crowd,
  onCrowd,
  time,
}: {
  time: { minutes: number; weekend: boolean; dayLabel: string; live: boolean; phase: Phase; onScrub: (m: number) => void; onLive: () => void } | null;
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
      {time && (
        <div className="dock-time" title="Scene follows the café's posted hours — a demo simulation, not a live camera">
          <span className={`phase ${time.phase}`}>{phaseLabel(time.phase, time.minutes, time.weekend)}</span>
          <span>{time.dayLabel} {fmtTime(time.minutes)}</span>
          <input type="range" min={0} max={1439} step={5} value={time.minutes} aria-label="Simulated time of day" onChange={(e) => time.onScrub(+e.target.value)} />
          {time.live ? <span style={{ color: "#8a6a1e", fontWeight: 700 }}>Durham now</span> : <button onClick={time.onLive}>Back to now</button>}
        </div>
      )}
      <div className={`dock-seg crowd${time && time.phase !== "open" ? " off" : ""}`} title="Simulated crowd — not live data">
        <span className="dock-label">Crowd · demo simulation</span>
        {CROWD_LABELS.map((l, i) => (
          <button key={l} className={crowd === i ? "on" : ""} aria-pressed={crowd === i} disabled={!!time && time.phase !== "open"} onClick={() => onCrowd(i as Crowd)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

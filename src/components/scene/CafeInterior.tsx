import type { SceneSignals } from "@/lib/scene";
import type { Phase } from "@/lib/hours";
import InteriorStage from "./InteriorStage";

/**
 * Gate 1: the interior is the empty, hand-drawn base scene only. Actors, hotspots, crowd and
 * signal-driven props are intentionally disabled until the base scene is visually approved (Gate 2).
 */
export default function CafeInterior({
  phase = "open",
}: {
  signals?: SceneSignals;
  level?: number;
  crowd?: 0 | 1 | 2;
  phase?: Phase;
  onSelect?: (id: "barista" | "pastry" | "bar" | "social") => void;
  guard?: (fn: () => void) => () => void;
}) {
  return <InteriorStage lit={phase !== "closed"} />;
}

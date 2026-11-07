"use client";

import type { SceneSignals } from "@/lib/scene";
import type { Phase } from "@/lib/hours";
import InteriorStage from "./InteriorStage";
import InteriorActors, { useActorFiles, type ActorRequest } from "./InteriorActors";

/**
 * The illustrated interior plus (Gate 2) a few small actor sprites chosen by DATA, never by default.
 * Sprites that have not been supplied are simply not drawn.
 */
export default function CafeInterior({
  signals,
  phase = "open",
}: {
  signals?: SceneSignals;
  level?: number;
  crowd?: 0 | 1 | 2;
  phase?: Phase;
  onSelect?: (id: "barista" | "pastry" | "bar" | "social") => void;
  guard?: (fn: () => void) => () => void;
}) {
  const present = useActorFiles();
  const show: ActorRequest[] = [];
  if (signals && phase !== "closed") {
    if (phase !== "opening") show.push({ id: "barista" });
    if (phase === "open") {
      const n = Math.min(signals.laptopWorkers, 2);
      if (n >= 1) show.push({ id: "laptop-worker", anchor: "window-seat-2" });
      if (n >= 2) show.push({ id: "laptop-worker", anchor: "window-seat-4" });
      if (signals.chattingGroups >= 1) show.push({ id: "chat-pair", anchor: "tableA-center" });
    }
  }
  return (
    <InteriorStage lit={phase !== "closed"}>
      <InteriorActors show={show} present={present} />
    </InteriorStage>
  );
}

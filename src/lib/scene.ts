import type { CafeAnalysis } from "@/lib/ai/schema";

/** What the illustrated scene is allowed to show. Always derived from analysis, never invented. */
export type SceneSignals = CafeAnalysis["visualSignals"];

/** Before any analysis: a neutral café — a few patrons, no claims about policy or amenities. */
export const BASELINE_SIGNALS: SceneSignals = {
  laptopWorkers: 0,
  chattingGroups: 0,
  dogOnPatio: false,
  dogInside: false,
  pastryProminence: "low",
  restroomSign: false,
  streetParkedCars: 2,
  plants: "some",
  lighting: "warm",
};

/** Human-readable list of what changed — shown to the user so the link data → visuals is explicit. */
export function describeChanges(prev: SceneSignals, next: SceneSignals): string[] {
  const out: string[] = [];
  if (next.laptopWorkers !== prev.laptopWorkers) out.push(`${next.laptopWorkers} laptop worker${next.laptopWorkers === 1 ? "" : "s"} at the window bar`);
  if (next.chattingGroups !== prev.chattingGroups) out.push(`${next.chattingGroups} chatting group${next.chattingGroups === 1 ? "" : "s"}`);
  if (next.dogOnPatio !== prev.dogOnPatio && next.dogOnPatio) out.push("dog on the patio");
  if (next.dogInside !== prev.dogInside && next.dogInside) out.push("dog inside");
  if (next.pastryProminence !== prev.pastryProminence) out.push(`pastry case: ${next.pastryProminence}`);
  if (next.restroomSign !== prev.restroomSign && next.restroomSign) out.push("restroom sign");
  if (next.streetParkedCars !== prev.streetParkedCars) out.push(`${next.streetParkedCars} cars on the street`);
  if (next.plants !== prev.plants) out.push(`plants: ${next.plants}`);
  if (next.lighting !== prev.lighting) out.push(`${next.lighting} lighting`);
  return out;
}

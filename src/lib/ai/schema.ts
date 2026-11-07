import { z } from "zod";

/** Lenient on size: models often overshoot limits, so long strings/arrays are trimmed rather than rejected. */
const str = (n: number) => z.string().transform((v) => v.slice(0, n));
const arr = <T extends z.ZodTypeAny>(item: T, n: number) => z.array(item).transform((a) => a.slice(0, n));
const clampInt = (lo: number, hi: number) => z.number().transform((v) => Math.max(lo, Math.min(hi, Math.round(v))));
const tri = z.enum(["yes", "no", "unknown"]).catch("unknown");
const level = z.enum(["high", "medium", "low", "unknown"]).catch("unknown");

export const AnalysisSchema = z.object({
  atmosphere: z.object({
    tags: arr(str(30), 6),
    summary: str(240),
    lighting: z.enum(["bright", "warm", "dim", "unknown"]),
    noise: z.enum(["quiet", "moderate", "lively", "unknown"]),
  }),
  studySuitability: z.object({ level, notes: str(180) }),
  socialSuitability: z.object({ level, notes: str(180) }),
  petPolicy: z.object({ status: z.enum(["allowed_indoors", "patio_only", "not_allowed", "unknown"]), notes: str(180) }),
  specialtyProducts: arr(z.object({ name: str(60), kind: z.enum(["pastry", "drink", "food", "other"]), evidence: str(140) }), 6),
  amenities: z.object({ wifi: tri, outlets: tri, restrooms: tri, parking: tri, transit: tri, patio: tri }),
  evidence: arr(z.object({ claim: str(140), source: z.enum(["website", "review", "description", "metadata"]), confidence: z.enum(["high", "medium", "low"]) }), 10),
  uncertainty: arr(str(160), 6),
  visualSignals: z.object({
    laptopWorkers: clampInt(0, 4),
    chattingGroups: clampInt(0, 2),
    dogOnPatio: z.boolean(),
    dogInside: z.boolean(),
    pastryProminence: z.enum(["low", "medium", "high"]),
    restroomSign: z.boolean(),
    streetParkedCars: clampInt(0, 4),
    busStop: z.boolean(),
    plants: z.enum(["few", "some", "many"]),
    lighting: z.enum(["bright", "warm", "dim"]),
  }),
});
export type CafeAnalysis = z.infer<typeof AnalysisSchema>;

export const RequestSchema = z.object({
  cafeName: z.string().max(120).default("this café"),
  sources: z
    .array(z.object({ kind: z.enum(["website", "review", "description", "metadata"]), text: z.string().min(1).max(4000) }))
    .min(1)
    .max(60),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyzeRequest = z.infer<typeof RequestSchema>;

/**
 * Visual signals must stay grounded in the extracted facts. Whatever a model returns,
 * clamp the scene so it never shows something the analysis doesn't support.
 */
export function groundSignals(a: CafeAnalysis): CafeAnalysis {
  const v = { ...a.visualSignals };
  const pet = a.petPolicy.status;
  v.dogOnPatio = v.dogOnPatio && (pet === "patio_only" || pet === "allowed_indoors") && a.amenities.patio !== "no";
  v.dogInside = v.dogInside && pet === "allowed_indoors";
  // visuals follow the facts: a confirmed restroom always gets its sign; an explicit "no transit" hides the stop
  v.restroomSign = a.amenities.restrooms === "yes";
  if (a.studySuitability.level === "low" || a.studySuitability.level === "unknown") v.laptopWorkers = Math.min(v.laptopWorkers, a.studySuitability.level === "unknown" ? 1 : 0);
  if (a.socialSuitability.level === "low") v.chattingGroups = 0;
  if (a.socialSuitability.level === "unknown") v.chattingGroups = Math.min(v.chattingGroups, 1);
  if (a.amenities.parking === "no") v.streetParkedCars = 0;
  v.busStop = a.amenities.transit !== "no";
  if (a.specialtyProducts.filter((p) => p.kind === "pastry").length === 0) v.pastryProminence = v.pastryProminence === "high" ? "medium" : v.pastryProminence;
  return { ...a, visualSignals: v };
}

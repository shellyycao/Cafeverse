import { z } from "zod";

const tri = z.enum(["yes", "no", "unknown"]);
const level = z.enum(["high", "medium", "low", "unknown"]);

export const AnalysisSchema = z.object({
  atmosphere: z.object({
    tags: z.array(z.string().max(30)).max(6),
    summary: z.string().max(240),
    lighting: z.enum(["bright", "warm", "dim", "unknown"]),
    noise: z.enum(["quiet", "moderate", "lively", "unknown"]),
  }),
  studySuitability: z.object({ level, notes: z.string().max(180) }),
  socialSuitability: z.object({ level, notes: z.string().max(180) }),
  petPolicy: z.object({ status: z.enum(["allowed_indoors", "patio_only", "not_allowed", "unknown"]), notes: z.string().max(180) }),
  specialtyProducts: z
    .array(z.object({ name: z.string().max(60), kind: z.enum(["pastry", "drink", "food", "other"]), evidence: z.string().max(140) }))
    .max(6),
  amenities: z.object({ wifi: tri, outlets: tri, restrooms: tri, parking: tri, transit: tri, patio: tri }),
  evidence: z
    .array(z.object({ claim: z.string().max(140), source: z.enum(["website", "review", "description", "metadata"]), confidence: z.enum(["high", "medium", "low"]) }))
    .max(10),
  uncertainty: z.array(z.string().max(160)).max(6),
  visualSignals: z.object({
    laptopWorkers: z.number().int().min(0).max(4),
    chattingGroups: z.number().int().min(0).max(2),
    dogOnPatio: z.boolean(),
    dogInside: z.boolean(),
    pastryProminence: z.enum(["low", "medium", "high"]),
    restroomSign: z.boolean(),
    streetParkedCars: z.number().int().min(0).max(4),
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
  v.restroomSign = v.restroomSign && a.amenities.restrooms === "yes";
  if (a.studySuitability.level === "low" || a.studySuitability.level === "unknown") v.laptopWorkers = Math.min(v.laptopWorkers, a.studySuitability.level === "unknown" ? 1 : 0);
  if (a.socialSuitability.level === "low") v.chattingGroups = 0;
  if (a.socialSuitability.level === "unknown") v.chattingGroups = Math.min(v.chattingGroups, 1);
  if (a.amenities.parking === "no") v.streetParkedCars = 0;
  if (a.amenities.transit === "no") v.busStop = false;
  if (a.specialtyProducts.filter((p) => p.kind === "pastry").length === 0) v.pastryProminence = v.pastryProminence === "high" ? "medium" : v.pastryProminence;
  return { ...a, visualSignals: v };
}

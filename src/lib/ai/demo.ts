import type { InferenceProvider, AnalysisResult } from "./provider";
import { groundSignals, type AnalyzeRequest, type CafeAnalysis } from "./schema";

/**
 * Demo provider: no API key needed. A transparent keyword pass over the supplied sources —
 * clearly labelled "demo" in the response and the UI. It only reacts to what the text says.
 */
const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));

export class DemoProvider implements InferenceProvider {
  readonly name = "demo-keywords";

  async analyze(input: AnalyzeRequest): Promise<AnalysisResult> {
    const text = input.sources.map((s) => s.text.toLowerCase()).join("\n");
    const study = has(text, "study", "laptop", "work remotely", "work from", "wifi", "wi-fi", "outlet", "work,");
    const social = has(text, "meet", "friends", "chat", "catch up", "group", "relax", "hang");
    const dogsOk = has(text, "dog-friendly", "dog friendly", "pet-friendly", "pet friendly", "dogs welcome", "dogs allowed", "bring your dog");
    const dogsPatio = dogsOk && has(text, "patio", "outside", "outdoor");
    const noDogs = has(text, "no dogs", "no pets", "dogs not allowed");
    const pastries = ["pastry", "pastries", "croissant", "scone", "muffin", "cookie", "danish", "bun", "cake", "tart", "bread"].filter((w) => text.includes(w));
    const restrooms = has(text, "restroom", "bathroom") && !has(text, "no restroom", "no bathroom", "restrooms are for customers only");
    const parking = has(text, "parking", "garage");
    const patio = has(text, "patio", "outdoor seating", "outside seating");
    const quiet = has(text, "quiet", "calm", "peaceful");
    const lively = has(text, "busy", "lively", "loud", "crowded");
    const cozy = has(text, "cozy", "cosy", "warm", "charming");

    const analysis: CafeAnalysis = {
      atmosphere: {
        tags: [cozy && "cozy", quiet && "quiet", lively && "lively", study && "work-friendly", social && "social"].filter(Boolean) as string[],
        summary: "Demo reading of the supplied text only — not a real analysis.",
        lighting: cozy ? "warm" : "unknown",
        noise: quiet ? "quiet" : lively ? "lively" : "unknown",
      },
      studySuitability: { level: study ? (quiet ? "high" : "medium") : "unknown", notes: study ? "Text mentions studying/working." : "Nothing stated." },
      socialSuitability: { level: social ? "medium" : "unknown", notes: social ? "Text mentions meeting or relaxing." : "Nothing stated." },
      petPolicy: {
        status: noDogs ? "not_allowed" : dogsPatio ? "patio_only" : dogsOk ? "allowed_indoors" : "unknown",
        notes: dogsOk || noDogs ? "Stated in the supplied text." : "Not stated.",
      },
      specialtyProducts: [...new Set(pastries)].slice(0, 4).map((p) => ({ name: p, kind: "pastry" as const, evidence: "Mentioned in the supplied text." })),
      amenities: {
        wifi: has(text, "wifi", "wi-fi") ? "yes" : "unknown",
        outlets: has(text, "outlet", "plug") ? "yes" : "unknown",
        restrooms: restrooms ? "yes" : "unknown",
        parking: parking ? "yes" : "unknown",
        transit: has(text, "bus ", "bus stop", "transit") ? "yes" : "unknown",
        patio: patio ? "yes" : "unknown",
      },
      evidence: [
        study && { claim: "Source text mentions studying or working here.", source: "website" as const, confidence: "medium" as const },
        social && { claim: "Source text mentions meeting or relaxing here.", source: "website" as const, confidence: "medium" as const },
        parking && { claim: "Source text describes where to park.", source: "website" as const, confidence: "high" as const },
        pastries.length > 0 && { claim: `Source text mentions pastry items (${[...new Set(pastries)].slice(0, 3).join(", ")}).`, source: "website" as const, confidence: "low" as const },
        (dogsOk || noDogs) && { claim: "Source text states a pet policy.", source: "website" as const, confidence: "medium" as const },
      ].filter(Boolean) as CafeAnalysis["evidence"],
      uncertainty: ["Demo mode: keyword matching, not model inference.", "Anything not stated in the sources stays unknown."],
      visualSignals: {
        laptopWorkers: study ? (quiet ? 3 : 2) : 0,
        chattingGroups: social ? 1 : 0,
        dogOnPatio: dogsPatio,
        dogInside: dogsOk && !dogsPatio,
        pastryProminence: pastries.length >= 3 ? "high" : pastries.length ? "medium" : "low",
        restroomSign: restrooms,
        streetParkedCars: parking ? 3 : 1,
        busStop: true,
        plants: cozy ? "many" : "some",
        lighting: cozy ? "warm" : "bright",
      },
    };
    return { mode: "demo", provider: this.name, analysis: groundSignals(analysis), note: "Demo mode — set TINKER_API_KEY and TINKER_MODEL for live AI analysis." };
  }
}

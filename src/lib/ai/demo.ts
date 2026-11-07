import type { InferenceProvider, AnalysisResult } from "./provider";
import { groundSignals, type AnalyzeRequest, type CafeAnalysis } from "./schema";

/**
 * Demo provider: no API key needed. A transparent keyword pass over the supplied sources —
 * clearly labelled "demo" in the response and the UI. It only reacts to what the text says.
 */
const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));
const count = (texts: string[], ...words: string[]) => texts.filter((t) => has(t, ...words)).length;

const PRODUCT = /([a-z][a-z&' -]{0,26}?\b(?:latte|mocha|chai|cold brew|waffle|croissant|loaf|sandwich|bun|muffin|cookie|scone))/gi;
const DRINK = /latte|mocha|chai|cold brew/i;
const PASTRY = /waffle|croissant|loaf|bun|muffin|cookie|scone/i;

function extractProducts(sources: AnalyzeRequest["sources"]) {
  const tally = new Map<string, { name: string; n: number; kinds: Set<string> }>();
  for (const s of sources) {
    for (const m of s.text.matchAll(PRODUCT)) {
      let name = m[1].trim().replace(/^(a|an|the|their|and|with|extra|oat|iced|my|some|of)\s+/i, "").replace(/\s+/g, " ");
      if (name.length < 4 || /^(latte|chai|mocha)$/i.test(name) === false && name.split(" ").length > 4) continue;
      name = name.replace(/^(a|an|the|and)\s+/i, "");
      const key = name.toLowerCase().replace(/loafs$/, "loaf");
      const cur = tally.get(key) ?? { name: name[0].toUpperCase() + name.slice(1), n: 0, kinds: new Set() };
      cur.n++;
      cur.kinds.add(s.kind);
      tally.set(key, cur);
    }
  }
  return [...tally.values()].sort((a, b) => b.n - a.n);
}

export class DemoProvider implements InferenceProvider {
  readonly name = "demo-keywords";

  async analyze(input: AnalyzeRequest): Promise<AnalysisResult> {
    const texts = input.sources.map((s) => s.text.toLowerCase());
    const text = texts.join("\n");
    const reviews = input.sources.filter((s) => s.kind === "review").length;

    const workN = count(texts, "study", "laptop", "work remotely", "work, study", "for work", "working", "home office");
    const study = workN > 0;
    const quietRoom = has(text, "quiet room", "quietly working");
    const socialN = count(texts, "meet", "friends", "hang out", "relax", "groups");
    const social = socialN > 0;

    const insideOk = has(text, "dogs allowed inside", "dog allowed inside", "dog lying on the café floor inside", "dog friendly", "dog-friendly", "dogs are welcome", "dogs welcome");
    const outsideOk = has(text, "dogs allowed outside", "dogs allowed outdoors", "inside and outside seating") || has(text, "dog friendly");
    const noDogs = has(text, "no dogs", "no pets", "dogs not allowed");
    const patio = has(text, "outdoor seating", "outside seating", "patio", "inside and outside seating");

    const products = extractProducts(input.sources);
    const pastries = products.filter((p) => PASTRY.test(p.name));
    const drinks = products.filter((p) => DRINK.test(p.name));
    const foods = products.filter((p) => /sandwich/i.test(p.name));
    const specialty = [...pastries.slice(0, 3), ...drinks.slice(0, 3), ...foods.slice(0, 1)].slice(0, 6);

    const restrooms = has(text, "restroom", "bathroom") && !has(text, "no restroom", "no bathroom");
    const parking = has(text, "parking", "garage");
    const bright = has(text, "bright and airy", "bright");
    const cozy = has(text, "cozy", "cosy", "warm", "quaint");
    const loud = has(text, "loud", "busy", "packed");
    const quiet = has(text, "quiet", "calm", "peaceful");

    const evidence: CafeAnalysis["evidence"] = [
      study && { claim: `Work/study use is mentioned in ${workN} source${workN === 1 ? "" : "s"}${quietRoom ? ", including a quiet working area" : ""}.`, source: reviews ? "review" : "website", confidence: workN >= 3 ? "high" : "medium" },
      social && { claim: "Described as a place to meet friends, groups or relax.", source: "review", confidence: "medium" },
      (insideOk || outsideOk) && { claim: "Dogs are described as welcome, inside and outside.", source: has(text, "listing attributes") ? "metadata" : "review", confidence: "high" },
      restrooms && { claim: "A restroom is listed and reviewers call the bathrooms good.", source: "metadata", confidence: "high" },
      parking && { claim: "Street parking (free and paid) and a garage are mentioned.", source: "website", confidence: "high" },
      specialty.length > 0 && { claim: `Frequently named items: ${specialty.slice(0, 4).map((p) => p.name).join(", ")}.`, source: reviews ? "review" : "description", confidence: "medium" },
      loud && quiet && { claim: "Noise differs by visit: some find it loud, others quiet.", source: "review", confidence: "medium" },
    ].filter(Boolean) as CafeAnalysis["evidence"];

    const tri = (b: boolean) => (b ? ("yes" as const) : ("unknown" as const));
    const analysis: CafeAnalysis = {
      atmosphere: {
        tags: [cozy && "cozy", bright && "bright & airy", study && "work-friendly", social && "social", loud && quiet && "mixed noise"].filter(Boolean) as string[],
        summary: "Keyword reading of the supplied sources (demo mode) — not a model-written summary.",
        lighting: bright ? "bright" : cozy ? "warm" : "unknown",
        noise: loud && quiet ? "moderate" : quiet ? "quiet" : loud ? "lively" : "unknown",
      },
      studySuitability: { level: workN >= 3 ? "high" : workN > 0 ? "medium" : "unknown", notes: study ? "Multiple sources mention working or studying here; some reviewers say the space fills with laptop users." : "Nothing stated." },
      socialSuitability: { level: socialN >= 3 ? "high" : social ? "medium" : "unknown", notes: social ? "Sources mention meeting friends, groups and relaxing." : "Nothing stated." },
      petPolicy: {
        status: noDogs ? "not_allowed" : insideOk ? "allowed_indoors" : outsideOk ? "patio_only" : "unknown",
        notes: insideOk ? "Dogs described as welcome inside and outside." : outsideOk ? "Dogs welcome outside." : "Not stated.",
      },
      specialtyProducts: specialty.map((p) => ({
        name: p.name,
        kind: PASTRY.test(p.name) ? ("pastry" as const) : /sandwich/i.test(p.name) ? ("food" as const) : ("drink" as const),
        evidence: `Named in ${p.n} source${p.n === 1 ? "" : "s"}.`,
      })),
      amenities: { wifi: tri(has(text, "wi-fi", "wifi")), outlets: tri(has(text, "outlet")), restrooms: tri(restrooms), parking: tri(parking), patio: tri(patio) },
      evidence,
      uncertainty: [
        "Demo mode: keyword matching over supplied text, not model inference.",
        "Reviews are a small sample and differ on noise and crowding.",
        "Current menu, bus service and outlet availability are not confirmed.",
      ],
      visualSignals: {
        laptopWorkers: workN >= 4 ? 4 : workN >= 3 ? 3 : workN >= 1 ? 2 : 0,
        chattingGroups: socialN >= 4 ? 2 : social ? 1 : 0,
        dogOnPatio: insideOk || outsideOk,
        dogInside: insideOk,
        pastryProminence: pastries.length >= 3 ? "high" : pastries.length ? "medium" : "low",
        restroomSign: restrooms,
        streetParkedCars: parking ? (has(text, "free street parking") && has(text, "paid street parking") ? 4 : 3) : 1,
        plants: cozy ? "many" : "some",
        lighting: bright ? "bright" : cozy ? "warm" : "warm",
      },
    };
    return { mode: "demo", provider: this.name, analysis: groundSignals(analysis), note: "Demo mode — set TINKER_API_KEY and TINKER_MODEL for live AI analysis." };
  }
}

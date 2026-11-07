import type { AnalyzeRequest } from "./schema";

export const SYSTEM_PROMPT = `You extract café attributes from the provided source texts for a map app.
Rules:
- Use ONLY the provided sources. If something is not supported, use "unknown"/"no information" values. Never invent menu items, policies, amenities or ratings.
- Paraphrase evidence; never copy more than 8 consecutive words from any review.
- "evidence" lists the claims you relied on with their source kind and confidence. "uncertainty" lists what could not be determined.
- visualSignals drive an illustration, so they must follow from the facts: dogOnPatio only if pets are allowed outside/inside, dogInside only if allowed indoors, restroomSign only if restrooms are confirmed, laptopWorkers > 0 only if study/work use is supported, chattingGroups > 0 only if socializing is supported.
- Respond with ONE JSON object and nothing else (no markdown, no commentary).`;

export const SCHEMA_HINT = `{
 "atmosphere": {"tags": string[<=6], "summary": string, "lighting": "bright"|"warm"|"dim"|"unknown", "noise": "quiet"|"moderate"|"lively"|"unknown"},
 "studySuitability": {"level": "high"|"medium"|"low"|"unknown", "notes": string},
 "socialSuitability": {"level": "high"|"medium"|"low"|"unknown", "notes": string},
 "petPolicy": {"status": "allowed_indoors"|"patio_only"|"not_allowed"|"unknown", "notes": string},
 "specialtyProducts": [{"name": string, "kind": "pastry"|"drink"|"food"|"other", "evidence": string}],
 "amenities": {"wifi","outlets","restrooms","parking","patio": "yes"|"no"|"unknown"},
 "evidence": [{"claim": string, "source": "website"|"review"|"description"|"metadata", "confidence": "high"|"medium"|"low"}],
 "uncertainty": string[],
 "visualSignals": {"laptopWorkers": 0-4, "chattingGroups": 0-2, "dogOnPatio": boolean, "dogInside": boolean, "pastryProminence": "low"|"medium"|"high", "restroomSign": boolean, "streetParkedCars": 0-4, "plants": "few"|"some"|"many", "lighting": "bright"|"warm"|"dim"}
}`;

export function buildUserPrompt(req: AnalyzeRequest): string {
  const src = req.sources.map((s, i) => `[${i + 1}] (${s.kind}) ${s.text}`).join("\n\n");
  const meta = req.metadata ? `\nStructured metadata: ${JSON.stringify(req.metadata)}` : "";
  return `Café: ${req.cafeName}\n\nSources:\n${src}${meta}\n\nReturn JSON matching this shape:\n${SCHEMA_HINT}`;
}

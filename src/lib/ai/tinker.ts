import type { InferenceProvider, AnalysisResult } from "./provider";
import { AnalysisSchema, groundSignals, type AnalyzeRequest } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

/**
 * Thinking Machines (Tinker) via its documented OpenAI-compatible endpoint (beta):
 *   https://tinker-docs.thinkingmachines.ai/tinker/compatible-apis/openai/
 * The docs describe `model` as a Tinker sampler checkpoint path, so the model is NOT hardcoded:
 * set TINKER_MODEL. Server-side only; the key never reaches the browser.
 */
export const TINKER_DEFAULT_BASE_URL = "https://tinker.thinkingmachines.dev/services/tinker-prod/oai/api/v1";

function extractJson(text: string): unknown {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```(?:json)?/g, "");
  const a = cleaned.indexOf("{");
  const b = cleaned.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("no JSON object in model output");
  return JSON.parse(cleaned.slice(a, b + 1));
}

export class TinkerProvider implements InferenceProvider {
  readonly name = "tinker";
  constructor(
    private apiKey: string,
    private model: string,
    private baseUrl = TINKER_DEFAULT_BASE_URL,
  ) {}

  private async call(messages: Array<{ role: string; content: string }>): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: this.model, messages, temperature: 0.2, max_tokens: 1800 }),
      signal: AbortSignal.timeout(50_000),
    });
    if (!res.ok) throw new Error(`Tinker ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("empty completion");
    return content;
  }

  async analyze(input: AnalyzeRequest): Promise<AnalysisResult> {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ];
    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await this.call(
          attempt === 0 ? messages : [...messages, { role: "user", content: "Your previous reply was not valid JSON for the schema. Reply with ONLY the JSON object." }],
        );
        const parsed = AnalysisSchema.parse(extractJson(raw));
        return { mode: "live", provider: this.name, analysis: groundSignals(parsed) };
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("analysis failed");
  }
}

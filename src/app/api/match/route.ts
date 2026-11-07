import { NextResponse } from "next/server";
import { INTENT_KEYS, describeIntent, keywordIntent, rankSites, sanitizeIntent, type Intent } from "@/lib/match";
import { TINKER_DEFAULT_BASE_URL } from "@/lib/ai/tinker";

const SYSTEM = `You turn a person's request about what they want to do at a café into weights.
Return ONE JSON object with these keys only (numbers 0..1, omit keys that do not matter):
${INTENT_KEYS.join(", ")}.
study = work/read/laptop time; social = chatting with friends; quiet = wants calm; lively = wants buzz;
pastry = baked goods; coffee = coffee/tea quality; pets = bringing a dog; patio = outdoor seating; wifi; outlets; takeout; breakfast.
Understand English and Chinese. Do not invent preferences the person did not express. JSON only, no commentary.`;

// tiny in-memory limiter (per server instance) — protects the model key from being hammered
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > 12;
}

async function modelIntent(prompt: string): Promise<Intent | null> {
  const key = process.env.TINKER_API_KEY;
  const model = process.env.TINKER_MODEL;
  if (!key || !model) return null;
  try {
    const eff = process.env.TINKER_REASONING_EFFORT;
    const res = await fetch(`${process.env.TINKER_BASE_URL || TINKER_DEFAULT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        temperature: 0,
        max_tokens: 400,
        ...(eff ? { reasoning_effort: eff === "false" ? false : eff === "true" ? true : Number.isFinite(Number(eff)) ? Number(eff) : eff } : {}),
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = (data.choices?.[0]?.message?.content ?? "").replace(/<think>[\s\S]*?<\/think>/g, "");
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    if (a < 0 || b <= a) return null;
    const intent = sanitizeIntent(JSON.parse(text.slice(a, b + 1)));
    return Object.keys(intent).length ? intent : null;
  } catch {
    return null;
  }
}

/** POST /api/match { prompt } → { mode, intent, summary, results[] }  (the model reads the intent; plain code ranks it) */
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ error: "Too many searches — wait a minute." }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { prompt?: unknown } | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim().slice(0, 300) : "";
  if (!prompt) return NextResponse.json({ error: "Tell me what you want to do at a café." }, { status: 400 });

  const live = await modelIntent(prompt);
  const intent = live ?? keywordIntent(prompt);
  return NextResponse.json({ mode: live ? "live" : "demo", intent, summary: describeIntent(intent), results: rankSites(intent) });
}

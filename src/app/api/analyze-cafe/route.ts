import { NextResponse } from "next/server";
import { RequestSchema } from "@/lib/ai/schema";
import { getProvider, isLive } from "@/lib/ai";
import { DemoProvider } from "@/lib/ai/demo";

/** GET: lets the UI label the mode (live vs demo) without exposing any secret. */
export async function GET(req: Request) {
  void req.headers; // reading the request keeps this handler dynamic (env is read per request)
  return NextResponse.json({ mode: isLive() ? "live" : "demo" });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  const total = parsed.data.sources.reduce((n, s) => n + s.text.length, 0);
  if (total > 60_000) return NextResponse.json({ error: "Sources too long" }, { status: 413 });

  try {
    const result = await getProvider().analyze(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    // Live provider failed: fall back to demo so the UI stays usable, and say so plainly.
    const demo = await new DemoProvider().analyze(parsed.data);
    return NextResponse.json({ ...demo, note: `Live analysis failed (${e instanceof Error ? e.message.slice(0, 120) : "error"}); showing demo output.` });
  }
}

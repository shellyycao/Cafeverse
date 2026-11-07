import { SITES, type Attrs, type Site } from "@/data/sites";

/** What the user wants, as weights 0..1. Produced by the model (when live) or by the keyword reader. */
export type Intent = Partial<Record<"study" | "social" | "quiet" | "lively" | "pastry" | "coffee" | "pets" | "patio" | "wifi" | "outlets" | "takeout" | "breakfast", number>>;
export const INTENT_KEYS = ["study", "social", "quiet", "lively", "pastry", "coffee", "pets", "patio", "wifi", "outlets", "takeout", "breakfast"] as const;
export type IntentKey = (typeof INTENT_KEYS)[number];

const LABEL: Record<IntentKey, string> = {
  study: "study / work",
  social: "chat with friends",
  quiet: "quiet",
  lively: "lively",
  pastry: "pastries",
  coffee: "great coffee",
  pets: "bring a dog",
  patio: "outdoor seating",
  wifi: "Wi-Fi",
  outlets: "outlets",
  takeout: "takeout",
  breakfast: "breakfast",
};
export const intentLabel = (k: IntentKey) => LABEL[k];

/** Keyword reader (English + 中文). Used as the demo reader and as the fallback when the model is unavailable. */
const RULES: Array<[IntentKey, number, RegExp]> = [
  ["study", 1, /\b(study|studying|work|working|laptop|homework|focus|remote|write|writing|read|reading|exam|thesis)\b|学习|自习|工作|办公|写作|论文|看书|读书|笔记本/i],
  ["social", 1, /\b(friend|friends|chat|chatting|catch up|date|group|meet|meeting|hang ?out|talk|social)\b|聊天|朋友|约会|聚|见面|社交|闺蜜/i],
  ["quiet", 1, /\b(quiet|silent|peaceful|calm|library|no noise)\b|安静|清净|不吵|静/i],
  ["lively", 0.8, /\b(lively|buzzing|busy|vibrant|energetic|noisy|fun)\b|热闹|有氛围|人多|活跃/i],
  ["pastry", 1, /\b(pastry|pastries|cake|dessert|bakery|croissant|bread|sweet|baked|waffle)\b|甜点|蛋糕|面包|糕点|烘焙|可颂|华夫/i],
  ["coffee", 0.8, /\b(coffee|espresso|latte|tea|brew|cappuccino|matcha)\b|咖啡|拿铁|茶|手冲/i],
  ["pets", 1.2, /\b(dog|dogs|pet|pets|puppy|pup)\b|狗|宠物|带狗|遛狗|猫/i],
  ["patio", 0.8, /\b(patio|outdoor|outside|terrace|sun|fresh air)\b|户外|露台|室外|露天|晒太阳/i],
  ["wifi", 0.8, /\b(wifi|wi-fi|internet|online|zoom)\b|网络|无线/i],
  ["outlets", 1, /\b(outlet|outlets|plug|charge|charging|power)\b|插座|充电/i],
  ["takeout", 0.8, /\b(takeout|take out|to-go|to go|grab and go|quick)\b|外带|带走|打包|快/i],
  ["breakfast", 0.8, /\b(breakfast|brunch|morning)\b|早餐|早午餐|早上/i],
];

export function keywordIntent(prompt: string): Intent {
  const out: Intent = {};
  for (const [k, w, re] of RULES) if (re.test(prompt)) out[k] = w;
  // "bring my laptop to study" implies outlets/wifi matter a little, quiet leans positive
  if (out.study) {
    out.wifi = Math.max(out.wifi ?? 0, 0.5);
    out.outlets = Math.max(out.outlets ?? 0, 0.5);
  }
  return out;
}

export function sanitizeIntent(raw: unknown): Intent {
  const out: Intent = {};
  if (raw && typeof raw === "object") {
    for (const k of INTENT_KEYS) {
      const v = (raw as Record<string, unknown>)[k];
      if (typeof v === "number" && Number.isFinite(v) && v > 0) out[k] = Math.min(1.2, v);
    }
  }
  return out;
}

export type Match = {
  id: string;
  score: number; // 0..100
  rank: number;
  reasons: string[]; // why it fits
  caveats: string[]; // where it falls short
};

function fit(site: Site, key: IntentKey): number {
  const a: Attrs = site.attrs;
  switch (key) {
    case "study": return a.study;
    case "social": return a.social;
    case "quiet": return a.quiet;
    case "lively": return a.lively;
    case "pastry": return a.pastry;
    case "coffee": return a.coffee;
    case "pets": return a.pets === "inside" ? 1 : a.pets === "patio" ? 0.8 : a.pets === "none" ? 0 : 0.2;
    default: {
      const v = a[key as "patio" | "wifi" | "outlets" | "takeout" | "breakfast"];
      return v === true ? 1 : v === false ? 0 : 0.35;
    }
  }
}

export function rankSites(intent: Intent): Match[] {
  const entries = (Object.entries(intent) as Array<[IntentKey, number]>).filter(([, w]) => w > 0);
  const fallback = entries.length === 0;
  const weights: Array<[IntentKey, number]> = fallback ? [["coffee", 1]] : entries;
  const total = weights.reduce((s, [, w]) => s + w, 0);
  const out = SITES.map((site) => {
    let sum = 0;
    const reasons: Array<[number, string]> = [];
    const caveats: Array<[number, string]> = [];
    for (const [k, w] of weights) {
      const f = fit(site, k);
      sum += w * f;
      const ev = site.evidence[k as keyof Attrs] ?? "";
      if (f >= 0.7) reasons.push([w * f, `${intentLabel(k)}: ${ev}`]);
      else if (f <= 0.35 && w >= 0.8) caveats.push([w * (1 - f), `${intentLabel(k)}: ${f === 0 ? "not offered" : "weak"} — ${ev}`]);
    }
    const score = Math.round((sum / total) * 100);
    return {
      id: site.id,
      score,
      rank: 0,
      reasons: reasons.sort((a, b) => b[0] - a[0]).slice(0, 3).map((r) => r[1]),
      caveats: caveats.sort((a, b) => b[0] - a[0]).slice(0, 2).map((r) => r[1]),
    };
  }).sort((a, b) => b.score - a.score);
  out.forEach((m, i) => (m.rank = i + 1));
  return out;
}

export const describeIntent = (intent: Intent) =>
  (Object.keys(intent) as IntentKey[])
    .filter((k) => (intent[k] ?? 0) > 0)
    .sort((a, b) => (intent[b] ?? 0) - (intent[a] ?? 0))
    .map(intentLabel);

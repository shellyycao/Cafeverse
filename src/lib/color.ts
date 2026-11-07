export function shade(hex: string, amt: number): string {
  // amt in [-1, 1]: negative darkens toward warm brown, positive lightens toward cream
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const tr = amt < 0 ? 92 : 255,
    tg = amt < 0 ? 66 : 248,
    tb = amt < 0 ? 44 : 232;
  const a = Math.abs(amt);
  const m = (c: number, t: number) => Math.round(c + (t - c) * a);
  return `#${[m(r, tr), m(g, tg), m(b, tb)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export const INK = "#7b5a3c";
export const PAPER = "#f4ead7";

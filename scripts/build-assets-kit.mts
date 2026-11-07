/** Writes docs/assets-kit/anchors.json + alignment-template.svg. Run: npx tsx scripts/build-assets-kit.mts */
import { writeFileSync } from "node:fs";
import { ANCHORS, CANVAS, OBJECTS, anchorCanvas, canvasPx } from "../src/data/foster-anchors";
import { CAFE_FOOTPRINT as F } from "../src/data/durham";
import { P } from "../src/lib/iso";

const pt = (gx: number, gy: number, z = 0) => {
  const p = P(gx, gy, z);
  const c = canvasPx(p.x, p.y);
  return `${c.x},${c.y}`;
};
const poly = (pts: Array<[number, number, number?]>) => pts.map(([x, y, z]) => pt(x, y, z ?? 0)).join(" ");
const { width: W, height: H } = CANVAS;

const anchors = ANCHORS.map((a) => {
  const c = anchorCanvas(a);
  return { id: a.id, kind: a.kind, note: a.note, px: { x: c.x, y: c.y }, normalized: { x: c.nx, y: c.ny } };
});
writeFileSync(
  "docs/assets-kit/anchors.json",
  JSON.stringify({ canvas: { width: W, height: H, aspect: "2040:1620 = 17:13.5 (1.2593)", worldUnitsToPx: CANVAS.px }, note: "normalized = px / canvas size (0..1, origin top-left). Pivot for people = feet / bottom-centre.", anchors }, null, 2),
);

const line = (d: string, c: string, w = 4, dash = "") => `<polyline points="${d}" fill="none" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""} stroke-linejoin="round"/>`;
const h = F.h;
const out: string[] = [];
// room shell: floor, back wall (service wall, right), photo wall (left), street glass (front, open)
out.push(`<polygon points="${poly([[F.x0, F.y0], [F.x1, F.y0], [F.x1, F.y1], [F.x0, F.y1]])}" fill="#e8a23a" fill-opacity=".10" stroke="#b9770e" stroke-width="5"/>`);
out.push(`<polygon points="${poly([[F.x0, F.y0], [F.x1, F.y0], [F.x1, F.y0, h], [F.x0, F.y0, h]])}" fill="#8a6a3a" fill-opacity=".08" stroke="#8a6a3a" stroke-width="5"/>`);
out.push(`<polygon points="${poly([[F.x0, F.y1], [F.x0, F.y0], [F.x0, F.y0, h], [F.x0, F.y1, h]])}" fill="#2f4a7a" fill-opacity=".10" stroke="#2f4a7a" stroke-width="5"/>`);
// storefront (street glass, cutaway = open): outline + door
out.push(line(poly([[F.x0, F.y1, 0], [F.x0, F.y1, h], [F.x1, F.y1, h], [F.x1, F.y0, h], [F.x1, F.y0, 0], [F.x1, F.y1, 0], [F.x0, F.y1, 0]]), "#1f8a70", 5, "18 12"));
out.push(line(poly([[F.x1, F.y1 - 6, 0], [F.x1, F.y1 - 6, 42], [F.x1, F.y1 - 32, 42], [F.x1, F.y1 - 32, 0]]), "#1f8a70", 5));
// key objects (floor footprints)
for (const o of OBJECTS) {
  const [x0, y0, x1, y1] = o.rect;
  out.push(`<polygon points="${poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])}" fill="#c4566b" fill-opacity=".14" stroke="#c4566b" stroke-width="4" stroke-dasharray="14 9"/>`);
  const c = canvasPx(P((x0 + x1) / 2, (y0 + y1) / 2).x, P((x0 + x1) / 2, (y0 + y1) / 2).y);
  out.push(`<text x="${c.x}" y="${c.y - 18}" text-anchor="middle" font-size="26" font-family="system-ui" fill="#7a2336" stroke="#fff" stroke-width="5" paint-order="stroke">${o.label}</text>`);
}
// back-wall features
const bw = (u0: number, u1: number, v0: number, v1: number) => poly([[F.x0 + u0, F.y0, v0], [F.x0 + u1, F.y0, v0], [F.x0 + u1, F.y0, v1], [F.x0 + u0, F.y0, v1]]);
out.push(`<polygon points="${bw(60, 136, 28, 54)}" fill="#2f8a5a" fill-opacity=".12" stroke="#2f8a5a" stroke-width="4"/><text x="${canvasPx(P(F.x0 + 98, F.y0, 54).x, P(F.x0 + 98, F.y0, 54).y).x}" y="${canvasPx(P(F.x0 + 98, F.y0, 54).x, P(F.x0 + 98, F.y0, 54).y).y - 16}" text-anchor="middle" font-size="26" font-family="system-ui" fill="#14573a" stroke="#fff" stroke-width="5" paint-order="stroke">3 menu boards</text>`);
out.push(`<polygon points="${bw(34, 56, 4, 46)}" fill="#8a5f36" fill-opacity=".14" stroke="#8a5f36" stroke-width="4"/>`);
out.push(`<polygon points="${bw(138, 158, 20, 46)}" fill="#2f6aa8" fill-opacity=".14" stroke="#2f6aa8" stroke-width="4"/>`);
// anchors
for (const a of anchors) {
  out.push(`<circle cx="${a.px.x}" cy="${a.px.y}" r="13" fill="#c4566b"/><text x="${a.px.x + 20}" y="${a.px.y + 8}" font-size="24" font-family="system-ui" fill="#5b2230" stroke="#fff" stroke-width="5" paint-order="stroke">${a.id}</text>`);
}
writeFileSync(
  "docs/assets-kit/alignment-template.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${out.join("\n")}\n<text x="40" y="60" font-size="34" font-family="system-ui" fill="#6a5338" stroke="#fff" stroke-width="6" paint-order="stroke">${W}×${H}px · orange = floor · blue = photo wall · brown = service wall · green = street glass / door</text>\n</svg>`,
);
console.log("kit written:", anchors.length, "anchors,", `${W}x${H}`);

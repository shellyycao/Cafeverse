/** Writes docs/exterior-kit/anchors.json + alignment-template.svg. Run: npx tsx scripts/build-exterior-kit.mts */
import { writeFileSync } from "node:fs";
import { EXT, EXT_LANDMARKS, EXT_ZONES, groundToExt } from "../src/data/foster-exterior";
import { boxFaces } from "../src/lib/iso";

const { width: W, height: H } = EXT;
const pt = (gx: number, gy: number, z = 0) => {
  const c = groundToExt(gx, gy, z);
  return `${c.x},${c.y}`;
};
const anchors = EXT_LANDMARKS.map((l) => {
  const c = groundToExt(...l.ground);
  return { id: l.id, note: l.note, px: { x: c.x, y: c.y }, normalized: { x: +(c.x / W).toFixed(4), y: +(c.y / H).toFixed(4) } };
});
writeFileSync("docs/exterior-kit/anchors.json", JSON.stringify({ canvas: { width: W, height: H, aspect: "2400:1425 (1.684)", worldUnitsToPx: EXT.px }, note: "normalized = px / canvas size, origin top-left", anchors }, null, 2));

const out: string[] = [];
for (const z of EXT_ZONES) {
  const pts = z.poly.map(([x, y, h]) => pt(x, y, h ?? 0)).join(" ");
  out.push(`<polygon points="${pts}" fill="${z.color}" fill-opacity=".10" stroke="${z.color}" stroke-width="5" ${z.id === "block" ? 'stroke-dasharray="26 14"' : ""}/>`);
  const [x0, y0] = z.poly[0];
  const [x2, y2] = z.poly[2];
  const c = groundToExt((x0 + x2) / 2, (y0 + y2) / 2, 0);
  out.push(`<text x="${c.x}" y="${c.y}" text-anchor="middle" font-size="26" font-family="system-ui" fill="${z.color}" stroke="#fff" stroke-width="5" paint-order="stroke">${z.id}</text>`);
}
// road centre-lines (they come from the real map, NOT from the image)
for (const gx of [0, 400]) out.push(`<polyline points="${pt(gx, -60)} ${pt(gx, 360)}" stroke="#7a8a99" stroke-width="3" stroke-dasharray="6 10" fill="none"/>`);
for (const gy of [0, 300]) out.push(`<polyline points="${pt(-60, gy)} ${pt(460, gy)}" stroke="#7a8a99" stroke-width="3" stroke-dasharray="6 10" fill="none"/>`);
for (const a of anchors) out.push(`<circle cx="${a.px.x}" cy="${a.px.y}" r="11" fill="#c4566b"/><text x="${a.px.x + 18}" y="${a.px.y + 7}" font-size="22" font-family="system-ui" fill="#5b2230" stroke="#fff" stroke-width="5" paint-order="stroke">${a.id}</text>`);
writeFileSync(
  "docs/exterior-kit/alignment-template.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${out.join("\n")}\n<text x="40" y="56" font-size="32" font-family="system-ui" fill="#6a5338" stroke="#fff" stroke-width="6" paint-order="stroke">${W}×${H}px · dashed orange = the café block (paint inside) · grey dashed = road centre-lines (leave roads to the map)</text>\n</svg>`,
);
console.log("exterior kit:", anchors.length, "anchors,", `${W}x${H}`);

// ---- massing reference (opaque flat volumes) ----
import { P as Pp } from "../src/lib/iso";
const px2 = (gx: number, gy: number, z = 0) => { const p = Pp(gx, gy, z); const c = extPx(p.x, p.y); return `${c.x},${c.y}`; };
import { extPx } from "../src/data/foster-exterior";
const faces = (x0: number, y0: number, x1: number, y1: number, h: number) => ({
  top: [[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]].map(([a, b, c]) => px2(a, b, c)).join(" "),
  left: [[x0, y1, 0], [x1, y1, 0], [x1, y1, h], [x0, y1, h]].map(([a, b, c]) => px2(a, b, c)).join(" "),
  right: [[x1, y1, 0], [x1, y0, 0], [x1, y0, h], [x1, y1, h]].map(([a, b, c]) => px2(a, b, c)).join(" "),
});
const colors: Record<string, [string, string, string]> = {
  podium: ["#d3846a", "#a85f49", "#e8cdb2"],
  "cafe-storefront": ["#e3957a", "#b56c54", "#bcd9a8"],
  "tower-back": ["#cdb396", "#9c7d63", "#e6dccb"],
  "tower-left": ["#cdb396", "#9c7d63", "#e6dccb"],
};
const vols = EXT_ZONES.filter((z) => z.h)
  .map((z) => { const xs = z.poly.map((p) => p[0]); const ys = z.poly.map((p) => p[1]); return { z, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; })
  .sort((a, b) => a.x0 + a.y0 - (b.x0 + b.y0) || (a.z.h ?? 0) - (b.z.h ?? 0));
const mass = vols.map((v) => { const f = faces(v.x0, v.y0, v.x1, v.y1, v.z.h!); const [l, r, t] = colors[v.z.id] ?? ["#ccc", "#aaa", "#eee"]; return `<polygon points="${f.left}" fill="${l}" stroke="#5b3a2a" stroke-width="3"/><polygon points="${f.right}" fill="${r}" stroke="#5b3a2a" stroke-width="3"/><polygon points="${f.top}" fill="${t}" stroke="#5b3a2a" stroke-width="3"/>`; });
writeFileSync("docs/exterior-kit/massing-overlay.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${mass.join("")}<text x="40" y="104" font-size="30" font-family="system-ui" fill="#4a3626" stroke="#fff" stroke-width="6" paint-order="stroke">MASSING: 2-storey brick podium (café = ground floor, planted roof terrace) · taller volumes behind and at the left end · flat colours, not final art</text></svg>`);

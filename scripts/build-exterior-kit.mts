/** Writes docs/exterior-kit/anchors.json + alignment-template.svg. Run: npx tsx scripts/build-exterior-kit.mts */
import { writeFileSync } from "node:fs";
import { EXT, EXT_LANDMARKS, EXT_ZONES, groundToExt } from "../src/data/foster-exterior";

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

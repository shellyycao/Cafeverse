import { memo } from "react";
import { P, round } from "@/lib/iso";
import { DURHAM, ROAD_HALF, ROAD_ORDER, type Poly, type RoadClass } from "@/data/durham";

/** Flat, Google-Maps-style base map: roads, water, parks, building footprints, street names. */
const C = {
  land: "#f2ebdb",
  building: "#e8dfca",
  buildingEdge: "#d8cbb0",
  park: "#d4e3b6",
  water: "#b6d3df",
  rail: "#b9ad98",
  casing: "#d9cbae",
  fill: { v: "#fffdf7", x: "#faf3e2", r: "#fffdf7", t: "#fffdf7", s: "#fff4d2", p: "#ffeab0", m: "#f8d594" } as Record<RoadClass, string>,
  casingBy: { v: "#e2d6bc", x: "#e2d6bc", r: "#dccfb2", t: "#d9cbae", s: "#dcc99a", p: "#dcbf7a", m: "#d9a85a" } as Record<RoadClass, string>,
};

const f = (x: number, y: number) => {
  const p = P(x, y);
  return `${round(p.x)} ${round(p.y)}`;
};
const polyD = (p: Poly) => "M" + p.map(([x, y]) => f(x, y)).join("L") + "Z";

function circle(x: number, y: number, r: number, n = 10) {
  let d = "";
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    d += (k ? "L" : "M") + f(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  return d + "Z";
}

/** path data for a stroked polyline, built in ground space so it projects with correct widths */
function strokeD(p: Poly, half: number): string {
  let d = "";
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    const L = Math.hypot(bx - ax, by - ay) || 1;
    const nx = (-(by - ay) / L) * half;
    const ny = ((bx - ax) / L) * half;
    d += `M${f(ax + nx, ay + ny)}L${f(bx + nx, by + ny)}L${f(bx - nx, by - ny)}L${f(ax - nx, ay - ny)}Z`;
  }
  // round joints / ends
  for (let i = 0; i < p.length; i++) {
    let turn = true;
    if (i > 0 && i < p.length - 1) {
      const [x0, y0] = p[i - 1];
      const [x1, y1] = p[i];
      const [x2, y2] = p[i + 1];
      const a1 = Math.atan2(y1 - y0, x1 - x0);
      const a2 = Math.atan2(y2 - y1, x2 - x1);
      turn = Math.abs(Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1))) > 0.2;
    }
    if (turn) d += circle(p[i][0], p[i][1], half, 9);
  }
  return d;
}

const roadPaths = (() => {
  const casing: Record<string, string> = {};
  const fill: Record<string, string> = {};
  for (const r of DURHAM.roads) {
    const h = ROAD_HALF[r.c];
    casing[r.c] = (casing[r.c] || "") + strokeD(r.p, h + 3.2);
    fill[r.c] = (fill[r.c] || "") + strokeD(r.p, h);
  }
  return { casing, fill };
})();

const labelPaths = (() => {
  const seen = new Map<string, { d: string; len: number; c: RoadClass }>();
  for (const r of DURHAM.roads) {
    if (!r.n || r.c === "v" || r.c === "x") continue;
    let len = 0;
    for (let i = 1; i < r.p.length; i++) len += Math.hypot(r.p[i][0] - r.p[i - 1][0], r.p[i][1] - r.p[i - 1][1]);
    if (len < 150) continue;
    let pts = r.p.map(([x, y]) => P(x, y));
    if (pts[pts.length - 1].x < pts[0].x) pts = pts.reverse();
    const d = "M" + pts.map((p) => `${round(p.x)} ${round(p.y)}`).join("L");
    const key = r.n + ":" + Math.round(len / 400);
    const prev = seen.get(key);
    if (!prev || prev.len < len) seen.set(key, { d, len, c: r.c });
  }
  return [...seen.entries()].map(([k, v], i) => ({ id: `lbl${i}`, name: k.split(":")[0].replace(/^(North|South|East|West) /, (m) => m[0] + ". ").replace(/ Street$/, " St").replace(/ Avenue$/, " Ave").replace(/ Boulevard$/, " Blvd"), ...v }));
})();

function BaseMapImpl() {
  return (
    <g>
      <rect x={-12000} y={-8000} width={24000} height={16000} fill={C.land} />

      {DURHAM.parks.map((p, i) => (
        <path key={`pk${i}`} d={polyD(p)} fill={C.park} />
      ))}
      {DURHAM.water.map((p, i) => (
        <path key={`w${i}`} d={polyD(p)} fill={C.water} stroke="#9fc2d0" strokeWidth={1} />
      ))}
      <path d={DURHAM.buildings.map((b) => polyD(b.p)).join("")} fill={C.building} stroke={C.buildingEdge} strokeWidth={0.8} />
      {DURHAM.rails.map((p, i) => (
        <path key={`rl${i}`} d={"M" + p.map(([x, y]) => f(x, y)).join("L")} fill="none" stroke={C.rail} strokeWidth={3} strokeDasharray="10 7" />
      ))}

      {ROAD_ORDER.map((c) => (roadPaths.casing[c] ? <path key={`c${c}`} d={roadPaths.casing[c]} fill={C.casingBy[c]} /> : null))}
      {ROAD_ORDER.map((c) => (roadPaths.fill[c] ? <path key={`f${c}`} d={roadPaths.fill[c]} fill={C.fill[c]} /> : null))}

      <defs>
        {labelPaths.map((l) => (
          <path key={l.id} id={l.id} d={l.d} />
        ))}
      </defs>
      <g className="street-labels" fontFamily="var(--font-geist-sans), system-ui" fontWeight={600} fill="#7b6648" stroke="#fffaf0" strokeWidth={4} paintOrder="stroke" letterSpacing={0.6}>
        {labelPaths.map((l) => (
          <text key={l.id} fontSize={l.c === "p" || l.c === "m" ? 19 : l.c === "r" ? 14 : 16.5}>
            <textPath href={`#${l.id}`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
              {l.name}
            </textPath>
          </text>
        ))}
      </g>
    </g>
  );
}

export const BaseMap = memo(BaseMapImpl);
export default BaseMap;

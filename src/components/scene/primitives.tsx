import { P, boxFaces, pts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";
import { polyArea, type Poly } from "@/data/durham";

const OUT = { stroke: INK, strokeWidth: 0.9, strokeOpacity: 0.55, strokeLinejoin: "round" as const };

/* ---------- face-quad helpers (ground coords) ---------- */
export const leftQuad = (x0: number, y1: number, u0: number, u1: number, v0: number, v1: number, y = y1) =>
  pts([
    [x0 + u0, y, v0],
    [x0 + u1, y, v0],
    [x0 + u1, y, v1],
    [x0 + u0, y, v1],
  ]);
export const rightQuad = (x1: number, y1: number, u0: number, u1: number, v0: number, v1: number, x = x1) =>
  pts([
    [x, y1 - u0, v0],
    [x, y1 - u1, v0],
    [x, y1 - u1, v1],
    [x, y1 - u0, v1],
  ]);

/* ---------- Extruded polygon building (real OSM footprint) ---------- */
export function PolyBuilding({ poly, h, wall, roof, shop = false }: { poly: Poly; h: number; wall: string; roof: string; shop?: boolean }) {
  const n = poly.length;
  const cx = poly.reduce((a, p) => a + p[0], 0) / n;
  const cy = poly.reduce((a, p) => a + p[1], 0) / n;
  const edges: Array<{ a: [number, number]; b: [number, number]; L: number; nx: number; ny: number; d: number }> = [];
  for (let i = 0; i < n; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % n];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 1) continue;
    let nx = (b[1] - a[1]) / L;
    let ny = -(b[0] - a[0]) / L;
    if (((a[0] + b[0]) / 2 - cx) * nx + ((a[1] + b[1]) / 2 - cy) * ny < 0) {
      nx = -nx;
      ny = -ny;
    }
    if (nx + ny > 0.05) edges.push({ a, b, L, nx, ny, d: a[0] + a[1] + b[0] + b[1] });
  }
  edges.sort((e1, e2) => e1.d - e2.d);
  const floors = Math.max(1, Math.floor((h - 4) / 15));
  return (
    <g>
      {edges.map((e, i) => {
        const pa = P(e.a[0], e.a[1]);
        const pb = P(e.b[0], e.b[1]);
        const side = e.nx > e.ny;
        const col = side ? shade(wall, -0.14) : wall;
        const ux = (pb.x - pa.x) / e.L;
        const uy = (pb.y - pa.y) / e.L;
        const cells = e.L >= 22 ? Math.floor(e.L / 20) : 0;
        return (
          <g key={i}>
            <polygon points={`${pa.x},${pa.y} ${pb.x},${pb.y} ${pb.x},${pb.y - h} ${pa.x},${pa.y - h}`} fill={col} {...OUT} />
            {cells > 0 && (
              <g transform={`matrix(${ux} ${uy} 0 1 ${pa.x} ${pa.y})`}>
                {Array.from({ length: floors }).map((_, fl) =>
                  Array.from({ length: cells }).map((_, k) => {
                    const cell = e.L / cells;
                    const v0 = 4 + fl * 15 + (fl === 0 && shop ? 1 : 0);
                    const v1 = v0 + (fl === 0 && shop ? 11 : 8);
                    return v1 > h - 3 ? null : (
                      <rect key={`${fl}-${k}`} x={cell * k + 5} y={-v1} width={cell - 10} height={v1 - v0} fill={fl === 0 && shop ? (side ? "#e7c887" : "#f6dca0") : side ? "#b4c5c0" : "#cbd9d4"} stroke={INK} strokeOpacity={0.4} strokeWidth={0.5} />
                    );
                  }),
                )}
              </g>
            )}
          </g>
        );
      })}
      <polygon points={poly.map(([x, y]) => { const q = P(x, y, h); return `${q.x},${q.y}`; }).join(" ")} fill={roof} {...OUT} />
      {polyArea(poly) === 0 && null}
    </g>
  );
}

export function Awning({
  x0,
  x1,
  y,
  z,
  color,
  out = 11,
  stripes = 7,
}: {
  x0: number;
  x1: number;
  y: number;
  z: number;
  color: string;
  out?: number;
  stripes?: number;
}) {
  const step = (x1 - x0) / stripes;
  return (
    <g>
      {Array.from({ length: stripes }).map((_, i) => (
        <polygon
          key={i}
          points={pts([
            [x0 + step * i, y, z],
            [x0 + step * (i + 1), y, z],
            [x0 + step * (i + 1), y + out, z - 8],
            [x0 + step * i, y + out, z - 8],
          ])}
          fill={i % 2 ? "#f4ead2" : color}
          stroke={INK}
          strokeOpacity={0.5}
          strokeWidth={0.6}
        />
      ))}
    </g>
  );
}

/* ---------- Tree ---------- */
const GREENS = ["#a9bf6a", "#8fae5a", "#c3cf74", "#7fa354"];
const BLOOMS = ["#f0b9c4", "#e7a3b4", "#f7cfd6", "#dd93a8"];
const BLOBS: Array<[number, number, number, number]> = [
  [0, 0, 17, 0],
  [-11, 5, 12, 1],
  [11, 4, 13, 2],
  [-4, -11, 12, 3],
  [8, -8, 10, 0],
];
export function Tree({ x, y, s = 1, kind = "round", rich = false }: { x: number; y: number; s?: number; kind?: "round" | "bloom"; rich?: boolean }) {
  const b = P(x, y);
  const pal = kind === "bloom" ? BLOOMS : GREENS;
  const top = -30 * s;
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={3 * s} cy={1} rx={17 * s} ry={7 * s} fill="#6b5a3a" opacity={0.16} />
      <path d={`M0 0 L${1.2 * s} ${top + 10 * s}`} stroke="#7a5a3a" strokeWidth={3.4 * s} strokeLinecap="round" />
      {rich && <path d={`M${1 * s} ${-12 * s} L${-9 * s} ${-22 * s}`} stroke="#7a5a3a" strokeWidth={1.6 * s} strokeLinecap="round" />}
      <g transform={`translate(0 ${top})`}>
        {BLOBS.map(([dx, dy, r, c], i) => (
          <circle key={i} cx={dx * s} cy={dy * s} r={r * s} fill={pal[c % pal.length]} stroke={rich ? INK : "none"} strokeOpacity={0.22} strokeWidth={0.6} />
        ))}
        {rich && (
          <>
            <circle cx={-6 * s} cy={-6 * s} r={5 * s} fill="#ffffff" opacity={0.16} />
            <circle cx={9 * s} cy={7 * s} r={6 * s} fill="#6b7f3a" opacity={0.18} />
          </>
        )}
      </g>
    </g>
  );
}

/* ---------- Car ---------- */
export function Car({ x, y, dir = "x", color }: { x: number; y: number; dir?: "x" | "y"; color: string }) {
  const L = 34,
    W = 16;
  const x0 = x,
    y0 = y,
    x1 = dir === "x" ? x + L : x + W,
    y1 = dir === "x" ? y + W : y + L;
  const body = boxFaces(x0, y0, x1, y1, 8, 2);
  const cx0 = dir === "x" ? x0 + 8 : x0 + 2,
    cx1 = dir === "x" ? x1 - 6 : x1 - 2,
    cy0 = dir === "x" ? y0 + 2 : y0 + 6,
    cy1 = dir === "x" ? y1 - 2 : y1 - 8;
  const cab = boxFaces(cx0, cy0, cx1, cy1, 7, 10);
  const wheel = (gx: number, gy: number) => {
    const p = P(gx, gy, 3);
    return <ellipse key={`${gx}-${gy}`} cx={p.x} cy={p.y} rx={3.2} ry={3.4} fill="#4b3f35" />;
  };
  return (
    <g>
      <polygon points={boxFaces(x0 - 1, y0 - 1, x1 + 2, y1 + 2, 0.1).top} fill="#5b4a33" opacity={0.2} />
      {dir === "x" ? [wheel(x0 + 7, y1), wheel(x1 - 7, y1)] : [wheel(x1, y0 + 7), wheel(x1, y1 - 7)]}
      <polygon points={body.left} fill={color} {...OUT} />
      <polygon points={body.right} fill={shade(color, -0.16)} {...OUT} />
      <polygon points={body.top} fill={shade(color, 0.12)} {...OUT} />
      <polygon points={cab.left} fill="#cfe0e2" {...OUT} />
      <polygon points={cab.right} fill="#a9c1c4" {...OUT} />
      <polygon points={cab.top} fill={shade(color, 0.2)} {...OUT} />
    </g>
  );
}

/* ---------- Person ---------- */
export function Person({
  x,
  y,
  z = 0,
  shirt = "#b66d6a",
  hair = "#4b3426",
  skin = "#e8bd9a",
  scale = 1,
  sitting = false,
  laptop = false,
}: {
  x: number;
  y: number;
  z?: number;
  shirt?: string;
  hair?: string;
  skin?: string;
  scale?: number;
  sitting?: boolean;
  laptop?: boolean;
}) {
  const p = P(x, y, z);
  const bh = sitting ? 6 : 9;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${scale})`}>
      {!sitting && <ellipse cx={0} cy={0.5} rx={4.5} ry={1.8} fill="#6b5a3a" opacity={0.22} />}
      {!sitting && <rect x={-2.6} y={-4} width={5.2} height={4.2} rx={1} fill="#6d5d4d" />}
      <rect x={-3.2} y={-4 - bh} width={6.4} height={bh + 1} rx={2.4} fill={shirt} stroke={INK} strokeOpacity={0.4} strokeWidth={0.5} />
      <circle cx={0} cy={-4 - bh - 3.2} r={3.4} fill={skin} stroke={INK} strokeOpacity={0.4} strokeWidth={0.5} />
      <path d={`M-3.5 ${-4 - bh - 3.6} a3.5 3.3 0 0 1 7 0 q-3.4 -1.2 -7 0z`} fill={hair} />
      {laptop && <rect x={-1} y={-4 - bh + 3} width={7} height={4.4} rx={0.6} fill="#e9e6df" stroke={INK} strokeOpacity={0.5} strokeWidth={0.5} />}
    </g>
  );
}

/* ---------- Street furniture ---------- */
export function LampPost({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={2} cy={0.5} rx={5} ry={2} fill="#6b5a3a" opacity={0.2} />
      <path d="M0 0 L0 -40" stroke="#3f3a36" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-3 -2 L3 -2" stroke="#3f3a36" strokeWidth={3} strokeLinecap="round" />
      <rect x={-3.4} y={-48} width={6.8} height={8} rx={1.8} fill="#f8d98a" stroke="#3f3a36" strokeWidth={1} />
      <circle cx={0} cy={-44} r={9} fill="#ffe3a0" opacity={0.22} />
    </g>
  );
}

export function Bench({ x, y, dir = "x" }: { x: number; y: number; dir?: "x" | "y" }) {
  const L = 22,
    W = 7;
  const x1 = dir === "x" ? x + L : x + W;
  const y1 = dir === "x" ? y + W : y + L;
  const seat = boxFaces(x, y, x1, y1, 2.2, 6);
  const back =
    dir === "x"
      ? boxFaces(x, y, x1, y + 1.4, 7, 6)
      : boxFaces(x, y, x + 1.4, y1, 7, 6);
  return (
    <g>
      <polygon points={boxFaces(x, y, x1, y1, 0.1).top} fill="#6b5a3a" opacity={0.18} />
      <polygon points={back.left} fill="#a77a52" {...OUT} />
      <polygon points={back.right} fill="#8c6340" {...OUT} />
      <polygon points={seat.left} fill="#b78a5c" {...OUT} />
      <polygon points={seat.right} fill="#936a45" {...OUT} />
      <polygon points={seat.top} fill="#c79b6c" {...OUT} />
    </g>
  );
}

export function Planter({ x, y, flowers = "#e9a0b4", size = 1 }: { x: number; y: number; flowers?: string; size?: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y}) scale(${size})`}>
      <ellipse cx={1} cy={1} rx={8} ry={3} fill="#6b5a3a" opacity={0.18} />
      <path d="M-6 -8 L6 -8 L5 0 L-5 0Z" fill="#b9805a" stroke={INK} strokeOpacity={0.5} strokeWidth={0.7} />
      <circle cx={-3} cy={-12} r={5} fill="#8fae5a" />
      <circle cx={3.5} cy={-12} r={5.4} fill="#a9bf6a" />
      <circle cx={0} cy={-16} r={4.4} fill="#7fa354" />
      <circle cx={-4} cy={-15} r={1.8} fill={flowers} />
      <circle cx={3} cy={-17} r={1.9} fill={flowers} />
      <circle cx={5} cy={-12} r={1.6} fill="#f6e3a4" />
    </g>
  );
}

export function RoundTable({ x, y, chairs = 2 }: { x: number; y: number; chairs?: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={0} cy={1} rx={10} ry={4.6} fill="#6b5a3a" opacity={0.16} />
      {chairs >= 1 && <Chair dx={-11} dy={-1} />}
      {chairs >= 2 && <Chair dx={11} dy={-1} flip />}
      <path d="M0 0 L0 -8" stroke="#6a4a30" strokeWidth={1.8} />
      <ellipse cx={0} cy={-8.6} rx={8.4} ry={4.2} fill="#c79b6c" stroke={INK} strokeOpacity={0.55} strokeWidth={0.8} />
      <ellipse cx={-1.5} cy={-9} rx={1.8} ry={0.9} fill="#fff8ea" />
      <circle cx={2.5} cy={-9.4} r={1} fill="#8a4b34" />
    </g>
  );
}

function Chair({ dx, dy, flip }: { dx: number; dy: number; flip?: boolean }) {
  return (
    <g transform={`translate(${dx} ${dy}) ${flip ? "scale(-1 1)" : ""}`}>
      <path d="M-3 -1 L-3 -5 M3 -1 L3 -5" stroke="#6a4a30" strokeWidth={1.2} />
      <ellipse cx={0} cy={-5.5} rx={4} ry={2} fill="#b0804f" stroke={INK} strokeOpacity={0.5} strokeWidth={0.6} />
      <path d="M-3.6 -6 L-3.6 -12" stroke="#8c6340" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );
}

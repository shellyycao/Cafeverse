import raw from "./durham.json";
import { mulberry32 } from "@/lib/iso";

/**
 * Downtown Durham, NC — baked from OpenStreetMap (© OpenStreetMap contributors, ODbL)
 * by scripts/build-durham.mjs. Ground coords: gx grows WEST, gy grows NORTH (rotated map).
 */
export type Poly = Array<[number, number]>;
export type RoadClass = "m" | "p" | "s" | "t" | "r" | "v" | "x";
export type Road = { c: RoadClass; n?: string; p: Poly };
export type OsmBuilding = { p: Poly; l?: number };

export const DURHAM = raw as unknown as {
  roads: Road[];
  buildings: OsmBuilding[];
  parks: Poly[];
  water: Poly[];
  rails: Poly[];
  parkNames: Array<{ n: string; c: [number, number]; a: number }>;
};

/** road half-width in ground units, by class */
export const ROAD_HALF: Record<RoadClass, number> = { m: 36, p: 30, s: 28, t: 26, r: 20, v: 9, x: 8 };
export const ROAD_ORDER: RoadClass[] = ["v", "x", "r", "t", "s", "p", "m"];

/** Zones where zooming in reveals the hand-drawn miniature. Everything else stays a plain map. */
export type Zone = { id: string; cx: number; cy: number; label: string };
import { SITES } from "./sites";
export const ZONES: Zone[] = SITES.map((x) => ({ id: x.id, cx: x.zone[0], cy: x.zone[1], label: x.name }));
/** ground rectangles that carry a hand-drawn café block (OSM footprints inside them are hidden) */
export const PAVINGS = SITES.map((x) => x.paving);
const inPaving = (x: number, y: number, pad = 0) => PAVINGS.some(([a, b, c, d]) => x > a - pad && x < c + pad && y > b - pad && y < d + pad);

/** radius (ground units) around a zone that gets extruded miniature neighbours */
export const MINI_RADIUS = 760;

function centroid(p: Poly): [number, number] {
  let x = 0,
    y = 0;
  for (const q of p) {
    x += q[0];
    y += q[1];
  }
  return [x / p.length, y / p.length];
}

export const NEAR_BUILDINGS = DURHAM.buildings
  .map((b, i) => ({ ...b, id: i, c: centroid(b.p) }))
  .filter((b) => ZONES.some((z) => Math.hypot(b.c[0] - z.cx, b.c[1] - z.cy) < MINI_RADIUS))
  .filter((b) => polyArea(b.p) > 160)
  .filter((b) => !inPaving(b.c[0], b.c[1]));

export function polyArea(p: Poly): number {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function pointInPoly(x: number, y: number, p: Poly) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function distToRoads(x: number, y: number): number {
  let best = 1e9;
  for (const r of DURHAM.roads) {
    if (r.c === "v") continue;
    const h = ROAD_HALF[r.c];
    for (let i = 1; i < r.p.length; i++) {
      const [ax, ay] = r.p[i - 1];
      const [bx, by] = r.p[i];
      const L2 = (bx - ax) ** 2 + (by - ay) ** 2 || 1;
      const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / L2));
      const d = Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))) - h;
      if (d < best) best = d;
    }
  }
  return best;
}

/** Street trees and park trees around the miniature zone, placed off roads and out of buildings. */
export const NEAR_TREES: Array<{ x: number; y: number; s: number; kind: "round" | "bloom" }> = (() => {
  const rnd = mulberry32(4242);
  const out: Array<{ x: number; y: number; s: number; kind: "round" | "bloom" }> = [];
  const cafeBlock = (x: number, y: number) => inPaving(x, y, 8);
  const ok = (x: number, y: number) =>
    !cafeBlock(x, y) &&
    ZONES.some((z) => Math.hypot(x - z.cx, y - z.cy) < MINI_RADIUS) &&
    distToRoads(x, y) > 6 &&
    !NEAR_BUILDINGS.some((b) => pointInPoly(x, y, b.p));
  for (const b of NEAR_BUILDINGS) {
    if (rnd() > 0.34) continue;
    const e = Math.floor(rnd() * b.p.length);
    const [ax, ay] = b.p[e];
    const [bx, by] = b.p[(e + 1) % b.p.length];
    const t = rnd();
    const mx = ax + (bx - ax) * t;
    const my = ay + (by - ay) * t;
    const L = Math.hypot(bx - ax, by - ay) || 1;
    const off = (polyArea(b.p) > 0 ? 1 : -1) * (13 + rnd() * 9);
    const x = Math.round(mx + (-(by - ay) / L) * -off);
    const y = Math.round(my + ((bx - ax) / L) * -off);
    if (ok(x, y)) out.push({ x, y, s: 0.8 + rnd() * 0.45, kind: rnd() > 0.88 ? "bloom" : "round" });
  }
  for (const park of DURHAM.parks) {
    const [cx, cy] = centroid(park);
    if (!ZONES.some((z) => Math.hypot(cx - z.cx, cy - z.cy) < MINI_RADIUS + 200)) continue;
    const xs = park.map((p) => p[0]);
    const ys = park.map((p) => p[1]);
    for (let k = 0; k < 40; k++) {
      const x = Math.min(...xs) + rnd() * (Math.max(...xs) - Math.min(...xs));
      const y = Math.min(...ys) + rnd() * (Math.max(...ys) - Math.min(...ys));
      if (pointInPoly(x, y, park) && ok(x, y) === true) out.push({ x: Math.round(x), y: Math.round(y), s: 0.9 + rnd() * 0.6, kind: "round" });
    }
  }
  return out;
})();

export const CAFE_FOOTPRINT = { x0: 184, y0: 114, x1: 344, y1: 258, h: 70 };

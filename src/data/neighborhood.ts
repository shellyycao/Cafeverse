import { mulberry32 } from "@/lib/iso";

/**
 * Fictional demonstration neighbourhood (inspired by Durham, NC — NOT a real map).
 * All street/POI names are invented for the prototype.
 */
export const ROAD_X = [-800, -400, 0, 400, 800]; // roads running along gy
export const ROAD_Y = [-600, -300, 0, 300, 600]; // roads running along gx
export const ROAD_W = 56;
export const HIGHWAY_Y = 600;
export const HIGHWAY_W = 110;

export const WORLD = { gxMin: -1100, gxMax: 1100, gyMin: -900, gyMax: 900 };

export const STREETS_X = [
  { at: -800, name: "Alder Ln" },
  { at: -400, name: "Hillandale Rd" },
  { at: 0, name: "Maple Ave" },
  { at: 400, name: "Albemarle Ave" },
  { at: 800, name: "Fern St" },
];
export const STREETS_Y = [
  { at: -600, name: "Old Mill Rd" },
  { at: -300, name: "Club Blvd" },
  { at: 0, name: "Wilson St" },
  { at: 300, name: "Main St" },
  { at: 600, name: "Route 15" },
];

export type BuildingKind = "shop" | "house" | "block" | "civic";
export type Building = {
  id: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h: number;
  wall: string;
  roof: string;
  kind: BuildingKind;
  /** drawn with windows/awnings when zoomed in */
  detail: boolean;
};

export type Block = { i: number; j: number; x0: number; y0: number; x1: number; y1: number };

const WALLS = ["#ecdcc0", "#e8cdb4", "#dfd2b4", "#e6c7b8", "#d9d3b6", "#efe0c8", "#d8bfa0"];
const ROOFS = ["#d8c7a6", "#cdb995", "#d9bfae", "#c9c4a4", "#d4c2a0"];

export const CAFE_BLOCK = { i: 2, j: 2 };
export const CAFE_FOOTPRINT = { x0: 196, y0: 128, x1: 340, y1: 256, h: 58 };

export const BLOCKS: Block[] = [];
for (let i = 0; i < ROAD_X.length - 1; i++) {
  for (let j = 0; j < ROAD_Y.length - 1; j++) {
    const hw = ROAD_W / 2;
    const yTop = ROAD_Y[j] + (ROAD_Y[j] === HIGHWAY_Y ? HIGHWAY_W / 2 : hw);
    const yBot = ROAD_Y[j + 1] - (ROAD_Y[j + 1] === HIGHWAY_Y ? HIGHWAY_W / 2 : hw);
    BLOCKS.push({ i, j, x0: ROAD_X[i] + hw, x1: ROAD_X[i + 1] - hw, y0: yTop, y1: yBot });
  }
}

/** Park block(s) in the back-left of the map. */
export const PARKS = [
  { x0: -772, y0: 328, x1: -428, y1: 572, name: "Greenway Park" },
];
export const POND = { cx: -600, cy: 440, rx: 110, ry: 62 };

function isPark(b: Block) {
  return b.i === 0 && b.j === 3;
}

export const BUILDINGS: Building[] = [];
export const TREES: Array<{ x: number; y: number; s: number; kind: "round" | "bloom" }> = [];

(function generate() {
  const rnd = mulberry32(20240607);
  for (const b of BLOCKS) {
    const isCafeBlock = b.i === CAFE_BLOCK.i && b.j === CAFE_BLOCK.j;
    const near = Math.abs(b.i - CAFE_BLOCK.i) <= 1 && Math.abs(b.j - CAFE_BLOCK.j) <= 1;
    const bw = b.x1 - b.x0;
    const bh = b.y1 - b.y0;

    if (isPark(b)) continue;

    if (isCafeBlock) {
      const f = CAFE_FOOTPRINT;
      BUILDINGS.push({
        id: "cafe",
        x0: f.x0,
        y0: f.y0,
        x1: f.x1,
        y1: f.y1,
        h: f.h,
        wall: "#c58f6c",
        roof: "#d8c7a6",
        kind: "shop",
        detail: true,
      });
      // a small neighbour behind the café
      BUILDINGS.push({
        id: "cb-1",
        x0: 150,
        y0: 40,
        x1: 346,
        y1: 104,
        h: 36,
        wall: "#e8d3b8",
        roof: "#d4c2a0",
        kind: "house",
        detail: true,
      });
      TREES.push({ x: 90, y: 74, s: 1.1, kind: "round" }, { x: 60, y: 120, s: 0.9, kind: "round" });
      TREES.push({ x: 352, y: 120, s: 1.05, kind: "bloom" });
      continue;
    }

    // Subdivide block into lots along its longer side
    const alongX = bw >= bh;
    const n = 2 + Math.floor(rnd() * 2);
    const total = alongX ? bw : bh;
    let cursor = alongX ? b.x0 : b.y0;
    for (let k = 0; k < n; k++) {
      const len = total / n;
      const gapA = 8 + rnd() * 10;
      const depth = (alongX ? bh : bw) * (0.42 + rnd() * 0.3);
      const h = 10 + Math.floor(rnd() * 18);
      const offset = 12 + rnd() * 12;
      const kind: BuildingKind = rnd() > 0.65 ? "block" : rnd() > 0.4 ? "shop" : "house";
      let x0: number, y0: number, x1: number, y1: number;
      if (alongX) {
        x0 = cursor + gapA / 2;
        x1 = cursor + len - gapA / 2;
        y0 = b.y0 + offset;
        y1 = y0 + depth;
      } else {
        y0 = cursor + gapA / 2;
        y1 = cursor + len - gapA / 2;
        x0 = b.x0 + offset;
        x1 = x0 + depth;
      }
      cursor += len;
      if (rnd() < 0.12) continue; // leave a gap/lawn
      BUILDINGS.push({
        id: `b${b.i}-${b.j}-${k}`,
        x0,
        y0,
        x1,
        y1,
        h,
        wall: WALLS[Math.floor(rnd() * WALLS.length)],
        roof: ROOFS[Math.floor(rnd() * ROOFS.length)],
        kind,
        detail: near,
      });
      // tree beside building
      if (rnd() > 0.35) {
        TREES.push({
          x: alongX ? x0 + rnd() * (x1 - x0) : x1 + 14 + rnd() * 20,
          y: alongX ? y1 + 14 + rnd() * 20 : y0 + rnd() * (y1 - y0),
          s: 0.8 + rnd() * 0.5,
          kind: rnd() > 0.85 ? "bloom" : "round",
        });
      }
    }
  }

  // Park trees
  for (const p of PARKS) {
    for (let k = 0; k < 46; k++) {
      const x = p.x0 + 16 + rnd() * (p.x1 - p.x0 - 32);
      const y = p.y0 + 16 + rnd() * (p.y1 - p.y0 - 32);
      const dx = (x - POND.cx) / (POND.rx + 22);
      const dy = (y - POND.cy) / (POND.ry + 22);
      if (dx * dx + dy * dy < 1) continue;
      TREES.push({ x, y, s: 0.9 + rnd() * 0.7, kind: "round" });
    }
  }
  // Street trees along highway green belt
  for (let x = -1000; x < 1000; x += 70 + rnd() * 40) {
    TREES.push({ x, y: HIGHWAY_Y + HIGHWAY_W / 2 + 34 + rnd() * 18, s: 0.8 + rnd() * 0.4, kind: "round" });
  }
})();

export const MAP_POIS = [
  { id: "cafe", label: "Cafeverse", gx: 268, gy: 192, z: 78, tone: "cafe" as const },
  { id: "park", label: "Greenway Park", gx: -600, gy: 500, z: 0, tone: "park" as const },
  { id: "library", label: "Fern Library", gx: 600, gy: -150, z: 30, tone: "civic" as const },
  { id: "clinic", label: "Mill Clinic", gx: -200, gy: -450, z: 30, tone: "health" as const },
  { id: "bakery", label: "Rye & Rose Bakery", gx: 620, gy: 140, z: 30, tone: "shop" as const },
];

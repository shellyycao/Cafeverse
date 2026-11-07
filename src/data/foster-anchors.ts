import { P } from "@/lib/iso";
import { CAFE_FOOTPRINT as F } from "@/data/durham";

/**
 * Registration for the illustrated interior. ONE canvas, shared by the reference screenshot, the alignment
 * template and the final `interior-base.png`: 2040 × 1620 px = 340 × 270 world units at 6 px / unit.
 */
export const CANVAS = { x: -190, y: -290, w: 340, h: 270, px: 6, width: 2040, height: 1620 } as const;
export const BASE_IMAGE = "/assets/foster/interior-base.png";
export const canvasPx = (wx: number, wy: number) => ({ x: Math.round((wx - CANVAS.x) * CANVAS.px), y: Math.round((wy - CANVAS.y) * CANVAS.px) });

export type Anchor = { id: string; kind: "seat" | "stand" | "prop" | "door"; note: string; px: [number, number] };

/**
 * Anchors measured on the authored illustration (interior-base.png, canvas pixels).
 * Seats = where a seated figure's hips rest; standing figures use their feet. Approximate — fine-tuned in Gate 2.
 */
export const ANCHORS: Anchor[] = [
  { id: "barista", kind: "stand", note: "behind the service counter, near the espresso machine", px: [1401, 832] },
  { id: "counter-front", kind: "stand", note: "where a customer stands at the counter", px: [1346, 938] },
  { id: "pastry-case", kind: "prop", note: "centre of the glass pastry display", px: [1231, 836] },
  { id: "lounge-1", kind: "seat", note: "leather armchair (right)", px: [707, 707] },
  { id: "lounge-2", kind: "seat", note: "leather armchair (left)", px: [568, 745] },
  { id: "window-seat-1", kind: "seat", note: "window-bar stool 1 (left end)", px: [313, 1050] },
  { id: "window-seat-2", kind: "seat", note: "window-bar stool 2", px: [422, 1099] },
  { id: "window-seat-3", kind: "seat", note: "window-bar stool 3", px: [537, 1149] },
  { id: "window-seat-4", kind: "seat", note: "window-bar stool 4", px: [636, 1197] },
  { id: "window-seat-5", kind: "seat", note: "window-bar stool 5 (door end)", px: [755, 1258] },
  { id: "tableA-back", kind: "seat", note: "left table, back chair", px: [415, 968] },
  { id: "tableA-front", kind: "seat", note: "left table, front chair", px: [537, 990] },
  { id: "tableB-back", kind: "seat", note: "middle table, back chair", px: [789, 982] },
  { id: "tableB-front", kind: "seat", note: "middle table, front chair", px: [891, 1006] },
  { id: "tableC-back", kind: "seat", note: "front table, back chair", px: [782, 1163] },
  { id: "tableC-front", kind: "seat", note: "front table, front chair", px: [884, 1183] },
  { id: "door", kind: "door", note: "glass entrance", px: [1170, 1278] },
];

export const anchorCanvas = (a: Anchor) => {
  const [x, y] = a.px;
  return { x, y, nx: +(x / CANVAS.width).toFixed(4), ny: +(y / CANVAS.height).toFixed(4), world: { x: CANVAS.x + x / CANVAS.px, y: CANVAS.y + y / CANVAS.px } };
};

const X = F.x0;
const Y = F.y0;

/** Footprints of the SVG fallback's main objects (kept for the template of the old layout) (ground rectangles), for the alignment template. */
export const OBJECTS: Array<{ id: string; label: string; rect: [number, number, number, number]; h: number }> = [
  { id: "counter", label: "service counter", rect: [X + 68, Y + 14, X + 126, Y + 31], h: 17 },
  { id: "case", label: "glass pastry display", rect: [X + 80, Y + 44, X + 118, Y + 59], h: 30 },
  { id: "retail", label: "retail table", rect: [X + 44, Y + 46, X + 66, Y + 57], h: 14 },
  { id: "fridge", label: "fridge", rect: [X + 4, Y + 2, X + 20, Y + 13], h: 42 },
  { id: "window-bar", label: "window bar + stools", rect: [X + 12, F.y1 - 11, X + 118, F.y1 - 3], h: 16 },
  { id: "divider", label: "wood divider w/ plants", rect: [X + 6, Y + 99, X + 66, Y + 106], h: 19 },
  { id: "lounge", label: "lounge (2 armchairs + coffee table)", rect: [X + 4, Y + 54, X + 36, Y + 94], h: 0 },
  { id: "table1", label: "table 1", rect: [X + 88, Y + 72, X + 104, Y + 88], h: 13 },
  { id: "table2", label: "table 2", rect: [X + 124, Y + 88, X + 140, Y + 104], h: 13 },
  { id: "table3", label: "table 3", rect: [X + 64, Y + 90, X + 80, Y + 106], h: 13 },
];

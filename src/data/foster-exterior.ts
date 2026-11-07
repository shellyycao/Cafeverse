import { P, pts } from "@/lib/iso";
import { CAFE_FOOTPRINT as F } from "@/data/durham";

/**
 * Registration for the illustrated NEIGHBOURHOOD ("mid-zoom") scene around the café.
 * One canvas shared by the reference render, the alignment template and the final `exterior-base.png`:
 * 2400 × 1425 px = 640 × 380 world units at 3.75 px / unit.
 */
export const EXT = { x: -370, y: -390, w: 640, h: 380, px: 3.75, width: 2400, height: 1425 } as const;
export const EXT_IMAGE = "/assets/foster/exterior-base.png";
export const extPx = (wx: number, wy: number) => ({ x: Math.round((wx - EXT.x) * EXT.px), y: Math.round((wy - EXT.y) * EXT.px) });
export const groundToExt = (gx: number, gy: number, z = 0) => {
  const p = P(gx, gy, z);
  return { ...extPx(p.x, p.y), world: p };
};

export type ExtLandmark = { id: string; note: string; ground: [number, number, number] };
/** Where things stand on the café block (ground coords: gx grows west, gy grows north; see scripts/build-durham.mjs). */
export const EXT_LANDMARKS: ExtLandmark[] = [
  { id: "cafe-door", note: "glass entrance under the black canopy (Corporation St side, left facade)", ground: [272, 258, 0] },
  { id: "oval-sign", note: "black oval hanging sign beside the door", ground: [268, 267, 38] },
  { id: "cafe-corner", note: "street corner of the café (Foster × Corporation)", ground: [344, 258, 0] },
  { id: "bus-stop", note: "illustrative bus shelter on the Foster St sidewalk", ground: [360, 88, 0] },
  { id: "parking-kiosk-1", note: "pay-by-space kiosk on the Corporation St sidewalk", ground: [120, 271, 0] },
  { id: "parking-kiosk-2", note: "pay-by-space kiosk", ground: [226, 271, 0] },
  { id: "parking-kiosk-3", note: "pay-by-space kiosk on Foster St", ground: [369, 150, 0] },
  { id: "lamp-corner", note: "street lamp at the café corner", ground: [366, 262, 0] },
  { id: "lot-entrance", note: "small surface lot beside the café", ground: [110, 232, 0] },
];

/** ground rectangles / polygons for the alignment template */
export const EXT_ZONES: Array<{ id: string; label: string; poly: Array<[number, number, number?]>; color: string }> = [
  { id: "block", label: "café block (paving + sidewalk) — everything inside belongs to the image", poly: [[28, 28], [372, 28], [372, 272], [28, 272]], color: "#b9770e" },
  { id: "cafe", label: "café building (ground floor, brick, black frames)", poly: [[F.x0, F.y0], [F.x1, F.y0], [F.x1, F.y1], [F.x0, F.y1]], color: "#c4566b" },
  { id: "warehouse", label: "taller brick apartment building behind the café", poly: [[96, 36], [372, 36], [372, 112], [96, 112]], color: "#8a4a3a" },
  { id: "lot", label: "small surface parking lot (empty, painted bays)", poly: [[42, 196], [176, 196], [176, 268], [42, 268]], color: "#5b6b7a" },
  { id: "bus", label: "bus stop pad", poly: [[346, 62], [372, 62], [372, 114], [346, 114]], color: "#2f6aa8" },
];

/** silhouette of the café building (walls + roof) used to cut a hole when you zoom inside */
export const CAFE_CUTOUT = pts([[F.x0 - 6, F.y1 + 16, 0], [F.x0 - 6, F.y1 + 16, F.h + 30], [F.x0 - 6, F.y0 - 8, F.h + 30], [F.x1 + 6, F.y0 - 8, F.h + 30], [F.x1 + 6, F.y0 - 8, 0], [F.x1 + 16, F.y1 + 16, 0]]);

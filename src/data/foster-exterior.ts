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

/**
 * The café is the GROUND FLOOR of a long multi-storey brick mixed-use building (see the user's surroundings reference).
 * Massing used for the template: a two-storey brick podium along W Corporation St (the café storefront is the
 * gx 184…344 stretch of it, with a roof terrace above), taller residential volumes behind and at the left end,
 * a garage entrance at the left end (website: "Liberty Warehouse Garage — enter on Corporation Street"),
 * No bus stop: there is none next to the café (it must not be invented). Street parking is on the street, not in a lot.
 */
export const PODIUM = { x0: 40, x1: 372, y0: 108, y1: 258, h: 70 };
export const CAFE_SEGMENT = { x0: F.x0, x1: F.x1, y0: F.y0, y1: F.y1 };

export const EXT_LANDMARKS: ExtLandmark[] = [
  { id: "cafe-door", note: "glass double door in the café storefront, under the black canopy", ground: [264, 258, 0] },
  { id: "oval-sign", note: "black oval hanging sign beside the door", ground: [248, 262, 42] },
  { id: "cafe-corner", note: "east end of the café storefront, toward the Foster St corner", ground: [344, 258, 0] },
  { id: "roof-terrace", note: "planted roof terrace on top of the podium above the café", ground: [264, 180, 70] },
  { id: "garage-entrance", note: "Liberty Warehouse Garage entrance (Corporation St side, left end of the building)", ground: [84, 258, 0] },
  { id: "pay-kiosk-1", note: "pay-by-space kiosk on the Corporation St sidewalk", ground: [300, 268, 0] },
  { id: "pay-kiosk-2", note: "pay-by-space kiosk (left)", ground: [150, 268, 0] },
  { id: "bike-rack", note: "bike rack in front of the café windows", ground: [214, 268, 0] },
  { id: "street-tree-1", note: "street tree slot (left)", ground: [96, 270, 0] },
  { id: "street-tree-2", note: "street tree slot (in front of the café, between windows)", ground: [232, 271, 0] },
  { id: "street-tree-3", note: "street tree slot (near the corner)", ground: [326, 270, 0] },
];

/** footprints + heights used for the template and the massing reference (ground units) */
export const EXT_ZONES: Array<{ id: string; label: string; poly: Array<[number, number, number?]>; color: string; h?: number }> = [
  { id: "block", label: "café block — paint inside, leave outside transparent", poly: [[28, 28], [372, 28], [372, 272], [28, 272]], color: "#b9770e" },
  { id: "podium", label: "2-storey brick podium (café is its ground floor)", poly: [[PODIUM.x0, PODIUM.y0], [PODIUM.x1, PODIUM.y0], [PODIUM.x1, PODIUM.y1], [PODIUM.x0, PODIUM.y1]], color: "#8a4a3a", h: PODIUM.h },
  { id: "cafe-storefront", label: "café storefront + interior cutout area", poly: [[CAFE_SEGMENT.x0, CAFE_SEGMENT.y0], [CAFE_SEGMENT.x1, CAFE_SEGMENT.y0], [CAFE_SEGMENT.x1, CAFE_SEGMENT.y1], [CAFE_SEGMENT.x0, CAFE_SEGMENT.y1]], color: "#c4566b", h: PODIUM.h },
  { id: "tower-back", label: "taller residential volume behind (4 storeys)", poly: [[96, 36], [372, 36], [372, 108], [96, 108]], color: "#6b4a3a", h: 96 },
  { id: "tower-left", label: "taller residential volume at the left end", poly: [[40, 108], [128, 108], [128, 200], [40, 200]], color: "#6b4a3a", h: 96 },
];

/** height (world units) of the hole cut for the interior — about the height of the cutaway box, so the building above it stays */
const CUT_H = 60;
/** silhouette of the café building (walls + roof) used to cut a hole when you zoom inside */
export const CAFE_CUTOUT = pts([[F.x0 - 6, F.y1 + 16, 0], [F.x0 - 6, F.y1 + 16, CUT_H], [F.x0 - 6, F.y0 - 8, CUT_H], [F.x1 + 6, F.y0 - 8, CUT_H], [F.x1 + 6, F.y0 - 8, 0], [F.x1 + 16, F.y1 + 16, 0]]);

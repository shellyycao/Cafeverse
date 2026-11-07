/**
 * Ground-plane -> screen-world projection (2:1 dimetric).
 * Ground coords (gx, gy, z) are in "units"; the café corner anchor maps to (0,0)
 * so that camera coordinates stay small and the café is the origin of the world.
 */
export const ANCHOR = { gx: 400, gy: 300 };

export type Pt = { x: number; y: number };

export function P(gx: number, gy: number, z = 0): Pt {
  return {
    x: gx - gy - (ANCHOR.gx - ANCHOR.gy),
    y: (gx + gy) / 2 - (ANCHOR.gx + ANCHOR.gy) / 2 - z,
  };
}

export function pts(list: Array<[number, number, number?]>): string {
  return list
    .map(([gx, gy, z]) => {
      const p = P(gx, gy, z ?? 0);
      return `${round(p.x)},${round(p.y)}`;
    })
    .join(" ");
}

export function rectPts(x0: number, y0: number, x1: number, y1: number, z = 0): string {
  return pts([
    [x0, y0, z],
    [x1, y0, z],
    [x1, y1, z],
    [x0, y1, z],
  ]);
}

/** Visible faces of an axis-aligned box seen from the +gx/+gy side. */
export function boxFaces(x0: number, y0: number, x1: number, y1: number, h: number, z0 = 0) {
  const z1 = z0 + h;
  return {
    top: pts([
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ]),
    /** faces +gy (screen: lower-left) */
    left: pts([
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y1, z1],
      [x0, y1, z1],
    ]),
    /** faces +gx (screen: lower-right) */
    right: pts([
      [x1, y1, z0],
      [x1, y0, z0],
      [x1, y0, z1],
      [x1, y1, z1],
    ]),
  };
}

export function round(n: number) {
  return Math.round(n * 100) / 100;
}

/** Screen angle (deg) of a ground direction vector, normalised to read left-to-right. */
export function screenAngle(dgx: number, dgy: number): number {
  const dx = dgx - dgy;
  const dy = (dgx + dgy) / 2;
  let a = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (a > 90) a -= 180;
  if (a < -90) a += 180;
  return a;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

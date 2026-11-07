/**
 * Bakes OpenStreetMap data (© OpenStreetMap contributors, ODbL) for downtown Durham, NC
 * into a compact local JSON in the app's ground coordinate system.
 *   node scripts/build-durham.mjs
 * Runtime never calls a map API; the app only reads src/data/durham.json.
 */
import fs from "fs";

const osm = JSON.parse(fs.readFileSync("data-raw/durham-osm.json", "utf8"));
const lat0 = 35.998, lon0 = -78.9;
const mx = (lon) => (lon - lon0) * 111320 * Math.cos((lat0 * Math.PI) / 180);
const my = (lat) => (lat - lat0) * 110574;

// Café block A (Foster Street Coffee, 530 Foster St) in metres:
// W = Foster St, N = W Corporation St, S/E = the next streets over.
const BLK = { x0: -144, x1: 2, y0: 326, y1: 446 };
const kx = 400 / (BLK.x1 - BLK.x0);
const ky = 300 / (BLK.y1 - BLK.y0);
// Map is rotated 90deg so the café's visible faces front Foster St and Corporation St:
// gx grows WEST (Foster St = gx 400), gy grows NORTH (Corporation St = gy 300). Proper rotation, not a mirror.
const G = (lon, lat) => [Math.round((BLK.x1 - mx(lon)) * kx), Math.round((my(lat) - BLK.y0) * ky)];

const WIN = { gx0: -1700, gx1: 2100, gy0: -1600, gy1: 1900 };
const inWin = (p) => p[0] > WIN.gx0 && p[0] < WIN.gx1 && p[1] > WIN.gy0 && p[1] < WIN.gy1;
const CAFE_ZONE = { cx: 200, cy: 150 };

/** closed rings repeat the first point; drop it so the simplifier has a real baseline */
function ring(pts, tol) {
  const open = pts.slice(0, -1);
  const s = simplify(open, tol);
  return s.length >= 3 ? s : open;
}

function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pts[i], [ax, ay] = pts[a], [bx, by] = pts[b];
      const L = Math.hypot(bx - ax, by - ay) || 1;
      const dd = Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / L;
      if (dd > md) { md = dd; mi = i; }
    }
    if (md > tol && mi > 0) { keep[mi] = true; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const CLASS = { motorway: "m", motorway_link: "m", trunk: "m", trunk_link: "m", primary: "p", primary_link: "p", secondary: "s", tertiary: "t", tertiary_link: "t", residential: "r", unclassified: "r", living_street: "r", service: "v", pedestrian: "x" };

const out = { roads: [], buildings: [], parks: [], water: [], rails: [], parkNames: [] };
for (const w of osm.elements) {
  const t = w.tags || {};
  const pts = (w.geometry || []).map((p) => G(p.lon, p.lat));
  if (pts.length < 2 || !pts.some(inWin)) continue;
  if (t.highway && CLASS[t.highway]) {
    const c = CLASS[t.highway];
    const d = Math.hypot(pts[0][0] - CAFE_ZONE.cx, pts[0][1] - CAFE_ZONE.cy);
    if (c === "v" && d > 1100) continue; // drop far-away service lanes
    out.roads.push({ c, n: t.name || undefined, p: simplify(pts, 2) });
  } else if (t.building) {
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    if (cx > 26 && cx < 374 && cy > 26 && cy < 274) continue; // replaced by the hand-drawn café block
    const lv = parseFloat(t["building:levels"] || "") || (t.height ? parseFloat(t.height) / 3.4 : 0);
    out.buildings.push({ p: ring(pts, 1.2), l: lv ? Math.round(lv) : undefined });
  } else if (t.leisure) {
    out.parks.push(ring(pts, 2));
    if (t.name && /park|green|garden|plaza/i.test(t.name + " " + t.leisure)) {
      const cx = Math.round(pts.reduce((a, p) => a + p[0], 0) / pts.length);
      const cy = Math.round(pts.reduce((a, p) => a + p[1], 0) / pts.length);
      let area = 0;
      for (let i = 0; i < pts.length - 1; i++) area += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1];
      out.parkNames.push({ n: t.name, c: [cx, cy], a: Math.round(Math.abs(area) / 2) });
    }
  }
  else if (t.natural === "water") out.water.push(ring(pts, 2));
  else if (t.railway) out.rails.push(simplify(pts, 2));
}
fs.writeFileSync("src/data/durham.json", JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])), (fs.statSync("src/data/durham.json").size / 1024).toFixed(0) + " KB");

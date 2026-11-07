import { memo } from "react";
import { P, pts, rectPts, screenAngle, round } from "@/lib/iso";
import {
  BLOCKS,
  BUILDINGS,
  HIGHWAY_W,
  HIGHWAY_Y,
  MAP_POIS,
  PARKS,
  POND,
  ROAD_W,
  ROAD_X,
  ROAD_Y,
  STREETS_X,
  STREETS_Y,
  TREES,
  WORLD,
} from "@/data/neighborhood";
import { BuildingShape, Tree } from "@/components/scene/primitives";

const C = {
  ground: "#f3e8d3",
  block: "#f0e3c8",
  walk: "#f8f0df",
  road: "#fcf8ee",
  roadEdge: "#e3d2b0",
  hwy: "#dcd6c8",
  park: "#d8e2b6",
  parkLight: "#e3ebc4",
  water: "#bdd6d6",
};

function ellipsePts(cx: number, cy: number, rx: number, ry: number, n = 36) {
  return pts(
    Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2;
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as [number, number];
    }),
  );
}

const roadRects: Array<{ x0: number; y0: number; x1: number; y1: number; hwy?: boolean }> = [
  ...ROAD_X.map((x) => ({ x0: x - ROAD_W / 2, x1: x + ROAD_W / 2, y0: WORLD.gyMin, y1: WORLD.gyMax })),
  ...ROAD_Y.map((y) => {
    const hwy = y === HIGHWAY_Y;
    const w = hwy ? HIGHWAY_W : ROAD_W;
    return { x0: WORLD.gxMin, x1: WORLD.gxMax, y0: y - w / 2, y1: y + w / 2, hwy };
  }),
];

function BaseMapImpl() {
  const depthSorted = [
    ...BUILDINGS.map((b) => ({ d: (b.x0 + b.x1 + b.y0 + b.y1) / 2, el: <BuildingShape key={b.id} b={b} detail={false} /> })),
    ...TREES.map((t, i) => ({ d: t.x + t.y + 6, el: <Tree key={`t${i}`} {...t} /> })),
  ].sort((a, b) => a.d - b.d);

  return (
    <g>
      {/* ground */}
      <polygon points={rectPts(WORLD.gxMin - 400, WORLD.gyMin - 400, WORLD.gxMax + 400, WORLD.gyMax + 400)} fill={C.ground} />

      {/* blocks + sidewalk ring */}
      {BLOCKS.map((b) => (
        <g key={`${b.i}-${b.j}`}>
          <polygon points={rectPts(b.x0, b.y0, b.x1, b.y1)} fill={C.walk} />
          <polygon points={rectPts(b.x0 + 12, b.y0 + 12, b.x1 - 12, b.y1 - 12)} fill={(b.i * 3 + b.j * 5) % 4 === 0 ? "#e4ebc2" : C.block} />
        </g>
      ))}

      {/* parks */}
      {PARKS.map((p) => (
        <g key={p.name}>
          <polygon points={rectPts(p.x0, p.y0, p.x1, p.y1)} fill={C.park} />
          <polygon points={ellipsePts((p.x0 + p.x1) / 2 + 80, (p.y0 + p.y1) / 2 - 30, 150, 90)} fill={C.parkLight} opacity={0.7} />
          <polygon points={ellipsePts(POND.cx, POND.cy, POND.rx, POND.ry)} fill={C.water} stroke="#8fb5ba" strokeWidth={1.2} strokeDasharray="3 3" />
        </g>
      ))}

      {/* roads: edges, fills, centre dashes, intersections */}
      {roadRects.map((r, i) => (
        <polygon key={`e${i}`} points={rectPts(r.x0 - 3, r.y0 - 3, r.x1 + 3, r.y1 + 3)} fill={C.roadEdge} />
      ))}
      {roadRects.map((r, i) => (
        <polygon key={`f${i}`} points={rectPts(r.x0, r.y0, r.x1, r.y1)} fill={r.hwy ? C.hwy : C.road} />
      ))}
      {/* highway green belts */}
      {[-1, 1].map((s) => (
        <polygon
          key={s}
          points={rectPts(
            WORLD.gxMin,
            s < 0 ? HIGHWAY_Y - HIGHWAY_W / 2 - 4 - 24 : HIGHWAY_Y + HIGHWAY_W / 2 + 4,
            WORLD.gxMax,
            s < 0 ? HIGHWAY_Y - HIGHWAY_W / 2 - 4 : HIGHWAY_Y + HIGHWAY_W / 2 + 4 + 24,
          )}
          fill="#cfdca8"
        />
      ))}
      {ROAD_X.map((x) => (
        <polyline
          key={`cx${x}`}
          points={pts([
            [x, WORLD.gyMin],
            [x, WORLD.gyMax],
          ])}
          stroke="#e8d7a8"
          strokeWidth={1.6}
          strokeDasharray="14 12"
          fill="none"
        />
      ))}
      {ROAD_Y.map((y) => (
        <polyline
          key={`cy${y}`}
          points={pts([
            [WORLD.gxMin, y],
            [WORLD.gxMax, y],
          ])}
          stroke={y === HIGHWAY_Y ? "#f4efe2" : "#e8d7a8"}
          strokeWidth={y === HIGHWAY_Y ? 2.2 : 1.6}
          strokeDasharray={y === HIGHWAY_Y ? "20 14" : "14 12"}
          fill="none"
        />
      ))}
      {ROAD_X.flatMap((x) =>
        ROAD_Y.map((y) => {
          const w = y === HIGHWAY_Y ? HIGHWAY_W : ROAD_W;
          return <polygon key={`i${x}${y}`} points={rectPts(x - ROAD_W / 2, y - w / 2, x + ROAD_W / 2, y + w / 2)} fill={y === HIGHWAY_Y ? C.hwy : C.road} />;
        }),
      )}

      {/* buildings + trees (depth sorted) */}
      {depthSorted.map((d) => d.el)}

      {/* street names */}
      <g className="street-labels" fontFamily="var(--font-geist-sans), system-ui" fontSize={19} fontWeight={600} fill="#8a7255" letterSpacing={1.2}>
        {STREETS_Y.flatMap((s) =>
          [-650, 700].map((gx) => {
            const p = P(gx, s.at);
            const a = screenAngle(1, 0);
            return (
              <text key={`${s.name}${gx}`} transform={`translate(${round(p.x)} ${round(p.y)}) rotate(${a})`} textAnchor="middle" dy={6} opacity={0.85}>
                {s.name}
              </text>
            );
          }),
        )}
        {STREETS_X.flatMap((s) =>
          [-450, 450].map((gy) => {
            const p = P(s.at, gy);
            const a = screenAngle(0, -1);
            return (
              <text key={`${s.name}${gy}`} transform={`translate(${round(p.x)} ${round(p.y)}) rotate(${a})`} textAnchor="middle" dy={6} opacity={0.85}>
                {s.name}
              </text>
            );
          }),
        )}
      </g>

      {/* POI labels (counter-scaled so they stay legible) */}
      <g className="poi-labels">
        {MAP_POIS.filter((p) => p.id !== "cafe").map((p) => {
          const pt = P(p.gx, p.gy, p.z);
          return (
            <g key={p.id} style={{ transform: `translate(${pt.x}px, ${pt.y}px) scale(calc(1 / var(--z)))` }}>
              <circle r={5} fill={p.tone === "park" ? "#8fae5a" : p.tone === "health" ? "#d46a62" : p.tone === "shop" ? "#e08a4a" : "#8a8fb0"} stroke="#fff" strokeWidth={2} />
              <text x={10} y={4} fontSize={12.5} fontWeight={600} fill="#7a6048" stroke="#f5ecd8" strokeWidth={3} paintOrder="stroke" fontFamily="var(--font-geist-sans), system-ui">
                {p.label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

export const BaseMap = memo(BaseMapImpl);
export default BaseMap;

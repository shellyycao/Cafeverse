import type { ReactNode } from "react";
import { P, boxFaces, pts, rectPts } from "@/lib/iso";
import { INK } from "@/lib/color";
import { BUILDINGS, TREES } from "@/data/neighborhood";
import { Bench, BuildingShape, Car, LampPost, Person, Planter, RoundTable, Tree } from "./primitives";
import CafeExterior from "./Cafe";
import { Pin } from "./Pin";
import { useMapGesture } from "@/components/map/MapViewport";

export type HotspotId = "cafe" | "parking" | "bus";

const PAVE = "#ecdcbd";

/** Ground-level detail: paving, lot, crosswalks, lane marks. */
function GroundPatch() {
  const bays = Array.from({ length: 7 }, (_, k) => 48 + k * 20);
  return (
    <g>
      {/* paved plaza (café block) */}
      <polygon points={rectPts(30, 30, 370, 270)} fill={PAVE} />
      {/* tile lines */}
      {Array.from({ length: 17 }).map((_, k) => (
        <polyline key={`tx${k}`} points={pts([[30 + k * 20, 30], [30 + k * 20, 270]])} stroke="#d9c6a0" strokeWidth={0.5} opacity={0.6} />
      ))}
      {Array.from({ length: 12 }).map((_, k) => (
        <polyline key={`ty${k}`} points={pts([[30, 30 + k * 20], [370, 30 + k * 20]])} stroke="#d9c6a0" strokeWidth={0.5} opacity={0.6} />
      ))}
      {/* garden / lawn behind the café */}
      <polygon points={rectPts(40, 40, 140, 140)} fill="#cfdca0" />
      <polygon points={rectPts(40, 40, 140, 140)} fill="url(#grassTex)" opacity={0.6} />
      {/* parking lot */}
      <polygon points={rectPts(42, 196, 188, 268)} fill="#a39a8a" stroke="#8b8273" strokeWidth={1} />
      {bays.map((x) => (
        <polyline key={x} points={pts([[x, 228], [x, 266]])} stroke="#f6efe0" strokeWidth={1.3} />
      ))}
      <polyline points={pts([[48, 228], [188, 228]])} stroke="#f6efe0" strokeWidth={0.8} opacity={0.5} strokeDasharray="4 3" />
      {/* curb highlight */}
      <polyline points={pts([[30, 270], [372, 270], [372, 30]])} stroke="#fff8e8" strokeWidth={2} fill="none" opacity={0.8} />
      <polyline points={pts([[28, 273], [374, 273], [374, 28]])} stroke="#d4bf94" strokeWidth={1.2} fill="none" />
      {/* crosswalks */}
      {Array.from({ length: 5 }).map((_, k) => (
        <polygon key={`c1${k}`} points={rectPts(344 + k * 7, 276, 349 + k * 7, 324)} fill="#fffaf0" opacity={0.95} />
      ))}
      {Array.from({ length: 5 }).map((_, k) => (
        <polygon key={`c2${k}`} points={rectPts(376, 236 + k * 7, 424, 241 + k * 7)} fill="#fffaf0" opacity={0.95} />
      ))}
      {/* lane edge / parking tick marks along Main St */}
      {[84, 134, 184, 234, 284].map((x) => (
        <polyline key={x} points={pts([[x, 275], [x, 293]])} stroke="#fffaf0" strokeWidth={1.2} opacity={0.9} />
      ))}
      {[60, 110, 160, 210].map((y) => (
        <polyline key={y} points={pts([[375, y], [393, y]])} stroke="#fffaf0" strokeWidth={1.2} opacity={0.9} />
      ))}
      {/* bus stop pad + yellow curb */}
      <polygon points={rectPts(346, 62, 372, 114)} fill="#e3d2ae" />
      <polyline points={pts([[372, 56], [372, 120]])} stroke="#e0b94f" strokeWidth={2.4} />
    </g>
  );
}

function BusStop({ onClick }: { onClick?: () => void }) {
  const roof = boxFaces(348, 64, 370, 110, 2, 30);
  const post = (x: number, y: number) => {
    const a = P(x, y, 0);
    const b = P(x, y, 30);
    return <line key={`${x}${y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4b4a52" strokeWidth={1.8} />;
  };
  return (
    <g className="hotspot" onClick={onClick} data-hotspot="bus">
      <polygon points={pts([[349, 65, 2], [349, 109, 2], [349, 109, 28], [349, 65, 28]])} fill="#cfe3e6" opacity={0.55} stroke="#8aa5ab" strokeWidth={0.7} />
      <Bench x={351} y={74} dir="y" />
      <Person x={354} y={86} z={5} sitting shirt="#6f8fa8" hair="#3c2c22" scale={0.95} />
      {post(369, 65)}
      {post(369, 109)}
      <polygon points={roof.left} fill="#4f6670" stroke={INK} strokeOpacity={0.5} strokeWidth={0.7} />
      <polygon points={roof.right} fill="#3f535c" stroke={INK} strokeOpacity={0.5} strokeWidth={0.7} />
      <polygon points={roof.top} fill="#6f8c96" stroke={INK} strokeOpacity={0.5} strokeWidth={0.7} />
      {/* bus sign */}
      {(() => {
        const p = P(370, 118, 0);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <path d="M0 0 V-34" stroke="#4b4a52" strokeWidth={1.6} />
            <rect x={-6} y={-42} width={12} height={12} rx={2.4} fill="#4b6ea5" stroke="#fff" strokeWidth={1} />
            <rect x={-3.6} y={-39.6} width={7.2} height={4.4} rx={1} fill="#fff" />
            <circle cx={-2} cy={-32.8} r={0.9} fill="#fff" />
            <circle cx={2} cy={-32.8} r={0.9} fill="#fff" />
          </g>
        );
      })()}
    </g>
  );
}

export default function Neighborhood({ onSelect }: { onSelect?: (id: HotspotId) => void }) {
  const { consumeDrag } = useMapGesture();
  const sel = (id: HotspotId) => () => {
    if (!consumeDrag()) onSelect?.(id);
  };
  type Item = { d: number; el: ReactNode };
  const items: Item[] = [];
  const push = (d: number, el: ReactNode) => items.push({ d, el });

  // neighbouring detailed buildings
  for (const b of BUILDINGS) {
    if (b.id === "cafe") continue;
    if (b.detail) push(b.x0 + b.y0, <BuildingShape key={b.id} b={b} detail />);
  }
  // trees (rich) near the café
  TREES.forEach((t, i) => {
    if (Math.abs(t.x - 268) < 700 && Math.abs(t.y - 192) < 560) push(t.x + t.y, <Tree key={`mt${i}`} {...t} rich />);
  });
  // café + its surroundings
  push(196 + 128, <CafeExterior key="cafe" onClick={sel("cafe")} />);
  push(450, <BusStop key="bus" onClick={sel("bus")} />);

  // big pink blossom tree + trees around the lot
  push(186 + 262, <Tree key="pink" x={184} y={262} s={1.35} kind="bloom" rich />);
  push(372 + 270, <Tree key="rt" x={376} y={42} s={1.2} rich />);
  push(120 + 50, <Tree key="bt1" x={120} y={52} s={1.35} rich />);
  push(240 + 40, <Tree key="bt2" x={250} y={30} s={1.3} rich />);

  // parked cars in the lot
  [
    [50, "#8fa7b3"],
    [90, "#efe6cf"],
    [130, "#a7b88d"],
  ].forEach(([x, c], i) => push((x as number) + 230, <Car key={`lc${i}`} x={(x as number) + 1} y={229} dir="y" color={c as string} />));

  // street parking (clickable group)
  const streetCars: Item[] = [
    { d: 100 + 278, el: <Car key="sp1" x={96} y={278} dir="x" color="#efe6cf" /> },
    { d: 200 + 278, el: <Car key="sp2" x={196} y={278} dir="x" color="#cfa0a0" /> },
    { d: 380 + 70, el: <Car key="sp3" x={378} y={150} dir="y" color="#8fa7b3" /> },
    { d: 280 + 308, el: <Car key="mv1" x={240} y={304} dir="x" color="#a9c4d6" /> },
    { d: 410 + 180, el: <Car key="mv2" x={408} y={180} dir="y" color="#e7dcc0" /> },
  ];

  // street furniture + people
  push(364 + 262, <LampPost key="lamp1" x={366} y={262} />);
  push(60 + 262, <LampPost key="lamp2" x={60} y={262} />);
  push(366 + 126, <LampPost key="lamp3" x={366} y={126} />);
  push(60 + 160, <Bench key="bench" x={66} y={176} dir="x" />);
  push(180 + 266, <Planter key="pl1" x={190} y={266} flowers="#e9a0b4" />);
  push(260 + 264, <Planter key="pl2" x={252} y={266} flowers="#f1c36b" size={0.9} />);
  push(330 + 266, <Planter key="pl3" x={336} y={266} flowers="#e9a0b4" />);
  push(356 + 176, <Planter key="pl4" x={358} y={176} flowers="#f4ede0" size={0.95} />);
  push(216 + 266, <RoundTable key="t1" x={222} y={266} />);
  push(300 + 266, <RoundTable key="t2" x={296} y={266} />);
  push(358 + 210, <RoundTable key="t3" x={358} y={212} />);
  push(300 + 266 + 1, <Person key="p1" x={296} y={262} sitting shirt="#9bb08a" laptop />);
  push(358 + 212 + 1, <Person key="p2" x={362} y={208} sitting shirt="#d9a0a0" />);
  push(280 + 296, <Person key="w1" x={282} y={284} shirt="#d1a057" scale={1.05} />);
  push(240 + 262, <ChalkSign key="chalk" x={262} y={270} />);
  push(380 + 40, <Person key="w2" x={344} y={44} shirt="#6f8fa8" hair="#2e231c" scale={1.05} />);

  items.sort((a, b) => a.d - b.d);

  return (
    <g>
      <GroundPatch />
      {/* cars on the street layer are separate hotspot for parking */}
      <g className="hotspot" data-hotspot="parking" onClick={sel("parking")}>
        {streetCars.map((c) => c.el)}
      </g>
      {items.map((it, i) => (it.el ? <g key={i}>{it.el}</g> : null))}
    </g>
  );
}

export function ScenePins({ onSelect }: { onSelect?: (id: HotspotId) => void }) {
  return (
    <g>
      <Pin id="cafe-pin" at={P(268, 192, 84)} kind="cafe" onClick={() => onSelect?.("cafe")} fadeOutAt={4.2} />
      <Pin id="parking-pin" at={P(110, 210, 30)} kind="parking" onClick={() => onSelect?.("parking")} fadeOutAt={5} fadeInAt={1.1} />
      <Pin id="bus-pin" at={P(362, 90, 48)} kind="bus" onClick={() => onSelect?.("bus")} fadeOutAt={5} fadeInAt={1.1} />
    </g>
  );
}

function ChalkSign({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={0} cy={1} rx={8} ry={3} fill="#6b5a3a" opacity={0.2} />
      <path d="M-7 0 L-4 -17 M7 0 L4 -17" stroke="#8c6340" strokeWidth={1.6} />
      <rect x={-6.5} y={-19} width={13} height={16} rx={1.2} fill="#3e4a43" stroke="#a77a52" strokeWidth={1.4} />
      <path d="M-3 -13 q3 -4 6 0 M-3 -9 h6" stroke="#f1e7cf" strokeWidth={0.8} fill="none" />
    </g>
  );
}

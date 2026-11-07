import type { ReactNode } from "react";
import { P, boxFaces, pts, rectPts } from "@/lib/iso";
import { shade } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/durham";
import { Wash } from "./primitives";
import {
  BarStool,
  BigPlant,
  BluePortrait,
  BrownArmchair,
  CoffeeTable,
  CrossChair,
  CupStack,
  EspressoMachine,
  FloorLamp,
  GrabGoCase,
  Lantern,
  MenuBoard,
  PastryDome,
  PlaneX,
  PlaneY,
  RetailTable,
  SlatBox,
  SquareTable,
  SteelFridge,
} from "./art";

/**
 * Gate 1 — the Foster Street Coffee interior as an EMPTY, hand-drawn miniature cutaway.
 * Everything here is taken from the supplied photographs:
 *   · white service wall with three menu boards (EAT / SPECIALS chalkboard / SIP), floating wood shelves, stainless fridge
 *   · grey wood-fronted counter with butcher-block top and a black espresso machine; blue painted portrait on the wall
 *   · white-based, mint-framed glass grab-and-go case; black-framed retail table with kraft coffee bags and newspapers
 *   · light wood window bar with stools along the street glass; square oak tables with black spindle-back chairs
 *   · deep-blue accent wall with hung seascapes and floating shelves; brown leather lounge chairs, black coffee table,
 *     white planter boxes with greenery; round white paper lanterns; black track lighting
 * The photographs show different viewpoints and do NOT establish a floor plan — positions are a conceptual
 * reconstruction (uncertain areas omitted: no restroom, no exact seat counts, no dimensions).
 */
const ink = { stroke: "#6b4a2c", strokeOpacity: 0.34, strokeWidth: 0.55, strokeLinejoin: "round" as const };
const H = F.h;
const BACK_LEN = F.x1 - F.x0; // 160
const SIDE_LEN = F.y1 - F.y0; // 144
const X = F.x0;
const Y = F.y0;
const FS = 0.85; // furniture is drawn a little smaller so the room reads large, like the real café
const WALL = "#f4ecdb";
const NAVY = "#3d5470";

type Item = { d: number; el: ReactNode };

function BackWall() {
  return (
    <PlaneY x={F.x0} y={F.y0}>
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill={WALL} {...ink} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#washPat)" opacity={0.75} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#faceShade)" />
      <rect x={0} y={-5} width={BACK_LEN} height={5} fill="#e3d9c3" {...ink} />
      {/* black track lighting */}
      <path d={`M6 ${-H + 3.4} H${BACK_LEN - 6}`} stroke="#403a36" strokeWidth={1.1} />
      {[18, 44, 70, 96, 122, 148].map((u) => (
        <path key={u} d={`M${u} ${-H + 3.4} l1.7 4.4 h-3.4z`} fill="#403a36" />
      ))}
      {/* floating shelf with a framed print and a grass pot (left white wall) */}
      <rect x={3} y={-50} width={26} height={1.8} fill="#d6ac72" {...ink} />
      <rect x={5} y={-58} width={8} height={8} fill="#f7f4ec" stroke="#403a36" strokeWidth={0.5} />
      <rect x={6} y={-57} width={6} height={6} fill="#a9a59d" />
      <circle cx={6.6} cy={-54.4} r={1.3} fill="#58544e" />
      <path d="M18 -50 l-1 -6 M20 -50 v-7 M22 -50 l1 -6 M24 -50 l2 -5" stroke="#6f9a52" strokeWidth={0.9} strokeLinecap="round" />
      <rect x={17.4} y={-52.6} width={7.4} height={2.6} fill="#f6f4ee" {...ink} />
      {/* sliding wooden barn door on a black rail (visible in the photos) */}
      <rect x={30} y={-47} width={30} height={1.4} fill="#403a36" />
      <rect x={34} y={-45.6} width={22} height={41} fill="#b98b5a" {...ink} />
      <rect x={34} y={-45.6} width={22} height={41} fill="url(#woodGrain)" opacity={0.9} />
      <path d="M45 -45.6 V-4.6 M39.5 -45.6 V-4.6 M50.5 -45.6 V-4.6" stroke="#8a5f36" strokeWidth={0.5} opacity={0.7} />
      <circle cx={37} cy={-47} r={1.1} fill="#403a36" />
      <circle cx={53} cy={-47} r={1.1} fill="#403a36" />
      {/* menu boards over the counter: EAT / SPECIALS / SIP */}
      <MenuBoard u={60} w={24} kind="eat" lines={["Caprese", "Ham & Cheese", "Southwest Turkey", "Grilled Cheese"]} />
      <MenuBoard u={86} w={24} kind="special" lines={["Butter Pecan Latte", "Sweet Potato Chai", "Pear & Cardamom", "Tea Latte"]} />
      <MenuBoard u={112} w={24} kind="sip" lines={["Americano", "Cold Brew", "Cappuccino", "Latte", "Chai Latte", "Mocha"]} />
      <BluePortrait u={138} v={20} />
    </PlaneY>
  );
}

function Seascape({ u, w, tint }: { u: number; w: number; tint: string }) {
  return (
    <g>
      <rect x={u} y={-51} width={w} height={25} fill="#f7f2e6" stroke="#e8dfcb" strokeWidth={1} />
      <rect x={u + 2} y={-49} width={w - 4} height={21} fill={tint} />
      <rect x={u + 2} y={-49} width={w - 4} height={9} fill="#eef3f1" opacity={0.75} />
      <path d={`M${u + 2} -38 q${(w - 4) / 4} -4 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0`} stroke="#fff" strokeWidth={1.1} fill="none" opacity={0.9} />
      <path d={`M${u + 2} -33 q${(w - 4) / 4} -3 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0 M${u + 2} -30 q${(w - 4) / 4} 2.4 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0`} stroke="#5f8da0" strokeWidth={0.8} fill="none" opacity={0.7} />
      <rect x={u + 2} y={-33} width={w - 4} height={5} fill="#6f9aa8" opacity={0.45} />
    </g>
  );
}

/** tiny black-and-white print: generic grey silhouettes, no real photograph is reproduced */
function Print({ type, w, h }: { type: string; w: number; h: number }) {
  const g1 = "#cfcbc3";
  const g2 = "#6e6a64";
  return (
    <g>
      <rect width={w} height={h} fill={g1} />
      <rect width={w} height={h * 0.45} fill="#e1ded7" />
      {type === "portrait" && (
        <g fill={g2}>
          <ellipse cx={w / 2} cy={h * 0.42} rx={w * 0.2} ry={h * 0.2} />
          <path d={`M${w * 0.18} ${h} q0 ${-h * 0.34} ${w * 0.32} ${-h * 0.34} q${w * 0.32} 0 ${w * 0.32} ${h * 0.34}z`} />
        </g>
      )}
      {type === "portrait2" && (
        <g fill="#4d4944">
          <ellipse cx={w * 0.4} cy={h * 0.4} rx={w * 0.17} ry={h * 0.18} />
          <path d={`M${w * 0.1} ${h} q0 ${-h * 0.32} ${w * 0.3} ${-h * 0.32} q${w * 0.3} 0 ${w * 0.3} ${h * 0.32}z`} />
          <ellipse cx={w * 0.74} cy={h * 0.5} rx={w * 0.13} ry={h * 0.14} fill="#8a857d" />
        </g>
      )}
      {type === "group" && (
        <g fill={g2}>
          {[0.25, 0.5, 0.75].map((cx) => (
            <g key={cx}>
              <circle cx={w * cx} cy={h * 0.45} r={w * 0.1} />
              <path d={`M${w * (cx - 0.13)} ${h} q0 ${-h * 0.28} ${w * 0.13} ${-h * 0.28} q${w * 0.13} 0 ${w * 0.13} ${h * 0.28}z`} />
            </g>
          ))}
        </g>
      )}
      {type === "skyline" && (
        <g fill={g2}>
          <rect x={w * 0.1} y={h * 0.4} width={w * 0.16} height={h * 0.6} />
          <rect x={w * 0.3} y={h * 0.22} width={w * 0.18} height={h * 0.78} />
          <rect x={w * 0.52} y={h * 0.5} width={w * 0.14} height={h * 0.5} />
          <rect x={w * 0.7} y={h * 0.32} width={w * 0.2} height={h * 0.68} />
        </g>
      )}
      {type === "landscape" && (
        <g fill={g2}>
          <path d={`M0 ${h} L0 ${h * 0.62} q${w * 0.25} ${-h * 0.28} ${w * 0.5} ${-h * 0.05} q${w * 0.25} ${h * 0.2} ${w * 0.5} ${-h * 0.14} V${h}z`} />
          <circle cx={w * 0.74} cy={h * 0.24} r={w * 0.08} fill="#f2efe9" />
        </g>
      )}
      {type === "cup" && (
        <g fill={g2}>
          <path d={`M${w * 0.28} ${h * 0.4} h${w * 0.4} l${-w * 0.05} ${h * 0.4} h${-w * 0.3}z`} />
          <path d={`M${w * 0.68} ${h * 0.5} q${w * 0.2} 0 0 ${h * 0.2}`} stroke={g2} strokeWidth={0.6} fill="none" />
        </g>
      )}
    </g>
  );
}

const FRAMES: Array<[number, number, number, number, string]> = [
  [12, 24, 8, 10, "portrait"],
  [26, 21, 7, 9, "skyline"],
  [38, 26, 9, 11, "group"],
  [52, 22, 7, 8, "cup"],
  [63, 28, 8, 10, "portrait2"],
  [76, 24, 9, 11, "portrait"],
  [90, 30, 7, 9, "landscape"],
  [101, 26, 10, 12, "portrait2"],
  [115, 32, 8, 10, "group"],
  [127, 28, 9, 11, "portrait"],
  [20, 45, 8, 9, "landscape"],
  [44, 47, 9, 9, "portrait"],
  [68, 46, 8, 9, "skyline"],
  [92, 48, 9, 9, "portrait2"],
  [116, 49, 8, 8, "cup"],
  [133, 44, 7, 9, "portrait"],
];

function PhotoWall() {
  return (
    <PlaneX x={F.x0} y={F.y1}>
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill={NAVY} {...ink} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#washPat)" opacity={0.7} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#hatch)" opacity={0.2} />
      <rect x={0} y={-5} width={SIDE_LEN} height={5} fill="#2f4259" {...ink} />
      {/* many small framed prints on little wood shelves, staggered like the real wall */}
      {FRAMES.map(([u, v, w, h, type], i) => (
        <g key={i} transform={`translate(${u} ${-v})`}>
          <rect x={-1} y={0.2} width={w + 2} height={1.1} fill="#d6ac72" {...ink} />
          <g transform={`translate(0 ${-h - 0.6})`}>
            <rect x={-0.9} y={-0.9} width={w + 1.8} height={h + 1.8} fill="#f8f5ee" stroke="#e3dccb" strokeWidth={0.5} />
            <g transform="translate(0.4 0.4) scale(0.92)">
              <Print type={type} w={w} h={h} />
            </g>
          </g>
        </g>
      ))}
    </PlaneX>
  );
}

/** light wood beadboard half-wall with a row of white bowls of greenery on top (as in the photo) */
function BeadboardDivider({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const h = 19;
  const f = boxFaces(x0, y0, x1, y1, h);
  const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 11));
  return (
    <g>
      <polygon points={boxFaces(x0 - 1, y0 - 1, x1 + 2, y1 + 2, 0.1).top} fill="#5a4630" opacity={0.18} />
      <polygon points={f.left} fill="#ead8ae" {...ink} />
      <polygon points={f.left} fill="url(#slats)" />
      <polygon points={f.right} fill="#c9b184" {...ink} />
      <polygon points={f.top} fill="#dcb27a" {...ink} />
      {Array.from({ length: n }).map((_, i) => {
        const gx = x0 + ((x1 - x0) * (i + 0.5)) / n;
        const gy = y0 + ((y1 - y0) * (i + 0.5)) / n;
        const p = P(gx, gy, h);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d="M-6 -0.6 q0 -3.6 6 -3.6 q6 0 6 3.6z" fill="#f4f1e8" {...ink} />
            <ellipse cx={0} cy={-3.9} rx={5.2} ry={1.2} fill="#7a6a54" />
            {[-4, -2.6, -1.2, 0.2, 1.6, 3, 4.2].map((dx, k) => (
              <path key={k} d={`M${dx} -4 q${dx * 0.5 + (k % 2 ? 1.4 : -1.4)} ${-3.4 - (k % 3)} ${dx * 1.15} ${-6.4 - ((k * 7) % 3)}`} stroke={["#7aa65a", "#648f48", "#8cb86a"][(i + k) % 3]} strokeWidth={0.9} fill="none" strokeLinecap="round" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** draw a furniture piece a little smaller, anchored on its own floor point */
function Scaled({ x, y, s = FS, children }: { x: number; y: number; s?: number; children: ReactNode }) {
  const p = P(x, y);
  return <g transform={`translate(${p.x} ${p.y}) scale(${s}) translate(${-p.x} ${-p.y})`}>{children}</g>;
}

export default function InteriorBase({ lit = true }: { lit?: boolean }) {
  const items: Item[] = [];
  const add = (d: number, el: ReactNode) => items.push({ d, el });

  /* ---- service side (back wall) ---- */
  add(X + 4 + Y + 2 + 12, <SteelFridge key="fridge" x={X + 4} y={Y + 2} />);
  add(X + 150 + Y + 26, <Scaled key="plantR" x={X + 150} y={Y + 26} s={1}><BigPlant x={X + 150} y={Y + 26} s={1.05} /></Scaled>);
  add(
    X + 66 + Y + 32,
    <g key="counter">
      <SlatBox x0={X + 68} y0={Y + 14} x1={X + 126} y1={Y + 31} h={17} />
      <EspressoMachine x={X + 100} y={Y + 16} />
      <CupStack x={X + 82} y={Y + 24} z={19} />
      <PastryDome x={X + 76} y={Y + 21} z={19} n={4} />
    </g>,
  );
  add(X + 80 + Y + 58, <GrabGoCase key="case" x={X + 80} y={Y + 44} per={5} />);
  add(X + 44 + Y + 58, <RetailTable key="retail" x={X + 44} y={Y + 46} />);

  /* ---- lounge by the photo wall ---- */
  add(X + 8 + Y + 46, <Scaled key="lamp" x={X + 8} y={Y + 46}><FloorLamp x={X + 8} y={Y + 46} /></Scaled>);
  add(X + 14 + Y + 62, <Scaled key="ch1" x={X + 14} y={Y + 62}><BrownArmchair x={X + 14} y={Y + 62} /></Scaled>);
  add(X + 14 + Y + 86, <Scaled key="ch2" x={X + 14} y={Y + 86}><BrownArmchair x={X + 14} y={Y + 86} /></Scaled>);
  add(X + 29 + Y + 74, <Scaled key="ct" x={X + 29} y={Y + 74}><CoffeeTable x={X + 29} y={Y + 74} /></Scaled>);
  add(X + 6 + Y + 100, <BeadboardDivider key="div" x0={X + 6} y0={Y + 99} x1={X + 66} y1={Y + 106} />);

  /* ---- oak square tables + black chairs, generously spaced ---- */
  const table = (key: string, x: number, y: number, tItems: Array<"cup" | "plant" | "paper" | "plate">, chairs: Array<[number, number, boolean]>) => {
    add(x + y, <Scaled key={key} x={x} y={y}><SquareTable x={x} y={y} items={tItems} /></Scaled>);
    chairs.forEach(([cx, cy, flip], i) => add(cx + cy, <Scaled key={`${key}c${i}`} x={cx} y={cy}><CrossChair x={cx} y={cy} flip={flip} /></Scaled>));
  };
  table("t1", X + 96, Y + 80, ["cup", "plant"], [[X + 96, Y + 64, false], [X + 96, Y + 96, false], [X + 112, Y + 80, true]]);
  table("t2", X + 132, Y + 96, ["paper", "cup"], [[X + 132, Y + 80, false], [X + 132, Y + 112, false]]);
  table("t3", X + 72, Y + 98, ["plate"], [[X + 72, Y + 114, false], [X + 88, Y + 98, true]]);
  add(X + 112 + Y + 108, <Scaled key="calathea" x={X + 112} y={Y + 108} s={1}><BigPlant x={X + 112} y={Y + 108} s={1.05} /></Scaled>);

  /* ---- window bar along the street glass: bar nearest the camera, stools on the room side ---- */
  add(
    900,
    <g key="winbar">
      <SlatBox x0={X + 12} y0={F.y1 - 11} x1={X + 118} y1={F.y1 - 3} h={16} front="#e3cc9c" topc="#e8d2a6" />
      {[34, 82].map((dx) => {
        const p = P(X + dx, F.y1 - 7, 16);
        return (
          <g key={dx} transform={`translate(${p.x} ${p.y})`}>
            <path d="M-4 0 q0 -3 4 -3 q4 0 4 3z" fill="#f2efe6" stroke="#6b4a2c" strokeOpacity={0.34} strokeWidth={0.5} />
            <circle cx={-1.4} cy={-5} r={2.2} fill="#6aa04a" />
            <circle cx={1.6} cy={-5.6} r={2.4} fill="#79b055" />
            <circle cx={0} cy={-7.4} r={1.8} fill="#8fc268" />
          </g>
        );
      })}
    </g>,
  );
  [26, 50, 74, 98].forEach((dx) => add(X + dx + F.y1 - 26, <Scaled key={`st${dx}`} x={X + dx} y={F.y1 - 25}><BarStool x={X + dx} y={F.y1 - 25} /></Scaled>));

  items.sort((a, b) => a.d - b.d);

  const lanterns: Array<[number, number, number, number]> = [
    [X + 52, Y + 30, 48, 6],
    [X + 112, Y + 30, 50, 5.6],
    [X + 100, Y + 74, 42, 7.6],
    [X + 40, Y + 62, 46, 6.4],
    [X + 130, Y + 90, 44, 7],
    [X + 76, Y + 108, 50, 6],
    [X + 24, Y + 110, 47, 5.4],
  ];

  const slab = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, -4);
  const backCut = boxFaces(F.x0 - 4, F.y0 - 5, F.x1 + 2, F.y0, H);
  const sideCut = boxFaces(F.x0 - 5, F.y0 - 5, F.x0, F.y1 + 2, H);

  return (
    <g>
      {/* slab + large light grey-beige wood-look plank floor, joints staggered (as in the photos) */}
      <polygon points={slab.left} fill="#c2b496" {...ink} />
      <polygon points={slab.right} fill="#aa9b7c" {...ink} />
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill="#d9d3c5" {...ink} />
      <Wash points={rectPts(F.x0, F.y0, F.x1, F.y1)} shade={false} o={0.85} />
      {Array.from({ length: 11 }).map((_, k) => (
        <polyline key={k} points={pts([[F.x0 + 4, F.y0 + k * 14], [F.x1, F.y0 + k * 14]])} stroke="#b8ad98" strokeWidth={0.55} opacity={0.55} />
      ))}
      {Array.from({ length: 11 }).flatMap((_, row) =>
        [0, 1, 2, 3].map((j) => {
          const x = F.x0 + 10 + ((row % 2) * 22) + j * 44;
          return <polyline key={`j${row}-${j}`} points={pts([[x, F.y0 + row * 14], [x, F.y0 + row * 14 + 14]])} stroke="#b8ad98" strokeWidth={0.45} opacity={0.5} />;
        }),
      )}
      {/* darker floor band along the counter, as in the counter photo */}
      <polygon points={rectPts(X + 62, Y + 32, X + 130, Y + 36)} fill="#aea28a" opacity={0.4} />
      {/* soft, static pools of daylight from the street windows */}
      {[[X + 24, Y + 112], [X + 60, Y + 90], [X + 100, Y + 60], [X + 130, Y + 110], [X + 80, Y + 130], [X + 50, Y + 70], [X + 120, Y + 64]].map(([x, y], i) => {
        const pp = P(x, y);
        return <ellipse key={i} cx={pp.x} cy={pp.y} rx={10 + (i % 3) * 3} ry={4 + (i % 3)} fill="#fff0b8" opacity={lit ? 0.2 : 0} />;
      })}

      <BackWall />
      <PhotoWall />
      <polygon points={backCut.top} fill="#e9dfc9" {...ink} />
      <polygon points={backCut.top} fill="url(#hatch)" opacity={0.5} />
      <polygon points={sideCut.top} fill="#e9dfc9" {...ink} />
      <polygon points={sideCut.top} fill="url(#hatch)" opacity={0.5} />

      {items.map((it, i) => (
        <g key={i}>{it.el}</g>
      ))}

      {lanterns.map(([x, y, z, r], i) => (
        <Lantern key={i} x={x} y={y} z={z} r={r} />
      ))}

      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill={lit ? "#ffe3a0" : "#1d2536"} opacity={lit ? 0.07 : 0.5} style={{ pointerEvents: "none" }} />

      {/* the storefront side of the cutaway: brick base, thin black mullions, a glass-door frame */}
      {(() => {
        const l = boxFaces(F.x0, F.y1 - 3, F.x1, F.y1, 8);
        const r = boxFaces(F.x1 - 3, F.y0, F.x1, F.y1, 8);
        const pil = boxFaces(F.x1 - 6, F.y1 - 6, F.x1 + 2, F.y1 + 2, H);
        const d0 = F.y1 - 6,
          d1 = F.y1 - 32;
        return (
          <g>
            <polygon points={l.left} fill="#b5654a" {...ink} />
            <Wash points={l.left} />
            <polygon points={l.top} fill="#e3d4b3" {...ink} />
            <polygon points={r.right} fill="#975241" {...ink} />
            <Wash points={r.right} />
            <polygon points={r.top} fill="#e3d4b3" {...ink} />
            <polygon points={pil.left} fill="#b5654a" {...ink} />
            <polygon points={pil.right} fill="#975241" {...ink} />
            <polygon points={pil.top} fill="#e3d4b3" {...ink} />
            <Wash points={pil.left} />
            <polygon points={pts([[F.x0, F.y1, 8], [F.x1, F.y1, 8], [F.x1, F.y1, H], [F.x0, F.y1, H]])} fill="#d6e6e4" opacity={0.12} style={{ pointerEvents: "none" }} />
            <polygon points={pts([[F.x1, F.y1, 8], [F.x1, F.y0, 8], [F.x1, F.y0, H], [F.x1, F.y1, H]])} fill="#d6e6e4" opacity={0.12} style={{ pointerEvents: "none" }} />
            {[0, 1, 2, 3].map((i) => {
              const a = P(F.x0 + i * 54, F.y1, 8);
              const b = P(F.x0 + i * 54, F.y1, H);
              return <line key={`pl${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a433e" strokeWidth={0.9} opacity={0.7} />;
            })}
            {[1, 2, 3].map((i) => {
              const a = P(F.x1, F.y1 - i * 36, 8);
              const b = P(F.x1, F.y1 - i * 36, H);
              return <line key={`pr${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a433e" strokeWidth={0.9} opacity={0.7} />;
            })}
            <polyline points={pts([[F.x0, F.y1, H], [F.x1, F.y1, H], [F.x1, F.y0, H]])} stroke="#4a433e" strokeWidth={0.8} opacity={0.7} fill="none" />
            <polygon points={pts([[F.x1, d0, 8], [F.x1, d1, 8], [F.x1, d1, 42], [F.x1, d0, 42]])} fill="#cfe2e0" opacity={0.3} />
            <polygon points={pts([[F.x1, d0, 8], [F.x1, d1, 8], [F.x1, d1, 42], [F.x1, d0, 42]])} fill="none" stroke="#403a36" strokeWidth={1.6} />
            <line x1={P(F.x1, (d0 + d1) / 2, 8).x} y1={P(F.x1, (d0 + d1) / 2, 8).y} x2={P(F.x1, (d0 + d1) / 2, 42).x} y2={P(F.x1, (d0 + d1) / 2, 42).y} stroke="#403a36" strokeWidth={1.2} />
            {(() => {
              const p = P(F.x1, (d0 + d1) / 2, 46);
              return (
                <g transform={`translate(${p.x} ${p.y})`}>
                  <rect x={-5} y={-2.6} width={10} height={4.4} rx={0.6} fill="#f3eee2" stroke="#403a36" strokeWidth={0.5} />
                  <text y={0.6} textAnchor="middle" fontSize={2.8} fontWeight={700} fill="#b83a30" fontFamily="system-ui">EXIT</text>
                </g>
              );
            })()}
            {shade("#000000", 0) && null}
          </g>
        );
      })()}
    </g>
  );
}

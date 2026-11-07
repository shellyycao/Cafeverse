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
  PlanterDivider,
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
const BACK_LEN = F.x1 - F.x0;
const SIDE_LEN = F.y1 - F.y0;
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
      {[18, 42, 66, 90, 114, 134].map((u) => (
        <path key={u} d={`M${u} ${-H + 3.4} l1.7 4.4 h-3.4z`} fill="#403a36" />
      ))}
      {/* floating shelves above the fridge */}
      <rect x={3} y={-52} width={26} height={1.8} fill="#d6ac72" {...ink} />
      <rect x={5} y={-60} width={6} height={8} rx={0.8} fill="#c9a27a" {...ink} />
      <rect x={5.8} y={-57} width={4.4} height={2.6} fill="#5b86b4" opacity={0.85} />
      <rect x={13} y={-58.5} width={5.4} height={6.5} rx={0.8} fill="#e6d9c2" {...ink} />
      <circle cx={23} cy={-56} r={3.6} fill="#79a05a" />
      <circle cx={26} cy={-57.4} r={2.8} fill="#8fb26a" />
      <rect x={21} y={-54.2} width={7} height={2.4} fill="#f6f4ee" {...ink} />
      <MenuBoard u={32} w={25} kind="eat" lines={["Caprese", "Ham & Cheese", "Southwest Turkey", "Grilled Cheese"]} />
      <MenuBoard u={59} w={25} kind="special" lines={["Butter Pecan Latte", "Sweet Potato Chai", "Pear & Cardamom", "Tea Latte"]} />
      <MenuBoard u={86} w={25} kind="sip" lines={["Americano", "Cold Brew", "Cappuccino", "Latte", "Chai Latte", "Mocha"]} />
      <BluePortrait u={118} />
      <rect x={113} y={-20} width={28} height={1.8} fill="#d6ac72" {...ink} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={115 + k * 6.4} y={-26} width={4.6} height={6} rx={0.9} fill={k % 2 ? "#3a5578" : "#ece7dc"} {...ink} />
      ))}
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

function NavyWall() {
  return (
    <PlaneX x={F.x0} y={F.y1}>
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill={NAVY} {...ink} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#washPat)" opacity={0.7} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#hatch)" opacity={0.2} />
      <rect x={0} y={-5} width={SIDE_LEN} height={5} fill="#2f4259" {...ink} />
      {/* picture rail with hung seascapes */}
      <path d="M18 -57 H122" stroke="#d8d4c8" strokeWidth={1.1} />
      {[24, 60, 94].map((u) => (
        <path key={u} d={`M${u + 4} -57 V-51 M${u + 18} -57 V-51`} stroke="#d8d4c8" strokeWidth={0.4} />
      ))}
      <Seascape u={24} w={30} tint="#a2c8cd" />
      <Seascape u={60} w={28} tint="#bcd7d9" />
      <Seascape u={94} w={24} tint="#dce9e6" />
      {/* floating shelves with small framed photos and a trailing pothos */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={3} y={-46 + k * 9} width={13} height={1.5} fill="#d6ac72" {...ink} />
          <rect x={4.4} y={-53 + k * 9} width={4.6} height={6.6} fill="#f6f1e6" stroke="#403a36" strokeWidth={0.4} />
          <rect x={5.2} y={-52.2 + k * 9} width={3} height={5} fill={["#98a8b8", "#bfae92", "#8798a4"][k]} />
        </g>
      ))}
      <path d="M14 -46 q-3 4 -1 9 q2 5 -1 9" stroke="#5f8a40" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {[[13, -42], [11, -36], [13, -32], [12, -28]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={2} ry={1.2} fill="#6aa04a" />
      ))}
    </PlaneX>
  );
}

export default function InteriorBase({ lit = true }: { lit?: boolean }) {
  const items: Item[] = [];
  const add = (d: number, el: ReactNode) => items.push({ d, el });

  /* back-of-house, counter, case, retail */
  add(200 + 141, <SteelFridge key="fridge" x={200} y={130} />);
  add(334 + 138, <BigPlant key="plantR" x={334} y={140} s={1.05} />);
  add(
    232 + 166,
    <g key="counter">
      <SlatBox x0={232} y0={142} x1={326} y1={166} h={17} />
      <EspressoMachine x={300} y={146} />
      <CupStack x={262} y={156} z={19} />
      <PastryDome x={246} y={154} z={19} n={4} />
    </g>,
  );
  add(270 + 187, <GrabGoCase key="case" x={270} y={172} per={5} />);
  add(236 + 187, <RetailTable key="retail" x={236} y={176} />);

  /* lounge against the blue wall: leather armchairs, black coffee table, lamp, planter boxes */
  add(204 + 154, <FloorLamp key="lamp" x={204} y={154} />);
  add(210 + 168, <BrownArmchair key="ch1" x={210} y={168} />);
  add(210 + 192, <BrownArmchair key="ch2" x={210} y={192} />);
  add(221 + 180, <CoffeeTable key="ct" x={222} y={180} />);
  add(200 + 206, <PlanterDivider key="plant-div" x0={200} y0={203} x1={242} y1={209} />);

  /* oak square tables + black spindle-back chairs */
  const table = (key: string, x: number, y: number, items: Array<"cup" | "plant" | "paper" | "plate">, chairs: Array<[number, number, boolean]>) => {
    add(x + y, <SquareTable key={key} x={x} y={y} items={items} />);
    chairs.forEach(([cx, cy, flip], i) => add(cx + cy, <CrossChair key={`${key}c${i}`} x={cx} y={cy} flip={flip} />));
  };
  table("t1", 270, 206, ["cup", "plant"], [[270, 191, false], [270, 221, false], [285, 206, true]]);
  table("t2", 308, 214, ["paper", "cup"], [[308, 199, false], [308, 229, false]]);

  /* window bar along the street glass: light wood top, stools, plants in bowls */
  add(
    700, // nearest to the camera: the bar sits at the street glass, stools are on the room side behind it
    <g key="winbar">
      <SlatBox x0={204} y0={246} x1={302} y1={254} h={16} front="#e3cc9c" topc="#e8d2a6" />
      {[222, 262].map((x) => {
        const p = P(x, 250, 16);
        return (
          <g key={x} transform={`translate(${p.x} ${p.y})`}>
            <path d="M-4 0 q0 -3 4 -3 q4 0 4 3z" fill="#f2efe6" stroke="#6b4a2c" strokeOpacity={0.34} strokeWidth={0.5} />
            <circle cx={-1.4} cy={-5} r={2.2} fill="#6aa04a" />
            <circle cx={1.6} cy={-5.6} r={2.4} fill="#79b055" />
            <circle cx={0} cy={-7.4} r={1.8} fill="#8fc268" />
          </g>
        );
      })}
    </g>,
  );
  [214, 236, 258, 280].forEach((x) => add(x + 226, <BarStool key={`st${x}`} x={x} y={223} />));

  items.sort((a, b) => a.d - b.d);

  const lanterns: Array<[number, number, number, number]> = [
    [250, 152, 46, 5.8],
    [304, 152, 48, 5.6],
    [262, 206, 40, 6.4],
    [226, 178, 44, 5.6],
    [316, 214, 42, 6],
    [268, 238, 46, 5.6],
    [238, 232, 48, 5.2],
  ];

  const slab = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, -4);
  const backCut = boxFaces(F.x0 - 4, F.y0 - 5, F.x1 + 2, F.y0, H);
  const sideCut = boxFaces(F.x0 - 5, F.y0 - 5, F.x0, F.y1 + 2, H);

  return (
    <g>
      {/* floor slab and a light wood-look plank floor (grey-beige, as in the photos) */}
      <polygon points={slab.left} fill="#c2b496" {...ink} />
      <polygon points={slab.right} fill="#aa9b7c" {...ink} />
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill="#dcd0b9" {...ink} />
      <Wash points={rectPts(F.x0, F.y0, F.x1, F.y1)} shade={false} o={0.9} />
      {Array.from({ length: 13 }).map((_, k) => (
        <polyline key={k} points={pts([[F.x0 + 4, F.y0 + k * 10], [F.x1, F.y0 + k * 10]])} stroke="#bba98a" strokeWidth={0.55} opacity={0.55} />
      ))}
      {Array.from({ length: 18 }).map((_, k) => {
        const x = F.x0 + 8 + ((k * 29) % 136);
        const y = F.y0 + Math.floor(((k * 37) % 120) / 10) * 10;
        return <polyline key={`j${k}`} points={pts([[x, y], [x, y + 10]])} stroke="#bba98a" strokeWidth={0.45} opacity={0.5} />;
      })}
      {/* darker floor band along the counter, as in the counter photo */}
      <polygon points={rectPts(228, 166, 332, 171)} fill="#b8a98a" opacity={0.45} />
      {/* soft, static pools of daylight from the street windows */}
      {[[214, 224], [240, 214], [268, 190], [294, 226], [318, 200], [256, 240], [232, 196], [306, 176]].map(([x, y], i) => {
        const p = P(x, y);
        return <ellipse key={i} cx={p.x} cy={p.y} rx={9 + (i % 3) * 3} ry={3.8 + (i % 3)} fill="#fff0b8" opacity={lit ? 0.2 : 0} />;
      })}

      <BackWall />
      <NavyWall />
      {/* cut sections of the two standing walls (the cutaway) */}
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

      {/* night / closed */}
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill={lit ? "#ffe3a0" : "#1d2536"} opacity={lit ? 0.07 : 0.5} style={{ pointerEvents: "none" }} />

      {/* the storefront side of the cutaway: brick base, black window mullions, a glass-door frame */}
      {(() => {
        const l = boxFaces(F.x0, F.y1 - 3, F.x1, F.y1, 8);
        const r = boxFaces(F.x1 - 3, F.y0, F.x1, F.y1, 8);
        const pil = boxFaces(F.x1 - 6, F.y1 - 6, F.x1 + 2, F.y1 + 2, H);
        const d0 = 250,
          d1 = 226; // door span along the right (Foster St) glass wall
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
              const a = P(F.x0 + i * 48, F.y1, 8);
              const b = P(F.x0 + i * 48, F.y1, H);
              return <line key={`pl${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a433e" strokeWidth={0.9} opacity={0.7} />;
            })}
            {[1, 2, 3].map((i) => {
              const a = P(F.x1, F.y1 - i * 32, 8);
              const b = P(F.x1, F.y1 - i * 32, H);
              return <line key={`pr${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4a433e" strokeWidth={0.9} opacity={0.7} />;
            })}
            {/* transom beam */}
            <polyline points={pts([[F.x0, F.y1, H], [F.x1, F.y1, H], [F.x1, F.y0, H]])} stroke="#4a433e" strokeWidth={0.8} opacity={0.7} fill="none" />
            {/* black-framed glass double door on the Foster St wall */}
            <polygon points={pts([[F.x1, d0, 8], [F.x1, d1, 8], [F.x1, d1, 40], [F.x1, d0, 40]])} fill="#cfe2e0" opacity={0.3} />
            <polygon points={pts([[F.x1, d0, 8], [F.x1, d1, 8], [F.x1, d1, 40], [F.x1, d0, 40]])} fill="none" stroke="#403a36" strokeWidth={1.6} />
            <line x1={P(F.x1, (d0 + d1) / 2, 8).x} y1={P(F.x1, (d0 + d1) / 2, 8).y} x2={P(F.x1, (d0 + d1) / 2, 40).x} y2={P(F.x1, (d0 + d1) / 2, 40).y} stroke="#403a36" strokeWidth={1.2} />
            {(() => {
              const p = P(F.x1, (d0 + d1) / 2, 44);
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

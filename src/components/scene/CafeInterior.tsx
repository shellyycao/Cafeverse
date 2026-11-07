import type { ReactNode } from "react";
import { P, boxFaces, pts, rectPts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/durham";
import { Bubble, Dog, Wash } from "./primitives";
import type { SceneSignals } from "@/lib/scene";
import type { Phase } from "@/lib/hours";
import {
  BarStool,
  BigPlant,
  BluePortrait,
  BrownArmchair,
  CoffeeTable,
  ConcreteColumn,
  CrossChair,
  CupStack,
  EspressoMachine,
  FloorLamp,
  GrabGoCase,
  Human,
  Lantern,
  MenuBoard,
  OakTable,
  PastryDome,
  PlanterDivider,
  PlaneX,
  PlaneY,
  RetailTable,
  SlatBox,
  SteelFridge,
} from "./art";

const stroke = { stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.7, strokeLinejoin: "round" as const };
const WALL = "#f6f2ea";
const BACK_LEN = F.x1 - F.x0; // 144
const SIDE_LEN = F.y1 - F.y0; // 128

/* ------------------------------------------------------------------ walls */
function BackWall() {
  const H = F.h;
  return (
    <PlaneY x={F.x0} y={F.y0}>
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill={WALL} {...stroke} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#washPat)" style={{ pointerEvents: "none" }} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#faceShade)" style={{ pointerEvents: "none" }} />
      <rect x={0} y={-17} width={BACK_LEN} height={17} fill="#e4ded2" {...stroke} />
      {/* black track lighting */}
      <path d={`M6 ${-H + 3} H${BACK_LEN - 6}`} stroke="#2b2b2e" strokeWidth={1.2} />
      {[20, 46, 72, 98, 124].map((u) => (
        <path key={u} d={`M${u} ${-H + 3} l1.8 4.6 h-3.6z`} fill="#2b2b2e" />
      ))}
      {/* floating shelves above the fridge: plant + coffee bags */}
      <rect x={3} y={-52} width={25} height={2} fill="#d3a56d" {...stroke} />
      <path d="M8 -52 v-3 M23 -52 v-3" stroke="#2b2b2e" strokeWidth={0.5} />
      <rect x={4.4} y={-60} width={6} height={8} rx={0.8} fill="#c9a27a" {...stroke} />
      <rect x={5.2} y={-57} width={4.4} height={2.6} fill="#3f6fa5" opacity={0.9} />
      <rect x={12} y={-58.5} width={5.4} height={6.5} rx={0.8} fill="#e6d9c2" {...stroke} />
      <circle cx={22} cy={-56.4} r={3.6} fill="#6a9048" />
      <circle cx={25} cy={-57.6} r={2.8} fill="#7fa354" />
      <rect x={20} y={-54.4} width={7} height={2.4} fill="#f6f4ee" {...stroke} />
      {/* three menu boards: EAT / SPECIALS / SIP (names read from the café's own board and ordering page) */}
      <MenuBoard u={31} w={25} kind="eat" lines={["Caprese", "Ham & Cheese", "Southwest Turkey", "Grilled Cheese", "on panini or", "croissant"]} />
      <MenuBoard u={58} w={25} kind="special" lines={["Butter Pecan Latte", "Sweet Potato Chai", "Pear & Cardamom", "Tea Latte", "", ""]} />
      <MenuBoard u={85} w={25} kind="sip" lines={["Americano", "Cold Brew", "Cappuccino", "Latte", "Chai Latte", "Mocha"]} />
      <BluePortrait u={117} />
      {/* shelf with navy mugs under the portrait */}
      <rect x={112} y={-20} width={28} height={1.8} fill="#d3a56d" {...stroke} />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={114 + k * 6.4} y={-26} width={4.6} height={6} rx={0.9} fill={k % 2 ? "#2f4668" : "#e9e6df"} {...stroke} />
        </g>
      ))}
    </PlaneY>
  );
}

function FramedSeascape({ u, w, tint }: { u: number; w: number; tint: string }) {
  return (
    <g>
      <rect x={u} y={-51} width={w} height={25} fill="#f6f1e6" stroke="#e8dfcb" strokeWidth={1} />
      <rect x={u + 2} y={-49} width={w - 4} height={21} fill={tint} />
      <rect x={u + 2} y={-49} width={w - 4} height={9} fill="#e9f1f1" opacity={0.7} />
      <path d={`M${u + 2} -38 q${(w - 4) / 4} -4 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0`} stroke="#fff" strokeWidth={1.1} fill="none" opacity={0.85} />
      <path d={`M${u + 2} -33 q${(w - 4) / 4} -3 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0 M${u + 2} -30 q${(w - 4) / 4} 2.4 ${(w - 4) / 2} 0 t${(w - 4) / 2} 0`} stroke="#4f7f92" strokeWidth={0.8} fill="none" opacity={0.7} />
      <rect x={u + 2} y={-33} width={w - 4} height={5} fill="#5f8a98" opacity={0.5} />
      <path d={`M${u + w / 2} -26 v-12`} stroke="#bdb8ac" strokeWidth={0.4} opacity={0} />
    </g>
  );
}

function SideWall({ restroom }: { restroom: boolean }) {
  const H = F.h;
  return (
    <PlaneX x={F.x0} y={F.y1}>
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="#34475d" {...stroke} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#washPat)" opacity={0.7} style={{ pointerEvents: "none" }} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#hatch)" opacity={0.22} style={{ pointerEvents: "none" }} />
      <rect x={0} y={-17} width={SIDE_LEN} height={17} fill="#2b3b4e" {...stroke} />
      {/* picture rail with hanging seascapes (as in the café photos) */}
      <path d="M8 -57 H116" stroke="#d8d4c8" strokeWidth={1.2} />
      {[16, 56, 92].map((u) => (
        <path key={u} d={`M${u + 4} -57 V-51 M${u + 20} -57 V-51`} stroke="#d8d4c8" strokeWidth={0.4} />
      ))}
      <FramedSeascape u={14} w={30} tint="#9cc3c9" />
      <FramedSeascape u={52} w={30} tint="#b8d3d6" />
      <FramedSeascape u={90} w={24} tint="#d9e6e4" />
      {/* small framed photos on floating shelves (left of the entrance) */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={4 + k * 0} y={-34 + k * 0} width={0} height={0} />
        </g>
      ))}
      {restroom && (
        <g>
          <rect x={106} y={-40} width={16} height={36} rx={1} fill="#8a6a4a" {...stroke} />
          <rect x={109} y={-47} width={10} height={6} rx={1.2} fill="#fffaf0" {...stroke} />
          <text x={114} y={-42.4} textAnchor="middle" fontSize={4.6} fontWeight={700} fill="#6a4a30">
            WC
          </text>
        </g>
      )}
    </PlaneX>
  );
}

function Steam({ x, y, z = 0, d = 0 }: { x: number; y: number; z?: number; d?: number }) {
  const p = P(x, y, z);
  return (
    <g transform={`translate(${p.x} ${p.y})`} style={{ pointerEvents: "none" }}>
      {[0, 1, 2].map((k) => (
        <path key={k} className="steam" style={{ animationDelay: `${d - k * 0.9}s` }} d={`M${k * 2.6 - 2.6} 0 q-2 -3 0 -6 t0 -6`} stroke="#fffaf0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
}

function Motes() {
  const list: Array<[number, number, number]> = [[220, 200, 30], [252, 176, 40], [284, 214, 26], [310, 190, 36], [236, 236, 22], [268, 150, 46], [328, 226, 30], [208, 160, 34]];
  return (
    <g style={{ pointerEvents: "none" }}>
      {list.map(([x, y, z], i) => {
        const p = P(x, y, z);
        return <circle key={i} className="mote" style={{ animationDelay: `${-i * 0.9}s` }} cx={p.x} cy={p.y} r={0.9 + (i % 3) * 0.3} fill="#fff6d8" />;
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ scene */
type Item = { d: number; el: ReactNode };
type Id = "barista" | "pastry" | "bar" | "social";

export default function CafeInterior({
  level,
  onSelect,
  guard,
  signals,
  crowd = 1,
  phase = "open",
}: {
  signals: SceneSignals;
  level: number;
  crowd?: 0 | 1 | 2;
  phase?: Phase;
  onSelect?: (id: Id) => void;
  guard: (fn: () => void) => () => void;
}) {
  const click = (id: Id) => guard(() => onSelect?.(id));
  const active = level >= 4;
  const patrons = phase === "open";
  const staff = phase !== "closed";
  const lightsOn = phase !== "closed";
  const glow = signals.lighting === "warm" ? 1 : signals.lighting === "bright" ? 0.55 : 1.5;
  const per = signals.pastryProminence === "high" ? 5 : signals.pastryProminence === "medium" ? 3 : 2;
  const hot = (id: Id) => ({
    className: active ? "hotspot" : undefined,
    "data-hotspot": id,
    onClick: click(id),
    style: { pointerEvents: active ? ("auto" as const) : ("none" as const) },
  });

  const items: Item[] = [];
  const add = (d: number, el: ReactNode) => items.push({ d, el });

  /* back-of-house */
  add(200 + 141, <SteelFridge key="fridge" x={200} y={130} />);
  add(330 + 136, <BigPlant key="bp1" x={334} y={138} s={1.1} />);

  /* barista + counter */
  if (staff) {
    add(
      250 + 137,
      <g key="barista" {...hot("barista")}>
        <Human x={250} y={137} shirt="#f1e7d4" apron="#6f8a6e" hair="bun" hairColor="#3c2c22" scale={1.5} />
        <circle cx={P(250, 137).x} cy={P(250, 137).y - 16} r={14} fill="transparent" />
      </g>,
    );
  }
  add(
    232 + 166,
    <g key="counter">
      <SlatBox x0={232} y0={142} x1={326} y1={166} h={17} />
      <EspressoMachine x={238} y={146} />
      <CupStack x={266} y={156} z={19} />
      <PastryDome x={304} y={154} z={19} n={signals.pastryProminence === "low" ? 2 : 4} />
      {/* POS tablet */}
      {(() => {
        const p = P(284, 158, 19);
        return <path transform={`translate(${p.x} ${p.y})`} d="M-3 0 l3 -4.4 l3 0 l-0.6 4.4z" fill="#2f2e33" stroke={INK} strokeOpacity={0.4} strokeWidth={0.4} />;
      })()}
    </g>,
  );

  /* grab-and-go glass case = the pastry hotspot */
  add(
    270 + 187,
    <g key="case" {...hot("pastry")}>
      <GrabGoCase x={270} y={172} per={per} />
    </g>,
  );
  add(236 + 187, <RetailTable key="retail" x={236} y={176} />);

  /* window bar: beadboard bar, stools, people */
  add(
    360,
    <g key="bar">
      <SlatBox x0={202} y0={148} x1={214} y1={228} h={19} front="#e0c796" topc="#e6cda0" />
      {[158, 190, 214].map((y) => {
        const p = P(214, y, 8);
        return <rect key={y} x={p.x - 1} y={p.y - 2.4} width={2} height={3} rx={0.4} fill="#f6f4ee" stroke={INK} strokeOpacity={0.4} strokeWidth={0.3} />;
      })}
    </g>,
  );
  const barSeats: Array<[number, string, string, "short" | "long" | "bun" | "curly", string]> = [
    [182, "#9bb08a", "#2e231c", "short", "#5b4a3a"],
    [218, "#c9a27a", "#5a3a24", "ponytail" as "short", "#3b4a63"],
    [162, "#8aa0b8", "#3c2c22", "curly", "#4a4a58"],
    [202, "#d9a0a0", "#6a4326", "long", "#3b3b46"],
  ];
  [162, 182, 202, 218].forEach((y) => add(226 + y, <BarStool key={`st${y}`} x={226} y={y} />));
  const workers = signals.laptopWorkers === 0 ? (patrons && crowd >= 1 ? 1 : 0) : signals.laptopWorkers;
  barSeats
    .filter(([y]) => {
      const order = [182, 218, 162, 202];
      return order.indexOf(y) < workers;
    })
    .forEach(([y, shirt, hairC, hair, pants]) =>
      add(
        226 + y + 1,
        <g key={`w${y}`} {...hot("bar")}>
          <Human x={226} y={y} z={8} sitting flip shirt={shirt} hairColor={hairC} hair={hair} pants={pants} holding={signals.laptopWorkers === 0 ? "cup" : "laptop"} scale={1.45} />
        </g>,
      ),
    );

  /* tables + chairs */
  add(268 + 210, <OakTable key="tA" x={268} y={210} items={["cup", "plate", "vase"]} />);
  add(262 + 216, <CrossChair key="cA1" x={262} y={216} />);
  add(274 + 204, <CrossChair key="cA2" x={274} y={204} flip />);
  if (patrons) {
    add(
      262 + 217,
      <g key="pA1" {...hot("social")}>
        <Human x={262} y={216} z={3} sitting shirt="#6d8a64" hair="bun" hairColor="#2e231c" holding="cup" scale={1.45} />
      </g>,
    );
    if (signals.chattingGroups >= 1)
      add(
        274 + 205,
        <g key="pA2" {...hot("social")}>
          <Human x={274} y={204} z={3} sitting flip shirt="#d9a0a0" hair="long" hairColor="#7a4a2c" holding="cup" scale={1.45} />
          <Bubble x={262} y={212} z={40} />
          <Bubble x={274} y={202} z={42} />
        </g>,
      );
  }
  add(306 + 232, <OakTable key="tB" x={306} y={232} items={["paper", "cup"]} />);
  add(300 + 238, <CrossChair key="cB1" x={300} y={238} />);
  if (patrons && crowd >= 1) add(300 + 239, <Human key="pB" x={300} y={238} z={3} sitting shirt="#cfa163" hair="short" hairColor="#3c2c22" holding="book" scale={1.45} />);
  if (signals.chattingGroups >= 2 && patrons) {
    add(312 + 226, <CrossChair key="cB2" x={312} y={226} flip />);
    add(
      312 + 227,
      <g key="pB2" {...hot("social")}>
        <Human x={312} y={226} z={3} sitting flip shirt="#8aa0b8" hair="curly" hairColor="#2e231c" scale={1.45} />
        <Bubble x={304} y={232} z={40} />
      </g>,
    );
  }
  if (patrons && crowd >= 2 && signals.chattingGroups < 2) add(312 + 227, <Human key="pB3" x={312} y={226} z={3} sitting flip shirt="#7d9aa6" hair="short" hairColor="#2e231c" scale={1.45} />);
  add(240 + 240, <OakTable key="tC" x={240} y={240} items={["cup"]} />);
  add(234 + 246, <CrossChair key="cC1" x={234} y={246} />);

  /* lounge corner: planter divider, leather armchairs, coffee table, floor lamp */
  add(312 + 198, <PlanterDivider key="pdiv" x0={312} y0={190} x1={340} y1={197} />);
  add(332 + 216, <BrownArmchair key="ac1" x={332} y={216} />);
  add(318 + 240, <BrownArmchair key="ac2" x={318} y={240} flip />);
  add(328 + 232, <CoffeeTable key="ct" x={328} y={232} />);
  add(338 + 206, <FloorLamp key="fl" x={338} y={206} />);
  if (patrons && crowd >= 2) add(318 + 241, <Human key="lg" x={318} y={240} z={4} sitting flip shirt="#b66d6a" hair="ponytail" hairColor="#5a3a24" holding="cup" scale={1.4} />);

  /* concrete column + plants */
  add(216 + 244, <ConcreteColumn key="col" x={216} y={236} />);
  const plantN = signals.plants === "few" ? 0 : signals.plants === "some" ? 1 : 2;
  if (plantN >= 1) add(210 + 134, <BigPlant key="bp2" x={210} y={140} s={0.8} />);
  if (plantN >= 2) add(244 + 250, <BigPlant key="bp3" x={246} y={252} s={0.9} />);

  if (signals.dogInside && patrons) add(252 + 238, <Dog key="dog" x={254} y={232} scale={1.3} />);

  /* standing customers in the queue (busy) */
  if (patrons && crowd >= 2) {
    add(288 + 200, <Human key="q1" x={288} y={200} shirt="#b66d6a" hair="ponytail" hairColor="#3c2c22" holding="cup" scale={1.5} />);
    add(300 + 196, <Human key="q2" x={300} y={196} shirt="#6d8a64" hair="short" hairColor="#7a4a2c" pants="#3b4a63" scale={1.5} />);
  }
  /* closing: staff member sweeping */
  if (phase === "closing") add(262 + 224, <Human key="sweep" x={262} y={224} shirt="#f1e7d4" apron="#6f8a6e" hair="short" hairColor="#3c2c22" holding="broom" scale={1.5} />);

  items.sort((a, b) => a.d - b.d);

  /* lanterns hang at different heights (drawn on top, they are overhead) */
  const lanterns: Array<[number, number, number, number]> = [
    [250, 152, 46, 5.8],
    [300, 152, 48, 5.8],
    [266, 208, 40, 6.4],
    [228, 178, 44, 5.6],
    [318, 224, 42, 6],
    [244, 238, 46, 5.4],
  ];
  const dimmed = !lightsOn ? 0.2 : phase === "opening" ? 0.6 : glow > 1 ? 1 : 0.8 + 0.2 * glow;

  const slab = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, -4);
  return (
    <g>
      {/* floor slab + light grey plank floor */}
      <polygon points={slab.left} fill="#b9a58a" {...stroke} />
      <polygon points={slab.right} fill="#a8967a" {...stroke} />
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill="#d9d3c6" {...stroke} />
      <Wash points={rectPts(F.x0, F.y0, F.x1, F.y1)} shade={false} o={0.9} />
      {Array.from({ length: 13 }).map((_, k) => (
        <polyline key={k} points={pts([[F.x0 + 4, F.y0 + k * 10], [F.x1, F.y0 + k * 10]])} stroke="#b9b1a2" strokeWidth={0.6} opacity={0.6} />
      ))}
      {Array.from({ length: 15 }).map((_, k) => (
        <polyline key={`v${k}`} points={pts([[F.x0 + 6 + ((k * 23) % 140), F.y0 + (k % 2) * 10 + 4 + ((k * 31) % 100)], [F.x0 + 6 + ((k * 23) % 140), F.y0 + (k % 2) * 10 + 10 + ((k * 31) % 100)]])} stroke="#b9b1a2" strokeWidth={0.5} opacity={0.5} />
      ))}
      {/* soft rug under the lounge */}
      <polygon points={rectPts(306, 206, 338, 250)} fill="#c9b9a2" opacity={0.55} />

      <BackWall />
      <SideWall restroom={signals.restroomSign} />
      {lightsOn && signals.lighting !== "dim" && (
        <g style={{ pointerEvents: "none" }}>
          {[214, 250, 292].map((x, i) => (
            <polygon key={x} className="beam" style={{ animationDelay: `${-i * 2.3}s` }} points={pts([[x, F.y1, 0], [x + 24, F.y1, 0], [x + 46, F.y1 - 70, 0], [x + 22, F.y1 - 70, 0]])} fill="url(#beamGrad)" />
          ))}
        </g>
      )}
      {lightsOn && <Motes />}

      {items.map((it, i) => (
        <g key={i}>{it.el}</g>
      ))}

      {staff && <Steam x={246} y={150} z={34} />}
      {patrons && <Steam x={268} y={210} z={12} d={1.2} />}
      <g style={{ opacity: dimmed, pointerEvents: "none" }}>
        {lanterns.map(([x, y, z, r], i) => (
          <Lantern key={i} x={x} y={y} z={z} r={r} />
        ))}
      </g>

      <polygon
        points={rectPts(F.x0, F.y0, F.x1, F.y1)}
        fill={!lightsOn || signals.lighting === "dim" ? "#1d2536" : "#ffe3a0"}
        opacity={!lightsOn ? 0.5 : phase === "opening" ? 0.18 : signals.lighting === "dim" ? 0.22 : signals.lighting === "warm" ? 0.1 : 0}
        style={{ pointerEvents: "none" }}
      />

      {/* cutaway frame: low knee walls + corner pillar + black window mullions stay visible */}
      {(() => {
        const l = boxFaces(F.x0, F.y1 - 3, F.x1, F.y1, 8);
        const r = boxFaces(F.x1 - 3, F.y0, F.x1, F.y1, 8);
        const pil = boxFaces(F.x1 - 6, F.y1 - 6, F.x1 + 2, F.y1 + 2, F.h);
        return (
          <g>
            <polygon points={l.left} fill="#b05a45" {...stroke} />
            <polygon points={l.top} fill="#e3d4b3" {...stroke} />
            <polygon points={r.right} fill="#8a4a3a" {...stroke} />
            <polygon points={r.top} fill="#e3d4b3" {...stroke} />
            <polygon points={pil.left} fill="#b05a45" {...stroke} />
            <polygon points={pil.right} fill="#8f4838" {...stroke} />
            <polygon points={pil.top} fill="#e3d4b3" {...stroke} />
            <Wash points={pil.left} />
            <polygon points={pts([[F.x0, F.y1, 8], [F.x1, F.y1, 8], [F.x1, F.y1, F.h], [F.x0, F.y1, F.h]])} fill="#cfe3e6" opacity={0.1} style={{ pointerEvents: "none" }} />
            <polygon points={pts([[F.x1, F.y1, 8], [F.x1, F.y0, 8], [F.x1, F.y0, F.h], [F.x1, F.y1, F.h]])} fill="#cfe3e6" opacity={0.1} style={{ pointerEvents: "none" }} />
            {[0, 1, 2, 3].map((i) => {
              const a = P(F.x0 + i * 48, F.y1, 8);
              const b = P(F.x0 + i * 48, F.y1, F.h);
              return <line key={`pl${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2b2b2e" strokeWidth={1.4} />;
            })}
            {[1, 2, 3].map((i) => {
              const a = P(F.x1, F.y1 - i * 32, 8);
              const b = P(F.x1, F.y1 - i * 32, F.h);
              return <line key={`pr${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2b2b2e" strokeWidth={1.4} />;
            })}
          </g>
        );
      })()}
      {shade("#000000", 0) && null}
    </g>
  );
}

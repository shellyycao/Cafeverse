import type { ReactNode } from "react";
import { P, boxFaces, pts, rectPts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/durham";
import { Armchair, Bubble, Dog, Person, RoundTable, SweepingStaff, Wash } from "./primitives";
import type { Phase } from "@/lib/hours";
import type { SceneSignals } from "@/lib/scene";

const stroke = { stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.7, strokeLinejoin: "round" as const };
const WOOD = "#b98456";
const COUNTER = "#8d7d69"; // grey-brown wood panelling (from reference photos)
const TOPWOOD = "#dcb27a"; // butcher-block counter top
const BARWOOD = "#dcc08e"; // light wood window bar
const WALL = "#f6f2ea"; // white walls

/** plane facing +gy (like the café's left/front face) — u along +gx, y negative = up */
function PlaneY({ x, y, z = 0, children }: { x: number; y: number; z?: number; children: ReactNode }) {
  const o = P(x, y, z);
  return <g transform={`matrix(1 .5 0 1 ${o.x} ${o.y})`}>{children}</g>;
}
/** plane facing +gx — u runs toward -gy */
function PlaneX({ x, y, z = 0, children }: { x: number; y: number; z?: number; children: ReactNode }) {
  const o = P(x, y, z);
  return <g transform={`matrix(1 -.5 0 1 ${o.x} ${o.y})`}>{children}</g>;
}

const BACK_LEN = F.x1 - F.x0; // 144 along x on the back wall (y = y0)
const SIDE_LEN = F.y1 - F.y0; // 128 along y on the side wall (x = x0)

function BackWall() {
  const H = F.h;
  return (
    <PlaneY x={F.x0} y={F.y0}>
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill={WALL} {...stroke} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#washPat)" style={{ pointerEvents: "none" }} />
      <rect x={0} y={-H} width={BACK_LEN} height={H} fill="url(#faceShade)" style={{ pointerEvents: "none" }} />
      <rect x={0} y={-17} width={BACK_LEN} height={17} fill="#dcd5c8" {...stroke} />
      {/* black track light with spots */}
      <path d={`M6 ${-H + 3} H${BACK_LEN - 6}`} stroke="#2b2b2e" strokeWidth={1.2} />
      {[22, 52, 82, 112].map((u) => (
        <path key={u} d={`M${u} ${-H + 3} l1.6 4.4 h-3.2z`} fill="#2b2b2e" />
      ))}
      {/* three menu boards: Eat / Specials (chalkboard) / Sip */}
      {[
        [10, 26, "#f6ecd6"],
        [40, 26, "#2f3a35"],
        [70, 26, "#f6ecd6"],
      ].map(([u, w, fill], i) => (
        <g key={i}>
          <rect x={u as number} y={-52} width={w as number} height={25} rx={1} fill={fill as string} stroke="#a9794c" strokeWidth={1.4} />
          {[-46, -41.5, -37, -33, -29.6].map((y, k) => (
            <path key={y} d={`M${(u as number) + 3.4} ${y} h${[16, 12, 17, 11, 14][k]}`} stroke={i === 1 ? "#f1e7cf" : "#8a7255"} strokeWidth={0.8} strokeLinecap="round" opacity={0.85} />
          ))}
        </g>
      ))}
      {/* floating wood shelves with plants and coffee bags */}
      <rect x={104} y={-42} width={34} height={2.2} fill="#d3a56d" {...stroke} />
      <rect x={104} y={-26} width={34} height={2.2} fill="#d3a56d" {...stroke} />
      <circle cx={112} cy={-47} r={4} fill="#7fa354" />
      <circle cx={117} cy={-48.5} r={3.4} fill="#8fae5a" />
      <rect x={109} y={-44} width={9} height={2.8} fill="#e8e1d2" {...stroke} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={122 + k * 5} y={-34} width={4.4} height={8} rx={0.8} fill={["#c9a27a", "#e6d9c2", "#b8946b"][k]} {...stroke} />
      ))}
      <rect x={126} y={-52} width={11} height={9} fill="#fffaf0" stroke="#3a3a3e" strokeWidth={1.1} />
      <path d="M128 -44 l3 -5 l3 3 l2 -2" stroke="#8a7255" strokeWidth={0.7} fill="none" />
    </PlaneY>
  );
}

function SideWall({ restroom }: { restroom: boolean }) {
  const H = F.h;
  return (
    <PlaneX x={F.x0} y={F.y1}>
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="#34475d" {...stroke} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#washPat)" opacity={0.7} style={{ pointerEvents: "none" }} />
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill="url(#hatch)" opacity={0.25} style={{ pointerEvents: "none" }} />
      <rect x={0} y={-17} width={SIDE_LEN} height={17} fill="#2b3b4e" {...stroke} />
      {/* framed seascapes */}
      {[
        [14, 30, "#9cc3c9"],
        [52, 30, "#b8d3d6"],
        [90, 24, "#d9e6e4"],
      ].map(([u, w, c], i) => (
        <g key={i}>
          <rect x={u as number} y={-50} width={w as number} height={24} fill="#f4efe4" stroke="#ece4d2" strokeWidth={1} />
          <rect x={(u as number) + 2} y={-48} width={(w as number) - 4} height={20} fill={c as string} />
          <path d={`M${(u as number) + 2} -36 q${(w as number) / 4} -5 ${(w as number) / 2 - 2} 0 t${(w as number) / 2 - 2} 0`} stroke="#fff" strokeWidth={1.1} fill="none" opacity={0.8} />
          <rect x={(u as number) + 2} y={-34} width={(w as number) - 4} height={6} fill="#5f8a98" opacity={0.55} />
        </g>
      ))}
      {restroom && (
        <g>
          <rect x={104} y={-40} width={16} height={36} rx={1} fill="#8a6a4a" {...stroke} />
          <rect x={107} y={-47} width={10} height={6} rx={1.2} fill="#fffaf0" {...stroke} />
          <text x={112} y={-42.4} textAnchor="middle" fontSize={4.6} fontWeight={700} fill="#6a4a30">WC</text>
        </g>
      )}
    </PlaneX>
  );
}

function Pendant({ x, y, z = 56, drop = 12 }: { x: number; y: number; z?: number; drop?: number }) {
  const top = P(x, y, F.h);
  const lamp = P(x, y, z - drop);
  return (
    <g>
      <line x1={top.x} y1={top.y} x2={lamp.x} y2={lamp.y} stroke="#3f3a36" strokeWidth={0.6} />
      <circle cx={lamp.x} cy={lamp.y + 5} r={15} fill="#fff1c4" opacity={0.2} />
      <circle cx={lamp.x} cy={lamp.y + 5} r={5.6} fill="#fffaf0" stroke={INK} strokeOpacity={0.45} strokeWidth={0.7} />
      <path d={`M${lamp.x - 5} ${lamp.y + 5} q5 3 10 0 M${lamp.x - 4} ${lamp.y + 2.4} q4 2.4 8 0`} stroke="#d8cdb6" strokeWidth={0.5} fill="none" />
    </g>
  );
}

function Stool({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={1} cy={1} rx={5.5} ry={2.4} fill="#6b5a3a" opacity={0.2} />
      <path d="M-3.4 -1 L-2.4 -11 M3.4 -1 L2.4 -11" stroke="#2b2724" strokeWidth={1.2} />
      <ellipse cx={0} cy={-11.6} rx={5} ry={2.4} fill="#e2d2b2" {...stroke} />
    </g>
  );
}

/** tiny hand-painted pastry: color picks the type */
function Treat({ c, cx, cy }: { c: string; cx: number; cy: number }) {
  const ink = { stroke: INK, strokeOpacity: 0.45, strokeWidth: 0.5 };
  if (c === "#c98f55")
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={5} ry={2.9} fill="#d79a55" {...ink} />
        <path d={`M${cx - 2.6} ${cy - 1.8} l1.6 3 M${cx} ${cy - 2.4} l1.6 3.2 M${cx + 2.6} ${cy - 1.8} l1.4 2.8`} stroke="#f2cf91" strokeWidth={0.8} strokeLinecap="round" />
      </g>
    );
  if (c === "#e58b8b")
    return (
      <g>
        <rect x={cx - 3.6} y={cy - 2.4} width={7.2} height={4} rx={1} fill="#f2c9cb" {...ink} />
        <ellipse cx={cx} cy={cy - 2.4} rx={3.8} ry={1.6} fill="#fffaf0" {...ink} />
        <circle cx={cx} cy={cy - 3.9} r={1.25} fill="#c7433f" />
        <path d={`M${cx - 3.6} ${cy - 0.6} h7.2`} stroke="#e58b8b" strokeWidth={0.7} />
      </g>
    );
  if (c === "#f6ead2")
    return (
      <g>
        <path d={`M${cx - 3.8} ${cy + 1.2} q0 -5.2 3.8 -5.2 q3.8 0 3.8 5.2z`} fill="#fbf1de" {...ink} />
        <circle cx={cx - 1} cy={cy - 1.6} r={0.45} fill="#d99a5b" />
        <circle cx={cx + 1.4} cy={cy - 0.4} r={0.45} fill="#d99a5b" />
      </g>
    );
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={4.6} ry={2.7} fill="#e0a85f" {...ink} />
      <path d={`M${cx - 3} ${cy - 1.4} l6 2.8 M${cx} ${cy - 2.2} l3.4 3.2 M${cx - 3.4} ${cy + 0.4} l3.4 -2.6`} stroke="#b8793a" strokeWidth={0.6} opacity={0.8} />
    </g>
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
  const pts: Array<[number, number, number]> = [[220, 200, 30], [252, 176, 40], [284, 214, 26], [310, 190, 36], [236, 236, 22], [268, 150, 46], [328, 226, 30], [208, 160, 34]];
  return (
    <g style={{ pointerEvents: "none" }}>
      {pts.map(([x, y, z], i) => {
        const p = P(x, y, z);
        return <circle key={i} className="mote" style={{ animationDelay: `${-i * 0.9}s` }} cx={p.x} cy={p.y} r={0.9 + (i % 3) * 0.3} fill="#fff6d8" />;
      })}
    </g>
  );
}

function PastryCase({ per }: { per: number }) {
  // glass front of the counter at y = counter y1, running along x
  const x0 = 262,
    x1 = 326,
    y1 = 166,
    zb = 5,
    zt = 17;
  const cakes = [
    ["#e58b8b", "#f6ead2", "#d99a5b", "#e58b8b", "#c98f55", "#f6ead2"],
    ["#d99a5b", "#e58b8b", "#c98f55", "#f6ead2", "#d99a5b", "#e58b8b"],
  ];
  return (
    <g>
      <PlaneY x={x0} y={y1} z={0}>
        <rect x={0} y={-zt} width={x1 - x0} height={zt} fill="#e9f1ee" opacity={0.5} {...stroke} />
        <rect x={0} y={-zb} width={x1 - x0} height={zb} fill="#f1eee6" {...stroke} />
        {[0, 1].map((r) => {
          const base = zb + 4 + r * 5.6;
          return (
            <g key={r}>
              <rect x={1} y={-base} width={x1 - x0 - 2} height={1.1} fill="#fffaf0" opacity={0.9} />
              {cakes[r].slice(0, per).map((c, k) => (
                <Treat key={k} c={c} cx={6 + k * 10.4} cy={-base - 2.4} />
              ))}
            </g>
          );
        })}
        <rect x={0} y={-zt} width={x1 - x0} height={zt} fill="url(#glassSheen)" opacity={0.45} />
      </PlaneY>
    </g>
  );
}

export default function CafeInterior({
  level,
  onSelect,
  guard,
  signals,
  crowd = 1,
  phase = "open",
}: {
  signals: SceneSignals;
  crowd?: 0 | 1 | 2;
  phase?: Phase;
  level: number;
  onSelect?: (id: "barista" | "pastry" | "bar" | "social") => void;
  guard: (fn: () => void) => () => void;
}) {
  const click = (id: "barista" | "pastry" | "bar" | "social") => guard(() => onSelect?.(id));
  const active = level >= 4;
  const patrons = phase === "open";
  const staff = phase !== "closed";
  const lightsOn = phase !== "closed";
  const per = signals.pastryProminence === "high" ? 6 : signals.pastryProminence === "medium" ? 4 : 2;
  const glow = signals.lighting === "warm" ? 1 : signals.lighting === "bright" ? 0.55 : 1.5;
  const counter = boxFaces(232, 142, 326, 166, 17);
  const counterTop = boxFaces(232, 142, 326, 166, 2, 17);
  const bar = boxFaces(202, 148, 214, 228, 19);
  const slab = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, -4);

  return (
    <g>
      {/* floor slab + wood floor */}
      <polygon points={slab.left} fill="#b9a58a" {...stroke} />
      <polygon points={slab.right} fill="#a8967a" {...stroke} />
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill="#dad3c6" {...stroke} />
      <Wash points={rectPts(F.x0, F.y0, F.x1, F.y1)} shade={false} o={0.9} />
      {Array.from({ length: 13 }).map((_, k) => (
        <polyline key={k} points={pts([[F.x0 + 4, F.y0 + k * 10], [F.x1, F.y0 + k * 10]])} stroke="#bdb5a6" strokeWidth={0.6} opacity={0.6} />
      ))}

      <BackWall />
      <SideWall restroom={signals.restroomSign} />
      {lightsOn && signals.lighting !== "dim" && (
        <g className="beams" style={{ pointerEvents: "none" }}>
          {[214, 250, 292].map((x, i) => (
            <polygon key={x} className="beam" style={{ animationDelay: `${-i * 2.3}s` }} points={pts([[x, F.y1, 0], [x + 24, F.y1, 0], [x + 46, F.y1 - 70, 0], [x + 22, F.y1 - 70, 0]])} fill="url(#beamGrad)" />
          ))}
        </g>
      )}
      <g style={{ opacity: !lightsOn ? 0.2 : phase === "opening" ? 0.6 : glow > 1 ? 1 : 0.75 + 0.25 * glow }}>
        <Pendant x={250} y={150} />
        <Pendant x={300} y={150} />
        <Pendant x={262} y={206} z={52} drop={10} />
        <Pendant x={226} y={176} z={52} drop={10} />
      </g>

      {/* ----- barista (behind counter) ----- */}
      {staff && (
      <g className={active ? "hotspot" : undefined} data-hotspot="barista" onClick={click("barista")} style={{ pointerEvents: active ? "auto" : "none" }}>
        <rect x={0} y={0} width={0} height={0} />
        <g transform="translate(0 0)">
          <Person x={250} y={136} shirt="#f1e7d4" hair="#3c2c22" scale={1.45} />
          {/* apron + cap */}
          {(() => {
            const p = P(250, 136);
            return (
              <g transform={`translate(${p.x} ${p.y}) scale(1.45)`}>
                <path d="M-3 -10 h6 v10 h-6z" fill="#6f8a6e" opacity={0.95} />
                <path d="M-3.8 -23.6 a3.8 3 0 0 1 7.6 0 z" fill="#8a5a3a" />
              </g>
            );
          })()}
        </g>
        <polygon points={rectPts(244, 130, 258, 142)} fill="transparent" />
        <circle cx={P(250, 136).x} cy={P(250, 136).y - 14} r={14} fill="transparent" />
      </g>
      )}
      {phase === "closing" && <SweepingStaff x={262} y={224} />}

      {lightsOn && <Motes />}
      {staff && <Steam x={246} y={152} z={33} />}
      {patrons && <Steam x={268} y={206} z={12} d={1.2} />}
      {/* ----- counter ----- */}
      <polygon points={counter.left} fill={COUNTER} {...stroke} />
      <polygon points={counter.right} fill={shade(COUNTER, -0.14)} {...stroke} />
      <PlaneY x={232} y={166}>
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${10 + k * 7} -17 V0`} stroke={INK} strokeOpacity={0.22} strokeWidth={0.6} />
        ))}
      </PlaneY>
      <polygon points={counterTop.top} fill={TOPWOOD} {...stroke} />
      <polygon points={counterTop.left} fill={shade(TOPWOOD, -0.1)} {...stroke} />
      <polygon points={counterTop.right} fill={shade(TOPWOOD, -0.22)} {...stroke} />
      {/* espresso machine + register on the wood section */}
      {(() => {
        const m = boxFaces(238, 146, 254, 158, 12, 19);
        return (
          <g>
            <polygon points={m.left} fill="#cfcabd" {...stroke} />
            <polygon points={m.right} fill="#aaa699" {...stroke} />
            <polygon points={m.top} fill="#e2ded1" {...stroke} />
            <circle {...(() => { const p = P(246, 158, 28); return { cx: p.x, cy: p.y }; })()} r={1.4} fill="#b8433f" />
          </g>
        );
      })()}
      {/* pastry glass front + top case */}
      <g className={active ? "hotspot" : undefined} data-hotspot="pastry" onClick={click("pastry")} style={{ pointerEvents: active ? "auto" : "none" }}>
        <PastryCase per={per} />
        {(() => {
          const c = boxFaces(266, 148, 322, 164, 11, 19);
          return (
            <g>
              <polygon points={c.left} fill="#e9f1ee" opacity={0.55} {...stroke} />
              <polygon points={c.right} fill="#cfdedb" opacity={0.55} {...stroke} />
              <polygon points={c.top} fill="#f4faf7" opacity={0.7} {...stroke} />
              {[0, 1, 2, 3].slice(0, signals.pastryProminence === "high" ? 4 : signals.pastryProminence === "medium" ? 2 : 0).map((k) => {
                const p = P(274 + k * 12, 160, 22);
                return <Treat key={k} c={["#d99a5b", "#f6ead2", "#e58b8b", "#c98f55"][k]} cx={p.x} cy={p.y} />;
              })}
            </g>
          );
        })()}
      </g>

      {/* ----- window bar + stools + study person ----- */}
      <polygon points={bar.left} fill={BARWOOD} {...stroke} />
      <polygon points={bar.right} fill={shade(BARWOOD, -0.14)} {...stroke} />
      <polygon points={boxFaces(200, 146, 216, 230, 2, 19).top} fill="#e6cda0" {...stroke} />
      {[162, 182, 202, 218].map((y) => (
        <Stool key={y} x={228} y={y} />
      ))}
      <g className={active ? "hotspot" : undefined} data-hotspot="bar" onClick={click("bar")} style={{ pointerEvents: active ? "auto" : "none" }}>
        {signals.laptopWorkers === 0 ? (
          crowd >= 1 && <Person x={228} y={218} z={11} sitting shirt="#c9a27a" hair="#5a3a24" scale={1.3} />
        ) : (
          [
            [182, "#9bb08a", "#2e231c"],
            [218, "#c9a27a", "#5a3a24"],
            [162, "#8aa0b8", "#3c2c22"],
            [202, "#d9a0a0", "#6a4326"],
          ]
            .slice(0, signals.laptopWorkers)
            .map(([y, shirt, hair]) => <Person key={y as number} x={228} y={y as number} z={11} sitting shirt={shirt as string} hair={hair as string} laptop scale={1.3} />)
        )}
        {(() => {
          const p = P(216, 190, 22);
          return (
            <g transform={`translate(${p.x} ${p.y})`}>
              <path d="M-5 0 h10 l2 -5 h-10z" fill="#e9e6df" {...stroke} />
            </g>
          );
        })()}
        <polygon points={rectPts(200, 170, 236, 230)} fill="transparent" />
      </g>

      {/* ----- round tables ----- */}
      <g className={active ? "hotspot" : undefined} data-hotspot="social" onClick={click("social")} style={{ pointerEvents: active ? "auto" : "none" }}>
        <g transform={`translate(0 0)`}>
          <RoundTableScaled x={268} y={206} />
          {patrons && <Person x={258} y={212} z={4} sitting shirt="#6d8a64" hair="#2e231c" scale={1.3} />}
          {signals.chattingGroups >= 1 && (
            <>
              <Person x={279} y={199} z={4} sitting shirt="#d9a0a0" hair="#7a4a2c" scale={1.3} />
              <Bubble x={262} y={208} z={32} />
              <Bubble x={276} y={198} z={34} />
            </>
          )}
        </g>
        <polygon points={rectPts(250, 192, 290, 222)} fill="transparent" />
      </g>
      <Armchair x={332} y={234} />
      <Armchair x={304} y={248} />
      <g transform="scale(0.8)" style={{ transformOrigin: `${P(318, 240).x}px ${P(318, 240).y}px` }}>
        <RoundTable x={318} y={240} chairs={0} />
      </g>
      {crowd >= 1 && <Person x={302} y={234} z={4} sitting shirt="#cfa163" hair="#3c2c22" scale={1.3} />}
      {crowd >= 2 && signals.chattingGroups < 2 && <Person x={320} y={222} z={4} sitting shirt="#7d9aa6" hair="#2e231c" scale={1.3} />}
      {crowd >= 2 && (
        <>
          <Person x={286} y={178} shirt="#b66d6a" hair="#3c2c22" scale={1.3} />
          <Person x={304} y={182} shirt="#6d8a64" hair="#7a4a2c" scale={1.3} />
        </>
      )}
      {signals.chattingGroups >= 2 && (
        <>
          <Person x={320} y={222} z={4} sitting shirt="#8aa0b8" hair="#2e231c" scale={1.3} />
          <Bubble x={304} y={232} z={32} />
        </>
      )}
      {signals.dogInside && <Dog x={246} y={236} scale={1.25} />}

      {/* plants */}
      {[[330, 244], [214, 244], [318, 134], [336, 190], [208, 134], [244, 246]].slice(0, signals.plants === "few" ? 1 : signals.plants === "some" ? 3 : 6).map(([x, y], i) => {
        const b = P(x, y);
        return (
          <g key={i} transform={`translate(${b.x} ${b.y})`}>
            <ellipse cx={1} cy={1} rx={8} ry={3} fill="#6b5a3a" opacity={0.18} />
            <path d="M-5 -9 h10 l-1.4 9 h-7.2z" fill="#c27d5a" {...stroke} />
            <circle cx={-3} cy={-14} r={5.2} fill="#7fa354" />
            <circle cx={4} cy={-15} r={5.6} fill="#8fae5a" />
            <circle cx={0} cy={-20} r={4.8} fill="#a9bf6a" />
          </g>
        );
      })}

      <polygon
        points={rectPts(F.x0, F.y0, F.x1, F.y1)}
        fill={!lightsOn || signals.lighting === "dim" ? "#1d2536" : "#ffe3a0"}
        opacity={!lightsOn ? 0.5 : phase === "opening" ? 0.18 : signals.lighting === "dim" ? 0.22 : signals.lighting === "warm" ? 0.1 : 0}
        style={{ pointerEvents: "none" }}
      />
      {/* cutaway frame: low knee walls + corner pillar stay visible */}
      {(() => {
        const l = boxFaces(F.x0, F.y1 - 3, F.x1, F.y1, 8);
        const r = boxFaces(F.x1 - 3, F.y0, F.x1, F.y1, 8);
        const pil = boxFaces(F.x1 - 6, F.y1 - 6, F.x1 + 2, F.y1 + 2, F.h);
        return (
          <g>
            <polygon points={l.left} fill="#b9a58a" {...stroke} />
            <polygon points={l.top} fill="#e3d4b3" {...stroke} />
            <polygon points={r.right} fill="#a8967a" {...stroke} />
            <polygon points={r.top} fill="#e3d4b3" {...stroke} />
            <polygon points={pil.left} fill="#c58f6c" {...stroke} />
            <polygon points={pil.right} fill="#a97555" {...stroke} />
            <polygon points={pil.top} fill="#e3d4b3" {...stroke} />
            {/* glass storefront ghost: black mullions + faint sheen so the windows still read */}
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
    </g>
  );
}

function RoundTableScaled({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y}) scale(1.35) translate(${-b.x} ${-b.y})`}>
      <g transform={`translate(${b.x * 0} 0)`}>
        <RoundTable x={x} y={y} chairs={0} />
      </g>
    </g>
  );
}

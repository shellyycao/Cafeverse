import type { ReactNode } from "react";
import { P, boxFaces, pts, rectPts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/neighborhood";
import { Person, RoundTable } from "./primitives";

const stroke = { stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.7, strokeLinejoin: "round" as const };
const WOOD = "#b98456";
const WALL = "#f2e4c8";

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
      <rect x={0} y={-17} width={BACK_LEN} height={17} fill={WOOD} {...stroke} />
      {[24, 48, 72, 96, 120].map((u) => (
        <path key={u} d={`M${u} -17 V0`} stroke={INK} strokeOpacity={0.25} strokeWidth={0.6} />
      ))}
      {/* chalkboard menu */}
      <rect x={14} y={-50} width={36} height={24} rx={1.2} fill="#3d4741" stroke="#a77a52" strokeWidth={1.6} />
      {[-44, -39, -34, -30].map((y, i) => (
        <path key={y} d={`M19 ${y} h${[22, 17, 24, 14][i]}`} stroke="#f1e7cf" strokeWidth={0.9} strokeLinecap="round" opacity={0.85} />
      ))}
      {/* bread shelves */}
      <g>
        <rect x={62} y={-52} width={40} height={30} fill="#9b6c43" opacity={0.25} />
        {[-50, -40, -30].map((y, r) => (
          <g key={y}>
            <rect x={62} y={y + 8} width={40} height={2.2} fill="#a77a52" {...stroke} />
            {[0, 1, 2].map((k) => (
              <ellipse key={k} cx={70 + k * 12} cy={y + 4.8} rx={5.2} ry={3.2} fill={["#d9944f", "#c9833f", "#e0a35e"][(k + r) % 3]} stroke={INK} strokeOpacity={0.4} strokeWidth={0.5} />
            ))}
          </g>
        ))}
      </g>
      {/* jars + plant shelf */}
      <rect x={112} y={-40} width={26} height={2.2} fill="#a77a52" {...stroke} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={115 + k * 8} y={-48} width={6} height={8} rx={1.4} fill={["#cfe0d0", "#f0d9a0", "#e7c3bd"][k]} {...stroke} />
      ))}
      <rect x={112} y={-24} width={26} height={2.2} fill="#a77a52" {...stroke} />
      <circle cx={122} cy={-28} r={3.6} fill="#7fa354" />
      <circle cx={127} cy={-29} r={3} fill="#8fae5a" />
      <rect x={120} y={-26} width={9} height={3} fill="#c27d5a" {...stroke} />
    </PlaneY>
  );
}

function SideWall() {
  const H = F.h;
  return (
    <PlaneX x={F.x0} y={F.y1}>
      <rect x={0} y={-H} width={SIDE_LEN} height={H} fill={shade(WALL, -0.07)} {...stroke} />
      <rect x={0} y={-17} width={SIDE_LEN} height={17} fill={shade(WOOD, -0.1)} {...stroke} />
      {[16, 66].map((u) => (
        <g key={u}>
          <rect x={u - 2} y={-49} width={42} height={31} fill="#587a58" {...stroke} />
          <rect x={u} y={-47} width={38} height={27} fill="#d9ead6" />
          <circle cx={u + 12} cy={-34} r={9} fill="#a9bf6a" opacity={0.85} />
          <circle cx={u + 26} cy={-31} r={8} fill="#8fae5a" opacity={0.85} />
          <path d={`M${u + 19} -47 V-20 M${u} -33 H${u + 38}`} stroke="#587a58" strokeWidth={1.2} />
          <rect x={u} y={-47} width={38} height={27} fill="url(#glassSheen)" opacity={0.5} />
        </g>
      ))}
      {/* hanging plant */}
      <path d="M116 -58 V-48" stroke="#6a4a30" strokeWidth={0.8} />
      <circle cx={116} cy={-44} r={5} fill="#7fa354" />
      <path d="M112 -42 q-4 8 -2 14 M120 -42 q3 8 1 12" stroke="#7fa354" strokeWidth={1.4} fill="none" />
    </PlaneX>
  );
}

function Pendant({ x, y, z = 56, drop = 12 }: { x: number; y: number; z?: number; drop?: number }) {
  const top = P(x, y, F.h);
  const lamp = P(x, y, z - drop);
  return (
    <g>
      <line x1={top.x} y1={top.y} x2={lamp.x} y2={lamp.y} stroke="#3f3a36" strokeWidth={0.7} />
      <circle cx={lamp.x} cy={lamp.y + 3} r={14} fill="#ffe3a0" opacity={0.2} />
      <path d={`M${lamp.x - 5} ${lamp.y + 4} a5 4.4 0 0 1 10 0z`} fill="#4b4a47" />
      <circle cx={lamp.x} cy={lamp.y + 5} r={1.6} fill="#fff1c4" />
    </g>
  );
}

function Stool({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <ellipse cx={1} cy={1} rx={5.5} ry={2.4} fill="#6b5a3a" opacity={0.2} />
      <path d="M-3.4 -1 L-2.4 -11 M3.4 -1 L2.4 -11" stroke="#6a4a30" strokeWidth={1.2} />
      <ellipse cx={0} cy={-11.6} rx={5} ry={2.4} fill="#c79264" {...stroke} />
    </g>
  );
}

function PastryCase() {
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
        <rect x={0} y={-zb} width={x1 - x0} height={zb} fill={WOOD} {...stroke} />
        {[0, 1].map((r) => {
          const base = zb + 4 + r * 5.6;
          return (
            <g key={r}>
              <rect x={1} y={-base} width={x1 - x0 - 2} height={1.1} fill="#fffaf0" opacity={0.9} />
              {cakes[r].map((c, k) => (
                <g key={k}>
                  <ellipse cx={6 + k * 10.4} cy={-base - 2.4} rx={4.3} ry={2.6} fill={c} stroke={INK} strokeOpacity={0.45} strokeWidth={0.5} />
                  {c === "#e58b8b" && <circle cx={6 + k * 10.4} cy={-base - 4.6} r={1} fill="#b8433f" />}
                </g>
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
}: {
  level: number;
  onSelect?: (id: "barista" | "pastry" | "bar" | "social") => void;
  guard: (fn: () => void) => () => void;
}) {
  const click = (id: "barista" | "pastry" | "bar" | "social") => guard(() => onSelect?.(id));
  const active = level >= 4;
  const counter = boxFaces(232, 142, 326, 166, 17);
  const counterTop = boxFaces(232, 142, 326, 166, 2, 17);
  const bar = boxFaces(202, 148, 214, 228, 19);
  const slab = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, -4);

  return (
    <g>
      {/* floor slab + wood floor */}
      <polygon points={slab.left} fill="#b9a58a" {...stroke} />
      <polygon points={slab.right} fill="#a8967a" {...stroke} />
      <polygon points={rectPts(F.x0, F.y0, F.x1, F.y1)} fill="#dcb98a" {...stroke} />
      {Array.from({ length: 13 }).map((_, k) => (
        <polyline key={k} points={pts([[F.x0 + 4, F.y0 + k * 10], [F.x1, F.y0 + k * 10]])} stroke="#b88f62" strokeWidth={0.6} opacity={0.6} />
      ))}
      <polygon points={pts(Array.from({ length: 28 }, (_, k) => [262 + Math.cos((k / 28) * 6.283) * 44, 212 + Math.sin((k / 28) * 6.283) * 26] as [number, number]))} fill="#e3b4ac" opacity={0.6} />

      <BackWall />
      <SideWall />
      <Pendant x={250} y={150} />
      <Pendant x={300} y={150} />
      <Pendant x={262} y={206} z={52} drop={10} />
      <Pendant x={226} y={176} z={52} drop={10} />

      {/* ----- barista (behind counter) ----- */}
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

      {/* ----- counter ----- */}
      <polygon points={counter.left} fill={WOOD} {...stroke} />
      <polygon points={counter.right} fill={shade(WOOD, -0.14)} {...stroke} />
      <PlaneY x={232} y={166}>
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${10 + k * 7} -17 V0`} stroke={INK} strokeOpacity={0.22} strokeWidth={0.6} />
        ))}
      </PlaneY>
      <polygon points={counterTop.top} fill="#d1a06d" {...stroke} />
      <polygon points={counterTop.left} fill="#c28e5c" {...stroke} />
      <polygon points={counterTop.right} fill="#a97a4b" {...stroke} />
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
        <PastryCase />
        {(() => {
          const c = boxFaces(266, 148, 322, 164, 11, 19);
          return (
            <g>
              <polygon points={c.left} fill="#e9f1ee" opacity={0.55} {...stroke} />
              <polygon points={c.right} fill="#cfdedb" opacity={0.55} {...stroke} />
              <polygon points={c.top} fill="#f4faf7" opacity={0.7} {...stroke} />
              {[0, 1, 2, 3].map((k) => {
                const p = P(274 + k * 12, 160, 22);
                return <ellipse key={k} cx={p.x} cy={p.y} rx={4.2} ry={2.6} fill={["#d99a5b", "#f6ead2", "#e58b8b", "#c98f55"][k]} stroke={INK} strokeOpacity={0.4} strokeWidth={0.5} />;
              })}
            </g>
          );
        })()}
      </g>

      {/* ----- window bar + stools + study person ----- */}
      <polygon points={bar.left} fill={WOOD} {...stroke} />
      <polygon points={bar.right} fill={shade(WOOD, -0.14)} {...stroke} />
      <polygon points={boxFaces(200, 146, 216, 230, 2, 19).top} fill="#d1a06d" {...stroke} />
      {[162, 182, 202, 218].map((y) => (
        <Stool key={y} x={228} y={y} />
      ))}
      <g className={active ? "hotspot" : undefined} data-hotspot="bar" onClick={click("bar")} style={{ pointerEvents: active ? "auto" : "none" }}>
        <Person x={228} y={182} z={11} sitting shirt="#9bb08a" hair="#2e231c" laptop scale={1.3} />
        <Person x={228} y={218} z={11} sitting shirt="#c9a27a" hair="#5a3a24" scale={1.3} />
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
          <Person x={258} y={212} z={4} sitting shirt="#6d8a64" hair="#2e231c" scale={1.3} />
          <Person x={279} y={199} z={4} sitting shirt="#d9a0a0" hair="#7a4a2c" scale={1.3} />
        </g>
        <polygon points={rectPts(250, 192, 290, 222)} fill="transparent" />
      </g>
      <RoundTableScaled x={310} y={228} />
      <Person x={302} y={234} z={4} sitting shirt="#cfa163" hair="#3c2c22" scale={1.3} />

      {/* plants */}
      {[[330, 244], [214, 244], [318, 134]].map(([x, y], i) => {
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

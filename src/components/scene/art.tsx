import type { ReactNode } from "react";
import { P, boxFaces, pts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";

/**
 * Hand-drawn furnishings modelled on the supplied Foster Street Coffee photos
 * (oak tables + black cross-back chairs, grey slatted counter, mint-framed glass case, paper lanterns,
 * navy art wall, brown leather armchairs, black retail table with kraft coffee bags…).
 */
const L = { stroke: "#6b4a2c", strokeOpacity: 0.34, strokeWidth: 0.55, strokeLinejoin: "round" as const };

/* ---------- planes ---------- */
export function PlaneY({ x, y, z = 0, children }: { x: number; y: number; z?: number; children: ReactNode }) {
  const o = P(x, y, z);
  return <g transform={`matrix(1 .5 0 1 ${o.x} ${o.y})`}>{children}</g>;
}
export function PlaneX({ x, y, z = 0, children }: { x: number; y: number; z?: number; children: ReactNode }) {
  const o = P(x, y, z);
  return <g transform={`matrix(1 -.5 0 1 ${o.x} ${o.y})`}>{children}</g>;
}

function Shadow({ x, y, rx, ry, o = 0.2 }: { x: number; y: number; rx: number; ry: number; o?: number }) {
  const p = P(x, y);
  return <ellipse cx={p.x + 1.5} cy={p.y + 1} rx={rx} ry={ry} fill="#5a4630" opacity={o} />;
}

/* ---------- people ---------- */
export type Hair = "short" | "bun" | "long" | "curly" | "cap" | "ponytail";
export type Holding = "none" | "cup" | "laptop" | "book" | "broom";

/**
 * A small person with a face, hair, clothes and limbs. Standing or seated.
 * Drawn at screen scale ~26 units tall (before `scale`).
 */
export function Human({
  x,
  y,
  z = 0,
  shirt = "#b66d6a",
  pants = "#4a4a58",
  hairColor = "#3c2c22",
  hair = "short",
  skin = "#e8bd9a",
  sitting = false,
  holding = "none",
  apron,
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  z?: number;
  shirt?: string;
  pants?: string;
  hairColor?: string;
  hair?: Hair;
  skin?: string;
  sitting?: boolean;
  holding?: Holding;
  apron?: string;
  scale?: number;
  flip?: boolean;
}) {
  const p = P(x, y, z);
  const outline = { stroke: INK, strokeOpacity: 0.5, strokeWidth: 0.55, strokeLinejoin: "round" as const };
  const ty = sitting ? 5 : 0; // torso base offset when seated (hips lower)
  const headY = sitting ? -19.5 : -23.5;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={0.6} rx={sitting ? 6.5 : 5} ry={2.1} fill="#5a4630" opacity={0.22} />
      <g className="bob" style={{ animationDelay: `${-((Math.abs(x * 7 + y * 3) % 30) / 10).toFixed(1)}s` }}>
        {/* legs */}
        {sitting ? (
          <g>
            <path d={`M-2.8 -6 q5.5 0.5 8 2.2 l-0.6 2.6 q-3 -1.2 -7.6 -1z`} fill={pants} {...outline} />
            <path d={`M2.2 -4 l1.2 5.4 h-2.8 l-0.4 -5z`} fill={pants} {...outline} />
            <ellipse cx={3.2} cy={1.2} rx={2.2} ry={1.1} fill="#2f2a27" />
          </g>
        ) : (
          <g>
            <path d="M-3.2 -9.5 h2.9 l-0.4 9 h-2.4z M0.3 -9.5 h2.9 l0.4 9 h-2.4z" fill={pants} {...outline} />
            <ellipse cx={-2.1} cy={0.4} rx={2.3} ry={1.1} fill="#2f2a27" />
            <ellipse cx={2.3} cy={0.4} rx={2.3} ry={1.1} fill="#2f2a27" />
          </g>
        )}
        {/* torso */}
        <path d={`M-4.4 ${-16.2 + ty} q0 -2.2 2.2 -2.4 h4.4 q2.2 0.2 2.2 2.4 v${8.6 - ty * 0.2} q0 1.4 -1.4 1.4 h-6 q-1.4 0 -1.4 -1.4z`} fill={shirt} {...outline} />
        {/* collar / neckline */}
        <path d={`M-1.6 ${-18.6 + ty} q1.6 1.8 3.2 0`} stroke={INK} strokeOpacity={0.45} strokeWidth={0.5} fill="none" />
        {apron && (
          <g>
            <path d={`M-3.3 ${-14.6 + ty} h6.6 v${9 - ty * 0.2} h-6.6z`} fill={apron} {...outline} />
            <rect x={-1.8} y={-10.4 + ty * 0.8} width={3.6} height={2.2} rx={0.5} fill={shade(apron, -0.12)} />
            <path d={`M-3.3 ${-14.6 + ty} l-1.2 -1.6 M3.3 ${-14.6 + ty} l1.2 -1.6`} stroke={apron} strokeWidth={0.6} />
          </g>
        )}
        {/* arms */}
        {holding === "broom" ? (
          <g>
            <path d={`M3.6 ${-16 + ty} q3 3 4 6`} stroke={shirt} strokeWidth={2.2} strokeLinecap="round" fill="none" />
            <circle cx={7.8} cy={-9.6 + ty} r={1.1} fill={skin} />
          </g>
        ) : holding === "laptop" ? (
          <g>
            <path d={`M-3.6 ${-15.6 + ty} q-1 4 2.6 6 M3.6 ${-15.6 + ty} q1.4 4 -2.2 6`} stroke={shirt} strokeWidth={2.1} strokeLinecap="round" fill="none" />
          </g>
        ) : holding === "cup" ? (
          <g>
            <path d={`M-4 ${-15.6 + ty} q-1.4 5 -0.6 8`} stroke={shirt} strokeWidth={2.1} strokeLinecap="round" fill="none" />
            <path d={`M4 ${-15.6 + ty} q2.4 3.4 0 6`} stroke={shirt} strokeWidth={2.1} strokeLinecap="round" fill="none" />
            <rect x={2.2} y={-12.4 + ty} width={3} height={3.6} rx={0.6} fill="#fffaf0" {...outline} />
            <rect x={2.2} y={-11.4 + ty} width={3} height={1.4} fill="#2f4668" />
          </g>
        ) : (
          <g>
            <path d={`M-4.2 ${-15.6 + ty} q-1.4 5 -0.8 8.4 M4.2 ${-15.6 + ty} q1.4 5 0.8 8.4`} stroke={shirt} strokeWidth={2.1} strokeLinecap="round" fill="none" />
            <circle cx={-5} cy={-7 + ty} r={1.05} fill={skin} />
            <circle cx={5} cy={-7 + ty} r={1.05} fill={skin} />
          </g>
        )}
        {/* neck + head */}
        <rect x={-1.2} y={-19.4 + ty} width={2.4} height={2} fill={shade(skin, -0.08)} />
        {hair === "long" && <path d={`M-4.4 ${headY + ty - 0.5} q-1 8 0.4 10.6 h1.6 l0.6 -9z M4.4 ${headY + ty - 0.5} q1 8 -0.4 10.6 h-1.6 l-0.6 -9z`} fill={hairColor} />}
        <ellipse cx={0} cy={headY + ty} rx={4.1} ry={4.4} fill={skin} {...outline} />
        {/* hair */}
        {hair === "short" && <path d={`M-4.4 ${headY + ty - 0.4} q0 -5.4 4.4 -5.2 q4.4 -0.2 4.4 5.2 q-2.2 -2.8 -4.4 -2.6 q-2.2 -0.2 -4.4 2.6z`} fill={hairColor} />}
        {hair === "cap" && (
          <g>
            <path d={`M-4.5 ${headY + ty - 0.6} q0 -5.6 4.5 -5.4 q4.5 -0.2 4.5 5.4z`} fill={hairColor} />
            <path d={`M-4.6 ${headY + ty - 0.6} h9.2 l1.8 1 h-3z`} fill={shade(hairColor, -0.2)} />
          </g>
        )}
        {hair === "bun" && (
          <g>
            <path d={`M-4.4 ${headY + ty - 0.4} q0 -5.4 4.4 -5.2 q4.4 -0.2 4.4 5.2 q-2.2 -2.6 -4.4 -2.4 q-2.2 -0.2 -4.4 2.4z`} fill={hairColor} />
            <circle cx={0} cy={headY + ty - 5.8} r={2} fill={hairColor} />
          </g>
        )}
        {hair === "ponytail" && (
          <g>
            <path d={`M-4.4 ${headY + ty - 0.4} q0 -5.4 4.4 -5.2 q4.4 -0.2 4.4 5.2 q-2.2 -2.6 -4.4 -2.4 q-2.2 -0.2 -4.4 2.4z`} fill={hairColor} />
            <path d={`M4 ${headY + ty - 3} q4 1 2.6 6.4`} stroke={hairColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          </g>
        )}
        {hair === "long" && <path d={`M-4.4 ${headY + ty - 0.2} q0 -5.6 4.4 -5.4 q4.4 -0.2 4.4 5.4 q-2.2 -3.2 -4.4 -3 q-2.2 -0.2 -4.4 3z`} fill={hairColor} />}
        {hair === "curly" && (
          <g fill={hairColor}>
            {[-3.4, -1.2, 1.2, 3.4].map((dx, i) => (
              <circle key={i} cx={dx} cy={headY + ty - 3.4 - (i % 2) * 0.7} r={2.1} />
            ))}
            <circle cx={-4} cy={headY + ty - 0.6} r={1.5} />
            <circle cx={4} cy={headY + ty - 0.6} r={1.5} />
          </g>
        )}
        {/* face */}
        <circle cx={-1.6} cy={headY + ty + 0.3} r={0.55} fill="#2e231c" />
        <circle cx={1.6} cy={headY + ty + 0.3} r={0.55} fill="#2e231c" />
        <path d={`M-2.4 ${headY + ty - 1.2} q0.8 -0.5 1.6 0 M0.8 ${headY + ty - 1.2} q0.8 -0.5 1.6 0`} stroke={hairColor} strokeWidth={0.35} fill="none" />
        <path d={`M-1 ${headY + ty + 2} q1 0.8 2 0`} stroke="#8a4b3a" strokeWidth={0.5} fill="none" strokeLinecap="round" />
        <circle cx={-2.9} cy={headY + ty + 1.5} r={0.9} fill="#e68a86" opacity={0.4} />
        <circle cx={2.9} cy={headY + ty + 1.5} r={0.9} fill="#e68a86" opacity={0.4} />
        {/* held objects drawn last */}
        {holding === "laptop" && (
          <g>
            <path d={`M-5 ${-8.5 + ty} l9.6 0 l1.4 2.6 h-9.6z`} fill="#cfcabd" {...outline} />
            <path d={`M-4 ${-8.8 + ty} l0.6 -5.6 l7.6 0 l-0.2 5.6z`} fill="#e9e6df" {...outline} />
            <path d={`M-3 ${-9.4 + ty} l0.4 -3.8 l5.4 0 l-0.2 3.8z`} fill="#bcd7e3" opacity={0.9} />
          </g>
        )}
        {holding === "book" && <path d={`M-4 ${-9 + ty} l4 -1.4 l4 1.4 v4 l-4 -1.4 l-4 1.4z`} fill="#f4ead2" {...outline} />}
        {holding === "broom" && (
          <g>
            <path d={`M7.8 ${-9.6 + ty} L12.5 0.6`} stroke="#9a6a3a" strokeWidth={1.2} strokeLinecap="round" />
            <path d="M10.4 -1 l5.4 1.4 l-1.2 2.4 l-5.6 -1.2z" fill="#d9b25f" {...outline} />
          </g>
        )}
      </g>
    </g>
  );
}

/* ---------- furniture ---------- */
export function OakTable({ x, y, items = [], r = 9 }: { x: number; y: number; items?: Array<"cup" | "plate" | "vase" | "laptop" | "paper">; r?: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={r + 2} ry={4.6} o={0.18} />
      <path d="M-1.4 0 l-0.4 -9 h3.6 l-0.4 9z" fill="#403a36" />
      <ellipse cx={0} cy={0.4} rx={4.6} ry={1.5} fill="#403a36" />
      <ellipse cx={0} cy={-8} rx={r} ry={r * 0.5} fill="#8a6a40" opacity={0.5} />
      <ellipse cx={0} cy={-9} rx={r} ry={r * 0.5} fill="#dcb987" {...L} />
      <ellipse cx={0} cy={-9} rx={r} ry={r * 0.5} fill="url(#woodGrain)" opacity={0.8} />
      {items.includes("plate") && <ellipse cx={-2.2} cy={-9.3} rx={2.6} ry={1.3} fill="#fffaf0" {...L} />}
      {items.includes("plate") && <ellipse cx={-2.2} cy={-9.9} rx={1.5} ry={0.8} fill="#e0a85f" />}
      {items.includes("cup") && (
        <g>
          <path d="M2 -9.6 h3 l-0.4 3 h-2.2z" transform="translate(0 -0.4)" fill="#fffaf0" {...L} />
          <rect x={2.2} y={-8.9} width={2.6} height={1} fill="#2f4668" />
        </g>
      )}
      {items.includes("vase") && (
        <g>
          <path d="M-0.8 -9.4 h1.6 l0.4 -3 h-2.4z" fill="#f4f1ea" {...L} />
          <circle cx={0} cy={-14} r={1.5} fill="#fffaf0" {...L} />
          <circle cx={-1.6} cy={-12.8} r={1.1} fill="#fff6e0" {...L} />
          <circle cx={1.6} cy={-13} r={1.1} fill="#f6d5dd" {...L} />
        </g>
      )}
      {items.includes("paper") && <path d="M-6 -9.8 l5 -1.4 l3 1 l-5 1.6z" fill="#f1ede2" {...L} />}
    </g>
  );
}

export function CrossChair({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  // spindle-back (Windsor-style) black chair, as in the café
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y}) ${flip ? "scale(-1 1)" : ""}`}>
      <Shadow x={x} y={y} rx={4.6} ry={1.8} o={0.16} />
      <path d="M-3.2 -1 L-3.4 -6 M3.2 -1 L3.4 -6" stroke="#403a36" strokeWidth={1.1} strokeLinecap="round" />
      <ellipse cx={0} cy={-6.4} rx={4.4} ry={2} fill="#3a3532" {...L} />
      {[-3.2, -1.6, 0, 1.6, 3.2].map((dx) => (
        <path key={dx} d={`M${dx} -6.8 L${dx} -14.6`} stroke="#403a36" strokeWidth={0.7} strokeLinecap="round" />
      ))}
      <path d="M-4 -14.8 q4 -1.6 8 0" stroke="#403a36" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function BarStool({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={5.5} ry={2.2} o={0.2} />
      <path d="M-3.6 0.4 L-2.4 -11 M3.6 0.4 L2.4 -11" stroke="#403a36" strokeWidth={1.1} strokeLinecap="round" />
      <ellipse cx={0} cy={-5} rx={3.8} ry={1.2} fill="none" stroke="#403a36" strokeWidth={0.7} />
      <ellipse cx={0} cy={-11.6} rx={5} ry={2.4} fill="#e2d2b2" {...L} />
      <ellipse cx={-0.8} cy={-12} rx={2.6} ry={1} fill="#f1e6cc" opacity={0.8} />
      <path d="M-4.4 -12 q0 -6.4 4.4 -6.6 q4.4 0.2 4.4 6.6" stroke="#d6bf92" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** counter-height slatted box with a butcher-block top */
function SlatBox({ x0, y0, x1, y1, h, front = "#8d7d69", topc = "#dcb27a" }: { x0: number; y0: number; x1: number; y1: number; h: number; front?: string; topc?: string }) {
  const f = boxFaces(x0, y0, x1, y1, h - 2);
  const t = boxFaces(x0 - 1.2, y0 - 1.2, x1 + 1.2, y1 + 1.2, 2, h - 2);
  return (
    <g>
      <polygon points={f.left} fill={front} {...L} />
      <polygon points={f.left} fill="url(#slats)" />
      <polygon points={f.right} fill={shade(front, -0.16)} {...L} />
      <polygon points={f.right} fill="url(#slats)" />
      <polygon points={f.left} fill="url(#faceShade)" />
      <polygon points={t.top} fill={topc} {...L} />
      <polygon points={t.top} fill="url(#woodGrain)" opacity={0.9} />
      <polygon points={t.left} fill={shade(topc, -0.12)} {...L} />
      <polygon points={t.right} fill={shade(topc, -0.26)} {...L} />
    </g>
  );
}
export { SlatBox };

export function EspressoMachine({ x, y, z = 19 }: { x: number; y: number; z?: number }) {
  // black two-group machine, ~20 wide
  const b = boxFaces(x, y, x + 20, y + 12, 11, z);
  const top = boxFaces(x + 1, y + 1, x + 19, y + 11, 2.4, z + 11);
  const o = P(x, y + 12, z);
  return (
    <g>
      <polygon points={b.left} fill="#2f2e33" {...L} />
      <polygon points={b.right} fill="#222126" {...L} />
      <polygon points={b.top} fill="#3b3a40" {...L} />
      <polygon points={top.left} fill="#bdbab0" {...L} />
      <polygon points={top.top} fill="#d8d5cb" {...L} />
      {/* group heads, portafilters, gauge on the front plane */}
      <g transform={`matrix(1 .5 0 1 ${o.x} ${o.y})`}>
        <rect x={2} y={-10} width={16} height={7.4} rx={0.8} fill="#43424a" opacity={0.9} />
        {[5.5, 14.5].map((u) => (
          <g key={u}>
            <rect x={u - 2.2} y={-8.6} width={4.4} height={1.8} fill="#c9c6bd" />
            <path d={`M${u - 1.6} -6.8 h3.2 v2.2 h-3.2z`} fill="#1a191c" />
            <path d={`M${u - 0.6} -4.6 l-2.4 1.4`} stroke="#2a292e" strokeWidth={1.2} strokeLinecap="round" />
          </g>
        ))}
        <circle cx={10} cy={-9.4} r={1.1} fill="#f5f2e8" stroke="#1a191c" strokeWidth={0.35} />
        <rect x={2} y={-2.4} width={16} height={1.4} fill="#bdbab0" />
        <path d="M-1.6 -9 v6.6" stroke="#bdbab0" strokeWidth={0.9} />
      </g>
    </g>
  );
}

function Cup({ x, y, z, sleeve = true }: { x: number; y: number; z: number; sleeve?: boolean }) {
  const p = P(x, y, z);
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <path d="M-1.7 -4.6 h3.4 l-0.5 4.6 h-2.4z" fill="#fffaf0" {...L} />
      {sleeve && <path d="M-1.55 -3.3 h3.1 l-0.2 2 h-2.7z" fill="#2f4668" />}
    </g>
  );
}

export function CupStack({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <g>
      <Cup x={x} y={y} z={z} />
      <Cup x={x + 3} y={y - 2} z={z} sleeve={false} />
      <Cup x={x + 6} y={y - 1} z={z} />
    </g>
  );
}

/** white-based, mint-framed glass grab-and-go case with wrapped pastries and cold drinks */
export function GrabGoCase({ x, y, per = 5 }: { x: number; y: number; per?: number }) {
  const w = 38,
    d = 15,
    baseH = 11,
    glassH = 20;
  const base = boxFaces(x, y, x + w, y + d, baseH);
  const o = P(x, y + d, 0);
  return (
    <g>
      <polygon points={boxFaces(x - 1, y - 1, x + w + 2, y + d + 2, 0.1).top} fill="#5a4630" opacity={0.2} />
      <polygon points={base.left} fill="#f4f1ea" {...L} />
      <polygon points={base.right} fill="#d9d4c8" {...L} />
      <polygon points={base.left} fill="url(#faceShade)" />
      {/* back panel + glass */}
      <PlaneY x={x} y={y + d} z={baseH}>
        <rect x={0} y={-glassH} width={w} height={glassH} fill="#e6f1ee" opacity={0.42} />
        {/* cold drinks on the bottom shelf */}
        {Array.from({ length: 10 }).map((_, k) => (
          <g key={k}>
            <rect x={2.2 + k * 3.6} y={-5.6} width={2.3} height={5.4} rx={0.7} fill={["#d94f45", "#58b07a", "#f0ac3a", "#6aa6d8", "#d88ac0", "#f4d24a"][k % 6]} stroke={INK} strokeOpacity={0.4} strokeWidth={0.35} />
            <rect x={2.2 + k * 3.6} y={-6.5} width={2.3} height={1} fill="#c9c6bd" />
          </g>
        ))}
        <rect x={0.8} y={-6.6} width={w - 1.6} height={0.9} fill="#fffaf0" opacity={0.9} />
        {/* wrapped pastries on the upper shelves */}
        {[0, 1].map((r) =>
          Array.from({ length: per }).map((_, k) => r === 1 ? (
            <g key={`${r}-${k}`}>
              <path d={`M${3 + k * 7} ${-13.2 - r * 6.6} l0.6 -2.6 h3.8 l0.6 2.6z`} fill="#f4ead2" stroke={INK} strokeOpacity={0.4} strokeWidth={0.35} />
              <path d={`M${2.6 + k * 7} ${-15.6 - r * 6.6} q3.4 -4.2 6.8 0z`} fill="#e0a85f" stroke={INK} strokeOpacity={0.45} strokeWidth={0.4} />
              <circle cx={4.6 + k * 7} cy={-18.4 - r * 6.6 + 2.4} r={0.5} fill="#b8793a" />
            </g>
          ) : (
            <g key={`${r}-${k}`}>
              <rect x={2.4 + k * 7} y={-12.4 - r * 6.6} width={5.4} height={3.6} rx={0.9} fill={["#f7ecd6", "#f2d9b4", "#fbe3e0", "#e8d6b0", "#f6f1e6"][(k + r) % 5]} stroke={INK} strokeOpacity={0.4} strokeWidth={0.4} />
              <path d={`M${3.4 + k * 7} ${-11.2 - r * 6.6} h3.4`} stroke="#c78a52" strokeWidth={0.5} />
            </g>
          )),
        )}
        <rect x={0.8} y={-13} width={w - 1.6} height={0.9} fill="#fffaf0" opacity={0.9} />
        <rect x={0.8} y={-19.6} width={w - 1.6} height={0.9} fill="#fffaf0" opacity={0.9} />
        {/* mint frame */}
        <rect x={0} y={-glassH} width={w} height={glassH} fill="none" stroke="#9fcfba" strokeWidth={1.3} />
        <rect x={0} y={-glassH} width={w} height={glassH} fill="url(#glassSheen)" opacity={0.5} />
      </PlaneY>
      {/* glass top + mint right edge */}
      <polygon points={pts([[x + w, y + d, baseH], [x + w, y, baseH], [x + w, y, baseH + glassH], [x + w, y + d, baseH + glassH]])} fill="#cfe4de" opacity={0.4} stroke="#9fcfba" strokeWidth={1.1} />
      <polygon points={boxFaces(x, y, x + w, y + d, 0.1, baseH + glassH).top} fill="#eaf4f0" opacity={0.6} stroke="#9fcfba" strokeWidth={1.1} />
      {/* water dispenser on top */}
      {(() => {
        const p = P(x + 6, y + 6, baseH + glassH);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <path d="M-3.6 0 v-8.2 q0 -1.6 3.6 -1.6 q3.6 0 3.6 1.6 v8.2z" fill="#dbeceb" opacity={0.85} {...L} />
            <rect x={-4} y={-11.6} width={8} height={1.6} fill="#c9a27a" {...L} />
            <path d="M-3 -2 h6" stroke="#8fc0cc" strokeWidth={1.6} opacity={0.8} />
            <rect x={-0.7} y={0} width={1.4} height={2} fill="#bdbab0" />
          </g>
        );
      })()}
      <g style={{ pointerEvents: "none" }} transform={`translate(${o.x} ${o.y})`} />
    </g>
  );
}

/** black metal table with a butcher-block top and kraft coffee bags below */
export function RetailTable({ x, y }: { x: number; y: number }) {
  const w = 22,
    d = 11,
    h = 14;
  const top = boxFaces(x, y, x + w, y + d, 1.6, h - 1.6);
  const leg = (lx: number, ly: number) => {
    const a = P(lx, ly, 0);
    const b = P(lx, ly, h - 1.6);
    return <line key={`${lx}${ly}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#403a36" strokeWidth={1.2} />;
  };
  const bags = [
    [x + 3, y + 4],
    [x + 9, y + 3],
    [x + 15, y + 4],
    [x + 6, y + 8],
    [x + 13, y + 8],
  ];
  return (
    <g>
      <Shadow x={x + w / 2} y={y + d / 2} rx={16} ry={5.5} o={0.16} />
      {[leg(x + 1, y + d - 1), leg(x + w - 1, y + d - 1), leg(x + w - 1, y + 1), leg(x + 1, y + 1)]}
      <polygon points={boxFaces(x + 1, y + 1, x + w - 1, y + d - 1, 0.6, 4).top} fill="#3b3733" />
      {bags.map(([bx, by], i) => {
        const p = P(bx, by, 4.6);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d="M-3 0 l0.6 -7 h4.8 l0.6 7z" fill="#c9a27a" {...L} />
            <rect x={-1.7} y={-5.4} width={3.4} height={2.6} fill="#3f6fa5" opacity={0.9} />
            <path d="M-2.6 -7 h5.2" stroke="#8a6a44" strokeWidth={0.8} />
          </g>
        );
      })}
      <polygon points={top.left} fill="#d9a96c" {...L} />
      <polygon points={top.right} fill="#b9894f" {...L} />
      <polygon points={top.top} fill="#dcb27a" {...L} />
      <polygon points={top.top} fill="url(#woodGrain)" />
      {/* newspaper stack */}
      {(() => {
        const p = P(x + 5, y + 5, h);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <path d="M-6 0 l7 -2.4 l6 2 l-7 2.6z" fill="#e4dfd2" {...L} />
            <path d="M-6 0 v1.6 l6 2.2 v-1.4z" fill="#cfc8b6" {...L} />
            <path d="M-4 -0.4 l5 -1.6 M-3 0.6 l5 -1.6" stroke="#8a8272" strokeWidth={0.35} />
          </g>
        );
      })()}
    </g>
  );
}

export function SteelFridge({ x, y }: { x: number; y: number }) {
  const f = boxFaces(x, y, x + 16, y + 11, 42);
  const o = P(x, y + 11, 0);
  return (
    <g>
      <polygon points={f.left} fill="#b8bcc2" {...L} />
      <polygon points={f.right} fill="#8f949b" {...L} />
      <polygon points={f.top} fill="#d2d5da" {...L} />
      <g transform={`matrix(1 .5 0 1 ${o.x} ${o.y})`}>
        <rect x={1} y={-40} width={14} height={38} fill="url(#glassSheen)" opacity={0.7} />
        <rect x={11.4} y={-28} width={1.3} height={12} rx={0.6} fill="#6f747b" />
        <path d="M1 -22 h14" stroke="#7d828a" strokeWidth={0.5} />
      </g>
    </g>
  );
}

/** white planter box divider with greenery and little lights */
export function PlanterDivider({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const f = boxFaces(x0, y0, x1, y1, 16);
  const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 7));
  return (
    <g>
      <polygon points={f.left} fill="#f6f4ee" {...L} />
      <polygon points={f.right} fill="#dcd8cc" {...L} />
      <polygon points={f.top} fill="#7a6a54" {...L} />
      {Array.from({ length: n }).map((_, i) => {
        const gx = x0 + ((x1 - x0) * (i + 0.5)) / n;
        const gy = y0 + ((y1 - y0) * (i + 0.5)) / n;
        const p = P(gx, gy, 16);
        const g = ["#6a9048", "#7fa354", "#8fae5a", "#5f8a40"][i % 4];
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d={`M0 0 q${-4 + (i % 3) * 3} -9 ${-5 + (i % 4) * 3} -12 M0 0 q1 -10 ${3 - (i % 3)} -14 M0 0 q4 -8 7 -9`} stroke={g} strokeWidth={2.4} strokeLinecap="round" fill="none" />
            <circle cx={(i % 2) * 3 - 1} cy={-13} r={2.3} fill={g} />
            {i % 3 === 0 && <circle cx={2} cy={-10} r={1} fill="#fff1c4" opacity={0.95} />}
          </g>
        );
      })}
    </g>
  );
}

/**
 * Striped-leaf floor plant (calathea) in a round white ceramic pot, as in the photos:
 * long oval leaves on thin stems, dark green with pale cross-stripes, fanning out unevenly.
 */
export function BigPlant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const b = P(x, y);
  // [angle, length, width, shade]
  const leaves: Array<[number, number, number, number]> = [
    [-52, 20, 5.2, 1],
    [-34, 27, 5.6, 0],
    [-16, 33, 6, 2],
    [-3, 36, 6.2, 1],
    [11, 31, 5.8, 0],
    [27, 28, 5.6, 2],
    [46, 21, 5.2, 1],
    [-24, 22, 5, 0],
    [20, 24, 5, 1],
  ];
  const greens = ["#4f7d44", "#5d8c4c", "#3f6b3a"];
  return (
    <g transform={`translate(${b.x} ${b.y}) scale(${s})`}>
      <Shadow x={x} y={y} rx={10} ry={3.8} o={0.22} />
      {leaves.map(([ang, len, w, c], i) => {
        const stem = len * 0.28;
        return (
          <g key={i} transform={`translate(0 -11) rotate(${ang})`}>
            <path d={`M0 0 L0 ${-stem}`} stroke="#6b8f4a" strokeWidth={0.9} strokeLinecap="round" />
            <g transform={`translate(0 ${-stem})`}>
              {/* oval blade */}
              <path d={`M0 0 C${-w} ${-len * 0.22} ${-w} ${-len * 0.62} 0 ${-len * 0.78} C${w} ${-len * 0.62} ${w} ${-len * 0.22} 0 0z`} fill={greens[c]} stroke="#2f5230" strokeOpacity={0.45} strokeWidth={0.5} />
              {/* pale midrib + the alternating cross-stripes of a calathea */}
              <path d={`M0 -1 L0 ${-len * 0.74}`} stroke="#bcd9a0" strokeWidth={0.7} opacity={0.9} />
              {[0.14, 0.26, 0.38, 0.5, 0.62].map((t) => (
                <g key={t} stroke="#a9cf8d" strokeWidth={0.55} opacity={0.75} strokeLinecap="round">
                  <path d={`M0 ${-len * t} L${-w * 0.78} ${-len * (t + 0.07)}`} />
                  <path d={`M0 ${-len * t} L${w * 0.78} ${-len * (t + 0.07)}`} />
                </g>
              ))}
              <path d={`M${-w * 0.9} ${-len * 0.3} C${-w * 0.7} ${-len * 0.55} ${-w * 0.4} ${-len * 0.7} 0 ${-len * 0.78}`} stroke="#ffffff" strokeWidth={0.5} opacity={0.18} fill="none" />
            </g>
          </g>
        );
      })}
      {/* round white ceramic pot */}
      <ellipse cx={0} cy={-11.4} rx={7.6} ry={2.6} fill="#ece8dc" stroke="#6b4a2c" strokeOpacity={0.34} strokeWidth={0.5} />
      <path d="M-7.6 -11.2 C-8 -4 -5.6 -0.4 0 -0.4 C5.6 -0.4 8 -4 7.6 -11.2 C4 -9.2 -4 -9.2 -7.6 -11.2z" fill="#f6f3ea" stroke="#6b4a2c" strokeOpacity={0.34} strokeWidth={0.55} />
      <path d="M-5.6 -5 C-3 -3.2 3 -3.2 5.6 -5" stroke="#d9d3c3" strokeWidth={0.6} fill="none" />
      <ellipse cx={-2.6} cy={-8} rx={1.2} ry={2.4} fill="#ffffff" opacity={0.5} />
    </g>
  );
}

export function Lantern({ x, y, z, r = 5.8 }: { x: number; y: number; z: number; r?: number }) {
  const top = P(x, y, 58);
  const l = P(x, y, z);
  // semi-transparent paper: whatever hangs behind a lantern stays readable through it
  return (
    <g style={{ pointerEvents: "none" }}>
      <line x1={top.x} y1={top.y} x2={l.x} y2={l.y - r} stroke="#3f3a36" strokeWidth={0.5} opacity={0.7} />
      <g opacity={0.52}>
        <circle cx={l.x} cy={l.y} r={r} fill="#fffaf0" {...L} />
        <circle cx={l.x - r * 0.3} cy={l.y - r * 0.3} r={r * 0.55} fill="#ffffff" opacity={0.6} />
      </g>
      <path d={`M${l.x - r} ${l.y} q${r} ${r * 0.55} ${2 * r} 0 M${l.x - r * 0.8} ${l.y - r * 0.55} q${r * 0.8} ${r * 0.45} ${r * 1.6} 0 M${l.x - r * 0.8} ${l.y + r * 0.55} q${r * 0.8} ${r * 0.45} ${r * 1.6} 0`} stroke="#c9bda3" strokeWidth={0.5} fill="none" opacity={0.7} />
      <path d={`M${l.x} ${l.y - r} V${l.y + r}`} stroke="#d9cfb6" strokeWidth={0.4} opacity={0.7} />
    </g>
  );
}

export function ConcreteColumn({ x, y, h = 58 }: { x: number; y: number; h?: number }) {
  const f = boxFaces(x, y, x + 8, y + 8, h);
  return (
    <g>
      <polygon points={boxFaces(x - 1, y - 1, x + 11, y + 11, 0.1).top} fill="#5a4630" opacity={0.2} />
      <polygon points={f.left} fill="#b9b5ab" {...L} />
      <polygon points={f.right} fill="#9a968c" {...L} />
      <polygon points={f.top} fill="#cdc9bf" {...L} />
      <polygon points={f.left} fill="url(#washPat)" opacity={0.8} />
      {[8, 22, 40].map((v) => {
        const p = P(x + 2 + (v % 5), y + 8, v);
        return <circle key={v} cx={p.x} cy={p.y} r={0.6} fill="#7d796f" opacity={0.7} />;
      })}
    </g>
  );
}

export function BrownArmchair({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y}) ${flip ? "scale(-1 1)" : ""}`}>
      <Shadow x={x} y={y} rx={12} ry={4.6} o={0.22} />
      <path d="M-9.5 -3 q-0.8 -11 3.4 -14 h12 q4.2 3 3.4 14z" fill="#6d3f29" {...L} />
      <rect x={-12} y={-11} width={5.6} height={10.6} rx={2.8} fill="#7a4630" {...L} />
      <rect x={6.4} y={-11} width={5.6} height={10.6} rx={2.8} fill="#6a3b27" {...L} />
      <rect x={-7} y={-9.4} width={14} height={8} rx={3} fill="#8c5638" {...L} />
      <path d="M-5 -8 q5 -1.4 10 0" stroke="#b27a58" strokeWidth={0.7} fill="none" opacity={0.7} />
      <path d="M-4 -15 l1 2.4 M2 -15.6 l-0.8 2.4" stroke="#4a2a1a" strokeWidth={0.5} opacity={0.6} />
    </g>
  );
}

export function CoffeeTable({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={9} ry={3.6} o={0.18} />
      <path d="M-5.4 0 L-4.4 -5.6 M5.4 0 L4.4 -5.6 M0 1 V-5.4" stroke="#403a36" strokeWidth={1} />
      <ellipse cx={0} cy={-6} rx={8.4} ry={3.9} fill="#26231f" {...L} />
      <ellipse cx={0} cy={-6.2} rx={7.4} ry={3.2} fill="none" stroke="#5b544a" strokeWidth={0.4} />
      <path d="M-0.7 -6.4 h1.4 l0.4 -3 h-2.2z" fill="#f6f4ee" {...L} />
      <circle cx={0} cy={-11} r={1.5} fill="#fffaf0" {...L} />
      <circle cx={1.4} cy={-10.2} r={1.1} fill="#fff6e0" {...L} />
    </g>
  );
}

export function FloorLamp({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={4} ry={1.6} o={0.2} />
      <path d="M0 0 V-32" stroke="#403a36" strokeWidth={1.1} />
      <ellipse cx={0} cy={0} rx={3.2} ry={1.1} fill="#403a36" />
      <path d="M-5.4 -32 l1 -8 h8.8 l1 8z" fill="#fbf4e2" {...L} />
      <circle cx={0} cy={-36} r={11} fill="#fff1c4" opacity={0.13} />
    </g>
  );
}

/* ---------- wall dressing ---------- */
export function MenuBoard({ u, w, kind, lines }: { u: number; w: number; kind: "eat" | "special" | "sip"; lines: string[] }) {
  const dark = kind === "special";
  return (
    <g>
      <rect x={u - 1.4} y={-53.4} width={w + 2.8} height={27.8} rx={1} fill="#a9794c" {...L} />
      <rect x={u} y={-52} width={w} height={25} fill={dark ? "#2f3a35" : "#f7efdc"} />
      <text x={u + w / 2} y={-47.4} textAnchor="middle" fontSize={3.4} fontWeight={700} letterSpacing={0.9} fill={dark ? "#f4ecd8" : "#7b5a3c"} fontFamily="var(--font-geist-sans), system-ui">
        {kind === "eat" ? "EAT" : kind === "sip" ? "SIP" : "SPECIALS"}
      </text>
      {kind === "special" && <path d={`M${u + w / 2 - 7} -44.8 q3.5 -2 7 0 q3.5 2 7 0`} stroke="#c9d6a0" strokeWidth={0.45} fill="none" />}
      {lines.slice(0, 6).map((t, i, all) => (
        <text key={i} x={u + 2.4} y={-43 + i * (all.length > 4 ? 2.9 : 3.8)} fontSize={all.length > 4 ? 2.3 : 2.5} fill={dark ? "#f1e7cf" : "#6a5338"} fontFamily={dark ? "var(--font-hand), cursive" : "var(--font-geist-sans), system-ui"} fontWeight={dark ? 700 : 500}>
          {t}
        </text>
      ))}
    </g>
  );
}

export function BluePortrait({ u, v = 24 }: { u: number; v?: number }) {
  return (
    <g>
      <rect x={u - 1} y={-v - 25} width={22} height={27} fill="#e9f0f4" stroke="#d9d4c8" strokeWidth={0.7} />
      <rect x={u} y={-v - 24} width={20} height={25} fill="#3d7fb0" />
      <ellipse cx={u + 10} cy={-v - 12} rx={5.6} ry={7.6} fill="#e8a98a" />
      <path d={`M${u + 4.4} ${-v - 14} q5.6 -8 11.2 0 q-2 -3.4 -5.6 -3.6 q-3.6 0.2 -5.6 3.6z`} fill="#c8744a" />
      <circle cx={u + 12.6} cy={-v - 12.6} r={1.2} fill="#7fd0e6" />
      <path d={`M${u + 6.6} ${-v - 6} q3.6 2.4 7.2 0`} stroke="#5aa6c2" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d={`M${u} ${-v - 2} q10 -6 20 0 v3 h-20z`} fill="#2f6a99" />
    </g>
  );
}

/** glass-lidded dish of waffles and cookies on the counter */
export function PastryDome({ x, y, z, n = 4 }: { x: number; y: number; z: number; n?: number }) {
  const p = P(x, y, z);
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <ellipse cx={0} cy={0} rx={9} ry={3.6} fill="#e9dcc2" {...L} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${-5 + i * 3.4} ${-1.6 - (i % 2) * 1.2})`}>
          <ellipse cx={0} cy={0} rx={3.4} ry={1.9} fill="#e0a85f" {...L} />
          <path d="M-2 -0.6 h4 M-1.4 0.7 h2.8 M-0.8 -1.2 v2.2 M0.8 -1.2 v2.2" stroke="#b8793a" strokeWidth={0.4} />
        </g>
      ))}
      <path d="M-8.6 0 q0 -9 8.6 -9 q8.6 0 8.6 9z" fill="#e6f1ee" opacity={0.45} stroke="#9fcfba" strokeWidth={0.9} />
      <path d="M-5 -6 q2 -2 5 -2.2" stroke="#fff" strokeWidth={0.8} opacity={0.8} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-9.6} r={0.9} fill="#bdbab0" />
    </g>
  );
}

/** square oak table with a black pedestal — the café's actual tables (items sit on top) */
export function SquareTable({ x, y, items = [], s = 17 }: { x: number; y: number; items?: Array<"cup" | "plant" | "paper" | "plate" | "laptop">; s?: number }) {
  const h = 13;
  const f = boxFaces(x - s / 2, y - s / 2, x + s / 2, y + s / 2, 1.8, h);
  const base = P(x, y, 0);
  const top = P(x, y, h);
  const on = (dx: number, dy: number) => P(x + dx, y + dy, h + 1.8);
  return (
    <g>
      <Shadow x={x} y={y} rx={s * 0.9} ry={s * 0.42} o={0.18} />
      <ellipse cx={base.x} cy={base.y} rx={5.4} ry={1.8} fill="#403a36" />
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} stroke="#403a36" strokeWidth={2.2} strokeLinecap="round" />
      <polygon points={f.left} fill="#c9a066" {...L} />
      <polygon points={f.right} fill="#a9814d" {...L} />
      <polygon points={f.top} fill="#dcb987" {...L} />
      <polygon points={f.top} fill="url(#woodGrain)" opacity={0.85} />
      <polygon points={f.top} fill="url(#faceShade)" opacity={0.5} />
      {items.includes("cup") && (() => {
        const p = on(4, -3);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <path d="M-2 -4 h4 l-0.5 4 h-3z" fill="#fffaf0" {...L} />
            <path d="M2 -3.2 q2 0.4 0.4 2.2" stroke="#e8e1d2" strokeWidth={0.8} fill="none" />
          </g>
        );
      })()}
      {items.includes("plant") && (() => {
        const p = on(-5, 4);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <path d="M-2.4 -3.4 h4.8 l-0.6 3.4 h-3.6z" fill="#f6f4ee" {...L} />
            <circle cx={-1.2} cy={-5.4} r={2.1} fill="#6a9048" />
            <circle cx={1.4} cy={-5.8} r={2.3} fill="#7fa354" />
            <circle cx={0} cy={-7.4} r={1.8} fill="#8fae5a" />
          </g>
        );
      })()}
      {items.includes("plate") && (() => {
        const p = on(-3, -4);
        return (
          <g transform={`translate(${p.x} ${p.y})`}>
            <ellipse cx={0} cy={0} rx={3.2} ry={1.5} fill="#fffaf0" {...L} />
            <ellipse cx={0} cy={-0.7} rx={1.8} ry={0.9} fill="#e0a85f" />
          </g>
        );
      })()}
      {items.includes("paper") && (() => {
        const p = on(-2, 1);
        return <path transform={`translate(${p.x} ${p.y})`} d="M-5 0 l5 -1.6 l5 1.4 l-5 1.8z" fill="#f1ede2" {...L} />;
      })()}
    </g>
  );
}

/** the pay-by-space kiosk with its sign, as in the street photos */
export function ParkingKiosk({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={5} ry={2} o={0.25} />
      <path d="M-4.6 0 v-21 q0 -2 2 -2.4 l5.2 -1.2 q2.4 0.2 2.4 2.6 v22z" fill="#2f2c2a" {...L} />
      <rect x={-3.4} y={-19.6} width={7.4} height={8.4} rx={1.6} fill="#2f5fa0" />
      <text x={0.3} y={-13.2} textAnchor="middle" fontSize={7} fontWeight={800} fill="#fff" fontFamily="system-ui">P</text>
      <rect x={-3.4} y={-10.4} width={7.4} height={7.4} rx={0.8} fill="#e9e6df" />
      <text x={0.3} y={-7.8} textAnchor="middle" fontSize={1.9} fontWeight={700} fill="#2f2c2a" fontFamily="system-ui">PAID</text>
      <text x={0.3} y={-5.8} textAnchor="middle" fontSize={1.9} fontWeight={700} fill="#2f2c2a" fontFamily="system-ui">STREET</text>
      <text x={0.3} y={-3.8} textAnchor="middle" fontSize={1.9} fontWeight={700} fill="#2f2c2a" fontFamily="system-ui">PARKING</text>
    </g>
  );
}

/** door-side planter: ficus + red-leaf cordyline in a big white pot (as in the street photo) */
export function DoorPlanter({ x, y }: { x: number; y: number }) {
  const b = P(x, y);
  return (
    <g transform={`translate(${b.x} ${b.y})`}>
      <Shadow x={x} y={y} rx={11} ry={4.2} o={0.22} />
      {[-18, -6, 8, 20].map((a, i) => (
        <g key={i} transform={`rotate(${a} 0 -14)`}>
          <path d={`M0 -14 C-3.6 -22 -3 -32 0 -${36 + (i % 2) * 3} C3 -32 3.6 -22 0 -14z`} fill={["#8a3a4a", "#9a4a56", "#7a3040", "#a85660"][i]} {...L} />
        </g>
      ))}
      {[-34, -20, 0, 18, 32].map((a, i) => (
        <g key={`f${i}`} transform={`rotate(${a} 0 -12)`}>
          <ellipse cx={0} cy={-20} rx={4.4} ry={7.4} fill={["#7aa84c", "#8fbd5a", "#6a9a40", "#9ac468", "#7aa84c"][i]} {...L} />
        </g>
      ))}
      <path d="M-8 -14 h16 l-2 14 h-12z" fill="#f2efe6" {...L} />
      <path d="M-7.2 -11 h14.4 M-6.6 -7 h13.2" stroke="#dcd6c8" strokeWidth={0.7} />
    </g>
  );
}

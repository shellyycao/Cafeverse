import { P, boxFaces, pts } from "@/lib/iso";
import { INK, shade } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/neighborhood";
import { Awning } from "./primitives";

const BRICK = "#c58f6c";
const CREAM = "#f1e3c6";
const GREEN = "#587a58";
const LEFT_LEN = F.x1 - F.x0; // 144
const RIGHT_LEN = F.y1 - F.y0; // 128

/** Draw in wall-plane coordinates: u along the wall, y negative = up. */
function Face({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const o = side === "left" ? P(F.x0, F.y1, 0) : P(F.x1, F.y1, 0);
  const m = side === "left" ? "1 .5 0 1" : "1 -.5 0 1";
  return <g transform={`matrix(${m} ${o.x} ${o.y})`}>{children}</g>;
}

const stroke = { stroke: INK, strokeOpacity: 0.55, strokeWidth: 0.8, strokeLinejoin: "round" as const };

function Glass({ u0, u1, v0 = 9, v1 = 40, id }: { u0: number; u1: number; v0?: number; v1?: number; id: string }) {
  return (
    <g>
      <rect x={u0 - 2} y={-v1 - 2} width={u1 - u0 + 4} height={v1 - v0 + 4} rx={1} fill={GREEN} {...stroke} />
      <rect x={u0} y={-v1} width={u1 - u0} height={v1 - v0} fill="url(#glassWarm)" />
      {/* mullions */}
      <path d={`M${(u0 + u1) / 2} ${-v1} V${-v0} M${u0} ${-(v0 + v1) / 2 - 3} H${u1}`} stroke={GREEN} strokeWidth={1.1} opacity={0.85} />
      {/* pendant lamps seen through the glass */}
      <circle cx={u0 + (u1 - u0) * 0.25} cy={-v1 + 6} r={2.2} fill="#fff1c4" />
      <circle cx={u0 + (u1 - u0) * 0.75} cy={-v1 + 6} r={2.2} fill="#fff1c4" />
      <clipPath id={`clip-${id}`}>
        <rect x={u0} y={-v1} width={u1 - u0} height={v1 - v0} />
      </clipPath>
      <rect x={u0} y={-v1} width={u1 - u0} height={v1 - v0} fill="url(#glassSheen)" opacity={0.55} />
    </g>
  );
}

export default function CafeExterior({
  onClick,
  interactive = true,
}: {
  onClick?: () => void;
  interactive?: boolean;
}) {
  const f = boxFaces(F.x0, F.y0, F.x1, F.y1, F.h);
  const cornice = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, F.h - 2);
  return (
    <g className="hotspot cafe-shell" onClick={onClick} data-hotspot="cafe" style={{ pointerEvents: interactive ? "auto" : "none" }}>
      {/* contact shadow */}
      <polygon points={pts([[F.x0 + 6, F.y0 + 6, 0], [F.x1 + 14, F.y0 + 10, 0], [F.x1 + 14, F.y1 + 14, 0], [F.x0 + 6, F.y1 + 14, 0]])} fill="#6b5a3a" opacity={0.15} />
      <polygon points={f.left} fill={BRICK} {...stroke} />
      <polygon points={f.right} fill={shade(BRICK, -0.12)} {...stroke} />
      <polygon points={f.top} fill="#d8c7a6" {...stroke} />
      {/* brick texture hint */}
      <Face side="left">
        <rect x={0} y={-F.h} width={LEFT_LEN} height={F.h} fill="url(#brickTex)" opacity={0.5} />
      </Face>
      <Face side="right">
        <rect x={0} y={-F.h} width={RIGHT_LEN} height={F.h} fill="url(#brickTex)" opacity={0.5} />
      </Face>

      {/* ---- left face ---- */}
      <Face side="left">
        <rect x={0} y={-9} width={LEFT_LEN} height={9} fill="#bba88c" {...stroke} />
        <Glass u0={12} u1={64} id="l1" />
        <Glass u0={104} u1={136} id="l3" />
        {/* door */}
        <rect x={70} y={-38} width={28} height={38} rx={1} fill={GREEN} {...stroke} />
        <rect x={73} y={-35} width={22} height={33} fill="url(#glassWarm)" />
        <path d="M84 -35 V-2" stroke={GREEN} strokeWidth={1.2} />
        <circle cx={80.5} cy={-18} r={1.1} fill="#d9b25f" />
        <circle cx={87.5} cy={-18} r={1.1} fill="#d9b25f" />
        {/* sign band */}
        <rect x={6} y={-56} width={LEFT_LEN - 12} height={13} rx={1.5} fill={CREAM} {...stroke} />
        <text x={LEFT_LEN / 2} y={-46.2} textAnchor="middle" fontSize={11.5} fill="#6a4a30" fontFamily="var(--font-hand), cursive" fontWeight={700}>
          ☕ Cafeverse
        </text>
      </Face>

      {/* ---- right face (glass-heavy side) ---- */}
      <Face side="right">
        <rect x={0} y={-9} width={RIGHT_LEN} height={9} fill="#a8967a" {...stroke} />
        <Glass u0={10} u1={42} id="r1" v1={42} />
        <Glass u0={48} u1={80} id="r2" v1={42} />
        <Glass u0={86} u1={118} id="r3" v1={42} />
        {/* patrons visible through glass */}
        <g opacity={0.9}>
          {[
            [22, "#a2574f"],
            [60, "#6d8a64"],
            [102, "#cfa163"],
          ].map(([u, c], i) => (
            <g key={i}>
              <circle cx={u as number} cy={-22} r={2.6} fill="#e8bd9a" />
              <rect x={(u as number) - 3.2} y={-19.5} width={6.4} height={10} rx={2.6} fill={c as string} />
            </g>
          ))}
          <rect x={10} y={-16} width={108} height={3} fill="#a77a52" opacity={0.7} />
        </g>
        <rect x={6} y={-56} width={RIGHT_LEN - 12} height={13} rx={1.5} fill={shade(CREAM, -0.08)} {...stroke} />
        <text x={RIGHT_LEN / 2} y={-46.6} textAnchor="middle" fontSize={9.5} fill="#7b5a3c" fontFamily="var(--font-hand), cursive" fontWeight={700}>
          coffee · pastry · study
        </text>
      </Face>

      {/* striped awning over storefront */}
      <Awning x0={F.x0 + 4} x1={F.x1 - 4} y={F.y1} z={43} color={GREEN} out={14} stripes={12} />

      {/* cornice */}
      <polygon points={cornice.left} fill={CREAM} {...stroke} />
      <polygon points={cornice.right} fill={shade(CREAM, -0.1)} {...stroke} />
      <polygon points={cornice.top} fill="#e3d4b3" {...stroke} />

      {/* roof: parapet inset + skylight + gravel texture */}
      <polygon points={pts([[F.x0 + 6, F.y0 + 6, F.h + 1], [F.x1 - 6, F.y0 + 6, F.h + 1], [F.x1 - 6, F.y1 - 6, F.h + 1], [F.x0 + 6, F.y1 - 6, F.h + 1]])} fill="#cdbb98" stroke={INK} strokeOpacity={0.3} strokeWidth={0.7} />
      <polygon points={pts([[F.x0 + 40, F.y0 + 60, F.h + 2], [F.x0 + 90, F.y0 + 60, F.h + 2], [F.x0 + 90, F.y0 + 96, F.h + 2], [F.x0 + 40, F.y0 + 96, F.h + 2]])} fill="#cfe0dc" stroke={INK} strokeOpacity={0.45} strokeWidth={0.8} />
      <polygon points={pts([[F.x0 + 10, F.y0 + 14, F.h + 2], [F.x0 + 44, F.y0 + 14, F.h + 2], [F.x0 + 44, F.y0 + 30, F.h + 2], [F.x0 + 10, F.y0 + 30, F.h + 2]])} fill="#a9bf80" stroke={INK} strokeOpacity={0.4} strokeWidth={0.7} />
      {/* rooftop units */}
      {[
        [226, 156, 30, 24],
        [268, 168, 22, 18],
      ].map(([x, y, w, d], i) => {
        const u = boxFaces(x, y, x + w, y + d, 11, F.h + 2);
        return (
          <g key={i}>
            <polygon points={u.left} fill="#cfcabd" {...stroke} />
            <polygon points={u.right} fill="#aaa699" {...stroke} />
            <polygon points={u.top} fill="#e2ded1" {...stroke} />
          </g>
        );
      })}

      {/* ivy climbing the corner */}
      {Array.from({ length: 14 }).map((_, i) => {
        const p = P(F.x1, F.y1, 4 + i * 4.2);
        const c = ["#7fa354", "#8fae5a", "#6a9048"][i % 3];
        return <circle key={i} cx={p.x + Math.sin(i * 1.7) * 3} cy={p.y} r={4.2 + (i % 2)} fill={c} opacity={0.95} />;
      })}
      {[2, 5, 9].map((i) => {
        const p = P(F.x1, F.y1, 4 + i * 4.2);
        return <circle key={i} cx={p.x + 3} cy={p.y - 1} r={1.8} fill="#f1b6c4" />;
      })}
      {/* hanging blade sign on the corner */}
      <g>
        {(() => {
          const p = P(F.x1 + 1, F.y1 + 1, 40);
          return (
            <g transform={`translate(${p.x} ${p.y})`}>
              <path d="M0 0 H10" stroke="#3f3a36" strokeWidth={1.4} />
              <rect x={6} y={1} width={11} height={11} rx={1.5} fill="#8a5a3a" stroke="#3f3a36" strokeWidth={0.8} />
              <text x={11.5} y={9.3} textAnchor="middle" fontSize={7.5} fill="#f4e6c8">
                ☕
              </text>
            </g>
          );
        })()}
      </g>
    </g>
  );
}

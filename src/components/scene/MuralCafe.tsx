import { P, boxFaces, pts } from "@/lib/iso";
import { INK } from "@/lib/color";
import { CAFE_FOOTPRINT as F } from "@/data/durham";
import type { Theme } from "@/data/sites";
import { Face, Glass } from "./Cafe";
import { Wash } from "./primitives";

/**
 * A corner building with a painted mural on one wall, a brick side with dark-framed windows and a string-light canopy over
 * the patio (in the spirit of a colourful neighbourhood café). Drawn in code on the shared café footprint.
 */
const LEFT_LEN = F.x1 - F.x0;
const RIGHT_LEN = F.y1 - F.y0;
const stroke = { stroke: INK, strokeOpacity: 0.55, strokeWidth: 0.8, strokeLinejoin: "round" as const };
const HAND = "var(--font-hand), cursive";

function Mural() {
  return (
    <g>
      <rect x={0} y={-F.h} width={LEFT_LEN} height={F.h} fill="#f5da8f" />
      <clipPath id="mural-clip"><rect x={0} y={-F.h} width={LEFT_LEN} height={F.h} /></clipPath>
      <g clipPath="url(#mural-clip)">
        <path d="M-6 -58 q8 -18 28 -10 q16 -12 32 4 q18 2 12 20 q-12 10 -30 4 q-16 10 -34 -2 q-12 -6 -8 -16z" fill="#f0a6bd" />
        <circle cx={104} cy={-50} r={15} fill="#f6c453" />
        <circle cx={104} cy={-50} r={9} fill="#f9dc7f" />
        <path d="M72 0 q-10 -34 4 -52 q10 -10 18 4 q-10 18 -4 48z" fill="#cf6b4d" />
        <path d="M84 -40 q-4 -10 2 -14 M92 -34 q2 -12 -2 -20" stroke="#fbe7c8" strokeWidth={1.4} fill="none" />
        <g fill="#3f93a3">
          <ellipse cx={20} cy={-16} rx={11} ry={4.6} transform="rotate(-38 20 -16)" />
          <ellipse cx={132} cy={-24} rx={12} ry={4.6} transform="rotate(32 132 -24)" />
          <ellipse cx={120} cy={-8} rx={11} ry={4} transform="rotate(-24 120 -8)" />
          <ellipse cx={46} cy={-6} rx={9} ry={3.6} transform="rotate(22 46 -6)" />
        </g>
        {[[30, -26], [58, -12], [128, -42], [108, -14]].map(([x, y], i) => (
          <g key={i}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 3.6} rx={2} ry={3.6} fill="#fffaf0" transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r={1.8} fill="#f1b640" /></g>
        ))}
        <path d="M0 -4 q20 -12 38 0 t40 0 t40 0 t26 -2" stroke="#7a3f6a" strokeWidth={1.6} fill="none" opacity={0.5} />
      </g>
      <text x={14} y={-46} fontSize={13} fontWeight={800} fill="#4a2d22" fontFamily={HAND} letterSpacing={1}>LANTERN</text>
      <text x={20} y={-34} fontSize={13} fontWeight={800} fill="#4a2d22" fontFamily={HAND} letterSpacing={1}>& LOAF</text>
    </g>
  );
}

export default function MuralCafe({ theme, onClick, interactive = true, lit = true }: { theme: Theme; onClick?: () => void; interactive?: boolean; lit?: boolean }) {
  const f = boxFaces(F.x0, F.y0, F.x1, F.y1, F.h);
  const cornice = boxFaces(F.x0 - 2, F.y0 - 2, F.x1 + 2, F.y1 + 2, 4, F.h - 2);
  const lamp = (u: number, v: number, key: string) => (
    <g key={key} transform={`translate(${u} ${-v})`}>
      <path d="M0 0 q-5 -2 -6 -7" stroke="#2f2f33" strokeWidth={1.2} fill="none" />
      <path d="M-10 -7 h8 l-1.5 5 h-5z" fill="#2f2f33" />
      {lit && <circle cx={-6} cy={-2} r={4} fill="#ffe3a0" opacity={0.35} />}
    </g>
  );
  const canopyTop = [[F.x1, F.y0 + 26, 60], [F.x1, F.y1 - 16, 60], [F.x1 + 54, F.y1 - 26, 52], [F.x1 + 54, F.y0 + 44, 54]] as Array<[number, number, number]>;
  const bulbs = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return P(F.x1 + 54 * t, F.y0 + 26 + 18 * t, 59 - 6 * t - 4 * Math.sin(t * Math.PI));
  });
  return (
    <g className="hotspot cafe-shell" onClick={onClick} data-hotspot="cafe" style={{ pointerEvents: interactive ? "auto" : "none" }}>
      <polygon points={pts([[F.x0 + 6, F.y0 + 6, 0], [F.x1 + 14, F.y0 + 10, 0], [F.x1 + 14, F.y1 + 14, 0], [F.x0 + 6, F.y1 + 14, 0]])} fill="#6b5a3a" opacity={0.15} />
      <polygon points={f.left} fill="#f5da8f" {...stroke} />
      <polygon points={f.right} fill="#c4775a" {...stroke} />
      <polygon points={f.top} fill="#d8c7a6" {...stroke} />
      <Wash points={f.right} hatch />
      <Wash points={f.top} shade={false} />
      <Face side="right"><rect x={0} y={-F.h} width={RIGHT_LEN} height={F.h} fill="url(#brickTex)" opacity={0.6} /></Face>

      <Face side="left">
        <Mural />
        <rect x={0} y={-8} width={LEFT_LEN} height={8} fill="#6bb0b8" {...stroke} />
        {/* two wooden doors with transoms */}
        {[10, 46].map((u, i) => (
          <g key={u}>
            <rect x={u - 2} y={-48} width={30} height={48} rx={1} fill="#7a4a2e" {...stroke} />
            <rect x={u + 1} y={-45} width={24} height={11} fill={lit ? "url(#glassWarm)" : "url(#glassDark)"} />
            <rect x={u + 3} y={-31} width={20} height={29} fill={i ? (lit ? "url(#glassWarm)" : "url(#glassDark)") : "#a3693f"} stroke="#4a2d22" strokeWidth={0.6} />
            <path d={`M${u + 13} -31 V-2`} stroke="#4a2d22" strokeWidth={0.8} />
          </g>
        ))}
        {lamp(38, 58, "lamp-a")}
        {lamp(96, 62, "lamp-b")}
      </Face>

      <Face side="right">
        <rect x={0} y={-8} width={RIGHT_LEN} height={8} fill="#a8605a" {...stroke} />
        <Glass u0={8} u1={50} id="m1" dark={!lit} v1={44} />
        <Glass u0={56} u1={90} id="m2" dark={!lit} v1={44} />
        <rect x={96} y={-44} width={22} height={44} rx={1} fill="#7a4a2e" {...stroke} />
        <rect x={99} y={-40} width={16} height={34} fill={lit ? "url(#glassWarm)" : "url(#glassDark)"} />
        <rect x={0} y={-F.h - 1} width={RIGHT_LEN} height={5} fill="#3a3a3e" opacity={0.6} />
      </Face>

      {/* string-light canopy over the patio, on two dark posts */}
      {[[F.x1 + 52, F.y0 + 42, 54], [F.x1 + 52, F.y1 - 24, 52]].map(([x, y, h], i) => (
        <polygon key={i} points={boxFaces(x - 1.2, y - 1.2, x + 1.2, y + 1.2, h).right} fill="#3a3a3e" {...stroke} />
      ))}
      <polygon points={pts(canopyTop)} fill="#8a5a3c" opacity={0.6} {...stroke} />
      <polyline points={pts([[F.x1, F.y0 + 26, 59], [F.x1 + 54, F.y0 + 44, 53]])} stroke="#3a3a3e" strokeWidth={0.8} fill="none" />
      {bulbs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={1.6} fill="#ffe3a0" stroke="#d9b25f" strokeWidth={0.4} />)}

      <polygon points={cornice.left} fill="#4a4a4f" {...stroke} />
      <polygon points={cornice.right} fill="#3a3a3e" {...stroke} />
      <polygon points={cornice.top} fill="#5a5a60" {...stroke} />
      <polygon points={pts([[F.x0 + 6, F.y0 + 6, F.h + 1], [F.x1 - 6, F.y0 + 6, F.h + 1], [F.x1 - 6, F.y1 - 6, F.h + 1], [F.x0 + 6, F.y1 - 6, F.h + 1]])} fill="#cdbb98" {...stroke} strokeOpacity={0.3} />
      {[[F.x0 + 20, F.y0 + 20], [F.x0 + 96, F.y0 + 70]].map(([x, y], i) => {
        const u = boxFaces(x, y, x + 24, y + 18, 9, F.h + 2);
        return <g key={i}><polygon points={u.left} fill="#cfcabd" {...stroke} /><polygon points={u.right} fill="#aaa699" {...stroke} /><polygon points={u.top} fill="#e2ded1" {...stroke} /></g>;
      })}
    </g>
  );
}

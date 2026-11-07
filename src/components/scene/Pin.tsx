import type { Pt } from "@/lib/iso";
import { useMapGesture } from "@/components/map/MapViewport";

const KIND = {
  cafe: { fill: "#8a5a3a", glyph: "☕", size: 1.15 },
  parking: { fill: "#4b6ea5", glyph: "P", size: 0.85 },
  bus: { fill: "#4b6ea5", glyph: "🚌", size: 0.85 },
};

/** Small map pin; counter-scaled so it stays the same screen size, fades out when zoomed in. */
export function Pin({
  at,
  kind,
  onClick,
  fadeOutAt,
  fadeInAt = 0,
}: {
  id: string;
  at: Pt;
  kind: keyof typeof KIND;
  onClick?: () => void;
  fadeOutAt: number;
  fadeInAt?: number;
}) {
  const k = KIND[kind];
  const { consumeDrag } = useMapGesture();
  return (
    <g
      className="pin"
      style={{
        transform: `translate(${at.x}px, ${at.y}px) scale(calc(${k.size} / var(--z)))`,
        opacity: `min(clamp(0, calc((${fadeOutAt} - var(--z)) / 1.2), 1), clamp(0, calc((var(--z) - ${fadeInAt}) / 0.8), 1))`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!consumeDrag()) onClick?.();
      }}
    >
      <path d="M0 0 C-4 -9 -13 -14 -13 -23 a13 13 0 0 1 26 0 c0 9 -9 14 -13 23z" fill={k.fill} stroke="#fff" strokeWidth={2} />
      <text y={-17} textAnchor="middle" fontSize={kind === "parking" ? 14 : 12} fontWeight={700} fill="#fff" fontFamily="system-ui">
        {k.glyph}
      </text>
    </g>
  );
}

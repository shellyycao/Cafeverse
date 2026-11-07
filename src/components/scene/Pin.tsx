import type { Pt } from "@/lib/iso";
import { useMapGesture } from "@/components/map/MapViewport";

const KIND = {
  cafe: { fill: "#a2502f", glyph: "☕", size: 2.0 },
  parking: { fill: "#4b6ea5", glyph: "P", size: 0.85 },
};

/** Small map pin; counter-scaled so it stays the same screen size, fades out when zoomed in. */
export function Pin({
  at,
  kind,
  onClick,
  fadeOutAt,
  fadeInAt = 0,
  status = null,
}: {
  id: string;
  at: Pt;
  kind: keyof typeof KIND;
  onClick?: () => void;
  fadeOutAt: number | string;
  fadeInAt?: number | string;
  status?: "saved" | "visited" | null;
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
      {status && (
        <g transform="translate(11 -34)">
          <circle r={8} fill={status === "saved" ? "#c4566b" : "#5f8f55"} stroke="#fff" strokeWidth={1.8} />
          <text y={3.6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff" fontFamily="system-ui">
            {status === "saved" ? "♥" : "✓"}
          </text>
        </g>
      )}
    </g>
  );
}

/** Pulsing dot that hints at a clickable object inside the café. */
export function HintDot({ at, onClick, label }: { at: Pt; onClick?: () => void; label: string }) {
  const { consumeDrag } = useMapGesture();
  return (
    <g
      className="hint"
      aria-label={label}
      style={{ transform: `translate(${at.x}px, ${at.y}px) scale(calc(1 / var(--z)))` }}
      onClick={(e) => {
        e.stopPropagation();
        if (!consumeDrag()) onClick?.();
      }}
    >
      <circle className="hint-ring" r={9} />
      <circle r={5} fill="#fff8e8" stroke="#8a5a3a" strokeWidth={1.6} />
      <circle r={1.8} fill="#8a5a3a" />
    </g>
  );
}

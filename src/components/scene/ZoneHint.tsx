import { P, pts } from "@/lib/iso";
import { ZONES } from "@/data/durham";

/**
 * Far-zoom cue that a neighbourhood holds a richer miniature: a faint warm halo and a dashed,
 * hand-drawn boundary around the supported block. It fades as the illustrated miniature takes over.
 */
export default function ZoneHint() {
  return (
    <g className="zone-hint" style={{ pointerEvents: "none" }}>
      {ZONES.map((z) => {
        const c = P(z.cx, z.cy);
        const ring = pts([[-60, -50], [460, -50], [460, 350], [-60, 350]]);
        return (
          <g key={z.id}>
            <ellipse cx={c.x} cy={c.y} rx={470} ry={270} fill="url(#zoneGlow)" />
            <polygon points={ring} fill="none" stroke="#b9805a" strokeWidth={3} strokeDasharray="12 9" strokeLinecap="round" opacity={0.75} />
            <polygon points={ring} fill="#f4c97a" opacity={0.09} />
          </g>
        );
      })}
    </g>
  );
}

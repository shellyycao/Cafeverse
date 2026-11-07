import { P, pts } from "@/lib/iso";
import { SITES } from "@/data/sites";
import type { Match } from "@/lib/match";

/**
 * Far-zoom cue that a block holds a richer miniature: a warm halo and a dashed, hand-drawn boundary around each café
 * block. After a search the matching blocks glow stronger and the others fade back. Fades as the miniature takes over.
 */
export default function ZoneHint({ matches }: { matches?: Match[] | null }) {
  return (
    <g className="zone-hint" style={{ pointerEvents: "none" }}>
      {SITES.map((site) => {
        const [a, b, c, d] = site.paving;
        const ring = pts([[a - 24, b - 24], [c + 24, b - 24], [c + 24, d + 24], [a - 24, d + 24]]);
        const ctr = P((a + c) / 2, (b + d) / 2);
        const m = matches?.find((x) => x.id === site.id);
        const k = m ? (m.score >= 70 ? 1.5 : m.score >= 50 ? 0.9 : 0.3) : 1;
        return (
          <g key={site.id} opacity={Math.min(1, k)}>
            <ellipse cx={ctr.x} cy={ctr.y} rx={(c - a + 380) * 0.5} ry={(c - a + 380) * 0.29} fill="url(#zoneGlow)" opacity={Math.min(1, k)} />
            <polygon points={ring} fill="#f4c97a" opacity={0.09 * k} />
            <polygon points={ring} fill="none" stroke={m && m.score >= 70 ? "#c4566b" : "#b9805a"} strokeWidth={m && m.score >= 70 ? 4.5 : 3} strokeDasharray="12 9" strokeLinecap="round" opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
}

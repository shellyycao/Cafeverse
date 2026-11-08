"use client";

import { P } from "@/lib/iso";
import { useMapGesture } from "@/components/map/MapViewport";
import { SITES } from "@/data/sites";
import type { Match } from "@/lib/match";

/**
 * One pin per café with a hand-lettered name. After a search the best matches light up (glow, larger, rank + %),
 * the rest dim. Pins keep the same on-screen size at any zoom and fade out as the miniature takes over.
 */
export default function CafePins({
  matches,
  focusId,
  statusFor,
  onSelect,
}: {
  matches: Match[] | null;
  focusId: string;
  statusFor: (id: string) => "saved" | "visited" | null;
  onSelect: (id: string) => void;
}) {
  const { consumeDrag } = useMapGesture();
  return (
    <g>
      {SITES.map((site) => {
        const m = matches?.find((x) => x.id === site.id) ?? null;
        const at = P(268 + site.offset[0], 192 + site.offset[1], 84);
        const hot = m ? m.score >= 70 : false;
        const dim = m ? m.score < 50 : false;
        const size = m ? 1.15 + (m.score / 100) * 0.7 : 1.35; // the pin body grows with the match; text stays one size
        const status = statusFor(site.id);
        return (
          <g
            key={site.id}
            className={`cafe-pin ${hot ? "hot" : ""} ${dim ? "dim" : ""}`}
            style={{
              transform: `translate(${at.x}px, ${at.y}px) scale(calc(1 / var(--z)))`,
              opacity: "min(clamp(0, calc((calc(0.5 * var(--zi)) - var(--z)) / 1.2), 1), 1)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!consumeDrag()) onSelect(site.id);
            }}
            role="button"
            aria-label={`${site.name}${m ? `, ${m.score}% match` : ""}`}
          >
            <g transform={`scale(${size})`}>
            {hot && <circle className="pin-glow" cx={0} cy={-18} r={30} fill="url(#pinGlow)" />}
            <path d="M0 0 C-4 -9 -13 -14 -13 -23 a13 13 0 0 1 26 0 c0 9 -9 14 -13 23z" fill={site.real ? "#a2502f" : "#7d6a8a"} stroke="#fff" strokeWidth={2} />
            <text y={-17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff" fontFamily="system-ui">
              ☕
            </text>
            {m && (
              <g transform="translate(-14 -36)">
                <circle r={8.5} fill={m.rank === 1 ? "#c4566b" : "#8a7255"} stroke="#fff" strokeWidth={1.6} />
                <text y={3.6} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff" fontFamily="system-ui">
                  {m.rank}
                </text>
              </g>
            )}
            {status && (
              <g transform="translate(13 -36)">
                <circle r={7.5} fill={status === "saved" ? "#c4566b" : "#5f8f55"} stroke="#fff" strokeWidth={1.6} />
                <text y={3.4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" fontFamily="system-ui">
                  {status === "saved" ? "♥" : "✓"}
                </text>
              </g>
            )}
            </g>
            <g style={{ pointerEvents: "none" }} transform={`translate(${14 + size * 14} 0)`}>
              <text x={0} y={-24} fontSize={21} fontWeight={700} fill="#6a3f24" stroke="#fffaf0" strokeWidth={5} paintOrder="stroke" fontFamily="var(--font-hand), cursive">
                {site.name}
              </text>
              {m ? (
                <text x={0} y={-6} fontSize={12} fontWeight={700} fill={hot ? "#9a2f48" : "#7a6048"} stroke="#fffaf0" strokeWidth={3.5} paintOrder="stroke" fontFamily="var(--font-geist-sans), system-ui">
                  {m.score}% match · demo
                </text>
              ) : (
                <text x={0} y={-6} fontSize={11} fontWeight={600} fill="#7a6048" stroke="#fffaf0" strokeWidth={3.5} paintOrder="stroke" fontFamily="var(--font-geist-sans), system-ui">
                  demo café · tap to look inside
                </text>
              )}
            </g>
            {site.id === focusId && !m && <circle cx={0} cy={-18} r={0.1} />}
          </g>
        );
      })}
    </g>
  );
}

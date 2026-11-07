"use client";

import { useEffect, useState } from "react";
import { ACTORS, anchorPx, type ActorSpec } from "@/data/foster-actors";
import { CANVAS } from "@/data/foster-anchors";

const url = (a: ActorSpec) => `/assets/foster/actors/${a.file}`;

/** Which actor sprites actually exist in /public (checked by trying to load them). Missing = simply not drawn. */
export function useActorFiles() {
  const [present, setPresent] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let alive = true;
    ACTORS.forEach((a) => {
      const img = new window.Image();
      img.onload = () => alive && setPresent((p) => ({ ...p, [a.id]: true }));
      img.onerror = () => alive && setPresent((p) => ({ ...p, [a.id]: false }));
      img.src = `${url(a)}?v=${Date.now() % 100000}`;
    });
    return () => {
      alive = false;
    };
  }, []);
  return present;
}

export type ActorRequest = { id: string; anchor?: string; scale?: number };

/** Draws the requested sprites at their anchors (pivot on the anchor). Nothing is drawn unless requested AND present. */
export default function InteriorActors({ show, present, debug = false }: { show: ActorRequest[]; present: Record<string, boolean>; debug?: boolean }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      {show.map((r, i) => {
        const a = ACTORS.find((x) => x.id === r.id);
        if (!a) return null;
        const at = r.anchor ?? a.anchors[0];
        const px = anchorPx(at);
        if (!px) return null;
        const sc = r.scale ?? 1;
        const w = (a.w / CANVAS.px) * sc;
        const h = (a.h / CANVAS.px) * sc;
        const cx = CANVAS.x + px[0] / CANVAS.px;
        const cy = CANVAS.y + px[1] / CANVAS.px;
        const x = cx - w * a.pivot[0];
        const y = cy - h * a.pivot[1];
        return (
          <g key={`${r.id}-${at}-${i}`}>
            {present[a.id] && (
              <>
                <ellipse cx={cx} cy={cy + h * (1 - a.pivot[1]) * 0.9} rx={w * 0.22} ry={w * 0.05} fill="#4a3626" opacity={0.16} />
                <image href={url(a)} x={x} y={y} width={w} height={h} preserveAspectRatio="none" />
              </>
            )}
            {debug && !present[a.id] && (
              <g>
                <rect x={x} y={y} width={w} height={h} fill="#c4566b" fillOpacity={0.1} stroke="#c4566b" strokeWidth={0.7} strokeDasharray="3 2" />
                <circle cx={cx} cy={cy} r={1.6} fill="#c4566b" />
                <text x={x + 1.5} y={y + 5} fontSize={4.4} fill="#7a2336" stroke="#fff" strokeWidth={1.1} paintOrder="stroke">
                  {a.id} ({a.w}×{a.h})
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

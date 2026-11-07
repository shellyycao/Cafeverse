"use client";

import { useEffect, useState, type ReactNode } from "react";
import InteriorBase from "./InteriorBase";
import { AnchorDots } from "./LayeredInterior";
import { CANVAS } from "@/data/foster-anchors";
import { BASE_IMAGE } from "@/data/foster-anchors";

/**
 * Shows the authored illustration if `public/assets/foster/interior-base.png` exists (just drop it in and reload),
 * otherwise the built-in SVG interior. No script, no config.
 */
/** lantern positions on the illustration (canvas px) and glow radius (world units) */
const NIGHT_GLOWS: Array<[number, number, number]> = [[1090, 520, 20], [1540, 620, 18], [1170, 760, 20], [520, 660, 18], [760, 500, 20], [1470, 700, 14]];

export default function InteriorStage({ lit = true, showAnchors = false, children }: { lit?: boolean; showAnchors?: boolean; children?: ReactNode }) {
  const [state, setState] = useState<"checking" | "image" | "svg">("checking");
  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.onload = () => alive && setState("image");
    img.onerror = () => alive && setState("svg");
    img.src = `${BASE_IMAGE}?v=${Date.now() % 100000}`;
    return () => {
      alive = false;
    };
  }, []);

  if (state === "image") {
    const { x, y, w, h } = CANVAS;
    // Night is the SAME pixels, dimmed and cooled, with the paper lanterns still glowing: nothing can drift out of
    // alignment, and the swap is a ~500 ms cross-fade.
    const fade = { transition: "opacity 520ms ease" } as const;
    return (
      <g>
        <image href={BASE_IMAGE} x={x} y={y} width={w} height={h} preserveAspectRatio="none" style={{ ...fade, opacity: lit ? 1 : 0 }} />
        <image href={BASE_IMAGE} x={x} y={y} width={w} height={h} preserveAspectRatio="none" style={{ ...fade, opacity: lit ? 0 : 1, filter: "brightness(0.5) saturate(0.7) hue-rotate(-8deg) contrast(1.05)" }} />
        {!lit && (
          <g style={{ pointerEvents: "none" }} opacity={0.9}>
            {NIGHT_GLOWS.map(([gx, gy, r], i) => (
              <circle key={i} cx={x + gx / CANVAS.px} cy={y + gy / CANVAS.px} r={r} fill="url(#nightGlow)" />
            ))}
          </g>
        )}
        {children}
        {showAnchors && <AnchorDots />}
      </g>
    );
  }
  return (
    <g className="paint-group" filter="url(#paint)" opacity={state === "checking" ? 0.999 : 1}>
      <InteriorBase lit={lit} />
    </g>
  );
}

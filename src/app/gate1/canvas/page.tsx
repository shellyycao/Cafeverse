import Defs from "@/components/scene/Defs";
import InteriorBase from "@/components/scene/InteriorBase";
import { CANVAS } from "@/data/foster-anchors";

export const metadata = { title: "Gate 1 — exact canvas (asset reference export)" };

/** The current interior drawn on the exact asset canvas: used to export a composition reference. */
export default function Gate1Canvas() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#fbf7ee" }}>
      <style>{"nextjs-portal{display:none !important}"}</style>
      <svg viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`} width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Foster Street Coffee interior on the asset canvas">
        <Defs />
        <g filter="url(#paint)">
          <InteriorBase />
        </g>
      </svg>
    </main>
  );
}

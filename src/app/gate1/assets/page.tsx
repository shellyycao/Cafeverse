import Defs from "@/components/scene/Defs";
import InteriorStage from "@/components/scene/InteriorStage";
import { AnchorDots } from "@/components/scene/LayeredInterior";
import { CANVAS } from "@/data/foster-anchors";

export const metadata = { title: "Interior asset check" };

/** /gate1/assets — the interior on the exact asset canvas, with the registration anchors drawn on top. */
export default function AssetCheck() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f2e8d3" }}>
      <svg viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <Defs />
        <InteriorStage />
        <g style={{ pointerEvents: "none" }}>
          <AnchorDots />
        </g>
      </svg>
    </main>
  );
}

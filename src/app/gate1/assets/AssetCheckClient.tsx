"use client";

import { useSearchParams } from "next/navigation";
import Defs from "@/components/scene/Defs";
import InteriorStage from "@/components/scene/InteriorStage";
import { AnchorDots } from "@/components/scene/LayeredInterior";
import { CANVAS } from "@/data/foster-anchors";

/** The interior on the exact asset canvas with registration anchors. `?night=1` previews the closed-hours look. */
export default function AssetCheckClient() {
  const lit = useSearchParams().get("night") !== "1";
  return (
    <svg viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Defs />
      <InteriorStage lit={lit} />
      <g style={{ pointerEvents: "none" }}>
        <AnchorDots />
      </g>
    </svg>
  );
}

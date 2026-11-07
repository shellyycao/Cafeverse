"use client";

import BaseMap from "@/components/map/BaseMap";
import Defs from "@/components/scene/Defs";
import Neighborhood from "@/components/scene/Neighborhood";
import { EXT } from "@/data/foster-exterior";

export default function Canvas() {
  return (
    <svg viewBox={`${EXT.x} ${EXT.y} ${EXT.w} ${EXT.h}`} width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Foster Street Coffee neighbourhood on the asset canvas">
      <Defs />
      <BaseMap />
      <Neighborhood level={3} />
    </svg>
  );
}

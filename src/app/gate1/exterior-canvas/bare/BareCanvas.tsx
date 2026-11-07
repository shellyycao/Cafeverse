"use client";

import BaseMap from "@/components/map/BaseMap";
import Defs from "@/components/scene/Defs";
import { EXT } from "@/data/foster-exterior";

export default function BareCanvas() {
  return (
    <svg viewBox={`${EXT.x} ${EXT.y} ${EXT.w} ${EXT.h}`} width="100%" height="100%" preserveAspectRatio="none">
      <Defs />
      <BaseMap />
    </svg>
  );
}

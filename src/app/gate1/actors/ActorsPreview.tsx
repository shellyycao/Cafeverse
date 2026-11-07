"use client";

import Defs from "@/components/scene/Defs";
import InteriorStage from "@/components/scene/InteriorStage";
import InteriorActors, { useActorFiles } from "@/components/scene/InteriorActors";
import { ACTORS } from "@/data/foster-actors";
import { CANVAS } from "@/data/foster-anchors";

/** /gate1/actors — where every sprite goes and how big it is (dashed boxes = sprites you have not supplied yet). */
export default function ActorsPreview() {
  const present = useActorFiles();
  return (
    <svg viewBox={`${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Defs />
      <InteriorStage />
      <InteriorActors debug present={present} show={[
        { id: "laptop-worker", anchor: "window-seat-2" },
        { id: "laptop-worker", anchor: "window-seat-4" },
        { id: "chat-pair", anchor: "tableA-center" },
        { id: "barista", anchor: "barista" },
        { id: "reader", anchor: "lounge-sofa-2" },
        { id: "grab-and-go", anchor: "door" },
        { id: "dog", anchor: "dog-spot" },
      ]} />
      <text x={CANVAS.x + 6} y={CANVAS.y + 10} fontSize={6} fill="#6a5338" stroke="#fff" strokeWidth={1.6} paintOrder="stroke">
        {ACTORS.length} sprite slots · dashed = not supplied yet · pivot dot = the point that sits on the anchor
      </text>
    </svg>
  );
}

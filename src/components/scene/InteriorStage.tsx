"use client";

import { useEffect, useState } from "react";
import InteriorBase from "./InteriorBase";
import LayeredInterior from "./LayeredInterior";
import { BASE_IMAGE } from "@/data/foster-anchors";

/**
 * Shows the authored illustration if `public/assets/foster/interior-base.png` exists (just drop it in and reload),
 * otherwise the built-in SVG interior. No script, no config.
 */
export default function InteriorStage({ lit = true, showAnchors = false }: { lit?: boolean; showAnchors?: boolean }) {
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

  if (state === "image") return <LayeredInterior showAnchors={showAnchors} />;
  return (
    <g className="paint-group" filter="url(#paint)" opacity={state === "checking" ? 0.999 : 1}>
      <InteriorBase lit={lit} />
    </g>
  );
}

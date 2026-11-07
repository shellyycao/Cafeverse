"use client";

import { useCallback, useRef, useState } from "react";
import MapViewport, { type Camera, type MapHandle } from "./map/MapViewport";
import BaseMap from "./map/BaseMap";
import Neighborhood, { ScenePins, type HotspotId } from "./scene/Neighborhood";
import Defs from "./scene/Defs";
import { P } from "@/lib/iso";

type Level = 1 | 2 | 3 | 4;
const LEVELS = ["City map", "Neighborhood", "Café exterior", "Inside"];
const levelOf = (z: number): Level => (z < 1.7 ? 1 : z < 4 ? 2 : z < 9 ? 3 : 4);

const START: Camera = { x: P(268, 192).x, y: P(268, 192).y, z: 0.55 };

export default function CafeverseApp() {
  const map = useRef<MapHandle>(null);
  const [level, setLevel] = useState<Level>(1);
  const lastLevel = useRef<Level>(1);

  const onCamera = useCallback((c: Camera) => {
    const l = levelOf(c.z);
    if (l !== lastLevel.current) {
      lastLevel.current = l;
      setLevel(l);
    }
  }, []);

  const onSelect = (id: HotspotId) => {
    const cafe = P(268, 192, 28);
    if (id === "cafe") map.current?.flyTo({ x: cafe.x, y: cafe.y, z: 5.2 }, 1500);
    // parking / bus popovers arrive in Milestone C
  };

  return (
    <div className="app">
      <MapViewport initial={START} onCamera={onCamera} handleRef={map}>
        <Defs />
        <BaseMap />
        <g className="mini" mask="url(#revealMask)">
          <g filter="url(#wobble)">
            <Neighborhood onSelect={onSelect} />
          </g>
        </g>
        <ScenePins onSelect={onSelect} />
      </MapViewport>
      <div className="paper" />
      <div className="vignette" />

      <div className="chrome top-left">
        <div className="pill brand">☕ Cafeverse</div>
        <label className="pill search">
          <span aria-hidden>🔍</span>
          <input
            placeholder="Search cafés, neighborhoods, or tags…"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelect("cafe");
            }}
          />
        </label>
      </div>

      <div className="chrome zoom-ctl">
        <button aria-label="Zoom in" onClick={() => map.current?.zoomBy(1.8)}>+</button>
        <button aria-label="Zoom out" onClick={() => map.current?.zoomBy(1 / 1.8)}>−</button>
        <button aria-label="Reset view" onClick={() => map.current?.flyTo(START, 1100)}>◎</button>
      </div>

      <div className="chrome level" aria-live="polite">
        {LEVELS.map((n, i) => (
          <span key={n} className={`step ${level === i + 1 ? "on" : ""}`}>{n}</span>
        ))}
      </div>
      <div className="chrome credit">Demo map · fictional neighborhood · no map API</div>
    </div>
  );
}

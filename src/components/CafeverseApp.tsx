"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import MapViewport, { type Camera, type MapHandle } from "./map/MapViewport";
import BaseMap from "./map/BaseMap";
import Neighborhood, { ANCHORS, ScenePins, type HotspotId } from "./scene/Neighborhood";
import Defs from "./scene/Defs";
import Popover from "./Popover";
import { P } from "@/lib/iso";

type Level = 1 | 2 | 3 | 4;
const LEVELS = ["City map", "Neighborhood", "Café exterior", "Inside"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** zoom at which the café interior fills the screen; scales with viewport width */
const interiorZoom = (vw: number) => clamp((vw * 0.9) / 272, 2.6, 4.6);
const levelOf = (z: number, zi: number): Level => (z < 1.2 ? 1 : z < 0.45 * zi ? 2 : z < 0.9 * zi ? 3 : 4);

const START: Camera = { x: P(268, 192).x, y: P(268, 192).y, z: 0.55 };

export default function CafeverseApp() {
  const map = useRef<MapHandle>(null);
  const [zi, setZi] = useState(4.2);
  const ziRef = useRef(zi);
  const [level, setLevel] = useState<Level>(1);
  const lastLevel = useRef<Level>(1);
  const [pop, setPop] = useState<{ id: HotspotId } | null>(null);
  const popEl = useRef<HTMLDivElement>(null);
  const popWorld = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const set = () => {
      const v = interiorZoom(window.innerWidth);
      ziRef.current = v;
      setZi(v);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const placePopover = useCallback(() => {
    const el = popEl.current;
    const w = popWorld.current;
    if (!el || !w || !map.current) return;
    const s = map.current.worldToScreen(w.x, w.y);
    const size = map.current.size();
    const pw = el.offsetWidth || 230;
    const left = clamp(s.x - pw / 2, 10, size.w - pw - 10);
    el.style.transform = `translate(${left}px, ${Math.max(s.y, 150) - 14}px) translateY(-100%)`;
    el.style.setProperty("--ax", `${clamp(s.x - left, 22, pw - 22)}px`);
  }, []);

  const onCamera = useCallback(
    (c: Camera) => {
      const l = levelOf(c.z, ziRef.current);
      if (l !== lastLevel.current) {
        lastLevel.current = l;
        setLevel(l);
      }
      placePopover();
    },
    [placePopover],
  );

  useLayoutEffect(() => {
    if (pop) placePopover();
  }, [pop, placePopover]);

  const fly = (to: "map" | "hood" | "exterior" | "inside", ms = 1500) => {
    setPop(null);
    const cafe = P(268, 192);
    if (to === "map") map.current?.flyTo(START, ms);
    if (to === "hood") map.current?.flyTo({ x: cafe.x, y: cafe.y + 10, z: Math.max(1.5, 0.3 * ziRef.current) }, ms);
    if (to === "exterior") {
      const c = P(290, 215, 10);
      map.current?.flyTo({ x: c.x, y: c.y, z: 0.62 * ziRef.current }, ms);
    }
    if (to === "inside") {
      const c = P(268, 192, 22);
      map.current?.flyTo({ x: c.x, y: c.y, z: ziRef.current }, ms);
    }
  };

  const onSelect = (id: HotspotId) => {
    if (id === "cafe") {
      // first click brings the camera to the exterior; clicking again steps inside
      const z = map.current?.getCamera().z ?? 0;
      fly(z < 0.5 * ziRef.current ? "exterior" : "inside");
      return;
    }
    const a = ANCHORS[id];
    const w = P(a[0], a[1], a[2]);
    popWorld.current = w;
    setPop({ id });
  };

  return (
    <div
      className="app"
      onClick={(e) => {
        if (pop && !(e.target as Element).closest("[data-hotspot], .hint, .pin, .popover, .chrome")) setPop(null);
      }}
    >
      <MapViewport initial={START} onCamera={onCamera} handleRef={map} cssVars={{ "--zi": zi }}>
        <Defs />
        <BaseMap />
        <g className="mini" mask="url(#revealMask)">
          <g filter="url(#wobble)">
            <Neighborhood onSelect={onSelect} level={level} />
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
              if (e.key === "Enter") fly("exterior");
            }}
          />
        </label>
      </div>

      {level >= 3 && (
        <div className="chrome back-btn">
          <button onClick={() => fly(level === 4 ? "exterior" : "hood", 1200)}>← {level === 4 ? "Step outside" : "Back to neighborhood"}</button>
        </div>
      )}

      <div className="chrome zoom-ctl">
        <button aria-label="Zoom in" onClick={() => map.current?.zoomBy(1.8)}>+</button>
        <button aria-label="Zoom out" onClick={() => map.current?.zoomBy(1 / 1.8)}>−</button>
        <button aria-label="Reset view" onClick={() => fly("map", 1100)}>◎</button>
      </div>

      <div className="chrome level" aria-live="polite">
        {LEVELS.map((n, i) => (
          <button key={n} className={`step ${level === i + 1 ? "on" : ""}`} onClick={() => fly((["map", "hood", "exterior", "inside"] as const)[i])}>
            {n}
          </button>
        ))}
      </div>
      <div className="chrome credit">Demo map · fictional neighborhood · illustrative data</div>

      {pop && <Popover ref={popEl} id={pop.id} onClose={() => setPop(null)} />}
    </div>
  );
}

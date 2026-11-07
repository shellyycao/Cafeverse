"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import MapViewport, { type Camera, type MapHandle } from "./map/MapViewport";
import BaseMap from "./map/BaseMap";
import Neighborhood, { ANCHORS, ScenePins, type HotspotId } from "./scene/Neighborhood";
import Defs from "./scene/Defs";
import Popover from "./Popover";
import Dock, { type Crowd } from "./Dock";
import { useCafeStatus } from "@/lib/useCafeStatus";
import AiPanel, { type AiState } from "./AiPanel";
import { durhamNow, phaseAt, type Clock } from "@/lib/hours";
import { BASELINE_SIGNALS, describeChanges, type SceneSignals } from "@/lib/scene";
import { CAFE } from "@/data/cafe";
import { fosterSources } from "@/data/foster-sources";
import { P } from "@/lib/iso";
import { ZONES } from "@/data/durham";

type Level = 1 | 2 | 3 | 4;
const LEVELS = ["City map", "Neighborhood", "Café exterior", "Inside"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** zoom at which the café interior fills the screen; scales with viewport width */
const interiorZoom = (vw: number) => clamp((vw * 0.9) / 272, 2.6, 4.6);
const levelOf = (z: number, zi: number): Level => (z < 1.2 ? 1 : z < 0.45 * zi ? 2 : z < 0.9 * zi ? 3 : 4);

const START: Camera = { x: P(268, 192).x, y: P(268, 192).y, z: 0.6 };

/**
 * Only café zones can zoom into the miniature; the rest of the map stops at street level.
 * Rule: the zone must stay in view — allowed zoom ≈ R / distance-to-zone, floored at street level.
 */
const OUTSIDE_CAP = 1.05;
const ZONE_PTS = ZONES.map((z) => P(z.cx, z.cy));
function maxZoomAt(x: number, y: number) {
  const R = typeof window === "undefined" ? 600 : Math.max(330, Math.min(window.innerWidth, 1200) * 0.45);
  const d = Math.min(...ZONE_PTS.map((p) => Math.hypot(p.x - x, p.y - y)));
  return Math.min(18, Math.max(OUTSIDE_CAP, R / Math.max(d, 1)));
}

export default function CafeverseApp() {
  const map = useRef<MapHandle>(null);
  const [zi, setZi] = useState(4.2);
  const ziRef = useRef(zi);
  const [level, setLevel] = useState<Level>(1);
  const lastLevel = useRef<Level>(1);
  const [pop, setPop] = useState<{ id: HotspotId } | null>(null);
  const popEl = useRef<HTMLDivElement>(null);
  const popWorld = useRef<{ x: number; y: number } | null>(null);
  const [signals, setSignals] = useState<SceneSignals>(BASELINE_SIGNALS);
  const signalsRef = useRef(signals);
  const [ai, setAi] = useState<AiState>({ status: "idle", mode: "demo" });
  const [crowd, setCrowd] = useState<Crowd>(1);
  const [now, setNow] = useState<Clock | null>(null);
  const [simMin, setSimMin] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(durhamNow());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const clock = now ? { minutes: simMin ?? now.minutes, weekend: now.weekend, dayLabel: now.label } : null;
  const phase = clock ? phaseAt(clock.minutes, clock.weekend) : "open";
  const { status: cafeStatus, toggle: toggleStatus } = useCafeStatus(CAFE.id);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onZoomBlocked = useCallback(() => {
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2600);
  }, []);

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

  useEffect(() => {
    fetch("/api/analyze-cafe")
      .then((r) => r.json())
      .then((d) => setAi((a) => ({ ...a, mode: d.mode === "live" ? "live" : "demo" })))
      .catch(() => {});
  }, []);

  const analyze = useCallback(async () => {
    setAi((a) => ({ ...a, status: "loading" }));
    try {
      const sources = fosterSources();
      const res = await fetch("/api/analyze-cafe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeName: CAFE.name, sources }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      const next: SceneSignals = data.analysis.visualSignals;
      const prev = signalsRef.current;
      signalsRef.current = next;
      setSignals(next);
      setAi({ status: "done", mode: data.mode, analysis: data.analysis, note: data.note, changes: describeChanges(prev, next) });
    } catch (e) {
      setAi((a) => ({ ...a, status: "error", error: e instanceof Error ? e.message : "failed" }));
    }
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

  // outside opening hours the scene empties; near closing a few stragglers remain and staff tidy up
  const sceneSignals: SceneSignals =
    phase === "open"
      ? signals
      : phase === "closing"
        ? { ...signals, laptopWorkers: Math.min(1, signals.laptopWorkers), chattingGroups: 0, dogOnPatio: false, dogInside: false }
        : { ...signals, laptopWorkers: 0, chattingGroups: 0, dogOnPatio: false, dogInside: false };
  const sceneCrowd: Crowd = phase === "open" ? crowd : 0;

  return (
    <div
      className="app"
      onClick={(e) => {
        if (pop && !(e.target as Element).closest("[data-hotspot], .hint, .pin, .popover, .chrome")) setPop(null);
      }}
    >
      <MapViewport initial={START} onCamera={onCamera} handleRef={map} cssVars={{ "--zi": zi }} maxZoomAt={maxZoomAt} onZoomBlocked={onZoomBlocked}>
        <Defs />
        <BaseMap />
        <g className="mini" mask="url(#revealMask)">
          <g filter="url(#wobble)">
            <Neighborhood onSelect={onSelect} level={level} signals={sceneSignals} crowd={sceneCrowd} phase={phase} />
          </g>
        </g>
        <ScenePins onSelect={onSelect} staff={phase !== "closed"} busStop={signals.busStop} status={cafeStatus.visited ? "visited" : cafeStatus.saved ? "saved" : null} />
      </MapViewport>
      <div className="paper" />
      <div className="vignette" />

      <div className="chrome top-left">
        <div className="pill brand">☕ Cafeverse</div>
        <label className="pill search">
          <span aria-hidden>🔍</span>
          <input
            placeholder="Search cafés in downtown Durham…"
            onKeyDown={(e) => {
              if (e.key === "Enter") fly("exterior");
            }}
          />
        </label>
      </div>

      <AiPanel state={ai} onAnalyze={analyze} />
      {level >= 2 && <Dock name={CAFE.name} status={cafeStatus} onToggle={toggleStatus} crowd={crowd} onCrowd={setCrowd} time={clock ? { ...clock, live: simMin === null, phase, onScrub: setSimMin, onLive: () => setSimMin(null) } : null} />}

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
      <div className="chrome credit">Map data © OpenStreetMap contributors · illustrated demo</div>
      {toast && <div className="chrome toast">Only café neighborhoods zoom in closer — more coming soon</div>}

      {pop && <Popover ref={popEl} id={pop.id} analysis={ai.analysis} onClose={() => setPop(null)} />}
    </div>
  );
}

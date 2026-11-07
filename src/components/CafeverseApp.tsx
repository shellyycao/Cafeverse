"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import MapViewport, { type Camera, type MapHandle } from "./map/MapViewport";
import BaseMap from "./map/BaseMap";
import Neighborhood, { ANCHORS, type HotspotId } from "./scene/Neighborhood";
import CafePins from "./scene/CafePins";
import Splash from "./Splash";
import ResultsBar from "./ResultsBar";
import { SITES, siteById } from "@/data/sites";
import type { Match } from "@/lib/match";
import Defs from "./scene/Defs";
import ZoneHint from "./scene/ZoneHint";
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

const FOSTER_ID = "foster-street-coffee";

type Level = 1 | 2 | 3 | 4;
const LEVELS = ["City map", "Neighborhood", "Café exterior", "Inside"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** zoom at which the café interior fills the screen; scales with viewport width */
const interiorZoom = (vw: number) => clamp((vw * 0.66) / 272, 2.0, 3.4);
const levelOf = (z: number, zi: number): Level => (z < 1.2 ? 1 : z < 0.45 * zi ? 2 : z < 0.9 * zi ? 3 : 4);

const sitePt = (id: string, dx = 268, dy = 192, z = 0) => {
  const [ox, oy] = siteById(id).offset;
  return P(dx + ox, dy + oy, z);
};
/** overview that frames every café; narrower screens zoom out a little further */
const overviewCam = (fixedVw?: number): Camera => {
  const pts = SITES.map((s) => sitePt(s.id));
  const vw = fixedVw ?? (typeof window === "undefined" ? 1440 : window.innerWidth);
  return { x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length, z: clamp(vw / 2700, 0.3, 0.5) };
};
const START: Camera = overviewCam(1440); // deterministic for SSR; the mount effect re-frames for the real width

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
  // search / boot
  const [focusId, setFocusId] = useState(FOSTER_ID);
  const [splash, setSplash] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [summary, setSummary] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<"live" | "demo">("demo");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nosplash")) setSplash(false);
    map.current?.flyTo(overviewCam(), 30);
  }, []);
  const [now, setNow] = useState<Clock | null>(null);
  const [simMin, setSimMin] = useState<number | null>(null);
  // test mode: open the app with ?test=1 to get the time-of-day control (hidden from normal users)
  const [testMode, setTestMode] = useState(false);
  useEffect(() => {
    setTestMode(new URLSearchParams(window.location.search).has("test"));
  }, []);
  useEffect(() => {
    const tick = () => setNow(durhamNow());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const clock = now ? { minutes: (testMode ? simMin : null) ?? now.minutes, weekend: now.weekend, dayLabel: now.label } : null;
  const phase = clock ? phaseAt(clock.minutes, clock.weekend) : "open";
  const st0 = useCafeStatus(SITES[0].id);
  const st1 = useCafeStatus(SITES[1].id);
  const st2 = useCafeStatus(SITES[2].id);
  const statuses = [st0, st1, st2];
  const focusIdx = Math.max(0, SITES.findIndex((x) => x.id === focusId));
  const { status: cafeStatus, toggle: toggleStatus } = statuses[focusIdx];
  const statusFor = (id: string) => {
    const st = statuses[SITES.findIndex((x) => x.id === id)]?.status;
    return st?.visited ? ("visited" as const) : st?.saved ? ("saved" as const) : null;
  };
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

  const fly = (to: "map" | "hood" | "exterior" | "inside", ms = 1500, siteId = focusId) => {
    setPop(null);
    if (to === "map") map.current?.flyTo(overviewCam(), ms);
    if (to === "hood") {
      const c = sitePt(siteId, 264, 186);
      map.current?.flyTo({ x: c.x, y: c.y + 10, z: Math.max(1.5, 0.3 * ziRef.current) }, ms);
    }
    if (to === "exterior") {
      // with the authored illustration the Foster building sits left of the old SVG box: centre on it
      const c = sitePt(siteId, 290, 215, 10);
      map.current?.flyTo({ x: c.x, y: c.y, z: 0.6 * ziRef.current }, ms);
    }
    if (to === "inside") {
      const c = sitePt(siteId, 268, 192, 22);
      map.current?.flyTo({ x: c.x, y: c.y, z: ziRef.current }, ms);
    }
  };

  /** click a café: first click flies to its exterior, a second click steps inside */
  const selectSite = (id: string) => {
    const z = map.current?.getCamera().z ?? 0;
    const again = id === focusId && z >= 0.5 * ziRef.current;
    setFocusId(id);
    setPop(null);
    fly(again ? "inside" : "exterior", 1500, id);
  };

  const runSearch = async (prompt: string) => {
    setBusy(true);
    setSearchErr(null);
    try {
      const res = await fetch("/api/match", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Search failed");
      setMatches(d.results as Match[]);
      setSummary(d.summary as string[]);
      setMatchMode(d.mode === "live" ? "live" : "demo");
      setQuery(prompt);
      setLeaving(true);
      setTimeout(() => setSplash(false), 600);
      map.current?.flyTo(overviewCam(), 1600);
    } catch (e) {
      setSearchErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  };
  const clearSearch = () => {
    setMatches(null);
    setSummary([]);
    setQuery("");
  };

  const onSelect = (id: HotspotId) => {
    if (id === "cafe") {
      selectSite(FOSTER_ID);
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
        <ZoneHint matches={matches} />
        <g className="mini" mask="url(#revealMask)">
          <g className="wobble-group" filter="url(#wobble)">
            <Neighborhood onSelect={onSelect} level={level} signals={sceneSignals} crowd={sceneCrowd} phase={phase} focusId={focusId} onSelectSite={selectSite} />
          </g>
        </g>
        <CafePins matches={matches} focusId={focusId} statusFor={statusFor} onSelect={selectSite} />
      </MapViewport>
      <div className="paper" />
      <div className="vignette" />

      <div className="chrome top-left">
        <div className="pill brand">☕ Cafeverse</div>
        <form
          className="pill search"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim() && !busy) runSearch(query.trim());
          }}
        >
          <span aria-hidden>{busy ? "…" : "🔍"}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What do you want to do at a café?  e.g. study quietly with outlets" maxLength={300} aria-label="What do you want to do at a café?" />
        </form>
      </div>

      {focusId === FOSTER_ID && <AiPanel state={ai} onAnalyze={analyze} />}
      {matches && <ResultsBar matches={matches} summary={summary} mode={matchMode} focusId={focusId} onPick={selectSite} onClear={clearSearch} compact={level >= 3} />}
      {level >= 2 && <Dock name={siteById(focusId).name} status={cafeStatus} onToggle={toggleStatus} crowd={crowd} onCrowd={setCrowd} time={clock ? { ...clock, phase, test: testMode ? { live: simMin === null, onScrub: setSimMin, onLive: () => setSimMin(null) } : undefined } : null} />}

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
      <div className="chrome credit">Map data © OpenStreetMap contributors · Foster Street Coffee is real · the other two cafés are fictional demos</div>
      {toast && <div className="chrome toast">Only café neighborhoods zoom in closer — more coming soon</div>}

      {splash && (
        <div className={leaving ? "splash-wrap leaving-wrap" : "splash-wrap"}>
          <div style={{ display: "contents" }} className={leaving ? "is-leaving" : ""}>
            <Splash busy={busy} error={searchErr} onSubmit={runSearch} onSkip={() => { setLeaving(true); setTimeout(() => setSplash(false), 500); }} />
          </div>
        </div>
      )}

      {pop && <Popover ref={popEl} id={pop.id} analysis={ai.analysis} onClose={() => setPop(null)} />}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";

export type Camera = { x: number; y: number; z: number };

export const MIN_ZOOM = 0.42;
export const MAX_ZOOM = 18;
const BOUNDS = { x: 1700, y: 900 };

export type MapHandle = {
  flyTo: (cam: Partial<Camera>, ms?: number) => void;
  zoomBy: (factor: number) => void;
  getCamera: () => Camera;
  worldToScreen: (x: number, y: number) => { x: number; y: number };
  size: () => { w: number; h: number };
};

type Ctx = { consumeDrag: () => boolean };
const MapCtx = createContext<Ctx>({ consumeDrag: () => false });
/** Children use this inside onClick so a pan gesture doesn't trigger a click. */
export const useMapGesture = () => useContext(MapCtx);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function MapViewport({
  children,
  initial,
  onCamera,
  handleRef,
  cssVars,
  maxZoomAt,
  onZoomBlocked,
}: {
  children: ReactNode;
  initial: Camera;
  /** Called (throttled to frames) whenever the camera changes */
  onCamera?: (c: Camera) => void;
  handleRef?: Ref<MapHandle>;
  /** extra CSS custom properties set on the map root (e.g. --zi) */
  cssVars?: Record<string, string | number>;
  /** per-location zoom ceiling: only supported zones may zoom in close */
  maxZoomAt?: (x: number, y: number) => number;
  /** fired (throttled by caller) when a zoom/pan request hit the ceiling */
  onZoomBlocked?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const cur = useRef<Camera>({ ...initial });
  const target = useRef<Camera>({ ...initial });
  const anim = useRef<{ from: Camera; to: Camera; t0: number; ms: number } | null>(null);
  const size = useRef({ w: 1000, h: 700 });
  const raf = useRef<number | null>(null);
  const dragged = useRef(false);
  const [, force] = useState(0);

  const movingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** lets CSS drop expensive filters while the camera is in motion */
  const markMoving = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.dataset.moving = "1";
    if (movingTimer.current) clearTimeout(movingTimer.current);
    movingTimer.current = setTimeout(() => {
      if (rootRef.current) rootRef.current.dataset.moving = "0";
    }, 160);
  }, []);

  const apply = useCallback(() => {
    const { w, h } = size.current;
    const c = cur.current;
    worldRef.current?.setAttribute(
      "transform",
      `translate(${w / 2 - c.x * c.z} ${h / 2 - c.y * c.z}) scale(${c.z})`,
    );
    rootRef.current?.style.setProperty("--z", String(c.z));
    markMoving();
    onCamera?.(c);
  }, [onCamera, markMoving]);

  const loop = useCallback(() => {
    raf.current = null;
    const c = cur.current;
    const a = anim.current;
    let moving = false;
    if (a) {
      const t = clamp((performance.now() - a.t0) / a.ms, 0, 1);
      const e = ease(t);
      // interpolate zoom in log space so it feels even
      c.z = Math.exp(Math.log(a.from.z) + (Math.log(a.to.z) - Math.log(a.from.z)) * e);
      c.x = a.from.x + (a.to.x - a.from.x) * e;
      c.y = a.from.y + (a.to.y - a.from.y) * e;
      if (t >= 1) anim.current = null;
      else moving = true;
      target.current = { ...c };
    } else {
      const t = target.current;
      const k = 0.22;
      const dz = Math.log(t.z) - Math.log(c.z);
      c.z = Math.exp(Math.log(c.z) + dz * k);
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      if (Math.abs(dz) > 0.0008 || Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05) moving = true;
      else {
        c.z = t.z;
        c.x = t.x;
        c.y = t.y;
      }
    }
    apply();
    if (moving) raf.current = requestAnimationFrame(loop);
  }, [apply]);

  const kick = useCallback(() => {
    if (raf.current == null) raf.current = requestAnimationFrame(loop);
  }, [loop]);

  const maxRef = useRef(maxZoomAt);
  maxRef.current = maxZoomAt;
  const blockedRef = useRef(onZoomBlocked);
  blockedRef.current = onZoomBlocked;
  const constrain = (c: Camera): Camera => {
    const x = clamp(c.x, -BOUNDS.x, BOUNDS.x);
    const y = clamp(c.y, -BOUNDS.y, BOUNDS.y);
    const cap = maxRef.current ? maxRef.current(x, y) : MAX_ZOOM;
    const wanted = clamp(c.z, MIN_ZOOM, MAX_ZOOM);
    if (wanted > cap + 0.001) blockedRef.current?.();
    return { x, y, z: Math.min(wanted, cap) };
  };

  /** Zoom keeping the world point under screen (sx, sy) fixed. */
  const zoomAt = useCallback(
    (sx: number, sy: number, factor: number) => {
      const { w, h } = size.current;
      const t = target.current;
      const nz = clamp(t.z * factor, MIN_ZOOM, MAX_ZOOM);
      const wx = t.x + (sx - w / 2) / t.z;
      const wy = t.y + (sy - h / 2) / t.z;
      anim.current = null;
      target.current = constrain({ z: nz, x: wx - (sx - w / 2) / nz, y: wy - (sy - h / 2) / nz });
      kick();
    },
    [kick],
  );

  useImperativeHandle(
    handleRef,
    () => ({
      flyTo(cam, ms = 1400) {
        const from = { ...cur.current };
        const to = constrain({ ...target.current, ...cam });
        anim.current = { from, to, t0: performance.now(), ms };
        kick();
      },
      zoomBy(f) {
        const { w, h } = size.current;
        zoomAt(w / 2, h / 2, f);
      },
      getCamera: () => ({ ...cur.current }),
      worldToScreen: (x, y) => {
        const { w, h } = size.current;
        const c = cur.current;
        return { x: w / 2 + (x - c.x) * c.z, y: h / 2 + (y - c.y) * c.z };
      },
      size: () => ({ ...size.current }),
    }),
    [kick, zoomAt],
  );

  // size + wheel + pointer handling
  useEffect(() => {
    const el = rootRef.current!;
    const measure = () => {
      size.current = { w: el.clientWidth, h: el.clientHeight };
      force((n) => n + 1);
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mult = e.ctrlKey ? 0.012 : e.deltaMode === 1 ? 0.05 : 0.0016;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * mult));
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    const pointers = new Map<number, { x: number; y: number }>();
    let startDist = 0;
    let downAt = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragged.current = false;
        downAt = { x: e.clientX, y: e.clientY };
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        startDist = Math.hypot(a.x - b.x, a.y - b.y);
        dragged.current = true;
      }
      anim.current = null;
    };
    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const rect = el.getBoundingClientRect();
      if (pointers.size === 1) {
        if (!dragged.current && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) dragged.current = true;
        if (dragged.current) {
          const t = target.current;
          anim.current = null;
          target.current = constrain({
            ...t,
            x: t.x - (e.clientX - prev.x) / t.z,
            y: t.y - (e.clientY - prev.y) / t.z,
          });
          // direct follow while dragging (no easing lag)
          cur.current = { ...target.current };
          apply();
        }
      } else if (pointers.size === 2) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (startDist > 0) {
          const mx = (a.x + b.x) / 2 - rect.left;
          const my = (a.y + b.y) / 2 - rect.top;
          zoomAt(mx, my, d / startDist);
          cur.current = { ...target.current };
          apply();
        }
        startDist = d;
      }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) startDist = 0;
    };
    const onDbl = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, 2);
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("dblclick", onDbl);
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("dblclick", onDbl);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [apply, zoomAt]);

  const consumeDrag = useCallback(() => {
    const d = dragged.current;
    dragged.current = false;
    return d;
  }, []);

  return (
    <div
      ref={rootRef}
      className="map-root"
      style={{ ["--z" as string]: initial.z, ...cssVars, touchAction: "none" }}
    >
      <svg className="map-svg" width="100%" height="100%">
        <MapCtx.Provider value={{ consumeDrag }}>
          <g ref={worldRef}>{children}</g>
        </MapCtx.Provider>
      </svg>
    </div>
  );
}

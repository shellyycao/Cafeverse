"use client";

import { ANCHORS, CANVAS } from "@/data/foster-anchors";

/**
 * Small, code-drawn figures with gentle motion. They stand in until hand-made sprites exist (a PNG in
 * /assets/foster/actors/ takes over automatically). Illustrative activity cues — not live customers.
 * Origin of every figure = the seat/foot anchor; units are world units (6 px each on the interior canvas).
 */
const INK = "#4a3626";
const world = (id: string) => {
  const a = ANCHORS.find((x) => x.id === id);
  if (!a) return null;
  return { x: CANVAS.x + a.px[0] / CANVAS.px, y: CANVAS.y + a.px[1] / CANVAS.px };
};
const mid = (a: string, b: string) => {
  const p = world(a);
  const q = world(b);
  return p && q ? { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 } : null;
};

const stroke = { stroke: INK, strokeWidth: 0.35, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Steam({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g className="act-steam" style={{ animationDelay: `${delay}s` }}>
      <path d={`M${x} ${y} c-1.2 -1.6 1.2 -2.6 0 -4.4`} fill="none" stroke="#fffaf0" strokeWidth={0.7} strokeLinecap="round" opacity={0.85} />
    </g>
  );
}

function Shadow({ rx = 9 }: { rx?: number }) {
  return <ellipse cx={0} cy={1} rx={rx} ry={rx * 0.28} fill={INK} opacity={0.16} />;
}

/** seated, three-quarter back view, typing on a laptop at the window bar */
function LaptopWorker({ x, y, top = "#b9805a", hair = "#3b2a20" }: { x: number; y: number; top?: string; hair?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.3)`}>
      <Shadow />
      {/* laptop on the bar, lid toward us */}
      <path d="M5.5 -13.2 L15.5 -15.6 L15.5 -22 L5.5 -19.6 Z" fill="#cfc9bd" {...stroke} />
      <path d="M5.5 -13.2 L15.5 -15.6 L16.8 -14.8 L6.8 -12.4 Z" fill="#b3ab9c" {...stroke} />
      {/* torso */}
      <path d="M-6.4 0 C-7 -8 -5.6 -13.6 -2.8 -15.4 L2.8 -15.4 C5.6 -13.6 7 -8 6.4 0 Z" fill={top} {...stroke} />
      {/* near arm reaching to the keys */}
      <path className="act-type" d="M3.6 -12.6 C6 -11.6 7.6 -11.6 9.6 -12.4" fill="none" stroke={top} strokeWidth={2.2} strokeLinecap="round" />
      <circle className="act-type" cx={9.9} cy={-12.5} r={1} fill="#e2b79b" />
      {/* head, mostly hair from behind */}
      <rect x={-1.1} y={-17.6} width={2.2} height={2.4} rx={1} fill="#e2b79b" />
      <circle cx={0} cy={-20.2} r={4} fill={hair} {...stroke} />
      <path d="M-3.4 -19.4 C-1.4 -17.4 1.8 -17.4 3.6 -19.4" fill="none" stroke="#e2b79b" strokeWidth={0.9} opacity={0.0} />
      {/* mug */}
      <rect x={-9.8} y={-12.4} width={2.6} height={2.6} rx={0.6} fill="#f2ead8" {...stroke} />
      <Steam x={-8.5} y={-12.8} />
      <Steam x={-8} y={-12.8} delay={1.1} />
    </g>
  );
}

/** two small upper bodies facing each other over a table (the table in the illustration hides their laps) */
function ChatPair({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.25)`}>
      <Shadow rx={13} />
      {/* left person, faces right */}
      <g transform="translate(-8 0)">
        <path d="M-5.2 0 C-5.8 -6 -4.8 -10.6 -2.4 -12.2 L2.4 -12.2 C4.6 -10.6 5.6 -6 5.2 0 Z" fill="#6f8a6e" {...stroke} />
        <circle cx={0.8} cy={-16} r={3.5} fill="#e7bf9f" {...stroke} />
        <path d="M-2.8 -16.6 C-2.8 -20.4 3 -20.8 4.2 -16.8 C2.8 -18.4 0 -18 -2.8 -16.6 Z" fill="#6a4a34" {...stroke} />
        <circle cx={3.2} cy={-15.8} r={0.28} fill={INK} />
        <path className="act-gesture" d="M3.2 -9.8 C6 -9 7.6 -8 9 -9.6" fill="none" stroke="#6f8a6e" strokeWidth={2} strokeLinecap="round" />
      </g>
      {/* right person, faces left */}
      <g transform="translate(9 0)">
        <path d="M-5.2 0 C-5.8 -6 -4.8 -10.6 -2.4 -12.2 L2.4 -12.2 C4.6 -10.6 5.6 -6 5.2 0 Z" fill="#7f93ad" {...stroke} />
        <circle cx={-0.8} cy={-16} r={3.5} fill="#cf9d7c" {...stroke} />
        <path d="M-4.2 -16.4 C-4.6 -21 3 -21.4 3.6 -16.4 C2.4 -18.6 -1.4 -18.8 -4.2 -16.4 Z" fill="#2f2420" {...stroke} />
        <circle cx={-3.2} cy={-15.8} r={0.28} fill={INK} />
        <rect className="act-sip" x={-6.8} y={-10.6} width={2.4} height={2.6} rx={0.6} fill="#f2ead8" {...stroke} />
      </g>
      <Steam x={-1} y={-9.6} />
      <Steam x={0.6} y={-9.6} delay={0.9} />
    </g>
  );
}

/** staff behind the counter — waist up, working at the machine */
function Barista({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.3)`}>
      <path d="M-5.6 0 C-6 -7 -5 -12 -2.6 -13.6 L2.6 -13.6 C5 -12 6 -7 5.6 0 Z" fill="#8a5d44" {...stroke} />
      <path d="M-3.2 -13 L3.2 -13 L2.8 -4 L-2.8 -4 Z" fill="#efe6d2" opacity={0.95} {...stroke} />
      <circle cx={0} cy={-17.4} r={3.6} fill="#e2b79b" {...stroke} />
      <path d="M-3.8 -17.8 C-4.2 -22 3.8 -22.4 3.9 -17.6 C2 -19.6 -2 -19.6 -3.8 -17.8 Z" fill="#3b2a20" {...stroke} />
      <circle cx={-3.3} cy={-15} r={1.6} fill="#3b2a20" />
      <circle cx={1.2} cy={-17.2} r={0.28} fill={INK} />
      <path className="act-barista-arm" d="M3.6 -11.4 C6.4 -9.4 8 -8.6 9.6 -9.6" fill="none" stroke="#8a5d44" strokeWidth={2.1} strokeLinecap="round" />
      <Steam x={11.5} y={-9.4} />
      <Steam x={12.4} y={-9.4} delay={1.2} />
    </g>
  );
}

/** closing time: someone sweeping the floor with a broom */
function Sweeper({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.3)`}>
      <Shadow rx={6} />
      <g className="act-sweep">
        <path d="M-2.2 -2 L-2.8 0 M2.2 -2 L2.8 0" stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
        <path d="M-4.6 -2 C-5 -9 -3.8 -14 -2 -15.2 L2 -15.2 C3.8 -14 5 -9 4.6 -2 Z" fill="#8a5d44" {...stroke} />
        <circle cx={0} cy={-19} r={3.4} fill="#e2b79b" {...stroke} />
        <path d="M-3.6 -19.6 C-4 -23.6 3.6 -24 3.6 -19.4 C2 -21.2 -1.8 -21.4 -3.6 -19.6 Z" fill="#3b2a20" {...stroke} />
        {/* broom */}
        <path d="M3.4 -12 L9.6 0.6" stroke="#9b7447" strokeWidth={0.8} strokeLinecap="round" />
        <path d="M8.2 -0.4 L12.4 -0.6 L11.4 1.8 L7.4 1.8 Z" fill="#c9a766" {...stroke} />
      </g>
    </g>
  );
}

export type ActorPlan = { laptop: number; chat: boolean; staff: boolean; sweeping: boolean };

export default function ActorsSvg({ plan }: { plan: ActorPlan }) {
  const w2 = world("window-seat-2");
  const w4 = world("window-seat-4");
  const t = mid("tableA-left", "tableA-right");
  const b = world("barista");
  const sw = world("counter-front");
  return (
    <g style={{ pointerEvents: "none" }}>
      {plan.staff && b && <Barista x={b.x} y={b.y} />}
      {plan.laptop >= 1 && w2 && <LaptopWorker x={w2.x} y={w2.y} />}
      {plan.laptop >= 2 && w4 && <LaptopWorker x={w4.x} y={w4.y} top="#7f93ad" hair="#6a4a34" />}
      {plan.chat && t && <ChatPair x={t.x} y={t.y + 4} />}
      {plan.sweeping && sw && <Sweeper x={sw.x - 40} y={sw.y + 6} />}
    </g>
  );
}

import { ANCHORS } from "./foster-anchors";

/**
 * Small human figures that sit ON TOP of interior-base.png. Gate 2 vocabulary only.
 * Each sprite is a transparent PNG; the file may be any resolution (2× recommended) as long as its aspect
 * ratio matches `w:h`. It is drawn `w × h` canvas-px large with the `pivot` (fraction of the sprite) on the anchor.
 */
export type ActorSpec = {
  id: string;
  file: string; // under /assets/foster/actors/
  label: string;
  /** which anchor(s) this sprite can occupy, in order of preference */
  anchors: string[];
  /** size on the 2040×1620 canvas, px */
  w: number;
  h: number;
  /** pivot as a fraction of the sprite (x, y) — hips for seated figures, waist for the barista, feet for standing */
  pivot: [number, number];
  pose: string;
  /** the structured signal that justifies showing this sprite */
  signal: string;
};

export const ACTORS: ActorSpec[] = [
  {
    id: "laptop-worker",
    file: "laptop-worker.png",
    label: "seated person typing on a laptop",
    anchors: ["window-seat-2", "window-seat-4", "window-seat-3"],
    w: 170,
    h: 215,
    pivot: [0.5, 0.6],
    pose: "Seated on a bar stool, seen from behind / three-quarter back, facing the street glass; laptop open on the bar.",
    signal: "study / work friendly (laptopWorkers > 0)",
  },
  {
    id: "chat-pair",
    file: "chat-pair.png",
    label: "two people chatting at a table",
    anchors: ["tableA-center", "tableB-center"],
    w: 340,
    h: 215,
    pivot: [0.5, 0.78],
    pose: "Two seated figures facing each other across a small table, drawn from the waist up (the table hides their laps); one gesturing, mugs in hand. No table in the sprite.",
    signal: "social friendly (chattingGroups > 0)",
  },
  {
    id: "barista",
    file: "barista.png",
    label: "barista behind the counter",
    anchors: ["barista"],
    w: 150,
    h: 190,
    pivot: [0.5, 1],
    pose: "Standing behind the counter, drawn from the waist up (the counter hides the rest), three-quarter view, working at the machines. Apron, cap or hair tied back.",
    signal: "open hours (guide figure; not a real employee)",
  },
  {
    id: "reader",
    file: "reader.png",
    label: "person reading on the sofa",
    anchors: ["lounge-sofa-2", "lounge-sofa-1"],
    w: 185,
    h: 200,
    pivot: [0.5, 0.62],
    pose: "Seated on the sofa, three-quarter view, holding a book, relaxed posture. Optional.",
    signal: "lounge / relax (optional)",
  },
  {
    id: "grab-and-go",
    file: "grab-and-go.png",
    label: "person leaving with a takeaway cup",
    anchors: ["door"],
    w: 130,
    h: 235,
    pivot: [0.5, 1],
    pose: "Walking toward the glass door, seen from the side/back, holding a takeaway cup. Optional.",
    signal: "takeout supported (optional)",
  },
  {
    id: "dog",
    file: "dog.png",
    label: "dog resting",
    anchors: ["dog-spot"],
    w: 175,
    h: 115,
    pivot: [0.5, 0.9],
    pose: "A normal-sized dog lying down, calm, no leash drama. Shown ONLY when dogs-allowed is verified. Optional.",
    signal: "pet policy verified (dogs allowed inside)",
  },
];

/** table centres + a floor spot for the dog: derived from the measured seat anchors */
const byId = (id: string) => ANCHORS.find((a) => a.id === id)!;
const mid = (a: string, b: string): [number, number] => [Math.round((byId(a).px[0] + byId(b).px[0]) / 2), Math.round((byId(a).px[1] + byId(b).px[1]) / 2)];
export const EXTRA_ANCHORS: Record<string, [number, number]> = {
  "tableA-center": mid("tableA-left", "tableA-right"),
  "tableB-center": mid("tableB-left", "tableB-back"),
  "dog-spot": [820, 905],
};
export const anchorPx = (id: string): [number, number] | null => EXTRA_ANCHORS[id] ?? ANCHORS.find((a) => a.id === id)?.px ?? null;

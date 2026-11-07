import { ANCHORS, BASE_IMAGE, CANVAS, anchorCanvas } from "@/data/foster-anchors";

/** The illustrated interior: ONE full-canvas image. `showAnchors` overlays the registration dots (for checking art). */
export default function LayeredInterior({ showAnchors = false }: { showAnchors?: boolean }) {
  const { x, y, w, h } = CANVAS;
  return (
    <g>
      <image href={BASE_IMAGE} x={x} y={y} width={w} height={h} preserveAspectRatio="none" />
      {showAnchors && <AnchorDots />}
    </g>
  );
}

export function AnchorDots() {
  return (
    <g>
      {ANCHORS.map((a) => {
        const c = anchorCanvas(a).world;
        return (
          <g key={a.id}>
            <circle cx={c.x} cy={c.y} r={2.4} fill="#c4566b" opacity={0.9} />
            <text x={c.x + 4} y={c.y + 1.4} fontSize={4.4} fill="#5b2230" stroke="#fff" strokeWidth={1.2} paintOrder="stroke">
              {a.id}
            </text>
          </g>
        );
      })}
    </g>
  );
}

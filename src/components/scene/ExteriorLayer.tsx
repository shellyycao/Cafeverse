import { CAFE_CUTOUT, EXT, EXT_IMAGE } from "@/data/foster-exterior";

/**
 * The authored neighbourhood illustration (one transparent image on a fixed canvas). When you zoom inside the
 * café, the café-building area is cut out (a mask whose hole fades in with zoom) so the interior shows through.
 */
export default function ExteriorLayer() {
  return (
    <g style={{ pointerEvents: "none" }}>
      <defs>
        <mask id="extMask" maskUnits="userSpaceOnUse" x={EXT.x} y={EXT.y} width={EXT.w} height={EXT.h}>
          <rect x={EXT.x} y={EXT.y} width={EXT.w} height={EXT.h} fill="#fff" />
          <polygon className="cafe-cutout" points={CAFE_CUTOUT} fill="#000" />
        </mask>
      </defs>
      <image href={EXT_IMAGE} x={EXT.x} y={EXT.y} width={EXT.w} height={EXT.h} preserveAspectRatio="none" mask="url(#extMask)" />
    </g>
  );
}

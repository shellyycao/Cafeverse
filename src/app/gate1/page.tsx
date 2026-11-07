import Defs from "@/components/scene/Defs";
import InteriorBase from "@/components/scene/InteriorBase";

export const metadata = { title: "Gate 1 — Foster Street Coffee interior (review)" };

/** Review page for Gate 1: the empty interior only, no UI, no people. */
export default function Gate1() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f2e8d3" }}>
      <svg viewBox="-200 -292 352 262" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Foster Street Coffee interior, conceptual reconstruction">
        <Defs />
        <g filter="url(#paint)">
          <InteriorBase />
        </g>
      </svg>
      <div className="paper" />
      <div style={{ position: "absolute", left: 14, bottom: 12, fontSize: 12, color: "#7a6048", background: "rgba(252,247,236,.88)", padding: "6px 10px", borderRadius: 999 }}>
        Conceptual reconstruction from photographs · positions approximate · no people · Gate 1 review
      </div>
    </main>
  );
}

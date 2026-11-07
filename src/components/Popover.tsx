"use client";

import { forwardRef, useEffect } from "react";
import { CAFE } from "@/data/cafe";
import type { HotspotId } from "./scene/Neighborhood";
import type { CafeAnalysis } from "@/lib/ai/schema";

const Popover = forwardRef<HTMLDivElement, { id: HotspotId; analysis?: CafeAnalysis; onClose: () => void }>(function Popover({ id, analysis, onClose }, ref) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const drinks = analysis?.specialtyProducts.filter((p) => p.kind === "drink") ?? [];
  const pastries = analysis?.specialtyProducts.filter((p) => p.kind === "pastry" || p.kind === "food") ?? [];
  const tag = analysis ? (analysis.atmosphere.summary.startsWith("Keyword") ? "Demo reading of reviews & listing" : "AI reading of reviews & listing") : "From café website";
  let body: React.ReactNode = null;
  if (id === "barista")
    body =
      drinks.length > 0 ? (
        <>
          <h4>Barista&apos;s pick</h4>
          <p>
            Try the <b>{drinks[0].name.toLowerCase()}</b>
            {drinks[1] ? <> or the {drinks[1].name.toLowerCase()}</> : null}.
          </p>
          <p style={{ fontSize: 11.5, color: "#8a7255" }}>Named most often in the sources. Open weekdays {CAFE.hours.weekdays}, weekends {CAFE.hours.weekends}.</p>
          <span className="tag">{tag}</span>
        </>
      ) : (
        <>
          <h4>Behind the counter</h4>
          <p>
            Open weekdays {CAFE.hours.weekdays}, weekends {CAFE.hours.weekends}. Order online or stop in.
          </p>
          <p style={{ fontSize: 11.5, color: "#8a7255" }}>Tap “Analyze café” to see drink picks from reviews — the café&apos;s site doesn&apos;t list a menu.</p>
          <span className="tag">From café website</span>
        </>
      );
  if (id === "pastry")
    body =
      pastries.length > 0 ? (
        <>
          <h4>In the case &amp; on the menu</h4>
          <ul>
            {pastries.slice(0, 4).map((p) => (
              <li key={p.name}>
                <i style={{ background: p.kind === "pastry" ? "#d99a5b" : "#c9a27a" }} />
                <span>
                  {p.name}
                  <small>{p.evidence}</small>
                </span>
              </li>
            ))}
          </ul>
          <span className="tag">{tag}</span>
        </>
      ) : (
        <>
          <h4>Pastry case</h4>
          <p>Catering offers boxed or individually bagged pastry selections.</p>
          <p style={{ fontSize: 11.5, color: "#8a7255" }}>Specific pastries aren&apos;t named on the café&apos;s website. Tap “Analyze café” to read what reviews mention.</p>
          <span className="tag">From café website</span>
        </>
      );
  if (id === "bar")
    body = (
      <>
        <h4>Work &amp; study</h4>
        <p>{analysis ? analysis.studySuitability.notes : `“${CAFE.tagline}”`}</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>{analysis?.amenities.wifi === "yes" ? "Free Wi-Fi is listed." : "Wi-Fi and outlets are not stated by the café."}</p>
        <span className="tag">{tag}</span>
      </>
    );
  if (id === "social")
    body = (
      <>
        <h4>Meet &amp; relax</h4>
        <p>{analysis ? analysis.socialSuitability.notes : "The café describes itself as a place to meet or relax."}</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>Seating layout here is illustrative.</p>
        <span className="tag">{analysis ? tag : "Illustrative layout"}</span>
      </>
    );
  if (id === "parking")
    body = (
      <>
        <h4>{CAFE.parking.title}</h4>
        {CAFE.parking.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        {analysis?.amenities.parking === "yes" && <p style={{ fontSize: 11.5, color: "#8a7255" }}>The listing mentions free and paid street parking; a reviewer mentions parking validation.</p>}
        <span className="tag">From café website</span>
      </>
    );

  return (
    <div className="popover" ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="card">
        <button className="x" aria-label="Close" onClick={onClose}>×</button>
        {body}
      </div>
    </div>
  );
});
export default Popover;

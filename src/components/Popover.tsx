"use client";

import { forwardRef, useEffect } from "react";
import { CAFE } from "@/data/cafe";
import type { HotspotId } from "./scene/Neighborhood";

const Popover = forwardRef<HTMLDivElement, { id: HotspotId; onClose: () => void }>(function Popover({ id, onClose }, ref) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  let body: React.ReactNode = null;
  if (id === "barista")
    body = (
      <>
        <h4>Behind the counter</h4>
        <p>
          Open weekdays {CAFE.hours.weekdays}, weekends {CAFE.hours.weekends}. You can order online or stop in.
        </p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>Drink and pastry picks will come from review analysis — the café's site doesn&apos;t list a menu.</p>
        <span className="tag">From café website</span>
      </>
    );
  if (id === "pastry")
    body = (
      <>
        <h4>Pastry case</h4>
        <p>Catering offers boxed or individually bagged pastry selections.</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>Specific pastries aren&apos;t named on the café&apos;s website — not shown here to avoid guessing.</p>
        <span className="tag">From café website</span>
      </>
    );
  if (id === "bar")
    body = (
      <>
        <h4>Work &amp; study</h4>
        <p>&ldquo;{CAFE.tagline}&rdquo;</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>Wi-Fi and outlets are not stated by the café.</p>
        <span className="tag">From café website</span>
      </>
    );
  if (id === "social")
    body = (
      <>
        <h4>Meet &amp; relax</h4>
        <p>The café describes itself as a place to meet or relax.</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>Seating layout here is illustrative.</p>
        <span className="tag">Illustrative layout</span>
      </>
    );
  if (id === "parking")
    body = (
      <>
        <h4>{CAFE.parking.title}</h4>
        {CAFE.parking.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <span className="tag">From café website</span>
      </>
    );
  if (id === "bus")
    body = (
      <>
        <h4>{CAFE.transit.title}</h4>
        {CAFE.transit.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <span className="tag">Illustrative</span>
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

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
        <h4>{CAFE.baristaName} suggests</h4>
        <p>{CAFE.recommendation.headline}</p>
        <p style={{ fontSize: 11.5, color: "#8a7255" }}>{CAFE.recommendation.why}</p>
        <span className="tag">Demo data</span>
      </>
    );
  if (id === "pastry")
    body = (
      <>
        <h4>Pastry case — specialties</h4>
        <ul>
          {CAFE.specialties.map((s) => (
            <li key={s.id}>
              <i style={{ background: s.color }} />
              <span>
                {s.name}
                <small>{s.note}</small>
              </span>
            </li>
          ))}
        </ul>
        <span className="tag">Demo data</span>
      </>
    );
  if (id === "bar")
    body = (
      <>
        <h4>Window bar</h4>
        <p>{CAFE.hotspots.study}</p>
        <span className="tag">Illustrative</span>
      </>
    );
  if (id === "social")
    body = (
      <>
        <h4>Round tables</h4>
        <p>{CAFE.hotspots.social}</p>
        <span className="tag">Illustrative</span>
      </>
    );
  if (id === "parking")
    body = (
      <>
        <h4>{CAFE.parking.title}</h4>
        {CAFE.parking.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        <span className="tag">Illustrative</span>
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

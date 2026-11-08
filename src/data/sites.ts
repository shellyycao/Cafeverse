/**
 * The cafés in the demo. Foster Street Coffee is REAL (facts only from its website, its public listing as seen by the
 * owner, and the owner's own review screenshots). The other two are FICTIONAL demo cafés invented to show the idea.
 */
export type Pets = "inside" | "patio" | "none" | "unknown";
export type Attrs = {
  study: number; // 0..1
  social: number;
  quiet: number;
  lively: number;
  pastry: number;
  coffee: number;
  pets: Pets;
  patio: boolean | null;
  wifi: boolean | null;
  outlets: boolean | null;
  takeout: boolean | null;
  breakfast: boolean | null;
};
export type Theme = {
  title: string; // sign text
  subtitle: string;
  brick: string;
  awningA: string;
  awningB: string;
  trim: string;
  wall: string; // interior accent wall
  /** painted-mural corner building with a string-light canopy (Cocoa-style) */
  mural?: boolean;
};

export type Site = {
  id: string;
  name: string;
  real: boolean;
  tagline: string;
  /** translation of the Foster block in ground coordinates (the miniature is drawn once and moved) */
  offset: [number, number];
  /** absolute ground rectangle of the block that carries the miniature [x0, y0, x1, y1] */
  paving: [number, number, number, number];
  /** zone centre (absolute ground coords) for the zoom ceiling / halo */
  zone: [number, number];
  theme: Theme;
  attrs: Attrs;
  /** one short sourced line per attribute, shown as the "why" */
  evidence: Partial<Record<keyof Attrs, string>>;
};

const DEMO = "Fictional demo café — invented data";

export const SITES: Site[] = [
  {
    id: "foster-street-coffee",
    name: "Foster Street Coffee",
    real: true,
    tagline: "Study, work, meet or relax in Durham's Central Park District",
    offset: [0, 0],
    paving: [28, 28, 372, 272],
    zone: [200, 150],
    theme: { title: "FOSTER STREET COFFEE", subtitle: "COFFEE · TEA", brick: "#b05a45", awningA: "#2d2d30", awningB: "#55555b", trim: "#2f2f33", wall: "#3d5470" },
    attrs: { study: 0.9, social: 0.6, quiet: 0.45, lively: 0.5, pastry: 0.55, coffee: 0.85, pets: "inside", patio: true, wifi: true, outlets: true, takeout: true, breakfast: true },
    evidence: {
      study: "Listing: good for working on a laptop; reviews say people work here (it can fill with laptop users).",
      social: "Listing crowd: groups & students; the café calls itself a place to meet or relax.",
      quiet: "Reviews differ: busy weekends can be loud, others found it quiet and easy to talk; a quiet working area is mentioned.",
      lively: "Busy at weekends and around students, per reviews.",
      pastry: "Reviews mention waffles, croissants and lemon-loaf samples; a glass case of baked goods.",
      coffee: "Listing highlights great coffee and tea; seasonal specials on the online menu.",
      pets: "Listing: dogs allowed inside and outside; a reviewer calls it very dog friendly.",
      patio: "Listing: outdoor seating.",
      wifi: "Listing: free Wi-Fi.",
      outlets: "An outlet is visible on the window bar in a photo (not a stated policy).",
      takeout: "Listing: takeout.",
      breakfast: "Listing: popular for breakfast.",
    },
  },
  {
    id: "lantern-and-loaf",
    name: "Lantern & Loaf",
    real: false,
    tagline: "A bakery café that is never quiet — fictional",
    offset: [-420, 0],
    paving: [-490, 28, -28, 272],
    zone: [-259, 150],
    theme: { title: "LANTERN & LOAF", subtitle: "BAKERY · CAFÉ", brick: "#c4775a", awningA: "#d98a8a", awningB: "#f4e6d0", trim: "#6b3f34", wall: "#7a8f72" , mural: true },
    attrs: { study: 0.3, social: 0.92, quiet: 0.15, lively: 0.9, pastry: 0.97, coffee: 0.6, pets: "patio", patio: true, wifi: true, outlets: false, takeout: true, breakfast: true },
    evidence: Object.fromEntries(["study", "social", "quiet", "lively", "pastry", "coffee", "pets", "patio", "wifi", "outlets", "takeout", "breakfast"].map((k) => [k, DEMO])),
  },
  {
    id: "quiet-hour-coffee",
    name: "Quiet Hour Coffee",
    real: false,
    tagline: "Silent-ish study café with outlets at every seat — fictional",
    offset: [-30, 465],
    paving: [50, 318, 323, 737],
    zone: [186, 527],
    theme: { title: "QUIET HOUR COFFEE", subtitle: "STUDY · BREW", brick: "#8f9b8c", awningA: "#3a4a63", awningB: "#efe6d4", trim: "#2c3646", wall: "#46606a" },
    attrs: { study: 0.97, social: 0.18, quiet: 0.96, lively: 0.1, pastry: 0.35, coffee: 0.9, pets: "none", patio: false, wifi: true, outlets: true, takeout: true, breakfast: false },
    evidence: Object.fromEntries(["study", "social", "quiet", "lively", "pastry", "coffee", "pets", "patio", "wifi", "outlets", "takeout", "breakfast"].map((k) => [k, DEMO])),
  },
];

export const siteById = (id: string) => SITES.find((s) => s.id === id) ?? SITES[0];

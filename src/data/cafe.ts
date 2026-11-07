/**
 * Local fixture for the demo café. Everything here is ILLUSTRATIVE demo data —
 * not verified, not live. Real data sources replace this later.
 */
export const CAFE = {
  id: "cafeverse-demo",
  name: "Cafeverse",
  area: "Maple Ave · fictional neighborhood",
  baristaName: "Mina",
  tags: ["bakery-forward", "window bar", "round tables", "patio"],
  description:
    "A corner café with a long window bar, a handful of round tables and a pastry case that does most of the talking. Small patio out front.",
  specialties: [
    { id: "bun", name: "Brown-butter cardamom bun", note: "Baked in the morning; sells out early.", color: "#d99a5b" },
    { id: "tart", name: "Strawberry cream tart", note: "Seasonal fruit, vanilla custard.", color: "#e58b8b" },
    { id: "loaf", name: "Sourdough miche", note: "Slow-fermented, sliced to order.", color: "#c98f55" },
    { id: "latte", name: "Oat-milk honey latte", note: "House drink, pairs with the bun.", color: "#c9a27a" },
  ],
  recommendation: {
    headline: "Try the cardamom bun with an oat honey latte.",
    why: "It's the first thing in the pastry case and the house drink listed with it.",
  },
  parking: {
    title: "Street parking",
    lines: ["Metered spaces along the front, a small lot beside the café.", "Rules and rates are placeholders in this demo."],
  },
  transit: {
    title: "Bus stop",
    lines: ["A shelter sits just past the café on the corner.", "Routes and times are placeholders in this demo."],
  },
  hotspots: {
    study: "Window bar with outlets near the seats. Quiet before noon (illustrative).",
    social: "Round tables for 2–4; the middle table is the chatty one (illustrative).",
  },
};
export type CafeData = typeof CAFE;

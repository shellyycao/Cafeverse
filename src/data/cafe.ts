/**
 * Foster Street Coffee — facts come ONLY from the café's own website (fosterstreetcoffee.com).
 * Anything the site does not state is `null` and is shown as "not stated", never invented.
 * AI-derived attributes (from permitted reviews/descriptions) are layered on top in Milestone D.
 */
export const CAFE = {
  id: "foster-street-coffee",
  name: "Foster Street Coffee",
  address: "530 Foster Street, Durham, NC 27701",
  area: "Central Park District · Downtown Durham",
  website: "https://www.fosterstreetcoffee.com/",
  tagline: "Study, Work, Meet, or Relax in Durham's Central Park District",
  hours: { weekdays: "7a–6p", weekends: "8a–6p" },
  location: "Just north of Durham Central Park, next to the Durham Food Hall in the Liberty Warehouse Apartment Building.",
  parking: {
    title: "Parking",
    lines: [
      "Street parking on Foster and surrounding streets.",
      "Also the Liberty Warehouse Garage — enter on Corporation Street.",
    ],
    source: "café website",
  },
  services: ["Online ordering", "Catering: boxed or bagged pastry selections, coffee/tea carafes, boxed breakfasts and lunches"],
  // Not stated on the café's site — kept null until reviews/other permitted sources provide evidence.
  menu: null as null | string[],
  petPolicy: null as null | string,
  wifi: null as null | string,
  restrooms: null as null | string,
  patio: null as null | string,
};
export type CafeData = typeof CAFE;

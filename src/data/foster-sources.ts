/**
 * Permitted inputs for the Foster Street Coffee analysis. Three kinds of material:
 *  - the café's own website text,
 *  - listing attributes + online-ordering specials (facts as seen by the project owner on 2026-11-07),
 *  - PARAPHRASED digests of public reviews (no names, no verbatim quotes) so raw review text is never
 *    redistributed. Replace/extend these digests as more reviews are collected.
 */
import { CAFE } from "./cafe";

export type Source = { kind: "website" | "review" | "description" | "metadata"; text: string };

export const FOSTER_LISTING = {
  accessibility: ["wheelchair accessible entrance", "wheelchair accessible parking lot", "wheelchair accessible restroom", "wheelchair accessible seating"],
  serviceOptions: ["outdoor seating", "takeout", "dine-in"],
  highlights: ["great coffee", "great tea selection"],
  popularFor: ["breakfast", "solo dining", "good for working on laptop"],
  offerings: ["coffee", "prepared foods", "quick bite", "vegetarian options"],
  dining: ["breakfast", "lunch", "catering", "dessert"],
  amenities: ["restroom", "free Wi-Fi"],
  atmosphere: ["casual", "cozy", "trendy"],
  crowd: ["college students", "groups", "family-friendly", "tourists"],
  planning: "does not accept reservations",
  parking: ["free street parking", "paid street parking"],
  pets: ["dogs allowed inside", "dogs allowed outside"],
};

export const FOSTER_SPECIALS = [
  "Butter Pecan Latte (butter pecan syrup, cinnamon, espresso, milk)",
  "Sweet Potato Chai Latte (house-made sweet potato pie syrup, spicy chai, milk)",
  "Pear & Cardamom Tea Latte (pear and cardamom syrups, jasmine green tea, milk)",
];

export const REVIEW_DIGESTS = [
  "A weekend visitor found the café busy and loud but still easy to talk in; staff were friendly, lemon loaf samples were handed out, and the chai was praised.",
  "A dine-in breakfast guest enjoyed a Mexican mocha and a waffle, found it quiet and easy to talk, and mentioned paid street parking and parking validation.",
  "A regular loves the strawberry latte, lavender cold brew, chai and mocha with extra espresso, and likes the coffee-themed decor and the coffee-house feel for friends or relaxing; they wish fewer people used the space as a home office.",
  "A reviewer calls the café very dog friendly: dogs are welcome, there is inside and outside seating, the croissant and coffee were good, the bathrooms are good, and the neighborhood is easy and safe to walk.",
  "A first-time visitor found the shop welcoming, quaint and cozy, with a cheerful barista.",
  "A visitor from out of town came with local friends and took lattes to the nearby park; a seasonal cinnamon oat latte was good, the line moved quickly, the café is big with lots of seating, and on a Sunday around 5 PM it was packed with people quietly working on laptops.",
  "A reviewer says the coffee is consistently good, the staff is very friendly, and there is a quiet room for working remotely.",
  "A reviewer loves the iced oat-milk vanilla lattes and the bacon and egg sandwich, and says the service is excellent.",
  "A mixed review: the espresso is fine but tastes closer to a national chain than a micro-roaster.",
  "A reviewer finds the space bright and airy with lots of seating options, great for work, study or hanging out, and it was packed with Duke students on their visit; the vanilla latte was smooth.",
  "A reviewer shared a photo of a dog lying on the café floor inside and calls it the best coffee shop.",
  "A reviewer calls it a perfect spot for work and coffee; a seasonal garden collection included a rosemary and lavender latte; staff are very friendly.",
];

export const MENU_BOARD_OBSERVED = "Menu board photographed in the café lists sandwiches such as Caprese, Ham & Cheese, Southwest Turkey and Grilled Cheese, plus a glass case of pastries, waffles and cold drinks.";

export function fosterSources(): Source[] {
  const L = FOSTER_LISTING;
  return [
    { kind: "website", text: CAFE.tagline },
    { kind: "website", text: CAFE.location },
    { kind: "website", text: CAFE.parking.lines.join(" ") },
    { kind: "website", text: `Services: ${CAFE.services.join("; ")}. Hours: weekdays ${CAFE.hours.weekdays}, weekends ${CAFE.hours.weekends}.` },
    {
      kind: "metadata",
      text: `Listing attributes — pets: ${L.pets.join(", ")}. Amenities: ${L.amenities.join(", ")}. Service: ${L.serviceOptions.join(", ")}. Popular for: ${L.popularFor.join(", ")}. Atmosphere: ${L.atmosphere.join(", ")}. Crowd: ${L.crowd.join(", ")}. Parking: ${L.parking.join(", ")}. Offerings: ${L.offerings.join(", ")}. Dining: ${L.dining.join(", ")}. Accessibility: ${L.accessibility.join(", ")}. ${L.planning}.`,
    },
    { kind: "description", text: `Online ordering specials: ${FOSTER_SPECIALS.join("; ")}.` },
    { kind: "description", text: MENU_BOARD_OBSERVED },
    ...REVIEW_DIGESTS.map((text) => ({ kind: "review" as const, text })),
  ];
}

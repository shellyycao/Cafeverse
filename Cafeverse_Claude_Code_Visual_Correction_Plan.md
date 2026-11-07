# Cafeverse — Visual Correction & Implementation Plan (Claude Code)

**Priority: STOP feature expansion. Correct the current café scene first.**

## 0. What is wrong with the current prototype

The current image is rejected. It looks like a flat, geometric isometric game populated by stiff, front-facing, nearly identical oversized doll characters. Objects are floating or placed without a coherent spatial purpose. It does not match the approved warm watercolor/colored-pencil reference art or the real Foster Street Coffee photographs. **Do not refine this image by adjusting colors or adding decorative items; reconstruct the scene design.**

**Product principle:** The place itself is the interface. This is a visual-first **real-place decision tool**, not a café-management game or a cartoon avatar simulator.

## 1. Approved art direction (non-negotiable)

- Hand-drawn, storybook **watercolor + colored pencil**, lightly irregular outlines, subtle paper grain, soft shadows, restrained cream/wood/terracotta/sage palette.
- **Miniature 2.5D cutaway** with believable spatial depth and room proportions. No glossy 3D, heavy vector fills, low-poly polygons, huge fake facial expressions, chibi humans, random oversized icons, neon/purple UI.
- Café architecture, furniture, windows and material details must dominate the frame; human figures must be **small, natural and secondary**. Avoid front-facing static portrait poses. A 3/4 or rear view doing an activity is better.
- **Use human characters, not anthropomorphic animal avatars**. An actual dog appears only where verified policy permits; unknown policy = do not infer pet friendliness.
- Interior background must remain legible **with zero characters**. The scene should already convey spatial layout without people.
- Do not overlay a giant text/AI-summary dashboard. Use small contextual popovers after clicks.

## 2. What the real Foster Street Coffee photos actually support

Treat user-supplied photographs as the source of truth. Visible features include:

- Storefront on the ground floor of a **multi-story red-brick building**, with tall dark-framed glass glazing, an oval Foster Street Coffee hanging sign, and a metal overhead canopy.
- Outdoor sidewalk with railings and a parking sign visible near the frontage (do not claim live spaces; don't invent a bus stop directly outside without location verification).
- A fairly modern interior, not a cottage bakery: **deep blue/charcoal accent walls**, white/cream service wall, exposed concrete columns, black track lighting, round white paper lanterns, pale curved ceiling elements.
- Wood-topped **square/rectangular tables** and mixed black/white chairs, a long **window bar** with stools and plants, a smaller lounge/sofa area, and large storefront windows.
- Wood-front service counter, glass chilled pastry display, pastries/drinks, shelving, menu boards, plants, and wall artwork.
- The photographs are from different viewpoints; they **do not establish a complete floor plan**. Do not pretend to know dimensions, hidden rooms, exact chair counts or hidden restroom position. Use plausible composition only as a *conceptual reconstruction* with uncertain areas omitted, and mark it as such in the demo.

**Important:** Earlier generated café images contained invented architecture, people, daylight and decorative details; use them for **art style only**, never as ground-truth layout.

## 3. The actual information hierarchy

### Level A — Building / real environment (always visible)

Render only grounded physical features: storefront, glazing, frame/canopy, counter, pastry case, tables, window stools, lamps, plants, concrete columns, adjacent sidewalk and street context. Preserve their relative relationships to the extent photos support them. The space must be recognizable **without any data badges or characters**.

### Level B — Visual vocabulary (subtle and data-driven)

The scene may add small props or characters **only when a structured attribute warrants it**. People are **representational activity cues**, not claimed live customers.

| Signal | Visual behavior | Hard rule |
|---|---|---|
| Work/study friendly | ONE seated small figure actively typing on a laptop, at an existing table/window bar | Only if evidence supports use for work; don't imply a verified laptop policy or socket location |
| Reading | ONE seated figure holding a book in an actual lounge or chair | Only if supported as a plausible activity; illustrative, not live |
| Social friendly | TWO small figures facing each other at an existing table, mid-conversation | Not proof of current people/noise level |
| Grab & go | ONE tiny figure exiting with a takeaway cup | Only where takeout service is supported |
| Pastries | Existing glass pastry case displays a few supported products | Do not invent exact menu items; user can click for source-backed details |
| Pet friendly | One normal-sized **dog**, near an allowed patio/area | Only on verified indoor/outdoor policy; unknown = omit dog, not ban |
| Restroom | Tiny restroom sign near verified restroom location | Unknown location = show information in tap bubble instead of fabricating a door |
| Power outlets | Small socket placed only where photo/merchant data establishes it | General 'outlets available' does not reveal exact socket locations |
| Wi-Fi | A minimal icon in a contextual information bubble | Do not draw invisible Wi-Fi as huge beams in the café |
| Crowdedness | Different density of *small generic silhouettes* (low/medium/high) without altering fixed furniture | Default is clearly labeled **Demo simulation**; do not imply exact live occupancy |
| Parking | Real street/parking geometry at neighborhood level, optionally small P marker | Price/availability only after verified source or clearly labeled demo |
| Transit | Actual stop at verified geolocation at neighborhood level | No fictional transit stops |
| Type of café | Show its physical relationship to the multistory building | Independent/chain status must come from business data, not guessed from architecture |
| Specialty rec | Tap the barista/pastry case to see source-backed recommendations | Virtual guide must not pretend to be a real employee or know someone's favorite |
| Saved / visited | Small external pin/bookmark state at map level | Never pollute the interior with achievement icons |

**Behavioral roles versus occupancy:** The work/chat/reading figures represent suitability or typical use. Crowd density is a separate simulated or evidence-backed state. Do not mix them as though all figures are real-time observations.

### Level C — On-demand details

Tiny clickable areas on barista, pastry case, window stools, table, parking sign. Tap opens a compact popover with 1-2 short sentences and **source / inferred / simulated status** when needed. No floating icon forest; hotspots should be discoverable on hover/focus or subtle interactive affordances.

## 4. Scene architecture: don't hard-code an AI-generated collage

For the next iteration, use **two or three separately authored/exported transparent assets** with consistent style, rather than one image containing all people and annotations:

1. `cafe-interior-base.png` — empty café: accurate visible material/architecture/furniture; no characters, pets, badges, text labels or UI. This is the immutable base art.
2. `scene-actors/` — small transparent individual human characters / pets / props that can be placed on top, shown/hidden by data; place at furniture-anchored normalized coordinates. **No character should appear without a related data reason.**
3. `neighborhood-base.png` / layered SVG — facade and sidewalk/road context with the same art direction, aligned into the simulated (not live-API) map.

Do **not** simply paste a rectangular image card over a map. The local illustrated district should seamlessly blend into the base-map paths. If smooth continuous blending is not ready, show an obvious **prototype limitation** rather than claim geospatial fidelity.

Use a scene data file so components are driven by attributes, not by ad-hoc conditional CSS. Example:

```ts
type Confidence = 'verified' | 'reported' | 'inferred' | 'unknown' | 'demo';
type Signal<T> = { value: T | null; confidence: Confidence; evidence?: string; updatedAt?: string };
type CafeVisualData = {
  cafeId: string;
  studyFriendly: Signal<boolean>;
  socialFriendly: Signal<boolean>;
  petPolicy: Signal<'indoor' | 'patio_only' | 'not_allowed'>;
  pastries: Signal<string[]>;
  restroom: Signal<boolean>;
  wifi: Signal<boolean>;
  outlets: Signal<boolean>;
  crowd: Signal<'low' | 'medium' | 'high'>;
};
```

**AI responsibilities:** The model interprets text/photos into this structured contract with evidence. It does **not** decide to randomly add furniture, move walls, create fake bus stops or invent people count. Renderer maps supported attributes to a fixed, curated visual grammar.

## 5. Work plan / gates (one-day hackathon reality)

### Gate 1 — Clean, accurate-enough empty interior (highest priority)

- Replace current characters-and-icons collage with a single carefully composed hand-drawn interior base.
- Ensure photos inform palette/materials/furniture/columns/window bar/counter/pastry display.
- Render **no people initially**.
- **Acceptance:** A person who has seen the source photos can identify at least 5 major architectural/furniture features; no invented public restroom or absurd furniture positions; visually warm, restrained, handcrafted.
- **STOP and request user visual approval before adding actors.**

### Gate 2 — Visual vocabulary in one scene

- Add at most **3–4 tiny people**: one laptop user, a pair chatting, optionally one barista behind the actual counter; place all at physical furniture anchors, scale consistently.
- Add an optional demo crowd density control only after base scene is approved; avoid changing positions of furniture.
- Add 3 click targets: barista, pastry case, window bar, each opening a compact source-aware bubble.
- **Acceptance:** Toggle study/social signals and actors appear/disappear; the café remains the main visual; no uncanny identical faces.

### Gate 3 — Neighborhood integration

- Preserve conventional simulated map at low zoom; gradually reveal neighborhood model at close zoom; click café to focus exterior, then move to interior.
- Ground storefront appearance from exterior photo: brick multistory building, dark-framed glazing and metal canopy. Keep road/sidewalk visually continuous.
- **Acceptance:** No bounding white card/border around café; building sits on real-looking road context and at consistent map location. The café does not become a standalone cartoon cottage.

### Gate 4 — AI connection / end-to-end demo

- Call Thinking Machines server-side if configured; otherwise explicitly labeled fixture mode.
- Send sample café descriptions/reviews **the user is authorized to use**; return typed attributes with evidence and unknown state.
- Renderer updates at least two signals (e.g., study actor and pastry/highlight), **not** the physical layout.
- **Acceptance:** Inputs change output, output changes supported visual cues; uncertainty handled; no claim of live data.

### Gate 5 — Polish and ship

- Mobile-friendly stage, zoom/pan, accessible hotspot buttons, stable loading/failure states, Vercel deployment, then screenshot/record demo.
- Saved/Visited localStorage only if time remains; do not jeopardize Gate 1–4.

## 6. Strict design QA checklist

- [ ] Do I recognize Foster Street Coffee from its actual photos, not an invented idealized café?
- [ ] Does the base environment look good **before any characters** are rendered?
- [ ] Are people small enough to feel like part of the place, not the subject of the picture?
- [ ] Are people doing legible actions with correct chair/table/bar positions?
- [ ] No stiff front-facing mannequin poses, repeated identical faces or giant heads?
- [ ] No bright flat-vector look, arbitrary emoji stickers or pop-up dashboard?
- [ ] Are wall/column/door/window positions based on visible evidence or clearly indicated as approximations?
- [ ] Does every icon/prop/actor represent one explicit attribute and confidence level?
- [ ] Are estimated/demonstration crowd states clearly labeled?
- [ ] Are external parking/transit cues located outside the café at the neighborhood layer?
- [ ] Can the user click 3 meaningful hotspots with small popovers?
- [ ] Does the world read as a *practical map* first, illustrated neighborhood second?

## 7. Immediate instruction to execute

**Do Gate 1 only.** Inspect the actual user photos and approved illustration references. Provide a new Foster Street Coffee interior concept that preserves real materials and major spatial features with **zero people**. Show a screenshot for review. **Do not implement other features or change the entire app until Gate 1 is visually approved.**

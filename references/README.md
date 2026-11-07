# Cafeverse — Design Reference Pack

This pack is for Claude Code to **understand the approved art direction and interaction concept**, not for indiscriminately displaying the reference images in the app.

## Priority 1: User-provided visual style references

`01_user_art_references/` contains four user-provided inspiration images:

1. Warm watercolor café interior: pastry display, wood, light and hand-drawn linework.
2. Cute café exterior: cozy, soft rounded shapes and delicate decorative details.
3. Small characters and objects: coffee, pastries, subtle whimsical illustrative language.
4. Hand-drawn bakery interior: detailed, relaxed, low-saturation textures.

Treat these as **style references only**, not licensed production assets. Do not directly reproduce the artwork, specific characters, watermarks, or branding; create original art based on generalized style features.

## Priority 2: Approved direction from the discussion

`02_approved_direction/` contains AI-generated illustrative concepts:

- `01_cafe_street_exterior_cutaway_concept.png` — approved warm watercolor mood and neighborhood café details: glass windows, pastries, round tables, bar seating, street parking, bus stop. **This is not intended to be pasted as a giant rectangular image over the map.**
- `02_map_neighborhood_blending_concept.png` — direction the user liked significantly more: conventional map geography and selectively rendered miniature café/neighborhood should feel like one uninterrupted world. **This is a concept image, not an accurate real Durham map.** The depicted named roads and businesses are not verified as geographically correct.

## Character decision

Use **small human characters** in v1. Do not switch all patrons to anthropomorphic animals. Normal pets may appear when pet policy supports them.

## Must-have interaction sequence

1. Open with a conventional-looking map (a self-contained simulated map is fine for the one-day demo; no external tiles or map APIs required).
2. Zoom to building-scale geography; the supported café block gradually reveals a hand-drawn miniature café exterior, surrounding sidewalk, roads, parking and bus stop **within the map**, not in a floating card.
3. Click the café to move closer to its exterior/interior scene.
4. Zoom into the interior to inspect pastry counter, bar stools, round tables and virtual barista.
5. Use small contextual tooltips for hotspots, no giant right sidebar or busyness bar.

## Prohibited style/features

- No purple dashboard, glowing building outlines, glossy 3D game assets, oversized pin labels or giant information panels.
- No full rectangular image pasted over a map.
- No pretending that example café reviews, current crowd, parking rules, or geography are verified facts.
- Do not use prior rejected prototype images unless explicitly requested.

## Optional comparison

`03_optional_comparison/human_vs_animal_comparison.png` is **not** a final design instruction. The user selected humans for v1. Included only as a record of the rejected/paused animal-character alternative.

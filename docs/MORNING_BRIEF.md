# Morning brief — Cafeverse demo direction

> Status file. Updated after every milestone so work can resume if interrupted.
> Authorization from the owner: commit / push / deploy without asking. Deliver: a demo + this document.

## Goal of the demo
Boot screen → type what you want to do at a café (free text, EN/中文) → the map lights up the cafés that fit
(ranked, with reasons) → click one to explore its miniature exterior and interior.
Foster Street Coffee is real (facts only from its website / listing / the owner's review screenshots).
The other two cafés are **fictional demo cafés** (clearly labelled), drawn with the original SVG method.

## Checklist
- [ ] 1. Sites data: 3 cafés (1 real, 2 fictional) + attributes + evidence
- [ ] 2. Match engine (intent → score → reasons) + `/api/match` (Tinker intent extraction with keyword fallback)
- [ ] 3. Map: 3 café pins/zones, lit by match score, ranked results bar
- [ ] 4. Fictional café miniatures (themed exterior + interior via translated SVG)
- [ ] 5. Boot / splash screen with the prompt box, example chips, skip link
- [ ] 6. Hook the top search bar to the same flow; fly-to per café; per-café save/visited
- [ ] 7. Mobile pass, build, commit, push (Vercel auto-deploys)
- [ ] 8. Final notes below (how to run, what is real vs demo, known issues, next steps)

## Known external items (need the owner)
- The mid-zoom illustration the owner sent in chat was **not saved to disk**, so it could not be used.
  Save it as `public/assets/foster/exterior-base.png` (2400×1425 transparent PNG) — it auto-replaces the SVG block.
- Tinker env on Vercel: `TINKER_API_KEY`, `TINKER_MODEL`, `TINKER_REASONING_EFFORT=false`.

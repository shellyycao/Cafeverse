# Cafeverse — Morning Brief

## What you have now

A working demo of the big direction:

**Boot screen → type what you want to do at a café → the map ranks and lights up the matching cafés → click one to explore (exterior, then interior).**

- Try it: `npm run dev` → http://localhost:3000 (or the Vercel deployment of `main`).
- Example prompts: `I need a quiet place to study with outlets`, `brunch with friends, pastries, lively`, `想找个安静能写代码的地方`.
- Three pins on the map: ranked, with a glow and a match %, plus ranking cards at the bottom with sourced reasons and caveats.
- Click a pin once → exterior view. Click again (or the café) → interior. Back button at bottom-left.

## Real vs. fictional

| Café | Status | Art |
|---|---|---|
| Foster Street Coffee | **Real** (530 Foster St). Facts only from its website, your listing screenshots, review digests. | Your authored illustrations (`exterior-base.png`, `interior-base.png`) |
| Lantern & Loaf | **Fictional**, labelled as such | Older hand-built SVG café, themed |
| Quiet Hour Coffee | **Fictional**, labelled as such | Older hand-built SVG café, themed |

The fictional interiors use the older SVG style, so they look different from Foster's illustrated interior. This is expected for the demo.

## How the matching works

- `src/data/sites.ts` — the 3 cafés, their attributes (0–1 scores, booleans, pet policy) and sourced `evidence` strings.
- `src/app/api/match/route.ts` — POST `{prompt}`. The model (Thinking Machines / Tinker, server-side) only **extracts intent weights**; if it is unavailable or slow (12 s timeout) a keyword reader (EN + 中文) takes over (`mode: "demo"`). Rate limit: 12/min/IP (in memory).
- `src/lib/match.ts` — plain code ranks sites and writes the reasons/caveats from the data. The model never invents facts about a café.
- UI: `Splash.tsx`, `ResultsBar.tsx`, `scene/CafePins.tsx`, `scene/ZoneHint.tsx`.

## Environment variables (Vercel → Settings → Environment Variables)

- `TINKER_API_KEY` — server only. Without it the demo falls back to the keyword reader (still works, labelled "Demo").
- `TINKER_MODEL` — the model name you used locally.
- `TINKER_REASONING_EFFORT=false` — required for the Qwen3.5-9B model (other values return 400).
- **Please rotate the Tinker key**: it ended up in your shell history during setup.

## URL switches

- `?nosplash=1` — skip the boot screen.
- `?test=1` — shows the hidden time-of-day slider (normally time follows real Durham hours: open / closing with staff sweeping / closed with lights off).

## Dropping in new art

- `public/assets/foster/interior-base.png` — 2040×1620.
- `public/assets/foster/exterior-base.png` — 2400×1425. `scripts/fit_exterior.py` fits it to the street grid.
- Auto-detected; no config. SVG fallback if the file is missing.
- Specs and prompts: `docs/assets-kit/`, `docs/exterior-kit/`.

## Known issues / limits

- Dev overlay may show 404s for actor sprites that don't exist yet. Harmless.
- Fixed tonight: hydration mismatch (server vs client viewport width in the initial camera).
- No people/actors yet (Gate 2 not started; environment first, per the plan).
- Foster's exterior was fitted by shear; the building appears slightly smaller than its block.
- Mobile works (checked at 390 px); Foster's label can touch the right edge at the default overview.
- Crowd numbers are labelled demo; nothing live.
- A DB-backed API (Neon, review import, analysis cache) is parked on branch `wip/backend-and-prop-pass`, not in `main`.

## Suggested next steps

1. Gate 2: small actor sprites (laptop user, pair chatting) placed at the interior anchors.
2. Real art for the two other cafés (or replace them with real ones).
3. Review data via your screenshots, public articles, or official APIs only.
4. Merge or discard the parked backend branch.
5. Rotate the Tinker key.

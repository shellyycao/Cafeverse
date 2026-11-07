# Cafeverse

Visual-first café discovery prototype: a Google-Maps-style map of downtown Durham, NC that zooms into a hand-drawn miniature neighborhood, then into a café's interior. First café: **Foster Street Coffee** (530 Foster St).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Environment (server-only, set in Vercel → Settings → Environment Variables)

| Variable | Purpose |
|---|---|
| `TINKER_API_KEY` | Thinking Machines (Tinker) API key. Never sent to the browser. |
| `TINKER_MODEL` | Model value for Tinker's OpenAI-compatible endpoint (a `tinker://…` sampler path per the docs). Not hardcoded. |
| `TINKER_REASONING_EFFORT` | Optional, `false` for Qwen3.5-9B (verified); other models may take a float or a string like `low`. A 400 error says what the model accepts. |
| `TINKER_MAX_TOKENS` | Optional completion budget (default 2500). |
| `TINKER_BASE_URL` | Optional override. Default: `https://tinker.thinkingmachines.dev/services/tinker-prod/oai/api/v1` |

Without `TINKER_API_KEY` + `TINKER_MODEL` the app runs in a clearly labelled **Demo mode** (keyword reading of the supplied text).

## Layout

- `src/components/map` — pan/zoom viewport (per-zone zoom ceiling), flat base map
- `src/components/scene` — illustrated miniature layer (café exterior/interior, street furniture)
- `src/data` — Durham map data (`durham.json`, baked from OpenStreetMap), café fixture (`cafe.ts`)
- `src/lib/ai` — provider interface, Tinker adapter, demo provider, zod schema; `POST /api/analyze-cafe`
- `src/lib/scene.ts` — analysis → visual signals
- `scripts/build-durham.mjs` — regenerates `durham.json` from `data-raw/durham-osm.json`

## Data & honesty

- Map data © OpenStreetMap contributors (ODbL).
- Café facts come only from the café's own website; anything not stated is shown as unknown.
- Crowd levels are a labelled demo simulation, not live data.
- `ref_pic/` and `data-raw/reviews/` are git-ignored: third-party photos and review text are not redistributed.
- `references/` holds the art-direction pack (style reference only).

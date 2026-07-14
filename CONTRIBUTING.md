# Contributing

Thanks for helping keep TokenWise useful! The most valuable contributions are **data updates** —
model prices and lineups change constantly.

## Data PRs (most wanted)

All app content lives in three JSON files under `backend/data/`:

- **`models.json`** — providers and their models: pricing, context window, blurb, and 1–5 meters
  for smarts / speed / value.
- **`use-cases.json`** — the task taxonomy. Every subcase needs exactly three picks (`best`,
  `budget`, `fastest`), each with a one-line `why`. Keywords power the fuzzy search — include
  synonyms people actually type.
- **`tips.json`** — token-efficiency tips, optionally with a before/after example.

Workflow:

1. Edit the JSON.
2. `npm test` — the data-integrity suite validates ids, roles, meters, and cross-references, with
   error messages that say exactly what's wrong.
3. Bump the `updated` date in `models.json` if you touched pricing or lineups.
4. Open a PR and mention your source (pricing page, announcement, etc.).

Picks are curated opinions. If you disagree with one, open a PR with your reasoning — that's the
process working as intended.

## Code PRs

- Keep it simple: this app is deliberately small, dependency-light, and easy to read.
- `npm run lint && npm run format:check && npm test && npm run build` must pass (CI runs the
  same).
- The paper aesthetic is the brand: hand-drawn borders, `steps()` animations, palette in
  `frontend/src/styles/tokens.css`. New UI should feel like it was cut from the same notebook.
- Respect `prefers-reduced-motion` for any new animation.

## Project layout

See the "How it's put together" section of the [README](README.md).

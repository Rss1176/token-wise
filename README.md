# TokenWise ✈️

**The right AI model for the job — before you spend the tokens.**

TokenWise is a tiny, fast, open-source web app for the moment you think _"which model should I
actually use for this?"_. Type what you're doing (say, "coding"), drill into the task ("bug
fixing"), and get three honest picks — **best overall**, **budget**, and **fastest** — with plain
reasons why. There's also a browsable catalog of every popular model, and a wall of tips for
spending fewer tokens whatever you choose.

No accounts, no API keys, no tracking. Just curated data served as static JSON.

## Quickstart

```bash
npm install
npm run dev
```

That starts the Vite frontend on [localhost:5173](http://localhost:5173) and the little API
server on `:3001` (Vite proxies `/api` to it). No environment variables needed.

Other scripts:

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm test`          | Unit tests + the data-integrity checks          |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | TypeScript across frontend, backend, and api    |
| `npm run format`    | Prettier                                        |
| `npm run build`     | Typecheck + production build to `frontend/dist` |

## How it's put together

```
frontend/   Vite + React SPA — search, picks, catalog, tips, and the paper theme
backend/    The product data (backend/data/*.json) + API handlers + local dev server
api/        Thin Vercel serverless entries that re-export the backend handlers
shared/     TypeScript types both sides share
```

- **The data is the product.** Everything the app shows lives in three JSON files:
  [`backend/data/models.json`](backend/data/models.json) (providers and models),
  [`backend/data/use-cases.json`](backend/data/use-cases.json) (tasks and picks), and
  [`backend/data/tips.json`](backend/data/tips.json) (token-saving tips).
- **The backend is deliberately boring.** Handlers return the JSON with cache headers. On Vercel
  they run as serverless functions; locally a ~30-line `node:http` server stands in, so
  contributors don't need a Vercel account.
- **No database, no keys.** Data updates are pull requests, reviewed like code and validated by
  the data-integrity tests.

## Updating the data

Model lineups and prices move fast. If something is stale:

1. Edit the relevant file in `backend/data/`.
2. Run `npm test` — it checks that every pick points at a real model, every task has a
   best/budget/fastest pick, meters are 1–5, and so on. The failure messages tell you what to fix.
3. Open a PR. That's it — see [CONTRIBUTING.md](CONTRIBUTING.md).

> Picks are **curated opinions**, not benchmarks. They aim to be sensible defaults for someone
> who just wants an answer, and they're always up for debate in a PR.

## Deploying

The repo deploys to [Vercel](https://vercel.com) with zero configuration: import the repository
and press deploy. `vercel.json` already points the build at `frontend/dist`, and the `api/`
directory becomes serverless functions automatically.

## Design notes

The look is a paper collage: sage sky, halftone dots, wobbly hand-drawn borders, and sticky
notes. All animation runs on CSS `steps()` — low-frame, stop-motion style, like paper — and is
fully disabled under `prefers-reduced-motion`. Fonts (Patrick Hand + Nunito) are self-hosted, so
the app makes no third-party requests at all.

## License

[MIT](LICENSE)

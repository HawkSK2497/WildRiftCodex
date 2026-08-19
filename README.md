# Wild Rift Codex

A champion browser for Riot's Wild Rift. Champion data is pulled from the
`@wildrift/champions-api` package into Postgres, served by an Express API, and
browsed through a React front end. An AI-backed "playstyle finder" recommends a
single champion from a free-text description of how you like to play.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, axios             |
| API      | Express 5, tsx                                    |
| Database | Postgres via Drizzle ORM (`node-postgres`)        |
| AI       | Vercel AI SDK + Google Gemini (`@ai-sdk/google`)  |
| Tooling  | TypeScript, Oxlint, drizzle-kit                   |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create a `.env` in the project root:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/wildrift
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
```

`DATABASE_URL` is required by both the API and `drizzle.config.ts`.
`GOOGLE_GENERATIVE_AI_API_KEY` is only needed for the playstyle finder.

### 3. Seed the database

```bash
npm run db:seed
```

This fetches every champion (plus abilities and skins) from
`@wildrift/champions-api` and upserts them into Postgres.

### 4. Run it

The API and the Vite dev server run as two processes:

```bash
npm run dev:api   # http://localhost:3000
npm run dev       # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:3000`, so the front end talks to the
API through relative URLs.

## Scripts

| Script                  | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Vite dev server for the front end                   |
| `npm run dev:api`       | Express API in watch mode                           |
| `npm run api`           | Express API, one-shot                               |
| `npm run build`         | Type-check (`tsc -b`) and build the front end       |
| `npm run preview`       | Preview the production build                        |
| `npm run lint`          | Oxlint                                              |
| `npm run db:seed`       | Seed champions, abilities, and skins                |
| `npm run db:reset`      | Drop/reset the database                             |
| `npm run db:full-reset` | Reset then seed                                     |
| `npm run db:studio`     | Drizzle Studio                                      |

## API

| Method | Route                  | Description                                                |
| ------ | ---------------------- | ---------------------------------------------------------- |
| `GET`  | `/api/champions`       | All champions, with their abilities and skins              |
| `GET`  | `/api/champions/:id`   | One champion by id; `404` if unknown                       |
| `POST` | `/api/playstyle`       | `{ description }` → a recommended champion                 |

`POST /api/playstyle` sends the description to Gemini with a schema-constrained
prompt, then looks the returned champion name up in Postgres so the response is
always backed by a real row:

```json
{
  "champion": "Lee Sin",
  "role": "Jungler",
  "playstyle": "…",
  "imageUrl": "https://…"
}
```

Returns `400` if `description` is missing or blank, and `502` if the model fails
or names a champion that isn't in the database.

## Project layout

```
api/
  config/env.ts       dotenv bootstrap
  db/schema.ts        champions, abilities, skins (+ relations)
  db/index.ts         Drizzle client
  services/chat.ts    Gemini playstyle recommendation
  scripts/            seed.ts, reset.ts
  index.ts            Express app and routes
web/
  api/index.ts        axios calls against /api
  components/         ChampionCard, ChampionGrid, ChampionSearch, PlaystyleFinder
  lib/roleStyle.ts    role → Tailwind class mapping
  types/champion.ts   shared front-end types
  App.tsx, main.tsx
```

## Data model

- **champions** — `id` (text, PK), `name`, `imageUrl`, `role`, `introVideoUrl`,
  `difficulty`
- **abilities** — belongs to a champion, unique per `(championId, abilityType)`,
  cascades on delete
- **skins** — belongs to a champion, ordered by `position`, cascades on delete

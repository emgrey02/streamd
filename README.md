![App Screenshot](https://res.cloudinary.com/greypse/image/upload/c_crop,g_south,h_250,w_970,x_0,y_74/v1782829788/streamd_ibpyog.png)

# streamd

A movie & TV discovery app built with Next.js (App Router) and TypeScript, powered entirely by the [TMDB](https://www.themoviedb.org/) REST API — no local database. Favorites, ratings, watchlists, and custom lists are all real, and all backed by TMDB's own account system rather than a separate login.

## Features

### Browse & search

- Home page pulling trending (all / movie / tv / person), now-playing / popular / top-rated / upcoming movies, and airing-today / on-the-air / popular / top-rated shows — fetched server-side in parallel with `Promise.all`.
- Movie, TV, and person detail pages, split across a `layout.tsx` (title, poster, tagline, release date, genres, overview) and a `page.tsx` (runtime, budget, revenue, origin country/language via `Intl.DisplayNames`, production companies, cast/crew, image galleries). A single TMDB request per detail page uses `append_to_response` to pull credits, keywords, recommendations, similar titles, videos, watch providers, and reviews together instead of firing off separate calls.
- Dive into shows by season and by individual episode.
- Search movies, shows, and people by name; click any tag/keyword or genre to see everything else carrying it.
- Scrollable content carousels with scroll buttons, category tabs, and a "See More" link that only appears once a row actually hits TMDB's page size of 20.
- Fully responsive.

### Accounts, favorites, ratings, and lists

- Sign-in **is** TMDB's account system, not a separate app login. The flow: request a v4 `request_token` → the user approves it on themoviedb.org and is redirected back to `/approval` → the app exchanges the approved token for a v4 access token → converts that to a v3 `session_id`.
- All of it runs through Next.js **Server Actions** (`app/actions/auth.ts`, `favorites.ts`, `lists.ts`) — there are no `app/api/*/route.ts` handlers in the app at all.
- The session (`sessionId`, `accessToken`) is encrypted with **AES-256-GCM** (`app/lib/crypto.ts`) before being set as an httpOnly cookie. A separate, deliberately non-httpOnly `username` cookie holds just the display name so client components can show who's signed in without calling `cookies()` (which would force the page dynamic) — read through a small `useSyncExternalStore` hook (`useUsername`).
- Every movie/TV detail page carries a `UserContentInfoBox`: a favorite/watchlist toggle, a rating widget with its own progress-bar visualization of the TMDB community average, and an "Add to List" button showing which of your lists already contain that title.
- A `/dashboard` section (`favorites`, `watchlist`, `rated`, `lists`) reads straight from TMDB's account endpoints, paginated end to end. The lists dashboard supports creating, editing, and deleting custom lists.

## Tech stack

- **Next.js (App Router) + TypeScript** — Server Components by default, Client Components for anything interactive.
- **Server Actions** for every mutation and TMDB-account read.
- **Tailwind CSS** for styling.
- **TMDB API** — v3 for content and account data, v4 for the auth handshake. Server-side requests carry a bearer token that never reaches the browser.
- **Vercel** for deployment and analytics.
- Designed in **Figma** first.

## Project structure

```
app/
  actions/      server actions: auth, content, favorites, lists
  lib/          fetchTmdb / fetchAllTmdbPages, AES-256-GCM crypto, useUsername
  components/   UI, grouped by area (Home, ContentPage, Dashboard, Search, ...)
  movie/[id]/   detail layout + page, credits, reviews
  tv/[id]/      detail layout + page, credits, reviews, seasons, episodes
  person/[id]/  detail layout + page, credits
  dashboard/    favorites, watchlist, rated, lists
  search/       search results by content type
```

Shared TMDB helpers live in `app/lib/tmdb.ts`:

- `fetchTmdb` — a typed wrapper that throws a `TmdbError` carrying the HTTP status on a non-2xx response, instead of letting a failed request silently render a bad body.
- `fetchAllTmdbPages` — walks every page of a paginated TMDB list endpoint and concatenates the results; used by the dashboard.

## Running locally

```bash
npm install
npm run dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `TMDB_AUTH_TOKEN` | TMDB API read access token (v4 bearer), used for all server-side requests |
| `SESSION_SECRET` | 32-byte key used to encrypt the session cookie with AES-256-GCM |
| `NEXT_PUBLIC_BASE_URL` | Origin the TMDB approval step redirects back to (e.g. `http://localhost:3000`) |

A TMDB API key is free — request one from your [TMDB account settings](https://www.themoviedb.org/settings/api).

### Other scripts

```bash
npm run build
npm run lint
npm run typecheck
```

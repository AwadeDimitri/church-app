# Church App

> Offline-first Progressive Web App for a local church community — sermons, events, Bible, prayer, and more.

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-offline--first-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/learn/pwa)
[![GraphQL](https://img.shields.io/badge/GraphQL-Supabase-E10098?logo=graphql&logoColor=white)](https://supabase.com/docs/guides/graphql)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live demo →** <https://church-app-cyan.vercel.app/>

---

A production PWA serving the digital needs of a local church community: a single mobile-first app for sermons, events, prayer requests, an offline-capable French Bible, daily verses, and member profiles.

Built on a strict zero-budget constraint, the project is a deliberate exercise in modern Angular architecture: event-driven state with `@ngrx/signals`, layered feature modules, and a typed GraphQL data layer powered by Supabase's `pg_graphql` extension — all running on free tiers.

## Highlights

- **Offline-first Bible.** The full Louis Segond translation (tens of thousands of verses) is bundled as JSON at build time and prefetched by the service worker at install. The Bible is available offline from the very first load.
- **Event-driven state with `@ngrx/signals`.** Every feature ships its own store using a split style — dedicated files for events, handlers, and reducers. Redux-style discipline without the NgRx-full overhead, signal reactivity throughout.
- **Typed GraphQL pipeline.** Supabase's `pg_graphql` exposes the Postgres schema directly; schema-driven codegen with `@graphql-codegen` produces typed documents consumed via Apollo Client.
- **Reactive Forms only.** `ReactiveFormsModule` everywhere; signals are reserved for derived UI state. Clean separation of form state vs UI state.
- **Single source of truth for server state.** Apollo configured with `fetchPolicy: 'no-cache'` globally; TanStack Query owns caching and invalidation. Avoids dual-cache drift.
- **Zero-budget infrastructure.** Supabase free tier (DB + GraphQL + auth), Vercel for frontend hosting, GitHub Actions cron to keep the Supabase project warm. Every service stays under the free quota.

## Live demo

<https://church-app-cyan.vercel.app/>

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | Angular 20 (standalone APIs, signals), TypeScript 5.8 |
| State | `@ngrx/signals` (events + handlers + reducers split style) |
| Forms | Angular Reactive Forms (`ReactiveFormsModule`) |
| Styling | Tailwind CSS 4, ng-zorro-antd 20 |
| Data | Apollo Client 4 (typed documents), TanStack Query, Supabase JS |
| API | Supabase GraphQL (`pg_graphql` over Postgres) |
| PWA | `@angular/service-worker` (offline-first) |
| Hosting | Vercel (frontend) · Supabase free tier (DB + GraphQL + auth) |
| Tooling | GraphQL Codegen, Prettier |

## Architecture

### Repo layout

```
app/         # Angular 20 PWA — the shipped product
admin/       # Angular backoffice — early scaffolding
api/         # NestJS backend — paused, available if custom logic is needed
supabase/    # SQL migrations + Bible LSG seed data
.github/     # Keep-alive workflow for free-tier services
```

`app/` is the main artifact. `admin/` and `api/` are kept in the repo as future extension points but are not part of the shipped product.

### Feature layout

Each feature follows a layered structure inspired by the data-access / feature / ui / util convention:

```
feature/<name>/
  data-access/   # Apollo queries/mutations, store wiring
  feature/       # screens (smart components)
  ui/            # presentational components
  util/          # types (business + state) and helpers
```

### State pattern

State is built on `@ngrx/signals` using three coordinated files per store:

- `events.ts` — page events and API events (intentions, never logic)
- `handlers.ts` — side effects, query orchestration, dispatching reducers
- `reducers.ts` — pure state transitions

The boilerplate cost is real, but it pays off the moment a feature gets a third event or a non-trivial side effect. Discoverability beats brevity here.

### Offline-first Bible

The Louis Segond Bible is generated at build time from SQL seeds into `app/public/bible.json` via `scripts/build-bible.mjs`. The service worker prefetches the bundle at install, so the Bible is reachable offline immediately after the first load — no second visit required to warm the cache.

## Features

- **Sermons** — browse and listen to recorded preachings
- **Events** — church programmes and upcoming activities
- **Prayer** — intercessions and testimonies, submitted by members
- **Bible** — full Louis Segond translation, fully offline, book + chapter navigation
- **Verse of the day** — daily verse on the home screen
- **Profile** — member account
- **Posts / Groups** — community feed (schema ready, UI on the v2 roadmap)

## Run locally

**Prerequisites:** Node.js 20+, npm.

```bash
cd app
npm install
npm start
```

The dev server runs at <http://localhost:4200>. The `prestart` hook regenerates the Bible bundle from SQL seeds, so the very first start may take a few extra seconds.

### Environment variables

Create `app/.env` with:

```env
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

### Build

```bash
cd app
npm run build
```

Outputs to `app/dist/app/browser`. Vercel uses the same command (see `app/vercel.json`).

## Notable technical decisions

- **Bible bundled as JSON, not queried.** Early versions queried `bible_verses` over GraphQL but hit a hard 30-row cap due to a `pg_graphql` quirk on this Supabase setup. Shifting to a build-time bundle unlocked true offline reading and removed N+1 query patterns from the navigation flow.
- **Apollo `fetchPolicy: 'no-cache'` globally.** Apollo's normalized cache and TanStack Query's invalidation logic were stepping on each other. Forcing Apollo to always go through means TanStack Query owns the cache, with a single, predictable invalidation model.
- **Reactive Forms over signal-based forms.** `ReactiveFormsModule` is battle-tested for validation, async validators, and dynamic forms. Signals are kept for derived UI state where their ergonomics shine.
- **Split-style stores.** Events, handlers, and reducers live in dedicated files even for small features. Worth the upfront cost — every store reads the same way.
- **Anonymous-by-default identity.** No account creation friction; identity ties to a member record. Phone OTP via WhatsApp is on the v2 roadmap if the audience scales enough to require stricter auth.

## License

[MIT](LICENSE)

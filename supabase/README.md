# Supabase

Database schema, RLS policies, and seed data for the church-app backend.

## Layout

- `migrations/` — schema + RLS + pg_graphql directives, applied in chronological order
- `seeds/` — Bible LSG verses (used both for DB seeding and to generate the client-side bundle)
- `config.toml` — local Supabase config

## Bible tables (`bible_books`, `bible_verses`) — not queried by the app

As of 2026-04-28, **the app does not query these tables anymore**. The full LSG Bible is bundled into the client as `public/bible.json`, generated at build time from the seed files (`seeds/bible_lsg_*.sql`) by `app/scripts/build-bible.mjs`. The service worker prefetches the bundle at install, making the Bible feature fully offline from the moment the app is installed.

See commit `09d6962 feat(bible): bundle Bible LSG offline-first` for the full context.

The tables are intentionally kept in the DB for **optionality** — future features that may need server-side Bible data:

- Full-text search via Postgres `tsvector`
- FK references from other tables (e.g. `sermon_verses`, `prayer_verses` linking to `(book_id, chapter, verse)` with integrity guarantees)
- Multi-version Bible support without re-bundling the app

If none of these materialize after a few months of product iteration, drop the tables (and their RLS policies + pg_graphql directives) in a dedicated migration.

-- ============================================================================
-- Bible tables are now queried via the Supabase REST SDK (bypass pg_graphql's
-- 30-row cap). Remove the pg_graphql directives that were set on these tables:
-- they were ignored by pg_graphql on this setup anyway, and no longer needed
-- since Bible queries don't go through GraphQL.
--
-- totalCount directives on sermons / prayer_requests / prayer_likes stay:
-- those tables are still served via pg_graphql and the app uses totalCount.
-- ============================================================================

COMMENT ON TABLE public.bible_books  IS NULL;
COMMENT ON TABLE public.bible_verses IS NULL;

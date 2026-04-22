-- ============================================================================
-- pg_graphql directives + helper functions
-- - Opt-in `totalCount` on tables where the app needs counts.
-- - `intercessors_count()` exposes a COUNT DISTINCT that pg_graphql can't express natively.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- totalCount opt-in (pg_graphql directive in table comment)
-- ----------------------------------------------------------------------------

COMMENT ON TABLE public.bible_verses    IS e'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.sermons         IS e'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.prayer_requests IS e'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.prayer_likes    IS e'@graphql({"totalCount": {"enabled": true}})';


-- ----------------------------------------------------------------------------
-- intercessors_count: count distinct user_id across all prayer_likes.
-- pg_graphql has no aggregate "count distinct" so we expose a SQL function,
-- auto-wired as a root Query field `intercessorsCount` by pg_graphql.
-- SECURITY INVOKER respects the caller's RLS (authenticated sees all likes).
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.intercessors_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT user_id)::integer FROM public.prayer_likes;
$$;

GRANT EXECUTE ON FUNCTION public.intercessors_count() TO authenticated;

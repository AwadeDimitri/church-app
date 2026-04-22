-- ============================================================================
-- Increase pg_graphql max_rows for Bible tables (read-only full-content access).
-- pg_graphql default is 30 rows per page, which truncates the 66 books (39 OT +
-- 27 NT) and long chapters (Psalm 119 = 176 verses).
--
-- Other tables keep the default 30 (paginated UX via $limit/$offset variables).
-- ============================================================================

COMMENT ON TABLE public.bible_books  IS e'@graphql({"max_rows": 100})';
COMMENT ON TABLE public.bible_verses IS e'@graphql({"max_rows": 200, "totalCount": {"enabled": true}})';

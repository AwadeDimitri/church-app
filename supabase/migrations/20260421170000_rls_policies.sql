-- ============================================================================
-- RLS policies baseline
-- Public app uses roles `anon` (visitors) and `authenticated` (logged-in members).
-- Admin ops go through `service_role` (bypasses RLS by design — backoffice / Studio).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- READ-ONLY PUBLIC TABLES (anyone can SELECT; nobody can write via the app)
-- ----------------------------------------------------------------------------

CREATE POLICY "bible_books_select_all"
  ON public.bible_books FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "bible_verses_select_all"
  ON public.bible_verses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "categories_select_all"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "events_select_all"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "posts_select_all"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "sermons_select_all"
  ON public.sermons FOR SELECT
  TO anon, authenticated
  USING (true);


-- ----------------------------------------------------------------------------
-- USERS
-- Members see each other's profile so joins on prayer_requests.author work.
-- Self-update for editable fields. Sensitive fields (email/phone) will be
-- masked from pg_graphql exposure in a later migration; meanwhile the app
-- reads its own email/phone via supabase.auth.getUser() (not GraphQL).
-- ----------------------------------------------------------------------------

CREATE POLICY "users_select_authenticated"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ----------------------------------------------------------------------------
-- PRAYER REQUESTS
-- Members read everything, CRUD only their own entries.
-- DEFAULT auth.uid() on author_id so the client doesn't need to pass it,
-- and WITH CHECK prevents spoofing if it does.
-- ----------------------------------------------------------------------------

ALTER TABLE public.prayer_requests
  ALTER COLUMN author_id SET DEFAULT auth.uid();

CREATE POLICY "prayer_requests_select_authenticated"
  ON public.prayer_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "prayer_requests_insert_own"
  ON public.prayer_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "prayer_requests_update_own"
  ON public.prayer_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "prayer_requests_delete_own"
  ON public.prayer_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);


-- ----------------------------------------------------------------------------
-- PRAYER LIKES
-- Same pattern: read all, like/unlike only as self.
-- ----------------------------------------------------------------------------

ALTER TABLE public.prayer_likes
  ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "prayer_likes_select_authenticated"
  ON public.prayer_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "prayer_likes_insert_own"
  ON public.prayer_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prayer_likes_delete_own"
  ON public.prayer_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

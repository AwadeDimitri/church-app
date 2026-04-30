-- ============================================================================
-- prayer_intercessions: messages de soutien laissés sous une demande de prière.
-- Modèle "TikTok comments" : pas d'édition après publication, suppression
-- réservée à l'auteur. Les "Amen" sont stockés dans intercession_likes,
-- même pattern que prayer_likes.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

CREATE TABLE public.prayer_intercessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    prayer_id uuid NOT NULL,
    author_id uuid NOT NULL,
    content text NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.prayer_intercessions
    ADD CONSTRAINT prayer_intercessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.prayer_intercessions
    ADD CONSTRAINT prayer_intercessions_prayer_id_fkey
    FOREIGN KEY (prayer_id) REFERENCES public.prayer_requests(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.prayer_intercessions
    ADD CONSTRAINT prayer_intercessions_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Feed d'une prière : on liste par created_at DESC, donc index composite.
CREATE INDEX idx_prayer_intercessions_prayer_id
    ON public.prayer_intercessions USING btree (prayer_id, created_at DESC);

CREATE INDEX idx_prayer_intercessions_author_id
    ON public.prayer_intercessions USING btree (author_id);


CREATE TABLE public.intercession_likes (
    intercession_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.intercession_likes
    ADD CONSTRAINT intercession_likes_pkey PRIMARY KEY (intercession_id, user_id);

ALTER TABLE ONLY public.intercession_likes
    ADD CONSTRAINT intercession_likes_intercession_id_fkey
    FOREIGN KEY (intercession_id) REFERENCES public.prayer_intercessions(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.intercession_likes
    ADD CONSTRAINT intercession_likes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_intercession_likes_user_id
    ON public.intercession_likes USING btree (user_id);


-- ----------------------------------------------------------------------------
-- RLS
-- Lecture ouverte aux authenticated (idem prayer_requests).
-- Écriture/suppression : auth.uid() = author/user_id.
-- Pas de policy UPDATE : modèle immuable côté texte.
-- ----------------------------------------------------------------------------

ALTER TABLE public.prayer_intercessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercession_likes   ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.prayer_intercessions
    ALTER COLUMN author_id SET DEFAULT auth.uid();

ALTER TABLE public.intercession_likes
    ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "prayer_intercessions_select_authenticated"
    ON public.prayer_intercessions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "prayer_intercessions_insert_own"
    ON public.prayer_intercessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "prayer_intercessions_delete_own"
    ON public.prayer_intercessions FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

CREATE POLICY "intercession_likes_select_authenticated"
    ON public.intercession_likes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "intercession_likes_insert_own"
    ON public.intercession_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "intercession_likes_delete_own"
    ON public.intercession_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- pg_graphql : opt-in totalCount (compteur "12 Intercessions" et "Amen · N").
-- ----------------------------------------------------------------------------

COMMENT ON TABLE public.prayer_intercessions IS e'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.intercession_likes   IS e'@graphql({"totalCount": {"enabled": true}})';

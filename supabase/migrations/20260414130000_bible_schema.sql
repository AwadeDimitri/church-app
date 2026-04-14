-- Bible LSG 1910 (domaine public) — schéma de lecture seule.
-- Les données sont seedées une seule fois via supabase/seeds/bible_lsg.sql.

create table if not exists public.bible_books (
  id smallint primary key,                            -- 1..66, ordre canonique
  testament smallint not null check (testament in (1, 2)),  -- 1=Ancien, 2=Nouveau
  position smallint not null,                         -- même valeur que id, redondant mais utile pour ordre dans un testament
  name text not null,                                 -- "Genèse"
  slug text not null unique,                          -- "genese"
  chapter_count smallint not null
);

create table if not exists public.bible_verses (
  book_id smallint not null references public.bible_books(id) on delete cascade,
  chapter smallint not null,
  verse smallint not null,
  text text not null,
  primary key (book_id, chapter, verse)
);

create index if not exists bible_verses_book_chapter_idx
  on public.bible_verses (book_id, chapter);

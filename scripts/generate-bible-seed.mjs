#!/usr/bin/env node
// Génère supabase/seeds/bible_lsg.sql à partir du JSON LSG 1910 (domaine public).
// Source : https://raw.githubusercontent.com/juliend2/data-bible/master/db/seed_data/louis-segond-formatted.json
// Usage : node scripts/generate-bible-seed.mjs

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SOURCE_URL = 'https://raw.githubusercontent.com/juliend2/data-bible/master/db/seed_data/louis-segond-formatted.json';
const CACHE_PATH = join(ROOT, 'scripts', '.cache-lsg.json');
const OUT_DIR = join(ROOT, 'supabase', 'seeds');
// Le SQL Editor Supabase refuse les requêtes trop grosses (~1 MB max).
// On génère donc plusieurs fichiers d'environ 700 KB.
const BATCHES_PER_FILE = 5; // 5 batches de 1000 versets par fichier ≈ ~700 KB

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')      // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function sqlEscape(s) {
  return s.replace(/'/g, "''");
}

async function fetchJson() {
  if (existsSync(CACHE_PATH)) {
    console.log('→ Utilisation du cache :', CACHE_PATH);
    return JSON.parse(await readFile(CACHE_PATH, 'utf-8'));
  }
  console.log('→ Téléchargement du JSON LSG...');
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Échec téléchargement : ${res.status}`);
  const text = await res.text();
  await writeFile(CACHE_PATH, text);
  console.log('→ Cache enregistré :', CACHE_PATH);
  return JSON.parse(text);
}

async function main() {
  const bible = await fetchJson();

  if (bible.Abbreviation !== 'LSG') {
    throw new Error(`Traduction inattendue : ${bible.Abbreviation}`);
  }

  const books = [];    // { id, testament, position, name, slug, chapterCount }
  const verses = [];   // { bookId, chapter, verse, text }
  let bookId = 0;

  for (let t = 0; t < bible.Testaments.length; t++) {
    const testament = t + 1; // 1 = AT, 2 = NT
    for (const book of bible.Testaments[t].Books) {
      bookId++;
      const name = book.Text;
      const chapterCount = book.Chapters.length;
      books.push({
        id: bookId,
        testament,
        position: bookId,
        name,
        slug: slugify(name),
        chapterCount,
      });

      for (let c = 0; c < book.Chapters.length; c++) {
        const chapterNum = c + 1;
        const chapterVerses = book.Chapters[c].Verses;
        for (let v = 0; v < chapterVerses.length; v++) {
          const verseNum = chapterVerses[v].ID ?? (v + 1);
          verses.push({
            bookId,
            chapter: chapterNum,
            verse: verseNum,
            text: chapterVerses[v].Text,
          });
        }
      }
    }
  }

  console.log(`→ ${books.length} livres, ${verses.length} versets extraits`);

  if (books.length !== 66) {
    console.warn(`⚠ Attendu 66 livres, trouvé ${books.length}`);
  }

  // Vérification rapide de l'unicité des slugs
  const slugSet = new Set();
  for (const b of books) {
    if (slugSet.has(b.slug)) throw new Error(`Slug dupliqué : ${b.slug}`);
    slugSet.add(b.slug);
  }

  // Découpe les versets en batchs de 1000
  const BATCH = 1000;
  const verseBatches = [];
  for (let i = 0; i < verses.length; i += BATCH) {
    verseBatches.push(verses.slice(i, i + BATCH));
  }

  // Construit les fichiers : 01 = livres + premiers batchs, puis batchs restants
  // Chaque fichier est une transaction autonome exécutable indépendamment.
  const files = [];
  let fileIdx = 1;

  // Fichier 01 : livres + BATCHES_PER_FILE premiers batchs de versets
  {
    const header = [
      '-- Seed Bible LSG 1910 (domaine public) — partie 1 (livres + versets)',
      '-- Généré par scripts/generate-bible-seed.mjs',
      '-- À exécuter APRÈS la migration 20260414130000_bible_schema.sql',
      '',
      'begin;',
      '',
      '-- Livres',
      'insert into public.bible_books (id, testament, position, name, slug, chapter_count) values',
      books
        .map(b => `  (${b.id}, ${b.testament}, ${b.position}, '${sqlEscape(b.name)}', '${b.slug}', ${b.chapterCount})`)
        .join(',\n') + '\non conflict (id) do nothing;',
      '',
    ];
    const firstBatches = verseBatches.splice(0, BATCHES_PER_FILE);
    for (const chunk of firstBatches) {
      header.push('insert into public.bible_verses (book_id, chapter, verse, text) values');
      header.push(
        chunk.map(v => `  (${v.bookId}, ${v.chapter}, ${v.verse}, '${sqlEscape(v.text)}')`).join(',\n')
          + '\non conflict (book_id, chapter, verse) do nothing;'
      );
      header.push('');
    }
    header.push('commit;', '');
    files.push({ idx: fileIdx++, content: header.join('\n') });
  }

  // Fichiers suivants : BATCHES_PER_FILE batchs chacun
  while (verseBatches.length) {
    const chunkBatches = verseBatches.splice(0, BATCHES_PER_FILE);
    const lines = [
      `-- Seed Bible LSG 1910 — partie ${fileIdx} (versets)`,
      '',
      'begin;',
      '',
    ];
    for (const chunk of chunkBatches) {
      lines.push('insert into public.bible_verses (book_id, chapter, verse, text) values');
      lines.push(
        chunk.map(v => `  (${v.bookId}, ${v.chapter}, ${v.verse}, '${sqlEscape(v.text)}')`).join(',\n')
          + '\non conflict (book_id, chapter, verse) do nothing;'
      );
      lines.push('');
    }
    lines.push('commit;', '');
    files.push({ idx: fileIdx++, content: lines.join('\n') });
  }

  await mkdir(OUT_DIR, { recursive: true });

  // Supprime l'ancien fichier monolithique s'il existe
  const legacy = join(OUT_DIR, 'bible_lsg.sql');
  if (existsSync(legacy)) {
    await (await import('node:fs')).promises.unlink(legacy);
    console.log(`→ Ancien fichier supprimé : ${legacy}`);
  }

  const total = files.length;
  for (const f of files) {
    const padded = String(f.idx).padStart(2, '0');
    const path = join(OUT_DIR, `bible_lsg_${padded}.sql`);
    await writeFile(path, f.content);
    const size = (await import('node:fs')).promises.stat(path);
    const { size: bytes } = await size;
    console.log(`→ ${padded}/${String(total).padStart(2, '0')} : ${path} (${(bytes / 1024).toFixed(0)} KB)`);
  }

  console.log(`\n→ ${total} fichiers générés dans ${OUT_DIR}`);
  console.log(`→ À exécuter dans l'ordre dans le SQL Editor Supabase.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

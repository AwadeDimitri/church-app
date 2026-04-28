import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEEDS_DIR = join(__dirname, '../../supabase/seeds');
const OUT_PATH = join(__dirname, '../public/bible.json');

const BOOK_BLOCK =
  /insert\s+into\s+public\.bible_books\s*\([^)]*\)\s*values\s*([\s\S]*?)\s*on\s+conflict/gi;
const VERSE_BLOCK =
  /insert\s+into\s+public\.bible_verses\s*\([^)]*\)\s*values\s*([\s\S]*?)\s*on\s+conflict/gi;

const BOOK_ROW =
  /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*(\d+)\s*\)/g;
const VERSE_ROW =
  /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*)'\s*\)/g;

const unescape = (s) => s.replace(/''/g, "'");

function extractRows(content, blockRegex, rowRegex, mapper) {
  const rows = [];
  blockRegex.lastIndex = 0;
  let blockMatch;
  while ((blockMatch = blockRegex.exec(content)) !== null) {
    const block = blockMatch[1];
    rowRegex.lastIndex = 0;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(block)) !== null) {
      rows.push(mapper(rowMatch));
    }
  }
  return rows;
}

async function parseFile(path) {
  const content = await readFile(path, 'utf8');

  const books = extractRows(content, BOOK_BLOCK, BOOK_ROW, (r) => ({
    id: +r[1],
    testament: +r[2],
    position: +r[3],
    name: unescape(r[4]),
    slug: unescape(r[5]),
    chapter_count: +r[6],
  }));

  const verses = extractRows(content, VERSE_BLOCK, VERSE_ROW, (r) => ({
    book_id: +r[1],
    chapter: +r[2],
    verse: +r[3],
    text: unescape(r[4]),
  }));

  return { books, verses };
}

async function main() {
  const files = (await readdir(SEEDS_DIR))
    .filter((f) => f.startsWith('bible_lsg_') && f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No bible_lsg_*.sql found in ${SEEDS_DIR}`);
  }

  const allBooks = [];
  const allVerses = [];

  for (const f of files) {
    const { books, verses } = await parseFile(join(SEEDS_DIR, f));
    allBooks.push(...books);
    allVerses.push(...verses);
  }

  const booksById = new Map();
  for (const b of allBooks) booksById.set(b.id, b);
  const books = [...booksById.values()].sort((a, b) => a.id - b.id);

  const verses = allVerses.sort(
    (a, b) =>
      a.book_id - b.book_id || a.chapter - b.chapter || a.verse - b.verse,
  );

  await mkdir(dirname(OUT_PATH), { recursive: true });
  const json = JSON.stringify({ books, verses });
  await writeFile(OUT_PATH, json, 'utf8');

  const sizeMb = (json.length / 1024 / 1024).toFixed(2);
  console.log(
    `✓ bible.json — ${books.length} books, ${verses.length} verses (${sizeMb} MB)`,
  );
}

main().catch((err) => {
  console.error('build-bible failed:', err);
  process.exit(1);
});

/**
 * Add missing `public.jobs` columns without `ADD COLUMN IF NOT EXISTS`,
 * which emits PostgreSQL NOTICE 42701 ("already exists, skipping") on every run
 * and clutters CI logs for new tenants.
 */

const IDENT = /^[a-z][a-z0-9_]*$/i;

function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

/** @param {import('postgres').Sql} sql */
export async function ensureJobsColumns(sql, columns) {
  const rows = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'jobs'
  `;
  const have = new Set((rows || []).map((r) => r.column_name));
  for (const [name, type] of columns) {
    if (!IDENT.test(name)) throw new Error(`Invalid column name: ${name}`);
    if (have.has(name)) continue;
    await sql.unsafe(`ALTER TABLE jobs ADD COLUMN ${quoteIdent(name)} ${type}`);
    have.add(name);
  }
}

/** scratch-scan / insert path */
export const JOBS_COLUMNS_SCAN = [
  ['canonical_url', 'TEXT'],
  ['jd_text', 'TEXT'],
];

/** agentic-tailor HTML persist path */
export const JOBS_COLUMNS_TAILOR = [
  ['resume_html', 'TEXT'],
  ['cover_letter_html', 'TEXT'],
  ['canonical_url', 'TEXT'],
  ['jd_text', 'TEXT'],
];

/** one-shot migrate (all optional tailor columns) */
export const JOBS_COLUMNS_MIGRATE = [
  ['resume_html', 'TEXT'],
  ['cover_letter_html', 'TEXT'],
  ['resume_pdf_key', 'TEXT'],
  ['cover_letter_pdf_key', 'TEXT'],
  ['canonical_url', 'TEXT'],
  ['jd_text', 'TEXT'],
];

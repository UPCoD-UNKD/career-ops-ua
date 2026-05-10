import sql from './client.mjs';

async function migrate() {
  console.log('🚀 Running database migrations...');
  try {
    await sql`
      ALTER TABLE jobs
        ADD COLUMN IF NOT EXISTS resume_html TEXT,
        ADD COLUMN IF NOT EXISTS cover_letter_html TEXT,
        ADD COLUMN IF NOT EXISTS resume_pdf_key TEXT,
        ADD COLUMN IF NOT EXISTS cover_letter_pdf_key TEXT,
        ADD COLUMN IF NOT EXISTS canonical_url TEXT,
        ADD COLUMN IF NOT EXISTS jd_text TEXT;
    `;
    console.log('✅ jobs table schema updated successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

migrate();

import sql from './client.mjs';
import fs from 'fs';
import path from 'path';

const PIPELINE_FILE = 'data/pipeline.md';
const EVAL_FILE = 'data/current_eval.json';

async function migrate() {
  console.log("🚚 Starting Data Migration to PostgreSQL...");

  const jobsToInsert = [];

  // 1. Process current_eval.json (highest priority as it has scores)
  if (fs.existsSync(EVAL_FILE)) {
    const evalData = JSON.parse(fs.readFileSync(EVAL_FILE, 'utf8'));
    for (const [id, entry] of Object.entries(evalData)) {
      jobsToInsert.push({
        company: entry.company,
        url: entry.url,
        score: entry.score || 0,
        source: 'legacy_eval',
        title: entry.title || 'Unknown Role'
      });
    }
  }

  // 2. Process pipeline.md (for any missing jobs)
  if (fs.existsSync(PIPELINE_FILE)) {
    const content = fs.readFileSync(PIPELINE_FILE, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/\|\s*(.*?)\s*\|\s*\[.*?\]\((.*?)\)\s*\|/);
      if (match) {
        const company = match[1].trim();
        const url = match[2].trim();
        if (!jobsToInsert.find(j => j.url === url)) {
          jobsToInsert.push({
            company,
            url,
            score: 0,
            source: 'legacy_pipeline',
            title: 'Unknown Role'
          });
        }
      }
    }
  }

  console.log(`📦 Found ${jobsToInsert.length} legacy jobs. Migrating...`);

  let count = 0;
  for (const job of jobsToInsert) {
    try {
      await sql`
        INSERT INTO jobs ${sql(job, 'company', 'url', 'score', 'source', 'title')}
        ON CONFLICT (url) DO UPDATE SET
          score = EXCLUDED.score,
          company = EXCLUDED.company
      `;
      count++;
    } catch (e) {
      console.warn(`  ⚠ Failed to migrate ${job.url}: ${e.message}`);
    }
  }

  console.log(`✅ Successfully migrated ${count} jobs to the database.`);
  process.exit();
}

migrate();

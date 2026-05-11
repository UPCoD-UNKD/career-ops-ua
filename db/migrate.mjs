import sql from './client.mjs';
import { ensureJobsColumns, JOBS_COLUMNS_MIGRATE } from './ensure-jobs-columns.mjs';

async function migrate() {
  console.log('🚀 Running database migrations...');
  try {
    await ensureJobsColumns(sql, JOBS_COLUMNS_MIGRATE);
    console.log('✅ jobs table schema updated successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

migrate();

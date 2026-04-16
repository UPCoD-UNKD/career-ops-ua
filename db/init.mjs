import sql from './client.mjs';

async function init() {
  console.log("🛠️ Initializing Database Schema...");

  try {
    await sql.begin(async (sql) => {
      // Jobs table
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          company TEXT NOT NULL,
          title TEXT,
          url TEXT UNIQUE NOT NULL,
          score NUMERIC DEFAULT 0,
          jd TEXT,
          source TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Applications table
      await sql`
        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'PENDING',
          resume_file TEXT,
          notes TEXT,
          applied_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Scans table
      await sql`
        CREATE TABLE IF NOT EXISTS scans (
          id SERIAL PRIMARY KEY,
          portal TEXT,
          jobs_found INTEGER DEFAULT 0,
          duration_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Create some indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_jobs_url ON jobs(url);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_jobs_score ON jobs(score);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);`;
    });

    console.log("✅ Database Schema Initialized Successfully!");
  } catch (err) {
    console.error("❌ Database Initialization Failed:", err.message);
  } finally {
    process.exit();
  }
}

init();

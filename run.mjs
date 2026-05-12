#!/usr/bin/env node

/**
 * run.mjs — Daily Career Automation Runner
 *
 * Executes the full daily workflow for Parth Rajguru's job search:
 *   1. Scan all configured portals for new roles (zero-token)
 *   2. Merge any pending tracker additions
 *   3. Identify roles ready to apply vs. needing prep
 *   4. Generate base CV PDF
 *   5. Stage cover letters for ready-to-apply roles
 *   6. Queue pipeline items for AI evaluation (via claude -p)
 *   7. Compile report and write to output/daily-report-{date}.json + .html
 *   8. Signal the AI agent to send via Gmail MCP (create_draft)
 *
 * ETHICAL CONSTRAINT: This script NEVER submits applications.
 * It prepares everything. Parth reviews and sends. Always.
 *
 * HOW EMAIL WORKS:
 *   This script does NOT call nodemailer or any SMTP server directly.
 *   Instead, it writes the full report to output/daily-report-{date}.json
 *   and exits with a special signal. The AI agent (Claude) reads the JSON
 *   and calls the Gmail MCP create_draft tool to create a Gmail draft in
 *   your inbox. You review the draft in Gmail and click Send.
 *
 *   Why not SMTP? No credentials to manage. No App Password. No OAuth flow.
 *   The Gmail MCP connector is already authenticated in your Claude session.
 *
 *   Why create_draft and not send? The Gmail MCP available in this setup
 *   only exposes create_draft (not send). This is intentional — you always
 *   review before anything leaves your inbox.
 *
 * Usage:
 *   node run.mjs                    # full daily run (AI agent sends draft after)
 *   node run.mjs --dry-run          # preview without writing files
 *   node run.mjs --skip-scan        # skip portal scan, use existing pipeline
 *   node run.mjs --skip-pdf         # skip PDF generation (Playwright not available)
 *   node run.mjs --evaluate         # also run AI evaluation on top pipeline items
 *
 * References:
 *   CAREER_SYSTEM.md — candidate profile, rules, workflow
 *   config/profile.yml — candidate identity and targets
 *   portals.yml — portal scanner configuration
 *   data/applications.md — application tracker
 *   data/pipeline.md — pending URLs inbox
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, appendFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync, execSync, spawnSync } from 'child_process';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TODAY = new Date().toISOString().slice(0, 10);
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_SCAN = process.argv.includes('--skip-scan');
const SKIP_PDF = process.argv.includes('--skip-pdf');
const EVALUATE = process.argv.includes('--evaluate');

// ── Path constants ───────────────────────────────────────────────────

const PATHS = {
  profile:      join(__dirname, 'config/profile.yml'),
  portals:      join(__dirname, 'portals.yml'),
  cv:           join(__dirname, 'cv.md'),
  careerSystem: join(__dirname, 'CAREER_SYSTEM.md'),
  applications: join(__dirname, 'data/applications.md'),
  pipeline:     join(__dirname, 'data/pipeline.md'),
  scanHistory:  join(__dirname, 'data/scan-history.tsv'),
  followUps:    join(__dirname, 'data/follow-ups.md'),
  reports:      join(__dirname, 'reports'),
  output:       join(__dirname, 'output'),
  coverLetters: join(__dirname, 'output/cover-letters'),
  template:     join(__dirname, 'templates/cv-template.html'),
  scan:         join(__dirname, 'scan.mjs'),
  mergeTkr:     join(__dirname, 'merge-tracker.mjs'),
  verifyPipe:   join(__dirname, 'verify-pipeline.mjs'),
  generatePdf:  join(__dirname, 'generate-pdf.mjs'),
  trackerAdds:  join(__dirname, 'batch/tracker-additions'),
};

// Ensure output directories exist
for (const dir of [PATHS.output, PATHS.coverLetters, PATHS.reports, PATHS.trackerAdds]) {
  mkdirSync(dir, { recursive: true });
}

// ── Logging ──────────────────────────────────────────────────────────

const log = {
  step: (msg) => console.log(`\n▶ ${msg}`),
  ok:   (msg) => console.log(`  ✅ ${msg}`),
  warn: (msg) => console.log(`  ⚠️  ${msg}`),
  info: (msg) => console.log(`  ℹ️  ${msg}`),
  err:  (msg) => console.error(`  ❌ ${msg}`),
  dry:  (msg) => console.log(`  [dry-run] ${msg}`),
};

// ── Config loading ───────────────────────────────────────────────────

function loadProfile() {
  if (!existsSync(PATHS.profile)) {
    log.err('config/profile.yml not found. Run onboarding first.');
    process.exit(1);
  }
  return yaml.load(readFileSync(PATHS.profile, 'utf-8'));
}

function loadPortals() {
  if (!existsSync(PATHS.portals)) return { tracked_companies: [], search_queries: [] };
  return yaml.load(readFileSync(PATHS.portals, 'utf-8'));
}

// ── Step 1: Portal scan ──────────────────────────────────────────────

async function runScan() {
  log.step('Scanning portals for new roles...');

  if (SKIP_SCAN) {
    log.info('--skip-scan flag set. Using existing pipeline.md.');
    return { newOffers: 0, errors: 0 };
  }

  if (!existsSync(PATHS.scan)) {
    log.warn('scan.mjs not found. Skipping portal scan.');
    return { newOffers: 0, errors: 0 };
  }

  try {
    const args = DRY_RUN ? ['scan.mjs', '--dry-run'] : ['scan.mjs'];
    const result = spawnSync('node', args, {
      cwd: __dirname,
      encoding: 'utf-8',
      timeout: 120_000,
    });

    if (result.stdout) console.log(result.stdout.split('\n').map(l => '  ' + l).join('\n'));
    if (result.stderr && result.status !== 0) log.err(result.stderr.trim());

    // Parse new offers count from scan output
    const newOffersMatch = result.stdout?.match(/New offers added:\s+(\d+)/);
    const errorsMatch = result.stdout?.match(/Errors \((\d+)\)/);

    return {
      newOffers: newOffersMatch ? parseInt(newOffersMatch[1]) : 0,
      errors: errorsMatch ? parseInt(errorsMatch[1]) : 0,
      output: result.stdout || '',
    };
  } catch (err) {
    log.err(`Scan failed: ${err.message}`);
    return { newOffers: 0, errors: 1 };
  }
}

// ── Step 2: Merge tracker ────────────────────────────────────────────

function runMergeTracker() {
  log.step('Merging pending tracker additions...');

  if (!existsSync(PATHS.mergeTkr)) {
    log.warn('merge-tracker.mjs not found. Skipping merge.');
    return;
  }

  const pendingTsvs = existsSync(PATHS.trackerAdds)
    ? readdirSync(PATHS.trackerAdds).filter(f => f.endsWith('.tsv')).length
    : 0;

  if (pendingTsvs === 0) {
    log.info('No pending tracker additions.');
    return;
  }

  if (DRY_RUN) {
    log.dry(`Would merge ${pendingTsvs} TSV file(s)`);
    return;
  }

  try {
    execFileSync('node', ['merge-tracker.mjs'], { cwd: __dirname, stdio: 'inherit' });
    log.ok(`Merged ${pendingTsvs} tracker addition(s)`);
  } catch (err) {
    log.err(`Merge failed: ${err.message}`);
  }
}

// ── Step 3: Parse applications tracker ──────────────────────────────

function parseApplications() {
  log.step('Reading applications tracker...');

  if (!existsSync(PATHS.applications)) {
    log.warn('data/applications.md not found.');
    return [];
  }

  const lines = readFileSync(PATHS.applications, 'utf-8').split('\n');
  const apps = [];

  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('---') || line.includes('Company')) continue;
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length < 7) continue;

    const num    = parseInt(parts[0]);
    if (isNaN(num)) continue;

    apps.push({
      num,
      date:    parts[1],
      company: parts[2],
      role:    parts[3],
      score:   parts[4],
      status:  parts[5],
      pdf:     parts[6],
      report:  parts[7] || '',
      notes:   parts[8] || '',
    });
  }

  log.ok(`${apps.length} application(s) in tracker`);
  return apps;
}

// ── Step 4: Parse pipeline (pending URLs) ────────────────────────────

function parsePipeline() {
  log.step('Reading pipeline inbox...');

  if (!existsSync(PATHS.pipeline)) {
    log.info('data/pipeline.md not found — no pending URLs.');
    return { pending: [], processed: [] };
  }

  const text = readFileSync(PATHS.pipeline, 'utf-8');
  const pending = [];
  const processed = [];

  for (const line of text.split('\n')) {
    const pendingMatch = line.match(/^- \[ \] (.+)/);
    const doneMatch    = line.match(/^- \[x\] (.+)/i);

    if (pendingMatch) {
      const parts = pendingMatch[1].split('|').map(s => s.trim());
      pending.push({ url: parts[0], company: parts[1] || '', title: parts[2] || '' });
    } else if (doneMatch) {
      processed.push(doneMatch[1]);
    }
  }

  log.ok(`${pending.length} pending URL(s), ${processed.length} processed`);
  return { pending, processed };
}

// ── Step 5: Visa-screen pending pipeline items ────────────────────────

function visaScreen(items) {
  // Simple keyword screen — full screening happens in AI evaluation
  // But we can fast-fail obvious blockers from the URL/title alone
  const BLOCKERS = ['citizen', 'clearance', 'nv1', 'nv2', 'agsva', 'secret'];
  return items.map(item => {
    const combined = `${item.url} ${item.title} ${item.company}`.toLowerCase();
    const blocked = BLOCKERS.some(k => combined.includes(k));
    return { ...item, visaFlag: blocked ? 'SKIP' : 'CHECK' };
  });
}

// ── Step 6: Generate base CV PDF ─────────────────────────────────────

async function generateCvPdf(profile) {
  log.step('Generating base CV PDF...');

  if (SKIP_PDF) {
    log.info('--skip-pdf flag set. Skipping PDF generation.');
    return null;
  }

  if (!existsSync(PATHS.generatePdf)) {
    log.warn('generate-pdf.mjs not found. Skipping PDF.');
    return null;
  }

  if (!existsSync(PATHS.template)) {
    log.warn('templates/cv-template.html not found. Skipping PDF.');
    return null;
  }

  // Build a rendered HTML file from cv.md + template
  const cvMd = existsSync(PATHS.cv) ? readFileSync(PATHS.cv, 'utf-8') : '';
  if (!cvMd) {
    log.warn('cv.md is empty. Skipping PDF.');
    return null;
  }

  // Simple markdown → HTML conversion for CV fields
  // (The template handles full layout; we inject the structured data)
  const candidateName  = profile?.candidate?.full_name || 'Parth Rajguru';
  const candidateEmail = profile?.candidate?.email || '';
  const candidatePhone = profile?.candidate?.phone || '';
  const candidateLi    = profile?.candidate?.linkedin || '';
  const portfolioUrl   = profile?.candidate?.portfolio_url || '';
  const tableauUrl     = profile?.candidate?.tableau_public_url || '';
  const location       = profile?.candidate?.location || 'Sydney, Australia';

  // Render markdown sections as HTML
  const html = markdownCvToHtml(cvMd, {
    name: candidateName, email: candidateEmail, phone: candidatePhone,
    linkedin: candidateLi, portfolio: portfolioUrl, tableau: tableauUrl, location,
  });

  const tempHtml = join(PATHS.output, `cv-${TODAY}.html`);
  const outputPdf = join(PATHS.output, `parth-rajguru-cv-${TODAY}.pdf`);

  if (DRY_RUN) {
    log.dry(`Would write HTML to ${tempHtml}`);
    log.dry(`Would generate PDF at ${outputPdf}`);
    return null;
  }

  writeFileSync(tempHtml, html, 'utf-8');

  try {
    execFileSync('node', [PATHS.generatePdf, tempHtml, outputPdf, '--format=a4'], {
      cwd: __dirname,
      stdio: 'pipe',
      timeout: 60_000,
    });
    log.ok(`CV PDF generated: ${outputPdf}`);
    return outputPdf;
  } catch (err) {
    log.err(`PDF generation failed: ${err.message}`);
    return null;
  }
}

// ── Markdown CV → HTML (minimal renderer for base CV) ────────────────

function markdownCvToHtml(md, meta) {
  // Read the template
  let template = '';
  if (existsSync(PATHS.template)) {
    template = readFileSync(PATHS.template, 'utf-8');
  }

  // Convert markdown to basic HTML
  let body = md
    // H2 sections
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Bullet points
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
    // Paragraphs (blank lines)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');

  // If template exists and has placeholders, inject
  if (template && template.includes('{{name}}')) {
    return template
      .replace(/\{\{name\}\}/g, esc(meta.name))
      .replace(/\{\{email\}\}/g, esc(meta.email))
      .replace(/\{\{phone\}\}/g, esc(meta.phone))
      .replace(/\{\{linkedin\}\}/g, esc(meta.linkedin))
      .replace(/\{\{portfolio\}\}/g, esc(meta.portfolio))
      .replace(/\{\{tableau\}\}/g, esc(meta.tableau))
      .replace(/\{\{location\}\}/g, esc(meta.location))
      .replace(/\{\{body\}\}/g, body)
      .replace(/\{\{date\}\}/g, TODAY);
  }

  // Fallback: minimal standalone HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(meta.name)} — CV</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #222; line-height: 1.5; }
    h1 { font-size: 2em; margin-bottom: 2px; }
    .contact { color: #555; font-size: 0.9em; margin-bottom: 24px; }
    .contact a { color: #1a6fb5; text-decoration: none; }
    h2 { border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 28px; font-size: 1.1em; text-transform: uppercase; letter-spacing: 0.05em; }
    h3 { margin-bottom: 4px; }
    ul { margin: 4px 0 12px 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
    a { color: #1a6fb5; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${esc(meta.name)}</h1>
  <div class="contact">
    ${meta.email ? `<a href="mailto:${esc(meta.email)}">${esc(meta.email)}</a> &nbsp;|&nbsp; ` : ''}
    ${meta.phone ? `${esc(meta.phone)} &nbsp;|&nbsp; ` : ''}
    ${meta.location ? `${esc(meta.location)} &nbsp;|&nbsp; ` : ''}
    ${meta.linkedin ? `<a href="https://${esc(meta.linkedin)}">${esc(meta.linkedin)}</a> &nbsp;|&nbsp; ` : ''}
    ${meta.portfolio ? `<a href="${esc(meta.portfolio)}">Portfolio</a> &nbsp;|&nbsp; ` : ''}
    ${meta.tableau ? `<a href="${esc(meta.tableau)}">Tableau Public</a>` : ''}
  </div>
  ${body}
</body>
</html>`;
}

function esc(str = '') {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Step 7: Stage cover letters for ready-to-apply roles ─────────────

function stageCoverLetters(apps, profile) {
  log.step('Staging cover letters for ready-to-apply roles...');

  // Ready = Evaluated with score >= 3.5 and has a report
  const ready = apps.filter(a => {
    const score = parseFloat(a.score);
    return a.status === 'Evaluated' && score >= 3.5 && a.report;
  });

  if (ready.length === 0) {
    log.info('No evaluated roles ready to stage.');
    return [];
  }

  const staged = [];
  const name    = profile?.candidate?.full_name || 'Parth Rajguru';
  const email   = profile?.candidate?.email || '';
  const phone   = profile?.candidate?.phone || '';
  const linkedin = profile?.candidate?.linkedin || '';
  const portfolio = profile?.candidate?.portfolio_url || '';
  const tableau  = profile?.candidate?.tableau_public_url || '';

  for (const app of ready) {
    const slug = `${String(app.num).padStart(3, '0')}-${app.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const outPath = join(PATHS.coverLetters, `${slug}-cover.md`);

    if (existsSync(outPath)) {
      log.info(`Cover letter already staged: ${slug}-cover.md`);
      staged.push({ ...app, coverPath: outPath });
      continue;
    }

    if (DRY_RUN) {
      log.dry(`Would stage cover letter: ${slug}-cover.md`);
      staged.push({ ...app, coverPath: outPath });
      continue;
    }

    // Generate a structured cover letter template (AI fills specifics during eval)
    const coverContent = `# Cover Letter — ${app.company} / ${app.role}
**Date:** ${TODAY}
**Score:** ${app.score}
**Report:** ${app.report}
**Status:** Staged — review before sending

---

**Subject:** Application — ${app.role}, ${app.company}

Dear Hiring Manager,

[TAILORED OPENING — reference something specific about ${app.company} and this ${app.role} role]

During my time as a Data Reporting Analyst at Anarock Property Consultants in Mumbai, I [MOST RELEVANT EXPERIENCE MAPPED TO THIS ROLE]. This experience maps directly to what you need for this ${app.role} position.

[DIFFERENTIATING SKILL + PROOF — pick the strongest match from: Python/Pandas, Tableau (${tableau}), SQL, Power BI, or ML certifications]

I would welcome the chance to discuss how my background fits ${app.company}'s needs. I am available to interview at your convenience and can start [NOTICE/AVAILABILITY].

${name}
${email} | ${phone}
${linkedin ? `linkedin.com/in/${linkedin.replace(/.*in\//, '')}` : ''}
Portfolio: ${portfolio}
Tableau: ${tableau}

---
_Generated by run.mjs on ${TODAY}. Replace [BRACKETED] sections before sending._
_Run \`/career-ops oferta\` on the report for a fully tailored version._
`;

    writeFileSync(outPath, coverContent, 'utf-8');
    log.ok(`Staged: ${slug}-cover.md`);
    staged.push({ ...app, coverPath: outPath });
  }

  return staged;
}

// ── Step 8: Queue top pipeline items for AI evaluation ───────────────

function queueForEvaluation(pending, apps) {
  log.step('Identifying top pipeline items for evaluation...');

  if (pending.length === 0) {
    log.info('Pipeline is empty — nothing to evaluate.');
    return [];
  }

  // Exclude already evaluated
  const evaluatedKeys = new Set(apps.map(a =>
    `${a.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`.substring(0, 15)
  ));

  const queue = pending
    .filter(item => item.visaFlag !== 'SKIP')
    .filter(item => {
      const co = item.company.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
      return !evaluatedKeys.has(co);
    })
    .slice(0, 5); // Top 5 per day

  if (queue.length > 0) {
    log.ok(`${queue.length} item(s) queued for evaluation`);
    for (const item of queue) {
      log.info(`  → ${item.company || 'Unknown'} | ${item.title || item.url}`);
    }
  } else {
    log.info('All pipeline items already evaluated or visa-blocked.');
  }

  return queue;
}

// ── Step 8b: Optional AI evaluation via claude -p ─────────────────────

async function runAiEvaluation(queue) {
  if (!EVALUATE || queue.length === 0) return;

  log.step(`Running AI evaluation on ${queue.length} role(s) via claude -p...`);
  log.warn('This consumes Claude API tokens. Each evaluation takes ~30-60 seconds.');

  for (const item of queue) {
    log.info(`Evaluating: ${item.company || ''} — ${item.url}`);

    if (DRY_RUN) {
      log.dry(`Would run: claude -p "/career-ops ${item.url}"`);
      continue;
    }

    const prompt = `You are running career-ops auto-pipeline. Evaluate this job posting for Parth Rajguru per the rules in CAREER_SYSTEM.md and modes/_profile.md. URL: ${item.url}. Run all blocks A-G, save the report to reports/, write a tracker TSV to batch/tracker-additions/, and generate a cover letter draft. Do not submit any application.`;

    try {
      const result = spawnSync('claude', ['-p', prompt], {
        cwd: __dirname,
        encoding: 'utf-8',
        timeout: 120_000,
      });
      if (result.status === 0) {
        log.ok(`Evaluated: ${item.url}`);
      } else {
        log.err(`Evaluation failed for ${item.url}: ${result.stderr?.trim()}`);
      }
    } catch (err) {
      log.err(`claude -p not available: ${err.message}`);
      log.info('Install Claude Code CLI to enable --evaluate flag.');
      break;
    }
  }
}

// ── Step 9: Compile daily stats ───────────────────────────────────────

function compileDailyStats(apps, pipeline, scanResult) {
  const byStatus = {};
  for (const app of apps) {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
  }

  const thisWeek = apps.filter(a => {
    const appDate = new Date(a.date);
    const cutoff  = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return appDate >= cutoff;
  });

  const highScore = apps
    .filter(a => parseFloat(a.score) >= 4.0 && a.status === 'Evaluated')
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

  const interviews = apps.filter(a => a.status === 'Interview');
  const offers     = apps.filter(a => a.status === 'Offer');
  const applied    = apps.filter(a => a.status === 'Applied');

  return {
    total: apps.length, byStatus, thisWeek, highScore, interviews, offers, applied,
    newOffers:     scanResult?.newOffers || 0,
    pendingUrls:   pipeline.pending.length,
    scanErrors:    scanResult?.errors || 0,
  };
}

// ── Step 10: Build and send email report ─────────────────────────────

function buildEmailReport(stats, apps, pipeline, staged, evalQueue, pdfPath, profile) {
  const name = profile?.candidate?.full_name || 'Parth Rajguru';

  // ── Plain-text version ──

  const txt = `
Career System Daily Report — ${TODAY}
${'═'.repeat(50)}
Hi ${name.split(' ')[0]},

Here is your daily career system update.

── TODAY'S ACTIVITY ─────────────────────────────
  New roles found by scanner:    ${stats.newOffers}
  Pipeline items pending eval:   ${stats.pendingUrls}
  Scanner errors:                ${stats.scanErrors}

── YOUR PIPELINE ────────────────────────────────
  Total applications tracked:    ${stats.total}
  Active interviews:             ${stats.interviews.length}
  Offers received:               ${stats.offers.length}
  Applied (awaiting response):   ${stats.applied.length}
  Evaluated (decide to apply):   ${stats.byStatus['Evaluated'] || 0}
  This week (all activity):      ${stats.thisWeek.length}

${stats.interviews.length > 0 ? `── ACTIVE INTERVIEWS ────────────────────────────
${stats.interviews.map(a => `  • ${a.company} — ${a.role}`).join('\n')}

` : ''}${stats.offers.length > 0 ? `── OFFERS ───────────────────────────────────────
${stats.offers.map(a => `  • ${a.company} — ${a.role} (${a.score})`).join('\n')}

` : ''}${stats.highScore.length > 0 ? `── READY TO APPLY (score ≥ 4.0, not yet applied) ─
${stats.highScore.slice(0, 5).map(a =>
    `  • ${a.company} — ${a.role} (${a.score})\n    Notes: ${a.notes || 'See report'}`
  ).join('\n\n')}

` : ''}${staged.length > 0 ? `── COVER LETTERS STAGED ─────────────────────────
These are ready to review and send:
${staged.map(a =>
    `  • ${a.company} — ${a.role} (${a.score})\n    Cover letter: output/cover-letters/${String(a.num).padStart(3, '0')}-${a.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cover.md`
  ).join('\n\n')}

` : ''}${evalQueue.length > 0 ? `── PIPELINE: NEXT FOR EVALUATION ────────────────
Run /career-ops pipeline or /career-ops {URL} to evaluate:
${evalQueue.map(item =>
    `  • ${item.company || 'Unknown'} — ${item.title || 'Role TBC'}\n    ${item.url}`
  ).join('\n\n')}

` : ''}${pipeline.pending.length > 0 ? `── FULL PENDING PIPELINE (${pipeline.pending.length} items) ──
${pipeline.pending.slice(0, 10).map(item =>
    `  [ ] ${item.company || ''} ${item.title ? '— ' + item.title : ''}\n      ${item.url}`
  ).join('\n')}${pipeline.pending.length > 10 ? `\n  ... and ${pipeline.pending.length - 10} more in data/pipeline.md` : ''}

` : ''}── PDF STATUS ─────────────────────────────────────
${pdfPath ? `  ✅ CV PDF generated: ${pdfPath}` : '  ⚠️  No PDF generated today (Playwright may not be available)'}

── YOUR ACTION LIST FOR TODAY ───────────────────
  1. Review staged cover letters in output/cover-letters/
  2. Send any ready-to-apply applications (you approve and send — never auto-sent)
  3. Run /career-ops pipeline to evaluate ${evalQueue.length} queued role(s)
  4. Check for email replies and update tracker status
  5. Run /career-ops followup to see overdue follow-ups

── VISA REMINDER ─────────────────────────────────
  Status: Student Visa 500 + 485 application pending
  ⚠️  Always confirm visa eligibility before applying.
  🚫 Auto-skip any role requiring AU Citizenship or PR.

── ETHICAL NOTE ──────────────────────────────────
  This system NEVER submits applications on your behalf.
  Every application is reviewed and sent by you.

${'─'.repeat(50)}
Generated by career-ops/run.mjs on ${TODAY}
Commands: /career-ops {URL} | /career-ops scan | /career-ops pipeline
Tracker: data/applications.md | Pipeline: data/pipeline.md
`.trim();

  // ── HTML version ──

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Career Report — ${TODAY}</title>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #f9f9f9; }
    .card { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    h1 { font-size: 1.4em; margin: 0 0 4px; color: #111; }
    .date { color: #666; font-size: 0.85em; margin-bottom: 20px; }
    h2 { font-size: 0.8em; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 12px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .stat { background: #f4f4f4; border-radius: 6px; padding: 10px 14px; }
    .stat-num { font-size: 1.6em; font-weight: 700; color: #111; }
    .stat-label { font-size: 0.78em; color: #666; }
    .stat.highlight { background: #e8f4e8; }
    .stat.warn { background: #fff8e1; }
    .stat.alert { background: #fdecea; }
    .role-item { border-left: 3px solid #1a6fb5; padding: 8px 12px; margin-bottom: 10px; background: #f7f9fc; border-radius: 0 6px 6px 0; }
    .role-item .company { font-weight: 600; }
    .role-item .score { color: #1a6fb5; font-size: 0.85em; font-weight: 600; }
    .role-item .notes { color: #666; font-size: 0.82em; margin-top: 2px; }
    .role-item.ready { border-left-color: #2e7d32; background: #f1f8f1; }
    .role-item.staged { border-left-color: #e65100; background: #fff8f5; }
    .queue-item { background: #f4f4f4; border-radius: 6px; padding: 8px 12px; margin-bottom: 8px; font-size: 0.85em; }
    .queue-item a { color: #1a6fb5; word-break: break-all; }
    .action-list { padding-left: 20px; }
    .action-list li { margin-bottom: 8px; }
    .visa-box { background: #fff3cd; border-radius: 6px; padding: 12px 16px; font-size: 0.85em; }
    .ethical-box { background: #e8f5e9; border-radius: 6px; padding: 12px 16px; font-size: 0.85em; }
    .footer { text-align: center; font-size: 0.75em; color: #999; margin-top: 20px; }
    .tag { display: inline-block; font-size: 0.72em; padding: 2px 7px; border-radius: 10px; font-weight: 600; margin-left: 6px; }
    .tag.interview { background: #e3f2fd; color: #1565c0; }
    .tag.offer { background: #e8f5e9; color: #2e7d32; }
    .tag.evaluated { background: #f3e5f5; color: #6a1b9a; }
    .pdf-ok { color: #2e7d32; font-weight: 600; }
    .pdf-warn { color: #e65100; }
  </style>
</head>
<body>

<div class="card">
  <h1>📊 Career Report — ${name}</h1>
  <div class="date">${new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

  <h2>Today's Activity</h2>
  <div class="stat-grid">
    <div class="stat ${stats.newOffers > 0 ? 'highlight' : ''}">
      <div class="stat-num">${stats.newOffers}</div>
      <div class="stat-label">New roles found</div>
    </div>
    <div class="stat ${stats.pendingUrls > 0 ? 'warn' : ''}">
      <div class="stat-num">${stats.pendingUrls}</div>
      <div class="stat-label">Pending evaluation</div>
    </div>
  </div>
</div>

<div class="card">
  <h2>Pipeline Overview</h2>
  <div class="stat-grid">
    <div class="stat"><div class="stat-num">${stats.total}</div><div class="stat-label">Total tracked</div></div>
    <div class="stat ${stats.interviews.length > 0 ? 'highlight' : ''}"><div class="stat-num">${stats.interviews.length}</div><div class="stat-label">Active interviews</div></div>
    <div class="stat ${stats.offers.length > 0 ? 'highlight' : ''}"><div class="stat-num">${stats.offers.length}</div><div class="stat-label">Offers received</div></div>
    <div class="stat"><div class="stat-num">${stats.applied.length}</div><div class="stat-label">Applied — awaiting</div></div>
    <div class="stat warn"><div class="stat-num">${stats.byStatus['Evaluated'] || 0}</div><div class="stat-label">Evaluated — decide</div></div>
    <div class="stat"><div class="stat-num">${stats.thisWeek.length}</div><div class="stat-label">This week</div></div>
  </div>
</div>

${stats.interviews.length > 0 ? `
<div class="card">
  <h2>🎯 Active Interviews</h2>
  ${stats.interviews.map(a => `
    <div class="role-item">
      <div class="company">${esc(a.company)} <span class="tag interview">Interview</span></div>
      <div class="notes">${esc(a.role)}</div>
    </div>`).join('')}
</div>` : ''}

${stats.offers.length > 0 ? `
<div class="card">
  <h2>🏆 Offers</h2>
  ${stats.offers.map(a => `
    <div class="role-item ready">
      <div class="company">${esc(a.company)} <span class="tag offer">Offer</span></div>
      <div class="notes">${esc(a.role)} — ${esc(a.score)}</div>
    </div>`).join('')}
</div>` : ''}

${stats.highScore.length > 0 ? `
<div class="card">
  <h2>✅ Ready to Apply (Score ≥ 4.0)</h2>
  ${stats.highScore.slice(0, 5).map(a => `
    <div class="role-item ready">
      <div class="company">${esc(a.company)} <span class="score">${esc(a.score)}</span></div>
      <div class="notes">${esc(a.role)}</div>
      <div class="notes">${esc(a.notes || 'See evaluation report')}</div>
    </div>`).join('')}
</div>` : ''}

${staged.length > 0 ? `
<div class="card">
  <h2>📝 Cover Letters Staged — Review &amp; Send</h2>
  <p style="font-size:0.85em;color:#555;margin-top:0">These applications are prepared. <strong>You review and send.</strong> Never auto-sent.</p>
  ${staged.map(a => `
    <div class="role-item staged">
      <div class="company">${esc(a.company)} <span class="score">${esc(a.score)}</span></div>
      <div class="notes">${esc(a.role)}</div>
      <div class="notes">📄 output/cover-letters/${String(a.num).padStart(3,'0')}-${a.company.toLowerCase().replace(/[^a-z0-9]/g,'-')}-cover.md</div>
    </div>`).join('')}
</div>` : ''}

${evalQueue.length > 0 ? `
<div class="card">
  <h2>🔍 Queue: Run /career-ops to Evaluate</h2>
  ${evalQueue.map(item => `
    <div class="queue-item">
      <strong>${esc(item.company || 'Unknown')}</strong>${item.title ? ' — ' + esc(item.title) : ''}<br>
      <a href="${esc(item.url)}">${esc(item.url)}</a>
    </div>`).join('')}
</div>` : ''}

<div class="card">
  <h2>📋 Today's Action List</h2>
  <ol class="action-list">
    <li>Review staged cover letters in <code>output/cover-letters/</code> and send any that are ready</li>
    <li>Run <code>/career-ops pipeline</code> to evaluate ${evalQueue.length} queued role(s)</li>
    <li>Check email for replies — update tracker status via <code>/career-ops tracker</code></li>
    <li>Run <code>/career-ops followup</code> to see any overdue follow-ups</li>
    <li>Run <code>/career-ops scan</code> again in 2–3 days for fresh roles</li>
  </ol>
</div>

<div class="card">
  <h2>💻 CV PDF</h2>
  ${pdfPath
    ? `<p class="pdf-ok">✅ Generated: <code>${pdfPath}</code></p>`
    : `<p class="pdf-warn">⚠️ No PDF generated today. Run <code>node run.mjs --evaluate</code> or <code>/career-ops pdf</code> to generate.</p>`}
</div>

<div class="visa-box">
  <strong>⚠️ Visa Status:</strong> Student Visa (subclass 500) + 485 application pending<br>
  Always confirm visa eligibility before applying. Auto-skip any role requiring Australian Citizenship or PR.
</div>

<br>

<div class="ethical-box">
  <strong>✅ Ethical Note:</strong> This system never submits applications on your behalf.
  Every application is reviewed and sent by you.
</div>

<div class="footer">
  Generated by career-ops/run.mjs · ${TODAY}<br>
  Commands: /career-ops {URL} &nbsp;|&nbsp; /career-ops scan &nbsp;|&nbsp; /career-ops pipeline<br>
  Files: data/applications.md &nbsp;|&nbsp; data/pipeline.md &nbsp;|&nbsp; output/cover-letters/
</div>

</body>
</html>`;

  return { txt, html };
}

// ── Step 11: Write report payload for Gmail MCP draft ────────────────
//
// This script does NOT send email directly. Instead, it writes a
// structured JSON payload to output/daily-report-{date}.json.
//
// After run.mjs exits, the AI agent (Claude) reads this file and calls
// the Gmail MCP create_draft tool to create a draft in Gmail.
// You then review the draft in Gmail and click Send.
//
// This avoids all SMTP credential management. The Gmail MCP connector
// is already authenticated in the Claude Code session.

function writeReportPayload(subject, txt, html, toAddress) {
  log.step('Writing report payload for Gmail MCP draft...');

  const htmlPath  = join(PATHS.output, `daily-report-${TODAY}.html`);
  const jsonPath  = join(PATHS.output, `daily-report-${TODAY}.json`);

  const payload = {
    to:        toAddress,
    subject,
    bodyHtml:  html,
    bodyText:  txt,
    createdAt: new Date().toISOString(),
    instruction: [
      'AI AGENT: Read this file after run.mjs exits.',
      'Call the Gmail MCP create_draft tool with the fields above.',
      'to: the "to" field',
      'subject: the "subject" field',
      'body: the "bodyText" field (plain text is safest for MCP draft)',
      'After creating the draft, confirm to the user and remind them to',
      'open Gmail, review the draft, and click Send.',
    ].join(' '),
  };

  if (DRY_RUN) {
    log.dry(`Would write HTML report to: ${htmlPath}`);
    log.dry(`Would write JSON payload to: ${jsonPath}`);
    log.dry(`  to:      ${toAddress}`);
    log.dry(`  subject: ${subject}`);
    return { htmlPath, jsonPath };
  }

  writeFileSync(htmlPath, html, 'utf-8');
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf-8');

  log.ok(`HTML report:    ${htmlPath}`);
  log.ok(`Gmail payload:  ${jsonPath}`);
  log.info('AI agent will call Gmail MCP create_draft after this script exits.');

  return { htmlPath, jsonPath };
}

// ── Main orchestrator ─────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(52)}`);
  console.log(`  career-ops daily runner — ${TODAY}`);
  if (DRY_RUN) console.log('  MODE: DRY RUN — no files will be written');
  console.log(`${'═'.repeat(52)}`);

  // Load config
  const profile = loadProfile();
  const candidateName  = profile?.candidate?.full_name || 'Parth Rajguru';
  const reportEmail    = 'parthrajguru290803@gmail.com';

  // ── Run all steps ──

  const scanResult   = await runScan();
  runMergeTracker();
  const apps         = parseApplications();
  const pipeline     = parsePipeline();
  pipeline.pending   = visaScreen(pipeline.pending);
  const pdfPath      = await generateCvPdf(profile);
  const staged       = stageCoverLetters(apps, profile);
  const evalQueue    = queueForEvaluation(pipeline.pending, apps);

  await runAiEvaluation(evalQueue);

  // Refresh apps after potential AI evaluation
  const finalApps    = parseApplications();
  const stats        = compileDailyStats(finalApps, pipeline, scanResult);

  // Build report and write payload for Gmail MCP
  const subject        = `Career Report ${TODAY} — ${stats.newOffers} new roles, ${stats.pendingUrls} pending, ${stats.interviews.length} interviews`;
  const { txt, html }  = buildEmailReport(stats, finalApps, pipeline, staged, evalQueue, pdfPath, profile);
  const { jsonPath }   = writeReportPayload(subject, txt, html, reportEmail);

  // ── Final console summary ──

  console.log(`\n${'═'.repeat(52)}`);
  console.log('  Daily run complete');
  console.log(`${'═'.repeat(52)}`);
  console.log(`  New roles found:      ${stats.newOffers}`);
  console.log(`  Pending evaluation:   ${stats.pendingUrls}`);
  console.log(`  Total tracked:        ${stats.total}`);
  console.log(`  Interviews:           ${stats.interviews.length}`);
  console.log(`  Offers:               ${stats.offers.length}`);
  console.log(`  Cover letters staged: ${staged.length}`);
  console.log(`  PDF generated:        ${pdfPath ? 'Yes' : 'No'}`);
  console.log(`  Report payload:       output/daily-report-${TODAY}.json`);
  console.log('');
  console.log('  ── Gmail MCP next step ──────────────────────────');
  console.log(`  The AI agent will now read output/daily-report-${TODAY}.json`);
  console.log(`  and call Gmail MCP create_draft to queue your report`);
  console.log(`  as a draft in Gmail (to: ${reportEmail}).`);
  console.log('  Open Gmail, review the draft, and click Send.');
  console.log('');
  console.log('  ── Other next steps ─────────────────────────────');
  console.log('    → Review output/cover-letters/ and send ready applications');
  console.log('    → Run /career-ops pipeline to evaluate queued roles');
  console.log('    → Run /career-ops followup to check overdue follow-ups');
  if (EVALUATE) {
    console.log('    → AI evaluations completed for queued pipeline items');
  } else if (evalQueue.length > 0) {
    console.log(`    → Run node run.mjs --evaluate to auto-evaluate ${evalQueue.length} queued role(s)`);
  }
  console.log('');

  // ── Signal to AI agent: create Gmail draft ──
  // This sentinel is read by the Claude Code post-run hook (if configured)
  // or picked up by the AI agent watching for this output.
  console.log(`__CAREER_OPS_GMAIL_DRAFT__:${jsonPath}`);
}

main().catch(err => {
  log.err(`Fatal error: ${err.message}`);
  if (process.env.DEBUG) console.error(err);
  process.exit(1);
});

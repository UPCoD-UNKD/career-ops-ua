#!/bin/bash
# scripts/overnight-run.sh
# Chains: /career-ops scan -> /career-ops pipeline -> cleanup -> verify
# Called by the GitHub Actions workflow AND runnable locally.
# Requires: @anthropic-ai/claude-code CLI installed and ONE of:
#   - CLAUDE_CODE_OAUTH_TOKEN (Claude.ai Pro/Max subscription, generated via `claude setup-token`)
#   - ANTHROPIC_API_KEY       (Anthropic Console account)

set -u
ERRLOG="data/overnight-errors.log"
mkdir -p data
TS=$(date -u +%Y-%m-%dT%H:%MZ)

log() { echo "[overnight $TS] $*"; }
record_err() { echo "[$(date -u +%Y-%m-%dT%H:%MZ)] $*" >> "$ERRLOG"; }

# Step 1: Level 1/2 scan (zero-token, fast). Safe to re-run.
log "Step 1/4: node scan.mjs"
node scan.mjs || { record_err "scan.mjs failed"; true; }   # non-fatal; pipeline may still have pending URLs

# Step 2: Pipeline processing via Claude Code CLI.
# Claude reads pipeline.md Pendientes, evaluates with full A-H, generates PDFs for score >= 3.0,
# moves entries to Procesadas, merges tracker.
log "Step 2/4: /career-ops pipeline via claude -p"
PROMPT=$(cat <<'EOF'
You are running the overnight career-ops pipeline routine. Execute in this exact order:

1. Read data/pipeline.md Pendientes. If empty, skip to step 4.
2. Take up to 10 URLs from Pendientes (prioritize any dated section that is newest).
3. Run the full pipeline flow per modes/pipeline.md + modes/_profile.md for those URLs:
   - Extract JD (Ashby = GraphQL; others = WebFetch)
   - Write report to reports/{NNN}-{slug}-{date}.md with mandatory header (Fecha, Arquetipo, Score, URL, Legitimacy, Location, PDF)
   - Full A-H blocks per modes/oferta.md
   - TSV to batch/tracker-additions/{NNN}-{slug}.tsv
   - PDF to output/{date}/cv-deepak-mallampati-{slug}-{date}.pdf if score >= 3.0
   - Move entry to Procesadas under ### {date} with Location column
4. Run: node merge-tracker.mjs && node verify-pipeline.mjs && node cleanup-low-scores.mjs
5. Print a one-line summary: N evaluated, M PDFs generated, K below-threshold archived.

HARD RULES:
- NEVER invent metrics or credentials
- NEVER edit cv.md or config/profile.yml
- Do NOT git push (GitHub Actions handles it after this step)
- If any URL fails to extract, mark the entry "- [!] {url} | error: ..." in pipeline.md Pendientes and continue

Go.
EOF
)

claude -p "$PROMPT" 2>&1 | tee -a "$ERRLOG" || { record_err "claude pipeline step failed"; exit 1; }

# Step 3: Defensive cleanup in case claude missed it
log "Step 3/4: node cleanup-low-scores.mjs"
node cleanup-low-scores.mjs || { record_err "cleanup-low-scores.mjs failed"; true; }

# Step 4: Verify integrity
log "Step 4/4: node verify-pipeline.mjs"
node verify-pipeline.mjs || { record_err "verify-pipeline.mjs reported errors"; exit 1; }

log "Done."

@AGENTS.md
<!-- Add anything Claude Code specific that other agents don't need -->

## Tonight / first-thing pointer

If the user is sitting down to build application materials → open `data/TODAY.md` first (master nav), then `data/APPLY-NOW.md` (ranked queue), then follow `data/HOW-TO-APPLY.md`. Pre-flight via `data/pre-flight-checklist.md` before submitting.

## Session Notes — 2026-05-08 (cost reduction autonomous run — phases 5–6)
- TRIAGE_PROVIDER_PRIORITY env var controls routing order (default: local,anthropic,gemini)
- lib/provider-client.mjs: circuit breaker (3 failures → 5min cooldown) + exponential backoff with 10–30% jitter
- gemini-eval.mjs --mode=triage: Gemini Flash triage fallback with JSON output + temp=0

## Session Notes — 2026-05-07 (overnight autonomous run)
- Em dash (—) established as formatting convention for all LinkedIn experience entries
- Trans military panel attribution corrected: HuffPost Live (Marc Lamont Hill host), NOT AJ+. File renamed accordingly.
- heartbeat.mjs sends via Gmail SMTP/nodemailer — do NOT use Gmail MCP compose for heartbeats
- Batch launchd schedule updated: 03:00 PT → 08:05 PT (post Claude Max quota reset)
- verify-pipeline.mjs now gates merge-tracker — fix any validation errors before merging
- Voice reference file added: writing-samples/voice-reference.md
- 2026-05-07 evening QA pass: `data/TODAY.md`, `data/APPLY-NOW.md`, `data/HOW-TO-APPLY.md`, `data/pre-flight-checklist.md`, `templates/cover-letter-template.md`, `interview-prep/story-bank.md` (10 STAR+R stories), 8 corpus/companies stubs, `scripts/build-apply-pack.mjs`, `scripts/apply-pending-diff.mjs`, `scripts/grok-research.mjs`, heartbeat patched with "Tonight's Top 5" action-cut section, 13 fresh apply-packs pre-built for the apply-now queue (20 total).

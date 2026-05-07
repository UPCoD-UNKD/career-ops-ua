# OVERNIGHT AUTONOMOUS CAREER-OPS RUN — FINAL v2
# Working directory: /Users/mitchellwilliams/Documents/career-ops
# Runtime window: ~22:15 PT May 6 → 08:00 PT May 7, 2026 (~6–7 hours)
# Heartbeat fires at 09:00 PT via launchd — finish by 08:00 PT
# User is asleep. Do NOT ask questions. Make decisions. Write decisions down.

---

## PRE-COMPLETED IN PRIOR SESSION — mark ✅ in the change report, DO NOT re-implement

| Item | What was done | File |
|------|--------------|------|
| **6A** — Batch schedule 08:05 PT | `Hour: 3 → 8, Minute: 5` applied; `launchctl` reloaded; verified with `launchctl list` | `~/Library/LaunchAgents/com.mitchell.career-ops.batch.plist` |
| **6E** — Score regex multi-pattern | `grep -oE` with both `SCORE:` (Gemini) and `**Score:**` (Claude) patterns; handles both worker types | `batch/batch-runner.sh` line ~376 |
| **Gemini fallback** — `--engine gemini` | `batch-runner.sh --engine gemini` flag wired; `gemini-eval.mjs` accepts `--url`, `--report-num`, `--id`, `--date`, `--batch`; fetches JD via Node `fetch()`; loads `article-digest.md`; writes TSV to `batch/tracker-additions/` | `gemini-eval.mjs`, `batch/batch-runner.sh` |
| **Grok spend cap TOCTOU fix** | Replaced `checkSpendCap()` + `logSpend()` with single O_EXCL atomic lock covering the full read-check-write critical section; stale-lock reclaim via `process.kill(pid, 0)` | `scripts/grok-social-intel.mjs` |

---

## HOW TO OPERATE THIS SESSION FOR SUCCESS

You are running a long autonomous session. Here is exactly how to avoid the failure modes:

**1. START WITH TODOWRITE.** The very first action must be to call TodoWrite and create your full task list. Update it as you complete each task. This is your ground truth — without it, you will lose track across tool calls.

**2. GIT COMMIT AFTER EVERY PHASE.** After each phase completes, run:
```
cd /Users/mitchellwilliams/Documents/career-ops && git add -A && git commit -m "overnight: complete phase N — [description]"
```
This preserves work. If a later phase fails, nothing from earlier is lost.

**3. READ BEFORE YOU WRITE. ALWAYS.** Before editing any file, use the Read tool. Never edit from memory. LinkedIn character counts are in the Read output, not in your context.

**4. CHECKPOINT AFTER EACH PHASE.** When a phase completes, run `date` and update `data/overnight-change-report-2026-05-07.md` with a 3-sentence summary of what was done. Do NOT rely on clock times — checkpoint after completion, not after elapsed time. The change report must always reflect current state.

**5. TIME-BOX EACH PHASE.** If a phase is taking longer than estimated, write what you have, commit, and move on. Depth on 6 phases beats perfection on 2.

**6. NEVER FABRICATE METRICS.** If you can't verify a citation with WebSearch, write "UNVERIFIED — requires manual lookup" and move on. Do not estimate or fill in.

**7. PREFER SMALL TARGETED EDITS OVER REWRITES.** Use the Edit tool for surgical changes. Full rewrites risk overwriting valid content.

**8. THE CHANGE REPORT IS THE DELIVERABLE.** Mitchell reads exactly one thing in the morning. Everything else is infrastructure. Make the change report excellent.

**9. PROTECT CONTEXT — DO NOT READ LARGE FILES IN FULL.** For any file over 100 lines, use Bash grep to extract only what you need. Examples:
- `grep -n 'proof_point\|metric\|award\|viewers\|million' article-digest.md | head -40` — targeted proof point extraction
- `grep -A 10 'video_verified' config/profile.yml` — extract a specific section
- `sed -n '14,38p' cv.md` — extract specific known line ranges
Full reads of 400–700 line files burn context that never recovers. Grep first, read-in-full only if grep is insufficient.

**10. USE AGENT SUBAGENTS FOR INTENSIVE PHASES — this is the single most important rule for quality.** Each subagent gets a fresh, clean context window. Use the Agent tool to delegate Phase 4, Phase 5, Phase 6, and Phase 7 as subagents. Pattern:

```
Agent({
  description: "Phase 4 — LinkedIn experience rewrites",
  prompt: "Working in /Users/mitchellwilliams/Documents/career-ops. [paste Phase 4 instructions verbatim]. 
  Read cv.md and config/profile.yml first. Write output to data/linkedin-experience-rewrites-2026-05-07.md. 
  Use wc -m for character counts. Report: list of entries written with char counts."
})
```

Why this matters: after 2 hours of Phase 0+4 work, the main context has accumulated 150k+ tokens. Delegating Phase 5 to a subagent means Phase 5 starts fresh — the narrative thread is written with the same quality as if it were the first task of the day. This is the difference between a 65% run and a 90%+ run.

**Subagent delegation order:** delegate Phase 4, wait for result + commit. Delegate Phase 5, wait + commit. Delegate Phase 6 (split into 6B-6G and 6H-6N if needed). Delegate Phase 1. Delegate Phase 2+3 together. Delegate Phase 7. Write Phase 8 in the main context (it's a synthesis task, benefits from full history).

**11. IF CONTEXT FEELS DEGRADED AND YOU CANNOT USE /compact — stop work, write progress to change report, commit, and continue the next phase as a subagent.** Signs of context rot: losing track of metrics read earlier, shorter responses, re-reading files already read. Do not push through on degraded context.

---

## PRIME DIRECTIVE

Mitchell Williams is positioning for frontier AI companies (Anthropic, xAI, OpenAI, Google DeepMind, Mistral, Sierra) in roles at the intersection of AI systems, communications architecture, and engineering enablement.

Central thesis — this must be coherent across EVERY document you touch:
> "Mitchell built the infrastructure before the category existed — in broadcast media (2010–2018), then in AI (2018–present). The Stream's social integration layer → RLHF-style audience feedback loops → AJ+'s structured format engineering → Google xGE's production AI agents. The instinct is identical. Only the layer has moved."

Every edit reinforces this. Nothing contradicts it.

---

## FILE MAP (read these first, in parallel)

| File | Purpose |
|------|---------|
| `cv.md` | Source of truth for all metrics — never contradict it |
| `config/profile.yml` | Full positioning, proof points, video credits |
| `article-digest.md` | Detailed proof points (686 lines — read it fully) |
| `data/industry-impact-document.md` | The industry narrative document |
| `data/linkedin-qa-report-2026-05-06.md` | 15 specific LinkedIn fixes with ready-to-paste copy |
| `data/ajp-confirmed-metrics.md` | Verified AJ+ video metrics |
| `data/press-references.md` | Citation tracking — append new finds here |
| `data/archive-research-strategy.md` | Citation retrieval strategy |
| `data/grok-prompt-industry-impact.md` | Grok research base |
| `data/industry-impact-grok-research.md` | Grok strategic framework |
| Transcripts: `/Users/mitchellwilliams/Downloads/VIDEOS/transcripts/` | Primary source evidence |

---

## PHASE 0 — ORIENTATION (15 min, do this FIRST)

1. Call TodoWrite with all phases in **execution order** (see EXECUTION ORDER below) — status: pending
2. Read cv.md and config/profile.yml IN PARALLEL. Then: `grep -n 'proof_point\|metric\|award\|viewers\|million\|on.air\|credit' article-digest.md | head -50` — do NOT read article-digest.md in full yet.
3. Read data/linkedin-qa-report-2026-05-06.md (this is your Phase 4 punch list)
4. Run: `cd /Users/mitchellwilliams/Documents/career-ops && git status && git log --oneline -5`
5. **Verify transcript path:** `ls ~/Downloads/VIDEOS/transcripts/*.txt 2>/dev/null | head -10` — if empty, note "TRANSCRIPTS NOT FOUND" in change report and skip Phase 2.
6. Write `data/overnight-change-report-2026-05-07.md` with full header + all phase checkboxes pre-populated (not just a stub — write the Phase 6 checkbox table from the template now, so it exists and can be ticked during the run).
7. Mark Phase 0 complete in TodoWrite

Do NOT proceed until all 7 steps are done.

---

## ORCHESTRATOR PROTOCOL — you delegate, you do not execute

Your primary role in this session is ORCHESTRATION. You execute Phase 0 yourself in the main context. Every other phase is delegated to a fresh Agent subagent. Each subagent starts with ~5k tokens of context instead of the 300k+ tokens this main context accumulates over 7 hours. That is why this works.

**DELEGATION LOOP — repeat this exact pattern for every phase after Phase 0:**
```
1. Spawn Agent subagent using the exact template from SUBAGENT CALL TEMPLATES (bottom of this file)
2. Wait for the subagent to return its summary
3. Verify output: ls -la [output-file] && head -5 [output-file]
4. Git commit: git add -A && git commit -m "overnight: phase N complete — [1-line summary]"
5. Update change report: append 3 sentences on what was done and what file was created
6. Mark TodoWrite task complete
7. Spawn next subagent
```

**FAILURE PROTOCOL — never halt on a single failure:**
If a subagent fails or its output file is missing:
- Write `[Phase N] SUBAGENT FAILED — [reason]` to change report
- Run `git add -A && git commit -m "overnight: phase N — failed/partial, continuing"`
- Proceed to next phase immediately
- Document the failure; do not retry unless there are more than 90 min remaining

**WHAT YOU DO IN THE MAIN CONTEXT:**
- Phase 0: orientation (yourself)
- Phase 8: change report finalization (yourself — this benefits from full session history)
- Git commits after each phase
- Change report updates after each phase
- TodoWrite tracking

**WHAT SUBAGENTS DO:**
Everything else. Each subagent reads only what it needs for its phase and returns a tight summary.

---

## EXECUTION ORDER — follow this, not document order

The phases are documented in thematic order but must be executed in this priority order — highest-career-value work first, research work after the deliverables are secured:

```
Phase 0  → Phase 4 → Phase 5 → Phase 6 → Phase 1 → Phase 2 → Phase 3 → Phase 7 → Phase 8
(orient)   (LinkedIn) (narrative) (system)  (citations) (transcripts) (impact doc) (GitHub) (report)
```

**Why this order:**
- Phase 4 (LinkedIn rewrites) is the highest-career-value deliverable. It must be done while context is clean and fresh — not 4 hours in.
- Phases 5 and 6 are generative/technical — they don't depend on citation research.
- Phases 1–3 are research-dependent and may partially fail. They strengthen deliverables but are not the deliverables.
- Phase 7 (GitHub) has external auth risk — last before the report.
- If the session is cut short at any point, Phase 4 + Phase 5 + Phase 6 are in hand.

---

## PHASE 1 — CITATION RETRIEVAL (Target: 45 min HARD CAP — execute AFTER Phases 4/5/6)

**STOP-LOSS RULE: These citations are from 2014–2015. Many are paywalled or relocated. If the first 2 search queries for any citation return nothing usable, try ONE archive.org search, then write NOT FOUND and move on immediately. Total budget for all 4 citations combined: 45 minutes. Do not exceed this.** Citation failure does not block Phases 2 or 3.

These citations convert the industry-impact document from "Mitchell says so" to "independently verified." Use WebSearch. Use archive.org only as last resort per the stop-loss rule above.

### Citation A: Pew Research 2014 — HuffPost Live
Search queries to try in sequence:
- `"Pew Research" "State of the News Media" 2014 "HuffPost Live"`
- `"Pew Research Center" 2014 "HuffPost Live" unique visitors`
- `site:journalism.org 2014 "HuffPost Live"`
- `archive.org "pewresearch.org" 2014 news media huffpost live`

What to capture: exact platform stats (monthly unique visitors, stream hours, launch date), exact publication (Pew Research Center, State of the News Media 2014), exact URL or archive URL.

If found: append to `data/press-references.md` under `## PEW 2014 — HUFFPOST LIVE`
If not found after 4 search attempts: write `## PEW 2014 — NOT FOUND` with the queries tried, move on.

### Citation B: Variety June 2015 — AJ+ Facebook Video Rank
Search queries:
- `Variety 2015 "AJ+" "second-largest" Facebook video`
- `Variety June 2015 AJ Plus Facebook news video producer`
- `"Al Jazeera" digital "second largest" Facebook video 2015 site:variety.com`
- `AJ+ Facebook 2015 largest news video producer Variety`

What to capture: article headline, author, exact date, URL, the exact phrase used.

### Citation C: Webby Awards — HuffPost Live + AJ+
Search queries:
- `"Webby Awards" "HuffPost Live" "Best News" winner`
- `site:webbyawards.com "HuffPost Live"`
- `"Webby Awards" 2013 OR 2014 "HuffPost Live" "internet broadcast"`
- `"Webby Awards" "AJ+" winner OR honoree`
- `"Murrow Award" "AJ+" "Al Jazeera"`

What to capture: exact category name, year, winner or honoree designation.

### Citation D: Editorial Lead-Time Verification
Use WebSearch to verify these independently:
- TLC "I Am Jazz" series premiere date (verify: was it 2014 or 2015?)
- Pentagon transgender military policy reversal (verify: was it June 2016?)
- When did mainstream medical media first cover PrEP/Truvada for the general public? (verify the ~2013–2014 timeframe)

Write a verified timeline table to `data/press-references.md` under `## EDITORIAL LEAD-TIME VERIFICATION`.

**After Phase 1:** Git commit. Update change report.

---

## PHASE 2 — TRANSCRIPT MINING (Target: 60–75 min)

Read these specific transcripts to surface unreported evidence. Read the .txt versions (not .json):

Priority transcripts at `/Users/mitchellwilliams/Downloads/VIDEOS/transcripts/`:
1. `AJP-OR-FUSION_2014_Hong-Kong-OccupyCentral-Live-Coverage_Live-Coverage_15m7s.txt` — find the verbatim Mariana Atencio "backpack" credit
2. `AJE-STREAM_2011_Global-Reactions-Bin-Laden-Death-Bahrain_Live-Coverage_45m11s.txt` — find any live workflow descriptions, editorial decisions, social signal references
3. `AJE-STREAM_2011-2012_What-Is-The-Way-Forward-In-Bahrain_Panel-Discussion_39m4s.txt` — this is the RTS-cited episode; find any production workflow descriptions
4. Any transcript containing "Jazz" or "trans" — verify the episode context and any on-air credits
5. `AJE-STREAM_2011_Lilianne-Khalil-Twitter-Hoax-Wenzhou-Train-Crash_Live-Panel_24m59s.txt` — find real-time social media workflow descriptions

For each transcript, extract:
- Any verbatim on-air credit mentioning Mitchell Williams
- Any description of the live production workflow (real-time social integration, multi-platform, etc.)
- Any editorial decision that demonstrates early signal detection

Write findings to: `data/transcript-analysis-new-findings-2026-05-07.md`
Format each finding as:
```
## [Filename]
**Timestamp / context**: [where in transcript]
**Verbatim quote**: "[exact words]"
**Significance**: [why this matters for the thesis]
**Use in**: [which document this belongs in]
```

**After Phase 2:** Git commit. Update change report.

---

## PHASE 3 — INDUSTRY IMPACT DOCUMENT UPGRADE (Target: 45–60 min)

Read `data/industry-impact-document.md` fully first.

Then make these targeted upgrades:

1. **Back it up first**: Copy to `data/industry-impact-document-backup-2026-05-06.md`

2. **Add all citations found in Phase 1** to the Validation Sources table at the bottom. If a citation wasn't found, do NOT add a placeholder — leave the table as-is and note in the change report.

3. **Add verbatim evidence from Phase 2** to the relevant Primitive sections. Use exact quotes in italics. Add a parenthetical source reference: *(Source: AJE-STREAM_2011_Global-Reactions...txt, timestamp: XX:XX)*

4. **Sharpen the Translation to AI Systems section** using the exact Grok framing:
   - The Stream's social integration layer → real-time multimodal data ingestion and synthesis at broadcast speed
   - HuffPost Live's audience feedback loop → RLHF / human-in-the-loop feedback architectures
   - AJ+'s structured explainer format → LLM output formatting and structured response primitives
   
5. **Add the editorial lead-time pattern** if not present: exact verified dates for Jazz (HuffPost Live → TLC), trans military panel (2012 → 2016 Pentagon), PrEP (2013 → mainstream).

6. **Verify the document does not exceed ~900 words** — it's designed as a 2-page PDF. Trim if needed.

Do NOT restructure the document. Make surgical edits only.

**After Phase 3:** Git commit. Update change report.

---

## PHASE 4 — LINKEDIN EXPERIENCE REWRITES (Target: 75–90 min)

### The Standard
Every LinkedIn experience description uses **em dash (—)** as the lead character. Never bullets, never arrows, never asterisks. Format: `— [past-tense action verb] [object] — [metric/outcome]`

All metrics must match cv.md or config/profile.yml exactly. LinkedIn's character limit is 2,000 per entry. Count every entry.

Write ALL rewritten entries to: `data/linkedin-experience-rewrites-2026-05-07.md`

Format each entry clearly:
```
## [Role Title] | [Company] | [Dates]
**Character count:** XXX/2000
**LinkedIn-ready copy:**
[full text]
```

### PHASE 4 PRIORITY STACK — if time runs short, complete in this order:
1. **Entry #7 (The Stream)** — currently F-grade on LinkedIn, doesn't exist as an entry. Highest urgency.
2. **Entry #1 (Google xGE)** — most recent, most relevant to frontier AI targeting. Second priority.
3. **About section fixes** — three surgical changes, 10 minutes, highest visibility-to-effort ratio.
4. **Entry #2 (CorpEng)** — critical 88% metric correction.
5. **Entries #3–6** — valuable but lower urgency than above.

### CHARACTER COUNT METHODOLOGY — use this for every entry:
Write the entry text to `/tmp/li-entry-N.txt`, then run: `wc -m /tmp/li-entry-N.txt`
Do not estimate character counts. Do not count manually. Always use wc -m.
LinkedIn truncates at 210 chars on mobile — ensure the lead metric appears in the first 200 chars.

### Entries to write (in this order):

**1. Google xGE — Internal Communications Lead, Program Manager (Jun 2024–present)**
Lead line (must appear before truncation): Surface the Comms Triage Agent metrics.
Use: cv.md lines 14–38, config/profile.yml proof_points.
Required metrics: ~160 ops hrs/yr, >90% classification accuracy, ~1,000 senior ICs, 90% drafting latency reduction, 99% stylistic fidelity, 300%+ deployment-capacity scaling, 3.5 hrs → 20 min/match.

**2. Google CorpEng — Senior Communications & Content Manager (Apr 2018–Jun 2024)**
Lead line: 75,000+ new hires OR 9,000 machines in one week.
Fix the "88% autonomous same-day provisioning" error — the correct metric is "88% of participants successfully provisioned their own corporate hardware autonomously within the first 24 hours" (per cv.md).
Use: cv.md lines 40–58.

**3. AJ+ — Senior Producer (2016–2018)**
Lead line: 50M views (measles video) — NOT "200M total views."
Company name: AJ+ (not "Al Jazeera").
Do NOT include trans military ban — that is HuffPost Live content.
Use: data/ajp-confirmed-metrics.md for exact video metrics.

**4. Fusion / FYI TV — Producer (approx 2013–2016)**
Include: Hong Kong backpack credit (Mariana Atencio on-air verbatim from config/profile.yml), Mandela special (44-min live primetime, Dec 5 2013).
Use: config/profile.yml narrative.video_verified.fusion section.

**5. HuffPost Live — Segment Producer (2012–2013)**
Include: both on-air credits verbatim (PrEP segment, Gellar segment).
Include: Jazz episode (2 years before TLC), trans military panel (4 years before Pentagon), PrEP (6 months before mainstream).
Include: Jada Pinkett Smith, Angela Davis, Kelly Rowland, Sarah Michelle Gellar, Maryam Al-Khawaja (FP Top 100 #48).
Use: config/profile.yml narrative.video_verified.huffpost_live section.

**6. CNN — Writer/Producer, New Day**
Simple fix: title must read "Writer/Producer, CNN New Day" (add "New Day").

**7. Al Jazeera English / The Stream — Associate Producer (May 2010–May 2011)**
This entry may not exist on LinkedIn (QA report gives it F grade).
Write it ready-to-paste as a new entry.
Include: founding AP, 250M household launch, May 2 2011 (bin Laden night), @ReallyVirtual live tweet graphing (751→59,000 followers), RTS Most Innovative Programme 2012.
Use: config/profile.yml + data/industry-impact-document.md.

### About Section Fixes (also in this file)

Three surgical fixes to the About section per the QA report:
1. Change "88% autonomous same-day provisioning" → "88% of participants provisioned their own hardware autonomously in the first 24 hours"
2. Replace "Currently exploring" with: "I'm looking for roles at frontier AI companies where technical depth, communication architecture, and builder instinct converge — specifically communications, DevRel, AI enablement, and engineering editorial lead positions where shipping is as important as storytelling."
3. After "Three production AI agents shipped...": add "One — a Communications Triage Agent — recaptured ~160 ops hours/year at >90% accuracy. A second built a Voice DNA pipeline delivering 99% stylistic fidelity for VP-level communications at scale."

**After Phase 4:** Git commit. Update change report.

---

## PHASE 5 — CAREER NARRATIVE THREAD (Target: 45–60 min)

Write `data/career-narrative-thread-2026-05-07.md`.

This is Mitchell's private analytical map — the "connection document" for interviews, networking, and future AI agent context. It is NOT a CV. It is the intellectual through-line that makes this a coherent career instead of a random sequence of jobs.

Structure (write exactly this):

```markdown
# The Career Narrative Thread — Mitchell Williams
*Private working document — interviews, networking, AI agent context*

## The Thesis
[One paragraph. State it as plainly as possible. No jargon. What would you say
if you had 60 seconds with an Anthropic hiring manager in an elevator?]

## 2010–2011: The Stream — Social Integration Layer
[What was built. Why it was pioneering. What it maps to in AI today.
Source: industry-impact-document.md, transcript evidence from Phase 2.]

## 2012–2013: HuffPost Live — Real-Time Feedback Loop
[Same structure. Cite: Webby Awards, Pew Research if found in Phase 1.]

## 2013–2016: Fusion / FYI TV — Agile Live Production Under Pressure
[Same structure. Lead with Hong Kong backpack, Mandela special.]

## 2016–2018: AJ+ — Structured Format Engineering
[Same structure. Lead with 50M views, Variety citation if found.]

## 2018–2024: Google CorpEng — Enterprise Communications at Scale
[Same structure. Lead with 75K new hires, 9K machines/week.]

## 2024–Present: Google xGE — AI Agent Infrastructure
[Same structure. Lead with Comms Triage Agent, Voice DNA, Mentorship Platform.]

## The Pattern: Pre-Category Infrastructure
[One analytical paragraph explaining WHY this is coherent. What does a senior
engineer at Anthropic see when they read this arc? Write it as if you're
briefing a headhunter who has 3 minutes to understand why this candidate is rare.]

## Interview Talking Points (one sentence per period, spoken delivery)
1. The Stream: ...
2. HuffPost Live: ...
3. Fusion: ...
4. AJ+: ...
5. CorpEng: ...
6. xGE: ...

## Objection Handlers
[Three common objections and how to address them. Based on the GitHub analysis:
"Not a traditional engineer" / "Journalism background" / "No ML research"]
```

Every claim must cite its source file in parentheses.

**After Phase 5:** Git commit. Update change report.

---

## PHASE 6 — CAREER-OPS SYSTEM UPGRADES (Target: 75–90 min)

Grok identified 50 production hacks. Tonight implement the 12 highest-ROI items. Do them in order — each is small, targeted, reversible. Read before every Edit. Read the actual file before assuming line numbers.

### TIER 1 — Scheduling & Quota (implement first, ~20 min)

~~**6A. Batch quota scheduling: 03:00 → 08:05 PT**~~ **✅ DONE — skip.**
Applied in the prior session and verified. Do not re-apply.

**6B. Pre-batch quota-check probe (Grok Hack #3)** — [LOWER PRIORITY: Gemini fallback (`--engine gemini`) handles quota exhaustion more gracefully. Implement 6B only if time remains after 6C–6N.]
Files to read first: `scripts/batch-runner-unattended.mjs` (what launchd invokes — Node.js) and `scripts/batch-runner-unattended.sh` (bash equivalent). The quota probe in Node.js would use `spawnSync('claude', ['-p', 'respond with OK'])` and check stderr for rate-limit strings. Add it in `scripts/batch-runner-unattended.mjs` just before the `batch-runner.sh` spawn.
Why: Fast early-abort prevents workers from spinning and failing silently on quota exhaustion.

**6C. Batch-in-flight lock before update-system.mjs (Grok Hack #39)**
File: `update-system.mjs` — read it first.
Find where the update begins. Add a check at the top:
```javascript
if (existsSync(join(ROOT, 'batch/.batch-running'))) {
  console.log('Batch in progress — update deferred. Run again after batch completes.');
  process.exit(0);
}
```
Why: Prevents mid-batch update corruption.

### TIER 2 — Validation & Quality Gates (~25 min)

**6D. Post-worker content validation — A-G block presence (Grok Hack #13)**
File: `batch/batch-runner.sh` — in the `process_offer()` function, after the `if [[ $exit_code -eq 0 ]]` branch (around line 372). Read the file first.
After a worker writes its report, add a validation check before marking complete:
```bash
# Validate report has required blocks A through G
REPORT_FILE="$REPORT_PATH"
for BLOCK in "## A)" "## B)" "## C)" "## D)" "## E)" "## F)" "## G)"; do
  if ! grep -q "$BLOCK" "$REPORT_FILE" 2>/dev/null; then
    echo "[$(date)] VALIDATION FAIL: $REPORT_FILE missing $BLOCK" >> data/errors.log
    # Do NOT mark as complete — leave in pending state
    continue 2
  fi
done
```
Why: Prevents malformed reports from entering applications.md silently.

~~**6E. Score regex multi-pattern fix (Grok Hack #12)**~~ **✅ DONE — skip.**
`batch/batch-runner.sh` line ~376 already handles both `SCORE: X.X` (Gemini) and `**Score:** X/5` (Claude) via `grep -oE`. No action needed.

**6F. Route ALL errors to data/errors.log (Grok Hack #27)**
`scripts/batch-runner-unattended.sh` already has `exec >> "$LOG_FILE" 2>&1` (redirects to dated batch log). The gap is a shared `data/errors.log` for cross-session error aggregation.
In `batch/batch-runner.sh` `process_offer()`, add to the `else` (failure) branch:
```bash
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] WORKER FAIL id=$id exit=$exit_code: $error_msg" >> "$PROJECT_DIR/data/errors.log"
```
Create `data/errors.log` if it doesn't exist: `touch data/errors.log`

**6G. verify-pipeline.mjs as hard gate before merge-tracker (Grok Hack #22)**
File: `batch/batch-runner.sh` — in the `merge_tracker()` function (around line 403). Read the file first.
Find `node "$PROJECT_DIR/merge-tracker.mjs"`. Add before it:
```bash
node verify-pipeline.mjs
if [ $? -ne 0 ]; then
  echo "[$(date)] MERGE BLOCKED: verify-pipeline failed. Fix errors before merging." >> data/errors.log
  exit 1
fi
```

### TIER 3 — Intelligence & Analysis (~20 min)

**6H. analyze-patterns.mjs auto-run at batch end (Grok Hack #18)**
File: batch runner script. After merge-tracker runs successfully, add:
```bash
echo "[$(date)] Running pattern analysis..." >> data/logs/batch.log
node analyze-patterns.mjs >> data/logs/batch.log 2>&1
```
Write the output to `data/pattern-analysis-$(date +%Y-%m-%d).json` (check if analyze-patterns.mjs already does this).

**6I. Move hardcoded archetype keywords to config/profile.yml (Grok Hack #19)**
File: `scripts/triage-pipeline.mjs` — read it fully first.
Find any hardcoded keyword arrays for role archetypes.
Move them to `config/profile.yml` under a new `triage:` key:
```yaml
triage:
  positive_keywords:
    - "AI solutions architect"
    - "forward deployed"
    - "applied AI"
    - "AI enablement"
    - "communications manager"
    - "engineering editorial"
    - "developer relations"
  negative_keywords:
    - "junior"
    - "intern"
    - "staffing agency"
```
Update triage-pipeline.mjs to read from config/profile.yml instead of hardcoded values.
This is a user-layer/system-layer separation fix — data contract compliant.

**6J. Version every report header with model info (Grok Hack #44)**
File: `batch/batch-prompt.md` or wherever the report header template is defined.
Find the report header format. Add two fields:
```
**Model:** claude-sonnet-4-6 (or as detected)
**Prompt-version:** [hash of batch-prompt.md at generation time]
```
For the prompt hash (career-ops uses ES Modules — `require` will fail; use this instead):
`node --input-type=module --eval "import{readFileSync}from'fs';import{createHash}from'crypto';const c=readFileSync('batch/batch-prompt.md','utf8');console.log(createHash('md5').update(c).digest('hex').slice(0,8))"`

### TIER 4 — Voice OS + Monitoring (~15 min)

**6K. Voice-os corpus reference file**
Create: `writing-samples/voice-reference.md`
Pull 350–400 words from Mitchell's most natural writing — use the executive summary of industry-impact-document.md, the "Pattern" section, and 2-3 sentences from article-digest.md proof points. NOT lists, NOT bullets — flowing prose only.
Add header: `# Voice Reference — Mitchell Williams` and note: `# Source: industry-impact-document.md, article-digest.md — do not modify without calibration run`

**6L. Heartbeat: add Grok-specified status rows and batch health score (Hacks #25, #29)**
File: `scripts/heartbeat.mjs` — find the System Status table construction (~line 985).
Add after existing rows:
```javascript
lines.push(`| Voice calibration | ${existsSync(join(ROOT, 'writing-samples/voice-reference.md')) ? '✅ active' : '⚠️ not configured'} | writing-samples/voice-reference.md |`);
lines.push(`| Errors today | ${existsSync(join(ROOT, 'data/errors.log')) && readFileSync(join(ROOT, 'data/errors.log'),'utf-8').includes(TARGET_DATE) ? '⚠️ see errors.log' : '✅ clean'} | data/errors.log |`);
lines.push(`| Quota schedule | ✅ 08:05 PT | batch fires after Claude Max reset |`);
```

**6M. CLAUDE.md lessons + AGENTS.md voice calibration scope (Hacks #24, #46)**
Append to CLAUDE.md (bottom only, do NOT edit system content):
```
## Session Notes — 2026-05-07 (overnight autonomous run)
- Em dash (—) established as formatting convention for all LinkedIn experience entries
- Trans military panel attribution corrected: HuffPost Live (Marc Lamont Hill host), NOT AJ+. File renamed accordingly.
- heartbeat.mjs sends via Gmail SMTP/nodemailer — do NOT use Gmail MCP compose for heartbeats
- Batch launchd schedule updated: 03:00 PT → 08:05 PT (post Claude Max quota reset)
- verify-pipeline.mjs now gates merge-tracker — fix any validation errors before merging
- Voice reference file added: writing-samples/voice-reference.md
```

Append to AGENTS.md under a new `## Voice Calibration` section:
```
## Voice Calibration
The voice corpus at `writing-samples/voice-reference.md` is used for stylistic calibration only.
SCOPE: Use ONLY to match Mitchell's written register (precision, directness, editorial pace).
NEVER use it to invent experience, fabricate metrics, or extend claims beyond what cv.md documents.
The corpus is sourced from Mitchell's own journalism and analysis writing — it is proof of voice, not proof of events.
```

**6N. Document Grok-Claude autonomous loop (setup for future nights)**
Write `data/grok-claude-loop-setup.md`:
```markdown
# Grok-Claude Autonomous Research Loop — Setup Guide
## Status: DOCUMENTED, NOT YET WIRED
## Target: implement night of 2026-05-08 or later

### Overview
Grok fires at 08:05 PT (after Claude Max reset), researches latest community hacks
for Mitchell's exact archetype stack, synthesizes into proposed code diffs,
hands off to Claude Code, which applies + validates + commits.

### Grok Master Prompt (ready to use)
[Grok master prompt goes here — write a 400-word research brief covering:
- Mitchell's exact setup (Claude Max, Sonnet, launchd, parallel=2, gemini overflow)
- Research targets: r/ClaudeCode, r/ClaudeAI, X builder threads, Blind AI hiring threads
- Output format: proposed AGENTS.md edits + batch-prompt.md diffs + triage keyword updates
- Ethical invariants: no auto-apply, privacy boundaries, quality-over-volume]

### State File
Create: data/research-state.json
```json
{
  "last_grok_run": null,
  "last_claude_apply": null,
  "pending_diffs": [],
  "loop_enabled": false
}
```

### LaunchD Plist (not yet loaded)
Would live at: scripts/launchd/com.mitchell.career-ops.grok-research.plist
Schedule: 08:05 PT daily
Requires: XAI_API_KEY in ~/.career-ops-secrets (already present)

### Blockers before enabling
- [ ] Grok API endpoint for programmatic access (verify xAI API supports this)
- [ ] Claude Code cloud agent trigger mechanism
- [ ] Human gate: Grok-proposed diffs go to data/pending-diffs/ for morning review before apply
```

**After Phase 6:** Git commit with message `overnight: phase 6 — system upgrades (12 hacks from Grok analysis)`. Update change report.

---

## PHASE 7 — GITHUB: AUDIT, FIX, AND BUILD-IN-PUBLIC CONTENT (Target: 55 min)

Grok's GitHub audit: current attention-catching probability is ~65%. The content quality is already elite. The gap is visibility (0 followers, 1-star repos, no community layer) and reframing ("personal productivity" → "team-scale enablement"). Tonight: fix the technical issues, reframe the copy, and write the build-in-public thread drafts so they're ready to post.

**AUTH CHECK — do this before any GitHub work:**
```bash
gh auth status && echo "AUTH OK" || echo "AUTH FAILED"
```
If auth fails: write all Phase 7 changes to `data/github-changes-2026-05-07.md` as ready-to-paste copy, note "push deferred to manual action" in change report, and continue. Do NOT loop on auth failures.

**PUSH POLICY: Do NOT push to GitHub autonomously.** Write all README/description changes to `data/github-changes-2026-05-07.md` with exact diff-style formatting. Mitchell reviews and pushes manually. This avoids credential prompts and irreversible push failures at hour 6 of an autonomous session.

### 7A. Audit and inventory
```bash
gh repo list mitwilli-create --limit 20
```
Document all repos (public vs private) in `data/github-audit-2026-05-07.md`.

### 7B. Profile README — targeted improvements
**Write changes to `data/github-changes-2026-05-07.md`, do NOT push.**
Fetch current README: `gh api repos/mitwilli-create/mitwilli-create/contents/README.md --jq '.content' | base64 -d`

Add these four elements (targeted additions, NOT a rewrite):
1. **Mission paragraph** (insert before the metrics table):
   `I build AI systems that scale editorial and communications work at team level — shipped in production for 1,000+ senior engineers at Google, calibrated in live-broadcast environments where every segment carried legal, political, or safety exposure. Background: The Stream · HuffPost Live · AJ+ · Google xGE. Now targeting frontier AI roles where shipping is as important as storytelling.`
2. **"Team-scale enablement" reframe** — replace "personal" or "I use" language with org-level framing: "comms-triage-agent saves ~160 ops hours/year across a 1,000-engineer organization"
3. **"Currently building" section** linking to all 3 public repos with one-line team-scale descriptions
4. **Broken image fix** — find and fix the broken image Grok flagged

Write the full updated README text to `data/github-changes-2026-05-07.md` under `## Profile README — READY TO PASTE`.

### 7C. comms-triage-agent README — first-3-lines fix
Read current README. Add to the very top (above everything else):
```
> **Impact:** ~160 ops hours/year recaptured across a 1,000-engineer organization at >90% classification accuracy. Three-prompt architecture (triage → revise → escalate) with dynamic knowledge-base loading. [Production deployment at Google xGE, 2024–present.]
```
This passes the <30-second scan test Grok identified as the blocker.

### 7D. Per-company positioning docs
Write `data/github-company-positioning-2026-05-07.md` with five sections:

```markdown
## Anthropic
Lead with: tax-verification-agent (citation-gated reasoning, mandatory IRS citations, [PLACEHOLDER] convention).
Reframe: "Citation discipline trained on IRS code + Claude" — directly mirrors Anthropic's Constitutional AI + RLHF values.
GitHub signal: voice-os six-axis scoring = alignment-adjacent work (output quality gates).
One-line pitch: "I built citation-gated AI that catches $19K errors commercial software misses."

## OpenAI
Lead with: comms-triage-agent as GTM/internal enablement archetype.
Reframe: "Broadcast discipline from CNN/AJ+ applied to LLM product narrative."
GitHub signal: three-prompt architecture mirrors OpenAI's tool-use patterns.
One-line pitch: "I ship the enablement infrastructure that makes AI usable for non-ML teams."

## Mistral
Lead with: comms-triage-agent (lightweight, deployable, open-weight-friendly).
Action item for future: port one agent to Mistral models and open-source the comparison.
One-line pitch: "Lightweight agentic comms systems — designed to run on any model tier."

## Sierra
Lead with: voice-os dual-persona routing (Architect vs Teammate) — directly maps to Sierra's agentic comms product.
Reframe: "Multi-agent enablement infrastructure for enterprise narrative control."
One-line pitch: "I built the persona routing and QA gates that make AI communication trustworthy at scale."

## Perplexity
Lead with: tax-verification-agent (KB architecture + citation discipline = Perplexity's product ethos).
Reframe: "Making complex multi-source verification usable at scale."
One-line pitch: "I architect knowledge-base systems that make complex verification usable for non-experts."
```

### 7E. Build-in-public thread drafts
Write `data/build-in-public-threads-2026-05-07.md` with three complete LinkedIn thread drafts — one per public repo. These are READY TO POST — not outlines. Mitchell posts them; do not post.

**Thread 1: comms-triage-agent**
Format: 5-7 paragraph LinkedIn post. Hook: the problem it solves. Body: how it works (three-prompt architecture, dynamic KB). Proof: the metric (160 hrs/yr, >90% accuracy). Close: what it taught me about LLM orchestration. Tag: #AI #LLM #GoogleEngineering #AgenticAI
Length: ~350 words. Written in Mitchell's voice (use voice-reference.md).

**Thread 2: tax-verification-agent**
Hook: "Commercial tax software said I owed X. My AI agent disagreed — and was right." Body: citation-gated reasoning, mandatory IRS citations, $19K catch. Proof: the conversation transcript (paraphrased, not verbatim). Close: what citation discipline means for AI reliability. Tag: #AI #CitationGrounding #TaxSeason #Claude
Length: ~300 words.

**Thread 3: voice-os**
Hook: "I trained an AI on 1.08M words of my own writing. Here's what it learned." Body: six-axis scoring, dual-persona routing, Kill List methodology, 99% fidelity result. Proof: the before/after rewrite example. Close: what Voice DNA means for AI-assisted communications at scale. Tag: #VoiceAI #AIComms #PersonaRouting #LLM
Length: ~320 words.

**After Phase 7:** Git commit (career-ops repo). Update change report.

---

## PHASE 8 — CHANGE REPORT + HANDOFF (Target: 20 min, MANDATORY)

Write the final version of `data/overnight-change-report-2026-05-07.md`.

This is the ONLY thing Mitchell reads in the morning. Make it excellent.

```markdown
# Overnight Change Report — May 7, 2026
*Session: ~22:15 PT May 6 → complete*
*This report was ready before the 09:00 PT heartbeat.*

## Executive Summary
[2–3 sentences. What is materially better today than yesterday?]

## Phases Completed

### Phase 1 — Citation Retrieval
- ✅/❌ Pew 2014: [result + URL or NOT FOUND]
- ✅/❌ Variety June 2015: [result + URL or NOT FOUND]
- ✅/❌ Webby Awards: [result]
- ✅/❌ Editorial timeline: [verified dates]

### Phase 2 — Transcript Mining
[What new evidence was found. Verbatim credits discovered. Which transcripts remain unanalyzed.]

### Phase 3 — Industry Impact Document
[What was added. What the document word count is now. Any trim performed.]

### Phase 4 — LinkedIn Rewrites
[All 7 entries + About section written? Character counts per entry.]

### Phase 5 — Career Narrative Thread
[Written? Key insight in the thesis paragraph.]

### Phase 6 — System Upgrades
**Pre-completed (prior session):**
- 6A Batch schedule 08:05 PT: ✅ (pre-done)
- 6E Score regex multi-pattern: ✅ (pre-done)
- Gemini fallback `--engine gemini`: ✅ (pre-done, bonus)
- Grok spend cap TOCTOU fix: ✅ (pre-done, bonus)

**Tonight:**
- 6B Quota-check probe: ✅/❌ (lower priority — Gemini covers this)
- 6C Batch-in-flight lock: ✅/❌
- 6D Post-worker A-G validation: ✅/❌
- 6F Errors → errors.log: ✅/❌
- 6G verify-pipeline gate: ✅/❌
- 6H analyze-patterns auto-run: ✅/❌
- 6I Archetype keywords → config/profile.yml: ✅/❌
- 6J Report header versioning: ✅/❌
- 6K voice-reference.md created: ✅/❌
- 6L Heartbeat rows added: ✅/❌
- 6M CLAUDE.md + AGENTS.md updated: ✅/❌
- 6N Grok-Claude loop documented: ✅/❌

### Phase 7 — GitHub (audit + reframe + build-in-public)
- Profile README improvements pushed: ✅/❌
- Broken image fixed: ✅/❌
- comms-triage-agent first-3-lines impact hook added: ✅/❌
- Per-company positioning docs written: ✅/❌
- Build-in-public thread drafts written (3 threads): ✅/❌

## Files Created or Modified
| File | Action | Notes |
|------|--------|-------|
| data/linkedin-experience-rewrites-2026-05-07.md | Created | LinkedIn-ready copy for all 7 entries |
| data/career-narrative-thread-2026-05-07.md | Created | Interview + networking context |
| data/press-references.md | Updated | Citations found/not-found |
| data/overnight-change-report-2026-05-07.md | Created | This file |
| ... | ... | ... |

## What Needs Manual Action Tomorrow (Mitchell's Queue)
- [ ] Upload LinkedIn cover banner (files at: docs/banners/)
- [ ] Apply LinkedIn Experience rewrites (copy from: data/linkedin-experience-rewrites-2026-05-07.md)
- [ ] Update About section on LinkedIn
- [ ] [Any citations not found that need manual retrieval]
- [ ] Add The Stream as new Experience entry on LinkedIn

## What the NEXT Claude Session Should Tackle First
[List in priority order. Be specific about which file, which line.]

## Decisions Made Autonomously (review these)
[Any judgment calls made during the session that Mitchell should be aware of.]

## Git Commits Made This Session
[paste: git log --oneline from session start to end]
```

---

## SUBAGENT CALL TEMPLATES

Each block below is the exact Agent() call to make for that phase. Each prompt is self-contained — the subagent has zero prior context from this session. Copy faithfully. Do not paraphrase.

---

### Template A — Phase 4: LinkedIn Experience Rewrites

```javascript
Agent({
  description: "Phase 4 — LinkedIn experience rewrites",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

PRIME DIRECTIVE: Mitchell Williams is positioning for frontier AI companies (Anthropic, xAI, OpenAI, Google DeepMind, Mistral, Sierra) in roles at the intersection of AI systems, communications architecture, and engineering enablement. Central thesis: "Mitchell built the infrastructure before the category existed — in broadcast media (2010–2018), then in AI (2018–present). The Stream → RLHF-style audience loops → AJ+ structured format engineering → Google xGE production AI agents. The instinct is identical. Only the layer has moved."

YOUR TASK: Execute Phase 4 of an overnight autonomous session — LinkedIn experience rewrites.

STEP 1 — Read these files IN PARALLEL:
- /Users/mitchellwilliams/Documents/career-ops/cv.md
- /Users/mitchellwilliams/Documents/career-ops/config/profile.yml
- /Users/mitchellwilliams/Documents/career-ops/data/linkedin-qa-report-2026-05-06.md
- /Users/mitchellwilliams/Documents/career-ops/data/ajp-confirmed-metrics.md

STEP 2 — Targeted proof-point extraction (do NOT read article-digest.md in full):
Bash: grep -n 'proof_point\|metric\|award\|viewers\|million\|on.air\|credit\|honor\|prize' /Users/mitchellwilliams/Documents/career-ops/article-digest.md | head -50

STEP 3 — Read the full Phase 4 section of the overnight prompt for complete instructions:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Section title: "## PHASE 4 — LINKEDIN EXPERIENCE REWRITES"
Execute all instructions there exactly — PRIORITY STACK, CHARACTER COUNT METHODOLOGY, all 7 entries + About section.

OUTPUT: Write all results to /Users/mitchellwilliams/Documents/career-ops/data/linkedin-experience-rewrites-2026-05-07.md

CRITICAL RULES (non-negotiable):
- Em dash (—) only for LinkedIn copy. Never bullets, arrows, or asterisks.
- Use "wc -m /tmp/li-entry-N.txt" for EVERY character count. Never estimate. Never count manually.
- All metrics must match cv.md exactly. Never fabricate.
- Lead metric must appear in the first 200 characters (mobile truncation point).
- Do NOT edit cv.md.

RETURN to caller: List of entries written with role title and character count. Any entries skipped and why. Confirm output file exists with "ls -la" result.`
})
```

---

### Template B — Phase 5: Career Narrative Thread

```javascript
Agent({
  description: "Phase 5 — Career narrative thread",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

PRIME DIRECTIVE: Mitchell Williams is positioning for frontier AI companies. Central thesis: "Mitchell built the infrastructure before the category existed — in broadcast media (2010–2018), then in AI (2018–present). The Stream's social integration layer → RLHF-style audience feedback loops → AJ+'s structured format engineering → Google xGE's production AI agents. The instinct is identical. Only the layer has moved."

YOUR TASK: Execute Phase 5 — write data/career-narrative-thread-2026-05-07.md. This is Mitchell's private analytical map for interviews and networking — NOT a CV.

STEP 1 — Read these files first:
- /Users/mitchellwilliams/Documents/career-ops/cv.md
- /Users/mitchellwilliams/Documents/career-ops/config/profile.yml
- /Users/mitchellwilliams/Documents/career-ops/data/industry-impact-document.md

STEP 2 — Check for Phase 1+2 outputs (read and incorporate if they exist):
Bash: ls -la /Users/mitchellwilliams/Documents/career-ops/data/press-references.md 2>/dev/null
Bash: ls -la /Users/mitchellwilliams/Documents/career-ops/data/transcript-analysis-new-findings-2026-05-07.md 2>/dev/null
If these exist, read them and fold any new citations or verbatim evidence into the narrative sections.

STEP 3 — Read the full Phase 5 section for complete structure instructions:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Section title: "## PHASE 5 — CAREER NARRATIVE THREAD"
Follow the exact markdown structure specified there (Thesis → per-period sections → Pattern → Talking Points → Objection Handlers).

OUTPUT: /Users/mitchellwilliams/Documents/career-ops/data/career-narrative-thread-2026-05-07.md

CRITICAL RULES:
- Every claim must cite its source file in parentheses: (Source: cv.md, line 42)
- The Thesis paragraph must function as a 60-second elevator pitch to an Anthropic hiring manager.
- Objection Handlers: address "Not a traditional engineer" / "Journalism background" / "No ML research"
- Do NOT fabricate metrics. All numbers from cv.md or config/profile.yml only.

RETURN to caller: Confirm file created. Quote the opening 2 sentences of the Thesis section verbatim. Note any sections that could not be fully written and why.`
})
```

---

### Template C — Phase 6: System Hacks (6B–6N)

```javascript
Agent({
  description: "Phase 6 — Career-ops system upgrades 6C through 6N",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

YOUR TASK: Execute Phase 6 of the overnight autonomous session — system upgrades. Items 6A and 6E are PRE-COMPLETED — skip them without checking. Execute: 6C, 6D, 6F, 6G, 6H, 6I, 6J, 6K, 6L, 6M, 6N. Do 6B last only if time permits.

STEP 1 — Read the full Phase 6 section for complete per-hack instructions:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Section title: "## PHASE 6 — CAREER-OPS SYSTEM UPGRADES"
Each hack has its own target file, exact code, and rationale.

STEP 2 — BEFORE EVERY EDIT: Read the target file. Never edit from memory. Line numbers in the prompt are approximate.

STEP 3 — ES MODULE NOTE (critical for 6J): This is a .mjs project. "require()" will fail. Use:
node --input-type=module --eval "import{readFileSync}from'fs';..."
Never use "node -e" with require() syntax.

STEP 4 — After all hacks are complete, commit:
git add -A && git commit -m "overnight: phase 6 — system upgrades (6C-6N)"

CRITICAL RULES:
- Read before every Edit. Always.
- Surgical edits (Edit tool) over full rewrites (Write tool).
- Do NOT edit modes/_shared.md for user-specific content — user customizations go in modes/_profile.md or config/profile.yml (data contract).
- If a target file doesn't exist, note it and skip that hack. Never create a file that doesn't belong.
- touch data/errors.log (for 6F) if it doesn't exist — this is safe.

RETURN to caller: Checklist — for each hack 6B through 6N: ✅ done / ❌ skipped (reason) / ⚠️ partial (what's missing). Total hacks completed.`
})
```

---

### Template D — Phase 1: Citation Retrieval

```javascript
Agent({
  description: "Phase 1 — Citation retrieval (45 min hard cap)",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

YOUR TASK: Execute Phase 1 — citation retrieval. HARD CAP: 45 minutes total for all 4 citations combined.

STOP-LOSS RULE (non-negotiable): These citations are from 2014–2015. Many are paywalled or relocated. If the first 2 direct search queries for any single citation return nothing usable, try ONE archive.org search, then write "NOT FOUND" and move immediately to the next citation. Do not retry. Do not dig deeper.

STEP 1 — Read existing state first:
- /Users/mitchellwilliams/Documents/career-ops/data/press-references.md (append new finds — do not overwrite)
- /Users/mitchellwilliams/Documents/career-ops/data/archive-research-strategy.md (research strategy)

STEP 2 — Read the full Phase 1 section for exact search queries and output format:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Section title: "## PHASE 1 — CITATION RETRIEVAL"
Execute Citations A, B, C, D exactly as specified there.

OUTPUT: Append findings to /Users/mitchellwilliams/Documents/career-ops/data/press-references.md

CRITICAL RULES:
- NEVER fabricate a URL, headline, publication date, or statistic. NOT FOUND is always the right answer.
- Maximum 4 search queries per citation (2 direct + 1 archive.org + 1 variation). Stop at 4.
- Time-box ruthlessly. At the 45-minute mark: write whatever you have and stop. Partial is fine.
- Do NOT use the Playwright/browser tools — WebSearch only.

RETURN to caller: For each citation A–D: ✅ FOUND [URL or archive URL] or ❌ NOT FOUND [queries tried]. Total queries used. Time taken.`
})
```

---

### Template E — Phases 2+3: Transcript Mining + Impact Doc

```javascript
Agent({
  description: "Phase 2+3 — Transcript mining and industry impact doc upgrade",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

YOUR TASK: Execute Phase 2 (transcript mining) then Phase 3 (industry impact doc upgrade) sequentially.

STEP 1 — Verify transcript path first:
Bash: ls ~/Downloads/VIDEOS/transcripts/*.txt 2>/dev/null | head -10
If output is empty: skip Phase 2 entirely, write "TRANSCRIPTS NOT FOUND at expected path" to the output file, proceed directly to Phase 3.

STEP 2 — Read the Phase 2 and Phase 3 sections for complete instructions:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Find "## PHASE 2 — TRANSCRIPT MINING" and "## PHASE 3 — INDUSTRY IMPACT DOCUMENT UPGRADE"
Execute them in order.

STEP 3 — For Phase 3, also read (before editing):
- /Users/mitchellwilliams/Documents/career-ops/data/industry-impact-document.md
- /Users/mitchellwilliams/Documents/career-ops/data/press-references.md (Phase 1 results — incorporate citations found)
- /Users/mitchellwilliams/Documents/career-ops/data/grok-prompt-industry-impact.md
- /Users/mitchellwilliams/Documents/career-ops/data/industry-impact-grok-research.md

PHASE 2 OUTPUT: /Users/mitchellwilliams/Documents/career-ops/data/transcript-analysis-new-findings-2026-05-07.md
PHASE 3 OUTPUT: Updated /Users/mitchellwilliams/Documents/career-ops/data/industry-impact-document.md
  — Back up first: cp data/industry-impact-document.md data/industry-impact-document-backup-2026-05-06.md

CRITICAL RULES:
- Phase 2: Verbatim quotes only — never paraphrase and present as a quote.
- Phase 3: Surgical edits only. Do NOT restructure the document.
- Phase 3: Do not exceed ~900 words (2-page PDF target). Trim if needed.
- Phase 3: Only add Phase 1 citations that were actually found. No placeholders.

RETURN to caller: Phase 2 — transcripts read, new findings count, any verbatim on-air credits found (quote them). Phase 3 — what was added/changed, word count before → after.`
})
```

---

### Template F — Phase 7: GitHub Audit + Build-In-Public

```javascript
Agent({
  description: "Phase 7 — GitHub audit, reframe, and build-in-public drafts (write-only)",
  prompt: `Working directory: /Users/mitchellwilliams/Documents/career-ops

YOUR TASK: Execute Phase 7 — GitHub audit and content preparation. WRITE-ONLY. Do NOT push anything to GitHub.

PRIME DIRECTIVE: Mitchell Williams positions for frontier AI companies. All GitHub copy reframes from "personal productivity" to "team-scale enablement." Comms Triage Agent = "~160 ops hrs/year recaptured across a 1,000-engineer org." That is the angle.

STEP 1 — Auth check (mandatory first):
gh auth status && echo "AUTH OK" || echo "AUTH FAILED"
If AUTH FAILED: proceed anyway — write all changes to data/github-changes-2026-05-07.md as ready-to-paste copy and note "AUTH FAILED — push deferred to manual action" in that file.

STEP 2 — Read the full Phase 7 section for complete instructions per sub-task:
/Users/mitchellwilliams/Documents/career-ops/data/overnight-autonomous-prompt-2026-05-07.md
Section title: "## PHASE 7 — GITHUB: AUDIT, FIX, AND BUILD-IN-PUBLIC CONTENT"
Execute 7A through 7E in order.

STEP 3 — If voice-reference.md exists, use it for thread voice matching:
Bash: ls /Users/mitchellwilliams/Documents/career-ops/writing-samples/voice-reference.md 2>/dev/null

OUTPUT FILES:
- /Users/mitchellwilliams/Documents/career-ops/data/github-audit-2026-05-07.md (7A: repo inventory)
- /Users/mitchellwilliams/Documents/career-ops/data/github-changes-2026-05-07.md (7B, 7C, 7D: ready-to-paste copy)
- /Users/mitchellwilliams/Documents/career-ops/data/build-in-public-threads-2026-05-07.md (7E: 3 thread drafts)

PUSH POLICY (non-negotiable): Do NOT run git push or gh repo edit or gh api PATCH commands. All changes are written to files for manual review. The only exception: running gh repo list and gh api GET commands to read current state.

RETURN to caller: List of output files created with ls -la. Confirm 3 thread drafts written (titles). Note any auth issues. Note broken image status from 7B.`
})
```

---

## EXECUTION RULES (read these before starting Phase 1)

1. **Never fabricate a metric.** Not found = write NOT FOUND and move on.
2. **Never edit cv.md to ADD content.** It is the source of truth. Fix typos only.
3. **Back up before overwriting.** Every existing file gets a -backup-2026-05-06 copy before edit.
4. **Em dash (—) only for LinkedIn copy.** No bullets. No arrows.
5. **Character count every LinkedIn entry** before writing it to the rewrites file.
6. **Every claim in career-narrative-thread cites its source file** in parentheses.
7. **Git commit after every phase.** Non-negotiable.
8. **Hard stop at 08:00 PT.** Write the handoff even if Phase 8 is incomplete. A partial report is infinitely better than no report.
9. **Never push to GitHub without reading the diff.** Use `git diff` before `git push`.
10. **The standard throughout:** Would this embarrass Mitchell if an Anthropic engineering editorial lead read it? If yes, fix it. If uncertain, flag it in the change report.

---

## START COMMAND

Begin now. Execute in this exact sequence — do not skip steps:

1. **TodoWrite** — create tasks in EXECUTION ORDER: Phase 0, Phase 4, Phase 5, Phase 6, Phase 1, Phase 2, Phase 3, Phase 7, Phase 8. All status: pending.
2. **Parallel reads** — Read cv.md and config/profile.yml simultaneously. Do NOT read article-digest.md in full.
3. **Targeted article-digest extraction:** `grep -n 'proof_point\|metric\|award\|viewers\|million\|on.air\|credit\|honor\|prize' /Users/mitchellwilliams/Documents/career-ops/article-digest.md | head -60`
4. **Read data/linkedin-qa-report-2026-05-06.md** (Phase 4 punch list — read this fully, it's short)
5. **Git state:** `git log --oneline -5 && git status`
6. **Transcript check:** `ls ~/Downloads/VIDEOS/transcripts/*.txt 2>/dev/null | head -10` — note result
7. **Write change report** with full header + pre-populated Phase 6 checkbox table (not just a stub)
8. Mark Phase 0 complete → **spawn Template A subagent for Phase 4** (find template in SUBAGENT CALL TEMPLATES section, copy exactly, call Agent tool)

**Phase time budget — EXECUTION ORDER:**
| Phase | Content | Budget | Notes |
|-------|---------|--------|-------|
| 0 | Orientation | 15 min | |
| **4** | **LinkedIn rewrites** | **90 min** | **Do this first — highest career value** |
| 5 | Career narrative thread | 55 min | |
| 6 | System hacks (6B–6N) | 70 min | 6A and 6E pre-done |
| 1 | Citation retrieval | **45 min HARD CAP** | Stop-loss: 2 queries → archive.org → NOT FOUND |
| 2 | Transcript mining | 55 min | Skip if path empty from Phase 0 check |
| 3 | Impact doc upgrade | 40 min | Conditional on Phases 1+2 finding something |
| 7 | GitHub (write-only, no push) | 50 min | Auth check first; write to data/github-changes-*.md |
| 8 | Change report finalization | 20 min | Always runs, always finishes |
| **Total** | | **~440 min / ~7.3 hrs** | Tight but achievable |

**If running short on time, drop in this order:**
1. Phase 7E (build-in-public threads) — nice to have
2. Phase 3 (impact doc) — only if Phases 1+2 found nothing
3. Phase 2 (remaining transcripts after first 2)
4. Phase 7D (per-company docs)

**Never drop:** Phase 4, Phase 5, Phase 6A–6G, Phase 8.

Good luck. The heartbeat fires at 09:00 PT.

# Career Acquisition System — Parth Rajguru
**Version:** 1.0 · **Created:** 2026-05-11 · **Location:** Sydney, Australia

This is the permanent operating manual for Parth's AI-powered job search pipeline. It documents who he is, what he's targeting, how the system works, and the exact workflow from discovery to offer. Any AI agent reading this file can pick up and continue the search without re-onboarding.

---

## 1. Candidate Identity

| Field | Value |
|-------|-------|
| Full name | Parth Rajguru |
| Email | parthchetan.rajguru@students.mq.edu.au |
| Phone | +61 432 292 832 |
| Location | Sydney, NSW, Australia |
| LinkedIn | linkedin.com/in/parthrajguru |
| Portfolio | https://klifjtumper88.github.io/Portfolio-website/ |
| Tableau Public | https://public.tableau.com/shared/S7B4J2S2G |

---

## 2. Visa and Work Rights

**Current status:** Student Visa — subclass 500
**Work rights:** 48 hours per fortnight during semester; unlimited during university breaks
**Pending:** 485 Graduate Visa (post-study work stream, 2–4 years full work rights)

### Screening rules — apply to every role before anything else

| JD says | Action |
|---------|--------|
| "Australian Citizen or PR required" | Auto-SKIP — do not evaluate further |
| "Security clearance required" (NV1, NV2, AGSVA) | Auto-SKIP |
| "Must have full working rights" | Flag as CONFIRM — likely ineligible during semester; note for user to verify |
| "Open to international students" / "Student visa welcome" | ELIGIBLE — proceed |
| Silent on visa (most SMEs) | ELIGIBLE — mention student visa + 485 pending in cover letter |
| "Sponsorship available" | ELIGIBLE — strong signal, prioritise |

**Always include a Visa Eligibility line in every evaluation report.**

---

## 3. Education

| Degree | Institution | Status |
|--------|-------------|--------|
| Master of Business Analytics | Macquarie University, Sydney | 2024–Present (in progress) |
| Bachelor of Management Studies | Pillai HOC College, Mumbai University | Completed 2024, CGPA 7.81/10 |

---

## 4. Experience

**Data Reporting Analyst — Anarock Property Consultants, Mumbai (2023–2024)**

This is Parth's primary professional differentiator. Frame it in every application.

- Tracked daily property sales data across multiple residential projects in Mumbai
- Produced weekly sales performance reports consolidating pipeline and conversion data
- Built dashboards visualising lead conversion rates by project — enabled identification of under/over-performing developments
- Supported portfolio performance reviews by translating raw data into actionable insights for management

**The hook:** Real industry experience, real stakeholders, real decisions driven by his data — rare for a graduate candidate.

---

## 5. Skills and Tools

| Category | Tools |
|----------|-------|
| Data & analytics | Python (Pandas, Scikit-learn, ARIMA, Prophet), SQL, Excel (Advanced) |
| Visualisation | Tableau, Power BI, Tableau Public |
| Web | HTML, CSS |
| ML / AI | Machine Learning, Generative AI (Caltech/Simplilearn certs) |

---

## 6. Projects and Proof Points

All projects are showcased at https://klifjtumper88.github.io/Portfolio-website/

| Project | Tech | Link | Hero metric |
|---------|------|------|-------------|
| Melbourne Property Market: Price vs. Distance from CBD | Tableau Public | https://public.tableau.com/shared/S7B4J2S2G | Interactive dashboard — value suburbs by price-to-distance ratio |
| Telco Customer Churn Analysis | Python, Pandas, Scikit-learn | Portfolio website | EDA + predictive model on telecom dataset |
| Sales Forecasting Dashboard | Python, ARIMA, Prophet | Portfolio website | End-to-end forecasting pipeline with interactive dashboard |

**Framing rule:** Always tie a project to a business question, not just the tool. "Which suburbs offer the most value relative to commute?" beats "I used Tableau."

---

## 7. Target Roles

### Primary targets
- Business Analyst (graduate/junior)
- Data Analyst (graduate/junior)

### Secondary targets
- Reporting Analyst
- Systems Analyst
- Product Analyst

### Stretch
- Junior Data Scientist (lead with ML certs + churn project)

### Not targeting right now
- Senior / Lead / Principal BA or DA (too much experience required)
- Roles requiring full-time during semester (student visa constraint)

---

## 8. Application Priority Order

**Always evaluate and present opportunities in this order:**

| Priority | Label | Type |
|----------|-------|------|
| 1 | `[INTERNSHIP]` | Internship, Vacation Student, Cadet |
| 2 | `[GRADUATE]` | Graduate program, Graduate role |
| 3 | `[JUNIOR]` | Junior, Entry Level, Associate |
| 4 | `[OPEN]` | Open-level BA/DA (no seniority prefix) |
| — | Skip | Senior, Lead, Principal, Clearance required |

---

## 9. Compensation Targets

| Field | Value |
|-------|-------|
| Target range | AUD 65,000–90,000 |
| Walk-away minimum | AUD 55,000 |
| Currency | AUD |
| Location preference | Sydney — hybrid or on-site acceptable |
| Relocation | Not seeking relocation outside Sydney |

**Note:** Graduate programs (e.g. The Data School at AUD 60K incl. super) may fall below target but are acceptable if they offer structured training and client exposure. Evaluate the opportunity cost, not just the salary.

---

## 10. System Files

| File | Purpose | Auto-updated? |
|------|---------|---------------|
| `cv.md` | Canonical CV — source of truth for all applications | Never auto-updated |
| `config/profile.yml` | Candidate identity, targets, visa, comp | Never auto-updated |
| `modes/_profile.md` | Archetypes, adaptive framing, visa rules, negotiation scripts | Never auto-updated |
| `portals.yml` | Portal scanner config — search queries + tracked companies | Never auto-updated |
| `data/applications.md` | Application tracker | Add via TSV merge only |
| `data/pipeline.md` | Inbox for queued job URLs | User-managed |
| `data/scan-history.tsv` | Dedup history for scanner | Auto-updated by scanner |
| `reports/` | Full A–G evaluation reports | Auto-generated |
| `batch/tracker-additions/` | TSV files pending merge into tracker | Auto-generated |
| `interview-prep/` | Company-specific interview prep docs | Auto-generated |
| `output/` | Generated CV PDFs | Auto-generated, gitignored |

**Critical rule:** Never edit `data/applications.md` to add new entries directly. Write a TSV to `batch/tracker-additions/` and run `node merge-tracker.mjs`.

---

## 11. Portal Scanner Configuration

The scanner (`portals.yml`) is tuned for Parth's search. Key settings:

**Title filter priority (positive keywords):**
Tier 1 — Intern, Internship, Vacation, Cadet
Tier 2 — Graduate, Graduate Business Analyst, Graduate Data Analyst
Tier 3 — Junior, Entry Level, Associate Analyst
Tier 4 — Business Analyst, Data Analyst, Systems Analyst, Reporting Analyst

**Negative keywords (auto-excluded):**
Principal, Director, Head of, Cleared, NV1, NV2, AGSVA, Embedded, Firmware, Blockchain, Web3, Crypto

**Tracked company categories:**
- AU job boards: Seek, GradConnection, GradAustralia, LinkedIn AU, Indeed AU, NSW Gov
- Big firms (graduate programs): Deloitte, KPMG, PwC, EY, Accenture
- AU banks (vacation programs): CBA, ANZ, NAB, Westpac, Macquarie
- Tech: Atlassian, Canva, REA Group, Seek (company), Telstra, Optus
- Insurance/Super: AMP, IAG, AustralianSuper, Medibank
- Government: NSW iWorkForNSW, Services Australia

**Run a scan:** `/career-ops scan`

---

## 12. Full Workflow

### Step 1 — Discover

**Option A — Automated scan:**
```
/career-ops scan
```
Searches all configured portals and adds new roles to `data/pipeline.md`.

**Option B — Manual:**
Paste a job URL directly: `/career-ops {URL}`
Or add URLs to `data/pipeline.md` and run `/career-ops pipeline`.

---

### Step 2 — Visa Screen

Before any evaluation, check:
1. Does the JD mention citizenship or PR requirements? → See Section 2 screening table
2. Is the role full-time during semester? → Flag if Parth is mid-semester
3. Does the company typically hire international students? → SMEs usually fine; government and defence often not

Any role requiring citizenship = immediate SKIP. Log it in scan-history.tsv as `skipped_visa`.

---

### Step 3 — Evaluate (Blocks A–G)

Run: `/career-ops oferta` or paste URL for full auto-pipeline.

Each evaluation produces 7 blocks:

| Block | What it covers |
|-------|---------------|
| A | Role summary — archetype, seniority, location, TL;DR |
| B | CV match — every JD requirement mapped to CV evidence; gaps with mitigation plan |
| C | Level and positioning strategy |
| D | Comp and market data (Glassdoor AU, SEEK salary, Robert Half) |
| E | CV personalisation plan — top 5 changes to make |
| F | Interview prep — 6–10 STAR+R stories mapped to JD requirements |
| G | Posting legitimacy — is this a real, active opening? |

**Score interpretation:**
- 4.5+ → Strong match, apply immediately
- 4.0–4.4 → Good match, worth applying
- 3.5–3.9 → Apply only if specific reason
- Below 3.5 → Recommend against (don't waste time)

**Save report to:** `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`

---

### Step 4 — Tailor

Before applying, make targeted CV changes from Block E.

**Adaptive framing by role type:**

| Role type | Lead with |
|-----------|-----------|
| Business Analyst | Anarock experience, stakeholder communication, management studies background |
| Data Analyst | Python/SQL/Pandas, Anarock dashboards, Power BI/Tableau |
| Reporting Analyst | Anarock dashboards, Excel/Tableau/Power BI, sales analytics |
| Systems Analyst | Applied Business Information Systems (MQ unit), technical documentation |
| Product Analyst | Forecasting dashboard, data-to-decision framing |
| Junior Data Scientist | Churn prediction (Scikit-learn), ARIMA/Prophet forecasting, Caltech ML certs |

**Cover letter rules:**
- 4 short paragraphs, max 200 words
- Para 1: Role + one specific real thing about the company
- Para 2: Most relevant experience (Anarock or a project), tied to the role
- Para 3: Differentiating skill with proof
- Para 4: Clear call to action
- Tone: confident, direct — no "I am passionate about" or "I would love the opportunity"
- Always include: name, email, LinkedIn, portfolio URL, Tableau Public URL

**Signature block (use in all emails):**
```
Parth Rajguru
parthchetan.rajguru@students.mq.edu.au | +61 432 292 832
linkedin.com/in/parthrajguru
Portfolio: https://klifjtumper88.github.io/Portfolio-website/
Tableau: https://public.tableau.com/shared/S7B4J2S2G
```

---

### Step 5 — Generate PDF

Run: `/career-ops pdf`

Generates an ATS-optimised PDF from `cv.md` using `templates/cv-template.html`. Saved to `output/`.

Always generate a tailored PDF before applying — never use a generic one.

---

### Step 6 — Apply

**CRITICAL: Never submit without Parth reviewing the final application first.**

The system prepares everything (cover letter, CV PDF, form answers). Parth clicks send.

**Application types by effort:**

| Type | What's needed | Time |
|------|--------------|------|
| Email application | Cover email + CV PDF | 5 min review |
| Seek/LinkedIn form | Cover letter in form + CV PDF upload | 10 min |
| Company portal | Cover letter + CV + possible form questions | 15–30 min |
| Graduate program | May require additional materials (viz, video, case study) | Flag and prep |

**Before applying, always confirm:**
- [ ] Visa eligibility confirmed (or explicitly acceptable risk noted)
- [ ] CV tailored per Block E recommendations
- [ ] Cover letter references something real about the company
- [ ] PDF generated from latest cv.md
- [ ] Score is 3.5 or above (exception only with Parth's explicit override)

---

### Step 7 — Track

After applying, update tracker:

1. Write TSV to `batch/tracker-additions/{num}-{company-slug}.tsv`
2. Run `node merge-tracker.mjs`

**Canonical statuses** (from `templates/states.yml`):

| Status | When |
|--------|------|
| `Evaluated` | Report done, decision pending |
| `Applied` | Application submitted |
| `Responded` | Company replied |
| `Interview` | In interview process |
| `Offer` | Offer received |
| `Rejected` | Rejected by company |
| `Discarded` | Candidate withdrew or role closed |
| `SKIP` | Doesn't fit — do not apply |

---

### Step 8 — Follow Up

After applying, log the follow-up cadence in `data/follow-ups.md`.

**Standard cadence:**
- Day 0: Application sent
- Day 7: Follow-up email if no response (for email applications only — not Seek/portal)
- Day 14: Final follow-up or mark as cold

Run: `/career-ops followup` to see overdue follow-ups and generate draft emails.

---

### Step 9 — Interview Prep

When an interview is confirmed:

```
/career-ops interview-prep
```

Generates a company-specific prep doc in `interview-prep/{company}-{role}.md` covering:
- Company background and recent news
- Role-specific STAR+R stories from story bank
- Likely questions + red-flag questions
- Case study to lead with

**Parth's master stories (build this bank over time):**

| Story | Situation | Best used for |
|-------|-----------|---------------|
| Anarock weekly reports | Sales team needed consolidated performance data | Data storytelling, stakeholder communication |
| Anarock dashboard | Lead conversion visibility across projects | Visualisation, translating data to decisions |
| Anarock data cleaning | Inconsistent input from multiple agents | Data quality, attention to detail |
| Telco churn model | Predicting customer drop-off | ML, Python, business problem framing |
| Forecasting dashboard | Scoping and building end-to-end pipeline | Ambiguity, structured problem solving |

---

## 13. Applications Log

Current as of 2026-05-11. Full tracker in `data/applications.md`.

| # | Company | Role | Score | Status | Notes |
|---|---------|------|-------|--------|-------|
| 1 | The Data School | Graduate Analytics Program | 3.5/5 | Evaluated | ⚠️ Await visa eligibility reply |
| — | Tyroola | BI Intern | 4.2/5 | Ready to send | Email careers@tyroola.com.au |
| — | Leaders IT | Junior DA (CUSP) | 4.0/5 | Prep needed | Register form at leaders.com.au/cusp |
| — | Francom Group | Business Analyst | 3.8/5 | Ready to send | Apply via Seek |
| — | Octagon / Futures | Sports DA Intern | 3.6/5 | Prep needed | Check MQ WIL/course credit |
| — | Cardihab | Data Analyst | 3.2/5 | Prep needed | Contact Kairos recruiter first |

---

## 14. Immediate Action Items

As of session 2026-05-11:

- [ ] Send cover email to Tyroola — careers@tyroola.com.au (draft in session history)
- [ ] Apply to Francom Group via Seek (draft in session history)
- [ ] Email The Data School — applications@thedataschool.com.au (draft in session history)
- [ ] Register interest at leaders.com.au/cusp (Leaders IT CUSP program)
- [ ] Check MQ Business Analytics WIL/course credit eligibility (for Octagon internship)
- [ ] Message Reena Dhana (Kairos Recruitment) on LinkedIn re: Cardihab role
- [ ] Add more MQ course units to cv.md as degree progresses
- [ ] Ensure Telco Churn + Forecasting projects are clearly visible on portfolio website

---

## 15. Ethical Operating Rules

These rules are non-negotiable:

1. **Never auto-submit.** Every application is reviewed by Parth before sending.
2. **Never apply below 3.5/5** without Parth's explicit override.
3. **Never fake experience or metrics.** Only cite what's in cv.md and project files.
4. **Always flag visa risk.** If eligibility is uncertain, say so clearly.
5. **Quality over quantity.** 5 well-targeted applications beat 50 generic ones.
6. **Respect recruiter time.** Don't apply to roles that are clearly not a fit.
7. **Always read cv.md fresh** before generating any application material — never hardcode metrics.

---

## 16. Key Commands

| Command | What it does |
|---------|-------------|
| `/career-ops {URL}` | Full auto-pipeline: evaluate + report + PDF + tracker |
| `/career-ops scan` | Scan all configured portals for new roles |
| `/career-ops pipeline` | Process queued URLs from data/pipeline.md |
| `/career-ops oferta` | Evaluate a single role (no auto-PDF) |
| `/career-ops pdf` | Generate tailored CV PDF |
| `/career-ops tracker` | Show application status overview |
| `/career-ops interview-prep` | Generate company-specific interview prep doc |
| `/career-ops followup` | Show overdue follow-ups, generate draft emails |
| `/career-ops patterns` | Analyse rejection patterns across applications |
| `/career-ops contacto` | Find LinkedIn contacts + draft outreach message |
| `node merge-tracker.mjs` | Merge TSV additions into applications.md |
| `node verify-pipeline.mjs` | Health check on tracker and reports |
| `node scan.mjs` | Zero-token portal scan (no LLM cost) |
| `node run.mjs` | **Daily automation runner** — scan + merge + PDF + cover letters + Gmail MCP draft |
| `node run.mjs --dry-run` | Preview daily run without writing files |
| `node run.mjs --skip-scan` | Skip portal scan, use existing pipeline |
| `node run.mjs --skip-pdf` | Skip PDF generation (use if Playwright not available) |
| `node run.mjs --evaluate` | Also run AI evaluation on top 5 pipeline items via `claude -p` |

---

## 17. Negotiation Scripts

**Salary expectations (when asked):**
> "Based on current Sydney market rates for this level, I'm targeting AUD 65,000–90,000. I'm open to discussing the full package — what matters most to me is the work and the growth opportunity."

**When offered below target:**
> "I've been benchmarking against similar roles in Sydney and that's a little below the range I'm seeing. I'm genuinely interested in this role — is there any flexibility to move closer to [target]?"

**On visa questions:**
> "I'm currently on a student visa with a 485 Graduate Visa application pending. I have work authorisation and I'm happy to provide documentation. The 485 should be granted within [timeframe], which would give full working rights."

---

## 18. Session History

| Date | What was done |
|------|--------------|
| 2026-05-11 | Full onboarding: cv.md strengthened, profile.yml created, _profile.md created, portals.yml created (Sydney-tuned), applications tracker created |
| 2026-05-11 | Visa rules added: student 500 + 485 pending, screening logic, priority order (internships first) |
| 2026-05-11 | Portfolio + Tableau Public viz added to cv.md and profile.yml |
| 2026-05-11 | Scanned for BA/DA roles — top 3 results surfaced |
| 2026-05-11 | Full evaluation of The Data School graduate program (Score: 3.5/5, report 001) |
| 2026-05-11 | Tableau viz guide created (Melbourne Housing dataset, step-by-step Tableau Public publishing) |
| 2026-05-11 | SME scan: 5 roles evaluated, 2 ready to send (Tyroola, Francom), 3 needing prep |
| 2026-05-11 | CAREER_SYSTEM.md created |
| 2026-05-11 | run.mjs created — daily automation runner (scan + merge + PDF + cover letter staging + email report) |

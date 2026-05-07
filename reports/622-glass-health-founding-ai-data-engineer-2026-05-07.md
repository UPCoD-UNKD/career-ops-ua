# Evaluación: Glass Health — Founding AI/Data Engineer (Remote)

**Fecha:** 2026-05-07
**Arquetipo:** Applied AI / LLM Engineer (founding clinical decision support)
**Score:** 3.5/5
**URL:** https://jobs.lever.co/glass-health-inc/df2660f1-6a2d-4c2b-980d-c2aee3ee15bf
**Legitimacy:** High Confidence
**Location:** Remote (verify US-only) — physician-co-founded YC alum
**PDF:** output/2026-05-07/cv-deepak-mallampati-glass-health-founding-ai-data-engineer-2026-05-07.pdf
**Verification:** confirmed (Lever API returned full JD body 2026-05-07T06Z)

---

## A) Resumen del Rol

| Dim | Detalle |
|-----|---------|
| Arquetipo | Applied AI / LLM Engineer (founding, full-stack + applied AI) |
| Domain | Clinical Decision Support (DDx, Clinical Plan, Glass Notebooks, AI CDS for physicians) |
| Function | Build (founding role; expanded ownership across product/full-stack/AI) |
| Seniority | 5+ yrs (explicit) |
| Remote | Remote (US-leaning per SF Fair Chance Ordinance reference) |
| Team size | YCombinator + Initialized backed; Kaiser Permanente Mid Atlantic partner; 150+ physicians using product |
| TL;DR | Founding role spanning product/full-stack/Applied AI for physician-facing CDS; ELT+RAG over millions of medical articles; OpenAI + Python/Django + React/TS + GCP. |

## B) Match con CV

| Requisito JD | Match en CV |
|--------------|-------------|
| 5+ yrs SWE | cv.md:23 (2.5y Progress Solutions) — **structural gap** |
| Production system design + scaling | cv.md:25-29 (RAG + agents + ML pipelines + FastAPI/Docker production at Progress) — partial scale |
| TypeScript / React frontend | cv.md:60 Manga Lens (TS Chrome Ext); cv.md:65-66 Dream Decoder (React/TS/Vite/Tailwind) — 1:1 |
| Python backend (Django adjacent) | cv.md:12 (Python, FastAPI, Flask) — Django not used but pattern transfer |
| OpenAI + LLM integration | cv.md:60 Manga Lens (Claude + GPT-4o + GPT-4.1 Nano + Ollama, 4 providers) — 1:1 |
| RAG over medical articles + ELT | cv.md:25 (clinical knowledge retrieval RAG, ~35% precision) — 1:1 healthcare RAG |
| Postgres / Vector DB | cv.md:12 (PostgreSQL); cv.md:71 (vector-indexed policy docs in claims agent) — 1:1 |
| GCP, Docker | cv.md:17 (Docker yes; GCP not specifically named — AWS-leaning skill) |
| Healthcare / EHR / HIPAA | cv.md:23, cv.md:30 (HIPAA-conscious data governance, EHR extracts, audit trails) — 1:1 |
| On-call rotation for production | New experience; can ramp |
| Excellent user experience focus | cv.md:60 Manga Lens (privacy policy + per-domain selectors + 7d cache UX) — partial |
| Startup founding experience (bonus) | E-Farming Marketplace cv.md:86 (founder/full-stack); Manga Lens shipped solo |
| Evaluating new AI/LLM tech | cv.md:13 (evaluation pipelines, guardrails, grounding) |

**Gaps:**
1. **5+ yrs experience floor** — Deepak has 2.5y. Mitigation: lead with measurable production impact (>30% hallucination reduction, >90% grounded alignment, ~35% retrieval precision) over years-of-service.
2. **Django specifically** — FastAPI/Flask transfer; Django is similar Python web framework, ramp in 1-2 weeks.
3. **GCP** — AWS skills transfer but GCP-specific patterns (Cloud Run, Vertex AI) need ramp.
4. **Founding "expanded ownership"** — strong fit on solo-shipping (Manga Lens) and founder pattern (E-Farming) but not at Series A scale.

## C) Nivel y Estrategia

**Nivel JD:** Senior Founding (5+y).
**Nivel candidato natural:** Mid IC (2.5y) with founding instincts (cv.md:86 E-Farming + cv.md:60 Manga Lens solo ship).
**Vender founding sin mentir:** Lead with the founder pattern: E-Farming PHP/MySQL marketplace (80-120 users phase 1) + Manga Lens (Chrome Web Store solo shipped) + Progress Solutions production HIPAA RAG. Pitch as "founder mindset + production HIPAA depth — fewer years but fully end-to-end ownership in three independent ships."
**Si me downlevelan:** Accept Mid IC seat at $130-160K with 6-mo review tied to clinical CDS RAG + DDx improvements. Founding equity (the upside reason for joining) negotiable separately.

## D) Comp y Demanda

| Source | Range | Note |
|--------|-------|------|
| Glassdoor (Founding Engineer Healthcare AI) | $140-200K + 0.5-2.0% equity | Reference band for Series A pre-Series A |
| Levels.fyi (Remote-US Senior Applied AI) | $180-250K | Standard market |
| Comp not disclosed in posting | — | Get range in screen + equity info |

**Demand:** Glass Health raised $6.5M (Initialized + YC + Tom Lee/One Medical + FIGS founders); Series A this year per JD. Active hiring momentum.

## E) Plan de Personalización

| # | Sección | Cambio |
|---|---------|--------|
| 1 | Summary | "Applied AI engineer + founder mindset — production HIPAA RAG (~35% retrieval precision) + agentic schema contracts (>30% hallucination reduction) + solo Chrome Web Store shipping (Manga Lens) + university-stage marketplace founder (E-Farming, 80-120 users phase 1)." |
| 2 | Competencies | Founding Mindset, Clinical RAG, HIPAA-conscious AI, Multi-Provider LLM, Full-Stack TS+Python, Eval Harnesses, Solo Product Ownership |
| 3 | Experience top bullet | Move clinical RAG metrics + agentic schema contracts to top |
| 4 | Projects order | Lead with claims (agentic schema contracts) → manga (multi-provider LLM solo Chrome Web Store ship) → dream (full-stack FastAPI + React/TS) → efarming (founder/full-stack) |
| 5 | Footer / Location | "Kent, OH (US-based, F-1 OPT, sponsorship welcome) — open to relocation to NYC/SF/Remote-US" |

## F) Plan de Entrevistas

| # | Req | STAR+R | Reflection |
|---|-----|--------|------------|
| 1 | Clinical RAG over medical articles | S: Progress Solutions clinical knowledge retrieval. T: Improve precision. A: Recursive semantic chunking + transformer embeddings + grounding rules. R: ~35% precision, >90% grounded alignment. | Chunking + grounding > model choice for clinical Q. |
| 2 | Founding mindset / expanded ownership | S: E-Farming AgriTech marketplace + Manga Lens Chrome Web Store. T: Build + ship + operate end-to-end. A: PHP/MySQL backend + Bootstrap frontend + cart/reviews/blog (E-Farming); MV3 service workers + 4-provider AI vision (Manga Lens). R: 80-120 users phase 1 (E-Farming); shipped to Chrome Web Store with privacy policy + 29 sites (Manga Lens). | Founding ownership = no PM, no scope shield. Every layer is yours. |
| 3 | Multi-provider LLM integration | S: Manga Lens multi-provider cost/latency tradeoff. T: Provider abstraction. A: WebP-for-cloud + JPEG-for-Ollama (CUDA crash workaround), cost-aware routing, 7d cache. R: Live on Chrome Web Store. | Provider abstraction = payload + cost + failure mode handling, not just API surface. |
| 4 | Production reliability + on-call | S: FastAPI/Flask + Docker production deploys at Progress. T: Reduce defects. A: Structured logging + load simulation + audit trails. R: ~30% post-deploy defect reduction. | Logging + load sim before launch saves on-call pages. |
| 5 | Schema contracts between agents | S: Healthcare claims silent corruption risk. T: Reliable multi-step. A: 5-stage agents + schema-validated JSON contracts. R: Prevented cascading hallucinations. | Schema contracts > prompt trust. |
| 6 | TypeScript/React full-stack | S: Dream Decoder needed user-facing dream interpretation. T: Ship MVP. A: FastAPI backend + React/TS/Vite/Tailwind frontend, multimodal API orchestration. R: ~30% better contextual alignment, ~25-30% first-pass image success. | Intermediate prompt-transformation layers > naive direct calls. |
| 7 | "Why Glass Health — physician CDS" | S: HIPAA RAG + audit trails at Progress Solutions. T: Direct application to DDx + Clinical Plan + AI CDS. A: Architectural transfer of grounding rules + audit trails to physician-facing tools. R: Real-time CDS suggestions can leverage same evaluation rigor. | Physician trust = auditability + grounding rigor. |

**Case study:** Lead E-Farming + Manga Lens as proof of founder pattern + Manga Lens multi-provider AI integration as 1:1 with Glass Health's "OpenAI & similar" stack ask + Healthcare RAG (Progress) as 1:1 with "ELT+RAG over millions of medical articles" backbone.

**Red-flag answers:**
- *"5+ yrs but you have 2.5"*: "Founding work isn't measured in calendar years — it's measured in independent end-to-end ships. I have three (Manga Lens / Dream Decoder / E-Farming) plus production HIPAA RAG at Progress. I'm betting on Glass because I want my fourth ship to be physician-grade."
- *"Why founding"*: "I've shipped solo before — Chrome Web Store is brutal feedback. I want that at Series A scale where the impact compounds."

## G) Posting Legitimacy

| Signal | Finding | Weight |
|--------|---------|--------|
| Posting age | Active on Lever (live 2026-05-07) | Positive |
| Tech specificity | Strong (Python/Django + React/TS + Postgres + OpenAI + GCP + RAG/ELT) | Positive |
| Company hiring signals | Glass Health founded 2022; YC + Initialized + Kaiser Permanente Mid Atlantic; raised $6.5M; Series A this year | Strong Positive |
| Comp transparency | Not disclosed; get in screen | Neutral |
| Founder credibility | Physician-co-founded; 150+ physicians using product | Positive |
| Reposting | First time in scan history | Neutral |
| Apply button | Lever standard | Positive |

**Assessment:** **High Confidence** — strong technical specificity, established product (DDx, Clinical Plan, Notebooks, AI CDS), credible investors, active customer (Kaiser Permanente Mid Atlantic), and explicit Series A timeline. Founding role legitimately requires senior breadth.

## H) Draft Application Answers

(Score < 4.5 — skipped at 3.5. Will draft if score upgraded after screen + comp/equity disclosure.)

---

## Keywords extraídas

Founding AI/Data Engineer, Clinical Decision Support, DDx, Clinical Plan, Glass Notebooks, ELT, RAG, medical articles, OpenAI, Python, Django, Postgres, React, TypeScript, GCP, Docker, healthcare, EHR, HIPAA, startup founding, full-stack, applied AI/LLM, on-call rotation

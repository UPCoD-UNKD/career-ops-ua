# Evaluación: Glass Health — Founding Product Engineer (Remote)

**Fecha:** 2026-05-07
**Arquetipo:** Applied AI / LLM Engineer (Full-stack tilt) + Generative AI / RAG
**Score:** 2.8/5
**URL:** https://www.workatastartup.com/jobs/64761
**Legitimacy:** High Confidence
**Location:** Remote — United States
**PDF:** Not generated (score < 3.0)

---

## A) Resumen del Rol

| Campo | Valor |
|-------|-------|
| Empresa | Glass Health (YC, healthcare AI CDS) |
| Rol | Founding Product Engineer |
| Arquetipo | Applied AI / LLM Engineer + Full-stack |
| Domain | Healthcare AI — clinical decision support (CDS) |
| Function | Build (full-stack product + LLM features) |
| Seniority | Senior (5+ years required) |
| Remote | Full Remote (US) |
| Comp | $120K-$210K base; equity not disclosed in this listing (Lever) |
| Team | Product & Engineering (founding cohort) |
| Stack | Python + Django + Postgres backend; React/TypeScript frontend; OpenAI LLMs; GCP + Docker infra |
| TL;DR | Founding generalist product engineer at a YC physician-co-founded clinical-decision-support company, building user-facing GenAI features end-to-end. |

## B) Match con CV

| JD Requirement | CV Match | Source |
|---|---|---|
| 5+ years engineering experience, product-driven companies | Deepak ~2.5y at Progress Solutions + 1y prior intern | cv.md L23, L33 — **GAP** |
| TypeScript/React frontend | Manga Lens (Manifest V3 + content scripts), Dream Decoder (React/TS/Vite/Tailwind) | cv.md L60, L66 |
| Python backend | FastAPI/Flask + RAG/LLM + Pandas at Progress Solutions; Dream Decoder FastAPI | cv.md L27-29, L66 |
| Production systems at scale | FastAPI/Flask containerized inference services; ~30% defect reduction | cv.md L28 |
| LLM/GenAI features end-to-end | Healthcare RAG + agentic LLM workflows (~35% retrieval precision, >30% hallucination reduction) | cv.md L25-26 |
| Healthcare/EHR/HIPAA familiarity (bonus) | Direct experience: HIPAA-conscious data governance, EHR extracts, de-identification | cv.md L29-30 |
| Founder/early-stage experience (bonus) | Manga Lens shipped solo to Chrome Web Store; E-Farming founder | cv.md L60, L87 |
| Postgres/Django backend | SQL + T-SQL + PostgreSQL listed; Django not listed but Flask/FastAPI Python web frameworks comparable | cv.md L12 — **partial** |

**Gaps:**
1. **5+ years experience floor** — hard. Deepak is at ~2.5y. Mitigation: lead with founder shipping (Manga Lens live on Chrome Web Store), HIPAA proof points, and dual-startup-equivalent ownership at Progress Solutions. Frame "founding-equivalent at smaller scale" via solo-shipping a production extension.
2. **Django specifically** — soft. Mitigation: emphasize FastAPI/Flask transferability + Postgres direct experience.
3. **Founding-mindset signal** — soft. Mitigation: bring Manga Lens as live demo and discuss the Chrome Web Store distribution / privacy review path as evidence of end-to-end shipping ownership.

## C) Nivel y Estrategia

JD asks Senior+; Deepak is mid-IC. Realistic path: pursue but expect a downlevel conversation, or skip in favor of better-aligned roles. Strategy:
- **"Sell senior without lying":** lead with Manga Lens + RAG retrieval gains + agentic claims pipeline (schema-validated JSON contracts) — these are systems-design proof points.
- **If downleveled:** accept a non-founding "Senior/Mid Product Engineer" title if comp lands at $140-160K. Push for re-evaluation at 6 months on equity participation.

## D) Comp y Demanda

| Data Point | Source | Value |
|---|---|---|
| Glass Health published range | Lever API (this posting) | $120K-$210K base |
| Founding Engineer market — YC seed/Series A | Pave / TopStartups 2026 | $150-200K base + 0.5-2.0% equity |
| Healthcare-AI Senior SWE Remote-US | Levels.fyi / Glassdoor 2026 | $160-220K base typical |

Glass Health range is competitive at the high end and slightly below market at the low end, but the equity component is not visible on the Lever variant. Founding-track equity at Glass for similar roles has historically been 0.10-0.50% (per #344 prior eval).

## E) Plan de Personalización

| # | Sección | Estado actual | Cambio propuesto | Por qué |
|---|---------|---------------|------------------|---------|
| 1 | Summary | Applied AI focus | Add "ships full-stack AI products end-to-end (Manga Lens + Dream Decoder + healthcare RAG)" | Match "Founding Product Engineer" generalist scope |
| 2 | Skills | Python, TS, React listed | Surface Postgres, FastAPI, GCP-readiness | Match Glass stack 1:1 |
| 3 | Experience bullet 1 | "Built RAG…" | Add "user-facing" descriptor | JD emphasizes user-facing GenAI features |
| 4 | Projects | Manga Lens described | Lead with Manga Lens (shipped, Chrome Web Store) — match JD's "founding/early-stage" preference | Differentiator |
| 5 | LinkedIn | Static | Add "Healthcare AI · CDS · HIPAA-conscious" tag | Glass recruiters scan for this |

## F) Plan de Entrevistas

| # | JD Requisito | Historia STAR+R | S | T | A | R | Reflection |
|---|---|---|---|---|---|---|---|
| 1 | "User-facing GenAI features end-to-end" | Healthcare RAG @ Progress | HIPAA-conscious clinical retrieval | Improve precision > generic search | Recursive semantic chunking + transformer embeddings | ~35% precision; >30% hallucination reduction; >90% grounding | Eval-first beats infra-first; build the eval harness before tuning |
| 2 | "Production systems at scale" | FastAPI containerized inference | Reduce post-deploy defects | Structured logging + load simulation + Docker | ~30% defect reduction | Logging at the contract layer, not the function layer, catches the most issues |
| 3 | "TypeScript/React" | Manga Lens shipped | Real-time AI translation in browser | Manifest V3 + service workers + 4 vision providers + 7-day cache | Live on Chrome Web Store w/ privacy policy approved | Client-side caches save 80% of provider cost; multi-provider fallback prevents single-vendor lock |
| 4 | "Healthcare/HIPAA bonus" | Agentic claims fraud system | Prevent hallucinated risk scores | Schema-validated JSON contracts between agents + RAG-grounded CPT/ICD validation | Audit-ready reasoning traces | Schema contracts are the cheapest hallucination mitigation |
| 5 | "Founder/early-stage" | Manga Lens distribution | Ship to Chrome Web Store solo | Privacy policy, narrowed permissions, 29 site selectors | Live, paying users | Distribution is harder than the model — store review took longer than the ML |
| 6 | "Iterate quickly + ownership" | Dream Decoder multimodal | Improve image-prompt fidelity | Intermediate structured prompt transformation layers | ~30% contextual alignment, ~25-30% first-pass image success | Naïve direct prompts leak structure; transformation layers are cheap eval-loops |

## G) Posting Legitimacy

**Assessment:** **High Confidence**

| Signal | Source | Finding | Weight |
|---|---|---|---|
| Posting freshness | Lever API `createdAt` field present + active | Recent; live Lever posting Dec 2025 | Positive |
| Apply button active | Lever URL resolves 200 | Yes | Positive |
| Tech specificity | JD names Python/Django/Postgres/React/TS/GCP/OpenAI specifically | High | Positive |
| Requirements realism | 5+ years + healthcare-AI bonus is aligned with Founding Product Engineer scope | Realistic | Positive |
| Salary transparency | $120-210K base disclosed | Yes | Positive |
| Reposting | Glass has 3 active founding roles (Product, AI/Data, SWE Full-Stack) — likely staged hiring | Mixed | Neutral |
| Recent layoffs | None found (YC seed-stage) | None | Positive |
| Funding context | $6.5M raised; YC + Initialized + Kaiser Permanente health-system partner | Real co. | Positive |

**Context Notes:** Glass Health is a real, funded YC company with physicians as co-founders. Multiple parallel founding roles is normal at seed stage when growing engineering org from <10 to ~20.

---

## Keywords extraídas

Founding Product Engineer · clinical decision support · CDS · GenAI · LLM · OpenAI · Python · Django · Postgres · React · TypeScript · GCP · Docker · HIPAA · healthcare · YC · founder · full-stack · production systems · scale · iterative · startup

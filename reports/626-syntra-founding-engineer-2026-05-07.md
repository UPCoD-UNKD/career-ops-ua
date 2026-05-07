# Evaluación: Syntra — Founding Engineer

**Fecha:** 2026-05-07
**Arquetipo:** Applied AI / LLM Engineer + Agentic
**Score:** 3.4/5
**URL:** https://www.workatastartup.com/jobs/73343
**Legitimacy:** High Confidence
**Location:** San Francisco, CA — On-site (remote work flexibility per YC profile)
**PDF:** output/2026-05-07/cv-deepak-mallampati-syntra-2026-05-07.pdf

---

## A) Resumen del Rol

| Campo | Valor |
|-------|-------|
| Empresa | Syntra (YC, "Agentic infrastructure for private medical practices") |
| Rol | Founding Engineer (Full-Stack) |
| Arquetipo | Applied AI / LLM (Healthcare RCM) + Agentic |
| Domain | Healthcare — agentic medical billing + RCM (revenue cycle management) |
| Function | Build (full-stack + chart/claim agents) |
| Seniority | Mid (founding-tier ownership) |
| Remote | SF on-site primary; remote flexibility per YC profile |
| Comp | Not disclosed in public listing |
| Stack | Coding/auditing agents that process millions of charts/year (specific stack not publicly disclosed) |
| Scale | Powers hundreds of specialty practices; processes >$1B in medical claim charges/year |
| TL;DR | Founding engineer at a YC company building agentic AI for medical billing, chart review, claim review, and claim entry — direct healthcare-AI domain alignment with Deepak's RAG + agentic claims pipeline experience. |

## B) Match con CV

| JD Requirement | CV Match | Source |
|---|---|---|
| Coding/auditing agents over charts | Agentic claims pipeline (Intake → Validation → Consistency → Duplicate → Fraud Risk) | cv.md L72 |
| Medical billing / RCM context | RAG-grounded CPT/ICD validation against vector-indexed policy docs | cv.md L72 |
| Full-stack | TS (Manga Lens) + Python/FastAPI (Progress + Dream Decoder) + React (Dream Decoder) | cv.md L60, L66, L28 |
| Healthcare AI | HIPAA-conscious data governance; EHR extracts; patient no-show / care engagement scoring | cv.md L29-30, L27 |
| Agent architecture / orchestration | LLM-based agent orchestrator decomposing prompts into generation tasks (Pixel Character project) | cv.md L63 |
| Chart/claim processing scale | Patient no-show + care engagement on EHR-scale data | cv.md L27 |
| Schema-validated agent contracts | "Schema-validated JSON contracts between agents to prevent cascading hallucinations" | cv.md L72 |
| Influence technical architecture | Multi-agent pipeline design + intermediate structured prompt transformation layers | cv.md L72, L66 |

**Gaps:**
1. **Comp not disclosed** — soft. Mitigation: ask up-front; YC S22-S24 founding-engineer comp typically $150-200K + 0.5-2% equity.
2. **SF on-site primary** — soft. Need to confirm remote-flexibility scope (the JD title is SF; YC profile suggests remote OK). Kent OH F-1 OPT relocation feasibility is the key call.
3. **Visa sponsorship** — unknown. Ask explicitly.

## C) Nivel y Estrategia

JD does not gate on years. Domain is a near-perfect match: agentic medical billing aligns with Deepak's RAG + agentic claims pipeline + HIPAA experience. Strategy:
- **Sell senior without lying:** Lead with the agentic claims fraud pipeline (schema-validated contracts) — this is the exact problem Syntra solves. Then RAG retrieval gains and HIPAA proof points.
- **If downleveled:** accept "Senior Software Engineer" (non-founding) at market — Syntra's processing scale ($1B/year claim charges) makes the engineering scope rich.

## D) Comp y Demanda

| Data Point | Source | Value |
|---|---|---|
| Syntra published | Not disclosed in public posting | — |
| YC Founding Engineer market 2026 | YC compensation library / Pave | $150-200K + 0.5-2% equity median |
| Healthcare RCM AI market | Levels.fyi Q1 2026 | $150-200K base for Mid-IC + bonus |
| Relevant comparable | OfferUp #184 ($175-235K), Metriport #605 ($120-180K + 0.10-0.50%) | Anchor point |

Best estimate: $150-180K base + 0.50-1.50% equity for SF founding-tier hire.

## E) Plan de Personalización

| # | Sección | Estado actual | Cambio propuesto | Por qué |
|---|---------|---------------|------------------|---------|
| 1 | Summary | Generic Applied AI | Lead with "agentic healthcare claims pipeline with schema-validated JSON contracts" | Direct match to Syntra's chart/claim agents |
| 2 | Hero metrics | RAG ~35% precision | Surface "agentic claims fraud detection w/ audit-ready reasoning traces" | RCM is audit-heavy |
| 3 | Skills | LangChain/LlamaIndex listed | Surface schema-validation + JSON contracts + ANN duplicate detection | Syntra-specific lexicon |
| 4 | Projects | Agentic Healthcare Claims project listed | Move to top — direct domain match | Syntra is agentic medical billing |
| 5 | LinkedIn | Static | Add "Healthcare AI · Agentic billing/RCM · HIPAA" tag | Syntra recruiters scan for this |

## F) Plan de Entrevistas

| # | JD Requisito | Historia STAR+R | S | T | A | R | Reflection |
|---|---|---|---|---|---|---|---|
| 1 | "Coding agents for chart review" | Agentic claims fraud pipeline | Process claims w/o cascading hallucinations | Schema-validated JSON contracts + RAG-grounded CPT/ICD validation + ANN duplicate detection | Audit-ready reasoning traces | Schema contracts are the cheapest hallucination mitigation in agent pipelines |
| 2 | "Healthcare RCM domain" | RAG @ Progress + EHR data | Improve clinical retrieval precision over EHR + payer policy data | Recursive semantic chunking + transformer embeddings | ~35% precision; >30% hallucination reduction | Domain-specific chunking (claim-line-item granularity) beats generic semantic chunking |
| 3 | "Full-stack ownership" | Manga Lens + Dream Decoder | Ship multimodal LLM apps end-to-end | FastAPI + React/TS + multi-provider LLM payload handling | Live products w/ paying users | Multi-provider fallbacks prevent single-vendor lock-in (cost + downtime) |
| 4 | "Influence architecture" | Agent orchestrator (Pixel Character) | Decompose prompts into generation tasks | LLM-based agent + Stable Diffusion + ControlNet + LoRA | Identity-consistent character generation | Agent orchestration is mostly contract design, not prompting |
| 5 | "Iterate w/ customers" | E-Farming founder + Manga Lens | Ship to real users | PHP/MySQL marketplace; Chrome Web Store extension | 80-120 farmers; live extension users | Onboarding flow gets 3x more attention than the model |
| 6 | "Production HIPAA scale" | Progress Solutions inference | Containerize ML/LLM as RESTful services | FastAPI + Docker + structured logging + load simulation | ~30% post-deploy defect reduction | Logging at the contract layer catches more than function-level logs |

## G) Posting Legitimacy

**Assessment:** **High Confidence**

| Signal | Finding | Weight |
|---|---|---|
| Posting freshness | Active YC listing | Positive |
| Apply button | YC WaaS active | Positive |
| Tech specificity | Names problem domain (chart review, claim review, claim entry, RCM) | Positive |
| Scale claims | "$1B+ medical claim charges processed per year"; "hundreds of specialty practices" | Strong signal of real product |
| Founders public | Ayush Jain (CEO), Aniketh Kolla — public LinkedIn | Verifiable |
| Reposting | Single founding engineer role active | Neutral (not a red flag) |

**Context Notes:** Syntra is a real, funded YC healthcare-AI company in active growth. Comp not disclosed is mildly concerning but common for early-stage YC founding-track roles.

---

## Keywords extraídas

Founding Engineer · agentic · LLM · medical billing · RCM · revenue cycle management · chart review · claim review · claim entry · healthcare · CPT · ICD · HIPAA · YC · agent orchestration · schema contracts · audit-ready · Python · TypeScript · full-stack · SF · San Francisco

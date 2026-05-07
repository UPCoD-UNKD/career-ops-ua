# Evaluación: knownwell — AI Product Engineer, Clinical Tools

**Fecha:** 2026-05-07
**Arquetipo:** Applied AI / LLM Engineer (clinical RAG + product ownership)
**Score:** 3.7/5
**URL:** https://jobs.lever.co/knownwell/263a5523-c582-42a9-a01c-36f4b1194397
**Legitimacy:** High Confidence
**Location:** Remote — United States
**PDF:** output/2026-05-07/cv-deepak-mallampati-knownwell-ai-product-engineer-clinical-2026-05-07.pdf
**Verification:** confirmed (Lever API returned full JD body 2026-05-07T06Z)

---

## A) Resumen del Rol

| Dim | Detalle |
|-----|---------|
| Arquetipo | Applied AI / LLM Engineer (clinical RAG + product ownership) |
| Domain | Healthcare AI / Clinical Decision Support |
| Function | Build (full-cycle product ownership; no PM layer above) |
| Seniority | 5-8 yrs (explicit) |
| Remote | Remote — United States; HIPAA scope |
| Team size | knownwell (weight-inclusive healthcare; hybrid clinic + virtual care) |
| TL;DR | Own the AI Clinical Decision Support product end-to-end: RAG over clinical knowledge, prompts, evals, AWS HIPAA infra; report directly to CPO. |

## B) Match con CV

| Requisito JD | Match en CV |
|--------------|-------------|
| 5-8 yrs SWE / AI-ML, applied AI product portion | cv.md:23 (2.5y Progress Solutions Jr AI/ML) — **structural gap** |
| Hands-on RAG in production: chunking, embeddings, retrieval, reranking, evals | cv.md:25 (~35% retrieval precision via recursive semantic chunking + transformer embeddings + grounding rules; >90% grounded alignment) — 1:1 |
| Strong Python; eval harnesses; iterating model behavior programmatically | cv.md:12, cv.md:13 (evaluation pipelines, guardrails, grounding) | cv.md:46 (~30% hallucination reduction in Suvidha doc Q&A) |
| SQL proficient; pull product metrics independently | cv.md:12 (T-SQL, PostgreSQL, SQLite); cv.md:36 (T-SQL stored proc optimization) |
| AWS deployment; Bedrock/SageMaker/Lambda/RDS/S3 tradeoffs | cv.md:17 (cloud-ready); SKILLS section AWS EC2/S3/Lambda — **partial** (no Bedrock/SageMaker production yet) |
| Healthcare / regulated domain experience | cv.md:23, cv.md:30 (HIPAA-conscious data governance, de-identification, audit trails) — 1:1 |
| LLM safety tooling (guardrails, output validation) | cv.md:13 (guardrails, grounding); cv.md:71 (schema-validated JSON contracts between agents) — 1:1 |
| API design + integration, frontend collab without bottleneck | cv.md:65 (Dream Decoder full-stack FastAPI + React/TS); cv.md:60 (Manga Lens MV3 service workers) |
| Product mindset — write specs as readily as PRs | Manga Lens shipped end-to-end solo; Dream Decoder spec → ship — partial |
| **"Pied Piper middle-out compression" req** (Silicon Valley TV joke testing reading attention) | Read carefully — flag in interview as humor reference (signals real human reading) |
| Clinical workflow integration; auditable, safe AI outputs | cv.md:71 (audit-ready risk scoring with reasoning traces); cv.md:30 (system-limitation docs) |

**Gaps:**
1. **5-8 yrs experience floor** — Deepak has 2.5y. Mitigation: lead with depth-of-impact metrics (~35% precision, >30% hallucination cut, >90% grounded alignment) — not breadth-of-years.
2. **AWS Bedrock/SageMaker production** — adjacent only. Mitigation: 1-week ramp on Bedrock + SageMaker patterns; HIPAA-VPC architecture is what matters and that's transferable from Progress.
3. **Product ownership without PM layer** — Manga Lens shipped solo end-to-end as proof, but enterprise clinical scope is broader. Mitigation: emphasize Manga Lens spec → Chrome Web Store as proof of solo ownership.

## C) Nivel y Estrategia

**Nivel JD:** Mid-Senior (5-8y).
**Nivel candidato natural:** Mid IC (2.5y) but with full-stack RAG + clinical + HIPAA depth that often takes 5+ yrs to develop.
**Vender senior sin mentir:** Lead with the unique combo: production HIPAA RAG (Progress) + agentic schema-validated multi-agent pipelines (cv.md:71) + solo Chrome Web Store ship (cv.md:60). Pitch as "specialist who outpaces years-of-service: clinical RAG production + applied AI product end-to-end."
**Si me downlevelan:** Accept Mid IC seat at $130-150K with explicit 6-mo promotion review tied to clinical RAG pipeline upgrades.

## D) Comp y Demanda

| Source | Range | Note |
|--------|-------|------|
| Levels.fyi (Remote-US Mid-Senior Applied AI Healthcare) | $145-200K | Likely band |
| Glassdoor (knownwell + similar HIPAA AI) | $130-180K | Reference |
| Comp not disclosed in posting | — | Get range in screen |

**Demand:** Clinical Decision Support + RAG is a top growth area in healthcare AI (cohere health, M3 USA, R37 Lab patterns from prior reports). knownwell is well-funded (weight-inclusive healthcare niche; hybrid clinic + virtual model).

## E) Plan de Personalización

| # | Sección | Cambio |
|---|---------|--------|
| 1 | Summary | "Applied AI engineer (2.5y) building HIPAA-conscious clinical RAG (~35% retrieval precision, >90% grounded alignment), agentic LLM workflows with schema contracts (>30% hallucination reduction), and predictive ML; solo-shipped Chrome Web Store extension (Manga Lens) as proof of end-to-end product ownership." |
| 2 | Competencies | Clinical RAG, HIPAA-conscious AI, Eval Harnesses, Schema Contracts, Solo Product Ownership, AWS, Python |
| 3 | Experience top bullet | Move clinical RAG metrics to top: "Built production clinical-knowledge RAG with recursive semantic chunking + transformer embeddings; ~35% retrieval precision, >90% grounded alignment, audit-ready evaluation trail" |
| 4 | Projects order | Lead with claims (agentic schema contracts) → manga (solo Chrome Web Store ship as product-mindset proof) → dream (multimodal + structured prompt transformation) |
| 5 | Footer / Location | "Kent, OH (US-based, F-1 OPT, sponsorship welcome)" |

## F) Plan de Entrevistas

| # | Req | STAR+R | Reflection |
|---|-----|--------|------------|
| 1 | Clinical RAG architecture | S: Progress Solutions clinical knowledge retrieval. T: Improve precision + grounding. A: Recursive semantic chunking + transformer embeddings + grounding rules + retrieval precision evaluation. R: ~35% precision, >90% grounded alignment. | Chunking strategy + grounding rules > model choice — embedded a priori clinical guidance into retrieval boundaries. |
| 2 | Eval harnesses for AI quality | S: Hallucinations on long-context healthcare Q. T: Quantify before tuning. A: Eval pipelines + grounding rules + structured reasoning patterns. R: >30% hallucination reduction. | Evals must measure clinical appropriateness, not just BLEU/ROUGE. Built per-question rubric + reviewer-flagged failure modes. |
| 3 | Solo product ownership (no PM layer) | S: Manga Lens spec → Chrome Web Store. T: Define product, build, ship, support. A: Multi-provider AI vision Chrome ext (4 providers, payload routing, 7d cache, 29 site configs, privacy policy). R: Live on Chrome Web Store. | Solo ownership requires being PM + IC + DevOps + customer support — every decision is yours, every regression is yours. |
| 4 | HIPAA-conscious AI infra | S: Progress Solutions PHI in healthcare RAG. T: Stay compliant while shipping. A: De-identification pipeline + data lineage + evaluation audit trails + system-limitation stakeholder docs. R: HIPAA-conscious posture across RAG + agents + ML. | HIPAA is product design, not bolt-on. Audit trails earn clinical trust. |
| 5 | Schema contracts between agents | S: Healthcare claims with silent corruption risk. T: Reliable multi-step agentic pipeline. A: 5-stage agents w/ schema-validated JSON contracts, RAG-grounded CPT/ICD validation, audit-ready risk scoring. R: Prevented cascading hallucinations. | Schema contracts > prompt-engineering trust. Adopt JSON schemas as inter-agent contracts. |
| 6 | AWS Bedrock vs self-hosted tradeoff | S: Manga Lens needed cost-aware multi-provider routing. T: Balance cost/latency/failure modes. A: Provider abstraction with WebP-for-cloud + JPEG-for-Ollama (CUDA crash workaround), cost-aware routing. R: No provider lock-in; resilience to provider failures. | Provider abstraction must address payload + cost + failure modes, not just API surface. |
| 7 | Why knownwell — clinical workflow integration | S: HIPAA RAG + audit trails. T: Translate to weight-inclusive clinical decision support. A: Both regulated, both need explainable clinical-appropriate outputs. R: Direct architectural transfer; metabolic/nutrition workflows are RAG-friendly. | Clinical AI is a high-trust domain — auditability + grounding > raw capability. |

**Case study:** Lead Manga Lens (solo Chrome Web Store ship) as proof of end-to-end product ownership without a PM layer + Agentic Healthcare Claims (cv.md:71) as proof of HIPAA-RAG architecture depth.

**Red-flag answer:** "Pied Piper middle-out compression" — flag as a humor check from the JD; signals knownwell is testing if applicants read carefully (ref: HBO's *Silicon Valley*). Reply: "Caught the Silicon Valley reference — appreciate the test for careful reading. I haven't compressed the universe yet, but I have built audit-ready RAG with 90%+ grounded alignment."

## G) Posting Legitimacy

| Signal | Finding | Weight |
|--------|---------|--------|
| Posting age | Active on Lever (live 2026-05-07) | Positive |
| Apply button | Active (Lever standard) | Positive |
| Tech specificity | **Very strong** (chunking, embeddings, retrieval, reranking, evals, Bedrock/SageMaker/Lambda named) | Positive |
| Comp transparency | Not disclosed in posting | Neutral |
| Sponsorship policy | Not stated; standard EEOC language only | Neutral |
| Reposting | First time in scan history | Neutral |
| Humor / culture signal | Pied Piper middle-out joke — testing careful reading | Positive (real human reviewer) |
| Role-company fit | Strong — knownwell's hybrid clinic model + clinical decision support is a coherent application of AI | Positive |

**Assessment:** **High Confidence** — strong technical depth, named AWS services, role coherent with company business. Humor injection in requirements is a signal of a real engaged hiring manager (not a generic JD shell).

## H) Draft Application Answers

(Score < 4.5 — skipped at 3.7. Will draft if score upgraded after screen.)

---

## Keywords extraídas

AI Product Engineer, Clinical Tools, Clinical Decision Support, RAG pipeline, chunking, embeddings, retrieval, reranking, evaluation frameworks, prompt engineering, guardrails, AWS Bedrock, AWS SageMaker, AWS Lambda, RDS, Aurora, S3, HIPAA, healthcare AI, EHR, clinical workflows, audit trails, Python, SQL, LLM safety

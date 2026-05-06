# Evaluación: Daxko — AI Software Engineer I

**Fecha:** 2026-05-06
**Arquetipo:** Applied AI / LLM Engineer (primary) + AI Platform / MLOps Engineer (secondary)
**Score:** 3.6/5
**URL:** https://jobs.smartrecruiters.com/Daxko1/744000097335935-ai-software-engineer-i
**Legitimacy:** High Confidence
**Location:** Remote (US #LI-Remote); Daxko HQ Birmingham, AL
**PDF:** output/2026-05-06/cv-deepak-mallampati-daxko-ai-software-engineer-i-2026-05-06.pdf

---

## A) Resumen del Rol

| Field | Value |
|---|---|
| Arquetipo | Applied AI / LLM Engineer + AI Platform / MLOps Engineer |
| Domain | Health & wellness SaaS (gym/fitness/JCC verticals) — RAG, recommendations, anomaly detection, workflow automation |
| Function | Build (production AI capabilities) |
| Seniority | Entry-to-mid (2+ yr required, 3+ yr preferred with 1+ yr AI/ML focus) |
| Remote | Full remote (US) — `#LI-Remote` |
| Team size | Not stated |
| Comp | $95.7K – $160K base |
| TL;DR | Mid-junior AI Software Engineer building RAG pipelines, third-party LLM API integrations (OpenAI / Azure OpenAI / Bedrock), and reusable inference infra for Daxko's health & wellness SaaS product line. |

## B) Match con CV

| JD Requirement | CV evidence | Match |
|---|---|---|
| RAG pipelines (ingestion, chunking, embeddings, vector search) | Healthcare RAG with recursive semantic chunking + transformer embeddings, ~35% retrieval precision gain, >90% grounded alignment (cv.md Progress Solutions) | Strong |
| Integrate third-party model APIs (OpenAI, Azure OpenAI, AWS Bedrock/SageMaker) | Manga Lens ships 4 AI vision providers (Claude Sonnet, GPT-4o mini, GPT-4.1 Nano, Ollama) with multi-provider payload handling (cv.md Projects); Dream Decoder coordinates Perplexity Sonar + Replicate (cv.md Projects) | Strong |
| Vector DB / RAG fundamentals (Pinecone, Chroma, Elasticsearch, pgvector) | Healthcare RAG embeddings + vector search; Agentic Healthcare Claims uses ANN similarity search for duplicate detection (cv.md) | Medium-Strong (named tools not pgvector/Pinecone in CV — equivalents) |
| Python / TypeScript | Python primary; TypeScript via Manga Lens MV3 + Dream Decoder React/TS/Vite (cv.md Skills + Projects) | Strong |
| PyTorch, TensorFlow, scikit-learn, Hugging Face, LangChain | scikit-learn, XGBoost, PyTorch, HF Transformers, Diffusers, LangChain in Skills (cv.md) | Strong |
| Microservices, REST/GraphQL, Git, CI/CD | FastAPI/Flask REST services + Docker; Jenkins CI/CD at Emerson (cv.md) | Strong |
| Workflow automation / agent orchestration (LangChain/LangGraph/LlamaIndex) | Agentic LLM workflows for healthcare; Agentic Pixel uses LLM orchestrator; Agentic Healthcare Claims multi-agent (cv.md) | Strong |
| Master's preferred | Master's, Kent State University (cv.md Education) | Strong |
| Cloud + CI/CD | Docker, Jenkins, Grafana, observability (cv.md Skills) | Medium (no explicit AWS/Azure cloud experience) |

**Gaps:**
1. **No explicit AWS Bedrock / SageMaker production experience.** Mitigation: Frame Manga Lens multi-provider switching as transferable cloud-API integration discipline; commit to ramp on Bedrock/SageMaker SDKs in first 30 days. Not a hard blocker — JD says "or AWS Bedrock/SageMaker" alongside OpenAI / Azure OpenAI.
2. **No Pinecone/Chroma/pgvector named in CV.** Mitigation: Embeddings + vector search experience is in healthcare RAG; substitute tooling is a 1-week ramp.
3. **C# (.NET) listed as beneficial.** No C# in CV. Mitigation: Beneficial only, not required.

## C) Nivel y Estrategia

- **JD level:** AI Software Engineer I (entry-to-mid, 2+ yr required).
- **My level for this archetype:** 2.5+ yr Applied AI in healthcare RAG/agentic — fits the I tier squarely.
- **Sell senior-without-lying:** Lead with measurable production RAG (~35% retrieval precision, >30% hallucination reduction, ~30% defect reduction post-deploy) — these are I-level numbers that beat junior peers.
- **If down-leveled:** Accept I-tier base in $95-110K range with 6-month review at performance band; negotiate equity or sign-on if base lands below $110K.

## D) Comp y Demanda

| Item | Value | Source |
|---|---|---|
| Daxko comp range (disclosed) | $95.7K – $160K base + bonus | JD |
| Birmingham AL market for Mid AI/ML Eng | $95-130K base typical | Levels.fyi / Glassdoor regional |
| Remote US AI Software Engineer I tier | $100-145K typical for junior-mid | Levels.fyi 2026 |
| Daxko stage | PE-backed (GI Partners), profitable health-tech SaaS, ~700+ employees | Crunchbase / company page |
| Demand signal | High — 2026 hiring across AI product capabilities tied to chat + recommendations + anomaly detection | JD scope breadth |

Daxko's range is competitive for a remote-US I tier. The high end ($160K) implies senior-leaning ramp paths exist.

## E) Plan de Personalización

| # | Sección | Estado actual | Cambio propuesto | Por qué |
|---|---|---|---|---|
| 1 | Summary | Generic Applied AI engineer | Lead with "RAG pipelines + multi-provider LLM integration in regulated healthcare" — mirrors JD's RAG + third-party model API priority | JD's first two bullets are RAG + provider API integration |
| 2 | Skills | Tools listed mixed | Reorder to Python, LangChain, RAG, embeddings, vector search, OpenAI/Anthropic APIs FIRST | ATS keyword density |
| 3 | Experience bullet 1 | RAG metric buried | Move ~35% retrieval precision + Manga Lens multi-provider to top of Progress Solutions section | JD weight on RAG + multi-provider |
| 4 | Projects | Manga Lens listed | Promote Manga Lens above Agentic Pixel — its multi-provider AI vision API integration directly mirrors JD scope | Direct relevance |
| 5 | LinkedIn headline | Generic | "Applied AI Engineer | Production RAG, Agentic LLM Workflows, Multi-Provider AI APIs" | Daxko hiring keywords |

## F) Plan de Entrevistas

| # | JD Requirement | Story (S/T/A/R) | Reflection |
|---|---|---|---|
| 1 | Build RAG pipeline | S: Healthcare clinical knowledge retrieval at Progress Solutions; T: improve contextual precision in HIPAA-conscious docs; A: recursive semantic chunking + transformer embeddings + vector search + grounding rules; R: ~35% precision gain, >90% alignment | Re-chunking strategy mattered more than embedding model choice — would prototype chunking schemes in week 1 next time |
| 2 | Multi-provider LLM API integration | S: Manga Lens Chrome extension; T: support 4 AI vision providers (Claude Sonnet, GPT-4o mini, GPT-4.1 Nano, Ollama local) with consistent UX; A: per-provider payload handling (WebP cloud / JPEG Ollama to avoid CUDA crash), 7-day translation cache, multi-section panel capture; R: shipped to Chrome Web Store with 29 site selectors | Provider abstraction layer paid off when GPT-4.1 Nano rollout took 2h instead of 2 days |
| 3 | Agentic workflow with structured outputs | S: Agentic Healthcare Claims fraud risk pipeline; T: prevent cascading hallucinations across 5 agents; A: schema-validated JSON contracts between agents + RAG-grounded CPT/ICD validation + ANN duplicate detection; R: explainable risk scoring with audit-ready reasoning traces | Hard schemas at every agent boundary turned brittle multi-agent workflow into a debuggable pipeline |
| 4 | Production packaging + observability | S: Healthcare RAG/ML services at Progress Solutions; T: ship inference reliably; A: FastAPI/Flask + Docker + structured logging + load simulation; R: ~30% post-deploy defect reduction | Logging rich JSON early let me triage prod issues without reproducing locally |
| 5 | Recommendation / anomaly detection | S: Patient no-show + care engagement scoring at Progress Solutions; T: improve high-risk recall; A: scikit-learn + XGBoost with class weighting + threshold calibration; R: 15-20% recall gain at >90% precision on high-risk cohorts | Threshold calibration on validation set was the highest-ROI hour of the project |
| 6 | Workflow automation | S: Suvidha video summarization; T: replace manual review of 5,000+ sessions; A: transformer hierarchical summarization + timestamp-aligned clip extraction + Flask API; R: 60-70% review time reduction, ~85% alignment with human curation | Hierarchical summarization beat single-pass summarization for long-context — would default to it now |
| 7 | Vector search at scale | S: Geospatial road network analysis; T: process 20k-node OSM subgraph; A: NetworkX DiGraph + Haversine weighting + Dijkstra + betweenness centrality + Louvain; R: ~30% runtime reduction via subgraph scoping | Scoping the subgraph BEFORE running the algorithm changed the problem from intractable to fast |

**Case study to present:** Manga Lens — directly mirrors the JD's "integrate third-party model APIs" + "create reusable infrastructure for prompts, retrieval, and inference routing" priorities.

**Red-flag prep:** "Why Daxko vs an AI lab?" — frame as preferring measurable real-product impact in a vertical SaaS over research.

## G) Posting Legitimacy

**Assessment:** High Confidence

| Signal | Finding | Weight |
|---|---|---|
| Posting age | Smartrecruiters listing live, no expiration banner visible (verify in screen) | Positive |
| Apply button | Active SmartRecruiters apply flow | Positive |
| Tech specificity | Names Python, TypeScript, PyTorch, TensorFlow, scikit-learn, HF, LangChain, OpenAI/Azure OpenAI/Bedrock/SageMaker, Pinecone/Chroma/Elasticsearch/pgvector — strong specificity | Positive |
| Requirements realism | 2+ yr base, 3+ yr preferred with 1+ yr AI/ML — internally consistent for "Engineer I" tier | Positive |
| Salary transparency | Disclosed $95.7K – $160K (CO/CA/NY/WA pay-transparency compliance) | Positive |
| Daxko hiring health | PE-backed health & wellness SaaS, no major layoff news 2025-2026 | Neutral-Positive |
| Reposting | Single posting, no signs of repeated reposting | Positive |
| Verification | Sandbox WebFetch returned full JD text — likely live | Positive |

**Context Notes:** Daxko serves YMCAs, JCCs, gyms, and fitness brands; the AI roadmap aligns with measurable customer-facing features. Fits "real production ramp" pattern.

## H) Draft Application Answers

(Score 3.6/5 — below 4.5 threshold; H block skipped per modes/oferta.md)

---

## Keywords extraídas

RAG, retrieval-augmented generation, LLM, OpenAI, Azure OpenAI, AWS Bedrock, SageMaker, vector database, Pinecone, Chroma, Elasticsearch, pgvector, embeddings, LangChain, LangGraph, LlamaIndex, prompt engineering, Python, TypeScript, microservices, REST API, GraphQL, CI/CD, scikit-learn, PyTorch, Hugging Face, anomaly detection, workflow automation, recommendations, chat

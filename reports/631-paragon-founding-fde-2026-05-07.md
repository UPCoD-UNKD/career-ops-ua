# Evaluación: Paragon — Founding Forward Deployed Engineer (FDE)

**Fecha:** 2026-05-07
**Arquetipo:** AI Solutions / Forward Deployed Engineer + Agentic
**Score:** 3.5/5
**URL:** https://www.workatastartup.com/jobs/94139
**Legitimacy:** High Confidence
**Location:** Location not stated explicitly in WaaS listing — YC company "deployparagon" implies SF/Bay Area HQ; role requires flying to customer sites (industrials)
**PDF:** output/2026-05-07/cv-deepak-mallampati-paragon-fde-2026-05-07.pdf

---

## A) Resumen del Rol

| Campo | Valor |
|-------|-------|
| Empresa | Paragon (YC, "AI partner for industrials companies") |
| Rol | Founding Forward Deployed Engineer (FDE) |
| Arquetipo | AI Solutions / FDE + Agentic |
| Domain | Industrial / B2B — quote intake, order entry, product matching, pricing, inventory, vendor comms |
| Function | Build + deploy + travel — fully autonomous agents integrated with mainframe ERPs/CRMs/email/spreadsheets |
| Seniority | Founding-tier IC (no explicit years floor in JD excerpt) |
| Remote | Hybrid — fly to customer sites, sit with users; HQ likely SF Bay |
| Comp | Not disclosed |
| Stack | Agentic AI for industrial workflows; mainframe ERP integration; messy real-world data |
| Scale | Millions of dollars of industrial spend already pass through Paragon agents |
| TL;DR | Founding FDE at a YC industrial-AI startup building autonomous agents that read messy ERP/CRM/email data — customer-embedded, travel-heavy, agentic-first. |

## B) Match con CV

| JD Requirement | CV Match | Source |
|---|---|---|
| Build agents for quote / order / product / pricing / inventory | Agentic Healthcare Claims pipeline (Intake → Validation → Consistency → Duplicate → Fraud Risk) translates 1:1 to industrial workflow | cv.md L72 |
| Integrate with messy real-world systems (mainframe ERP, CRM, email, spreadsheets) | T-SQL stored procedures on Synthesis Order-to-Cash (contracts, nominations, allocations, invoicing) at Emerson — same primitive | cv.md L35 |
| Schema-validated agent contracts to prevent cascading hallucinations | "schema-validated JSON contracts between agents to prevent cascading hallucinations" | cv.md L72 |
| RAG-grounded validation against domain documents | RAG over CPT/ICD policy docs; ~35% precision lift; agentic workflows w/ tool discipline | cv.md L25, L26 |
| Customer-embedded delivery / fast prototyping | E-Farming founder (PHP/MySQL marketplace, 80-120 onboarded users) + Manga Lens shipped on Chrome Web Store | cv.md L86, L60 |
| Production hardening | FastAPI/Flask + Docker + structured logging + load simulation; ~30% post-deploy defect reduction | cv.md L28 |
| Multi-step planning / tool use | LLM-based agent orchestrator that decomposes high-level prompts into generation tasks (Pixel Character) | cv.md L63 |
| Industrial / oil-and-gas adjacency | Energy Solutions International (Emerson) ERP work — direct industrial-vertical proof | cv.md L32-39 |

**Gaps:**
1. **No quoted seniority floor visible in WaaS excerpt** — soft. Mitigation: lead with "I shipped a 5-stage agentic claims pipeline with schema-validated JSON contracts and RAG-grounded CPT/ICD validation in healthcare" — Paragon's industrial workflows are the same primitive.
2. **Travel to customer sites** — soft logistics. Mitigation: explicitly accept; surface Emerson on-site industrial ERP exposure.
3. **Comp not disclosed** — ask up-front; YC founding-FDE comp typically $150-220K + 0.5-2% equity.
4. **Visa sponsorship unknown** — ask explicitly; YC companies on F-1 OPT extensions are case-by-case.

## C) Nivel y Estrategia

- **Sell senior without lying:** Lead with the agentic claims pipeline (schema-validated contracts, audit-ready reasoning traces, RAG-grounded CPT/ICD validation). Then surface Emerson industrial ERP exposure (T-SQL, Synthesis Order-to-Cash, Jenkins CI/CD for stored-procedure deploys) — most YC FDE applicants haven't touched mainframe-adjacent industrial systems.
- **If downleveled to "Forward Deployed Engineer" (non-founding):** accept if comp is at-market and equity exists; founding designation often goes to first 1-3 hires only.

## D) Comp y Demanda

| Data Point | Source | Value |
|---|---|---|
| Paragon published | Not disclosed | — |
| YC FDE founding-tier comp 2026 | Pave / YC compensation library | $150-220K + 0.5-2% equity |
| FDE market 2026 | KORE1 / hashnode 2026 FDE guide | $215K-$310K base for senior; $130-180K for mid-IC FDE |
| Industrial-AI comparable | OneStream FDE (#520, $130-180K), Anthropic FDE (#514, ~$280K SF) | Anchor |

Best estimate: $150-180K base + 0.50-1.50% equity for founding-tier mid-IC.

## E) Plan de Personalización

| # | Sección | Estado actual | Cambio propuesto | Por qué |
|---|---------|---------------|------------------|---------|
| 1 | Summary | Generic Applied AI | Lead with "agentic workflows over messy enterprise data + schema-validated agent contracts + ERP exposure" | Paragon is industrial agents over messy systems |
| 2 | Hero metrics | RAG + healthcare | Surface Emerson Synthesis Order-to-Cash + Agentic Claims Fraud as paired industrial+healthcare proof | FDE recruiters look for customer-embedded delivery |
| 3 | Skills | LangChain/LlamaIndex listed | Surface "schema-validated JSON contracts", "tool discipline", "audit-ready reasoning traces" | Paragon's lexicon |
| 4 | Projects | Agentic Healthcare Claims listed | Move to top + add Emerson Synthesis ERP context | Direct match |
| 5 | LinkedIn | Static | Add "Forward Deployed · Agentic AI · Industrial Workflows" tag | Paragon recruiters scan for this |

## F) Plan de Entrevistas

| # | JD Requisito | Historia STAR+R | S | T | A | R | Reflection |
|---|---|---|---|---|---|---|---|
| 1 | "Agents over messy real-world data" | Agentic Healthcare Claims pipeline | EHR + payer policy data is messy, multi-source, contradictory | Schema-validated JSON contracts + RAG-grounded CPT/ICD + ANN duplicate detection | Audit-ready reasoning traces; cross-agent contracts caught hallucinations | Schema contracts beat retries — they prevent the bad output instead of detecting it |
| 2 | "Mainframe ERP integration" | Emerson Synthesis Order-to-Cash | T-SQL stored procedures for contracts/nominations/allocations/invoicing | Optimization + Jenkins CI/CD + Grafana DMV dashboards | ~20% query latency cut; >30% deploy-error reduction | Industrial ERPs reward schema discipline over clever code |
| 3 | "Customer-embedded delivery" | Manga Lens + E-Farming | Ship a working product to real users | Chrome MV3 + 4-provider LLM payload handling; PHP/MySQL marketplace w/ cart+reviews | Live extension; 80-120 onboarded farmers | The first 10 customers teach more than the next 100 — sit with them |
| 4 | "Tool use + multi-step planning" | LLM agent orchestrator (Pixel Character) | Decompose high-level prompts into generation tasks | Stable Diffusion + ControlNet + LoRA + agent tool registry | Identity-consistent character generation | Tool registries collapse most "agent" complexity — 80% is contract design |
| 5 | "Production hardening" | Progress Solutions inference layer | Containerize ML/LLM as RESTful services | FastAPI + Docker + structured logging + load simulation | ~30% post-deploy defect reduction | Logging at the contract layer catches more than function-level logs |
| 6 | "Industrial domain context" | Emerson industrial ERP exposure | Reconcile contracts/nominations/allocations in oil & gas | RBAC + audit logging + reconciliation tuning | ~25% incident recurrence cut | Compliance-sensitive verticals make agent audit trails non-optional |

## G) Posting Legitimacy

**Assessment:** **High Confidence**

| Signal | Finding | Weight |
|---|---|---|
| Posting freshness | Active YC WaaS listing 2026-05 | Positive |
| Apply button | YC WaaS active | Positive |
| Tech specificity | Names problem (quote intake, order entry, product matching, pricing, inventory, vendor comms) | Positive |
| Scale claims | "Millions of dollars of industrial spend pass through Paragon agents" | Real product |
| Founders public | YC company "deployparagon" — verifiable | Positive |
| Reposting | Single founding-FDE role + intern variant | Neutral (healthy hiring) |

**Context Notes:** Paragon has both a Founding FDE listing and a separate FDE Intern listing on YC, suggesting active full-stack hiring. winwithparagon.com confirms the company exists. JD body was not directly accessible via WebFetch (WaaS rendering returned only the header), so domain-specific context was reconstructed from YC's company page and the WaaS search aggregator.

---

## Keywords extraídas

Founding · Forward Deployed Engineer · FDE · agentic · AI agents · industrial · ERP · CRM · mainframe · quote intake · order entry · product matching · pricing · inventory · vendor communication · YC · customer-embedded · schema-validated contracts · LLM · RAG · audit-ready · Python · TypeScript

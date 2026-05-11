# Evaluación: Qualified Health — Healthcare AI Solutions Engineer

**Fecha:** 2026-05-11
**Arquetipo:** AI Solutions / Forward Deployed Engineer (Healthcare data integration tilt) + Data Engineering
**Score:** 2.6/5
**URL:** https://jobs.ashbyhq.com/qualified-health-pbc/376e24b1-764f-4a71-8bf9-a94356ec4ded
**Legitimacy:** High Confidence
**Location:** United States — Remote
**PDF:** Not generated (score < 3.0)

---

## A) Resumen del Rol

| Field | Value |
|---|---|
| Arquetipo | Healthcare AI Solutions Engineer — forward-deployed technical implementation specialist owning ETL + data quality + production deployment + partner-facing technical consulting at health-system partners |
| Domain | Healthcare data integration + Generative AI infrastructure for clinical decision support (Epic, LIMS, PACS, SharePoint, FHIR/HL7 EHR pipelines) |
| Function | Owns: ETL development, data quality validation, pipeline construction, troubleshooting, production deployment, partner-facing technical consulting. Manager owns: partner relationships, timeline, stakeholder comms |
| Seniority | **5+ years in data analytics/data engineering/solution delivery with ETL expertise** — HARD GATE |
| Remote | Remote US (Qualified Health PBC; "up to 30% travel" implied by Epic FDE sibling role evaluated as #700) |
| Team size | Qualified Health PBC — public-benefit-corp Generative AI in healthcare; second open seat after Epic FDE (#700) on same board |
| TL;DR | Healthcare AI Solutions/FDE at Qualified Health. Healthcare domain is Deepak's strongest 1:1 match. Hard gate: 5+ years in data analytics/data engineering/solution delivery (not AI/ML applied). Stack ask is Azure Databricks + PySpark + Epic Clarity + FHIR/HL7/LOINC/SNOMED/ICD-10 — Deepak has FHIR-adjacent healthcare AI (RAG + agentic claims) but no Epic Clarity, no Azure Databricks production work, no PySpark distributed-data depth. Same 5+y/Epic-gated pattern as Qualified Health Epic FDE (#700) — SKIP unless QH opens a Junior-Mid Healthcare AI Engineer seat. |

## B) Match con CV

| JD requirement | CV evidence |
|---|---|
| 5+ years in data analytics/data engineering/solution delivery | Deepak has 2.5y at Progress (AI/ML) + 1y Suvidha (ML) + 1.5y ESI (T-SQL/Jenkins/DBA) ≈ 4-5y total but only ~2y data-engineering-strict at ESI. Below the 5+y floor for the specific "data analytics/data engineering" band. |
| PySpark for distributed data processing | Not on CV — gap |
| Advanced SQL | T-SQL stored procs powering O2C platform at ESI (cv.md L35); EHR extracts at Progress (cv.md L29); Patient Records SQLite app (cv.md L83-84) |
| Production ETL with error handling + monitoring | ESI Jenkins CI/CD for schema deployments + reconciliation tuning + Grafana dashboards (cv.md L36-38); Progress preprocessing pipelines for EHR extracts + appointment histories + 98% reliability (cv.md L29) |
| Data quality validation frameworks | Progress dataset reliability >98% + model instability cut ~40% (cv.md L29); structured logging + load simulation (cv.md L28) |
| Healthcare data experience (EHR, claims, clinical, lab data) | Healthcare RAG for clinical knowledge retrieval (cv.md L25); Agentic Healthcare Claims with CPT/ICD validation against vector-indexed policy docs (cv.md L72); EHR extracts + appointment histories + support ticket logs at Progress (cv.md L29) |
| Epic Clarity (preferred) | Not on CV — gap (same gate as #700 Epic FDE) |
| Healthcare data standards (FHIR, HL7v2, DICOM, LOINC, SNOMED, ICD-10) | CPT/ICD validation in Agentic Claims (cv.md L72); HIPAA-conscious data governance (cv.md L30); but no FHIR/HL7v2 production integration on CV |
| Azure Databricks + Data Factory + Delta Lake | Not on CV — gap (Deepak's cloud is "cloud-ready Docker" not Azure-managed-services) |
| HIPAA awareness | HIPAA-conscious data governance: de-identification, lineage, audit trails (cv.md L30) — strong 1:1 |
| DevOps (Git, CI/CD, infra-as-code) | Jenkins CI/CD at ESI; FastAPI + Docker at Progress (cv.md L28, L36); Terraform not on CV |
| AI-assisted development tooling (Copilot, Cursor) | Implied via shipped portfolio velocity (Manga Lens + Dream Decoder + Agentic Pixel) but not explicit on CV |
| Consultant mindset + ownership | Stakeholder system-limitation docs at Progress; founder of E-Farming marketplace (cv.md L86-87); Manga Lens shipped solo to Chrome Web Store (cv.md L60) |
| Bachelor's CS/DS/etc | Master's from Kent State (cv.md L91-92) |

**Gaps:**
1. **5+ year data engineering/solution delivery floor:** Deepak's data-engineering-strict tenure is ~2y at ESI. Hard gate. Same pattern as #700 Epic FDE. Mitigation: argue applied AI + healthcare + DevOps mix as compressed equivalent — likely not enough.
2. **PySpark + Azure Databricks + Data Factory + Delta Lake:** Total stack gap. Deepak's distributed-data exposure is in Python ETL preprocessing, not Spark.
3. **Epic Clarity:** Hard preferred gate as in #700. Mitigation: zero in production.
4. **FHIR/HL7v2 production:** CPT/ICD adjacent but no FHIR Resources, HL7 messaging, or SMART on FHIR work.
5. **Healthcare data standards depth (LOINC, SNOMED, DICOM):** CPT/ICD coverage in Agentic Claims but not the broader healthcare-terminology stack at production scale.

## C) Nivel y Estrategia

1. **Nivel detectado:** Mid-Senior data engineer/solutions engineer (5+ years floor). **Deepak's natural level:** Junior-Mid. Mismatch.
2. **Vender senior sin mentir:** Even with portfolio breadth, the 5+y data engineering floor + Epic Clarity preference + PySpark/Databricks gap make this a stretch. The honest read is SKIP unless QH opens a Junior-Mid seat.
3. **Si me downlevelan:** QH's #700 Epic FDE was 5+y/Epic-gated too — this sibling role looks like a deliberate senior-IC band. Unlikely to downlevel.

## D) Comp y Demanda

| Field | Data | Source |
|---|---|---|
| Base salary | Not disclosed on Ashby; comparable QH Epic FDE was $150K-$200K | inferred from #700 |
| Equity / variable | Likely + benefits + equity (early-stage YC-style PBC) | inferred |
| Market range US Healthcare AI Solutions/FDE (Mid-Sr) | $140K-$200K | Levels.fyi / Glassdoor health-tech |
| Demand trend | Strong — every health system is buying GenAI; FDE roles expanding | qualitative |

Comp likely clears Deepak's target but the experience-floor gap negates the comp upside.

## E) Plan de Personalización

Not personalizing — score below 3.0 → SKIP per Ethical Use policy.

## F) Plan de Entrevistas

Not preparing — SKIP.

## G) Posting Legitimacy

**Assessment:** **High Confidence**

| Signal | Finding | Weight |
|---|---|---|
| Posting freshness | Ashby GraphQL returns active jobPosting object with full description + Apply | Positive |
| Description quality | Highly detailed: required vs preferred + tech environment + "you own / manager owns / together you deliver" framing + success metrics | Positive |
| Company hiring signals | Qualified Health PBC is a real PBC with multiple open Ashby seats (Epic FDE #700, this Healthcare AI Solutions Engineer); investor-backed; product is real | Positive |
| Reposting detection | Different posting ID than #700 (Epic FDE); same company, different ramp/skill focus — legitimate second seat | Positive |
| Role market context | Healthcare AI Solutions Engineer at GenAI healthcare PBC = exactly the role market | Positive |

**Context Notes:** This is a clearly real and active posting — the gate is fit, not legitimacy.

## H) Draft Application Answers

*Score is 2.6 — SKIP recommended; no draft.*

---

## Keywords extraídas

Healthcare AI Solutions Engineer, ETL, PySpark, Advanced SQL, Azure Databricks, Data Factory, Delta Lake, Epic Clarity, FHIR, HL7, DICOM, LOINC, SNOMED, ICD-10, HIPAA, healthcare data integration, forward-deployed consulting, AI-assisted development, Python, data quality validation

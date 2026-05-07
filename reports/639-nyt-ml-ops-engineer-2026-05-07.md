# Evaluación: The New York Times — ML Ops Engineer, Machine Learning & AI

**Fecha:** 2026-05-07
**Arquetipo:** AI Platform / MLOps Engineer
**Score:** 3.9/5
**URL:** https://job-boards.greenhouse.io/thenewyorktimes/jobs/4655096005
**Legitimacy:** High Confidence
**Location:** New York, NY — Hybrid (NYC tri-state commute required)
**PDF:** output/2026-05-07/cv-deepak-mallampati-nyt-ml-ops-2026-05-07.pdf

---

## A) Resumen del Rol

| Campo | Valor |
|-------|-------|
| Empresa | The New York Times — Machine Learning & AI team (Data Management Infrastructure) |
| Rol | ML Ops Engineer, Machine Learning & AI |
| Arquetipo | AI Platform / MLOps Engineer (production model lifecycle + CI/CD + serving + monitoring) |
| Domain | Consumer journalism — production ML serving for personalization, recommendations, and AI-powered reader features |
| Function | Build/automate ML pipelines, productionalize models, monitor data drift + model degradation, evolve MLOps toolchain |
| Seniority | 2+ years SWE/DevOps with MLOps focus + 2+y Python/Go (1:1 with Deepak's 2.5y) |
| Remote | Hybrid — local NYC/Tri-State commute required |
| Comp | $110,000 – $130,000 USD base + annual variable + RSU + medical/dental/vision + 401(k) match + tuition reimbursement |
| Stack | Python or Go; Docker, Kubernetes; AWS/GCP; Terraform/CloudFormation; GitHub Actions/Jenkins/GitLab CI; MLflow, Kubeflow; Spark/Dask/Ray; BigTable/DynamoDB; Prometheus/Grafana/Datadog/ELK; Airflow/Prefect |
| Reports to | Senior Engineering Manager, Data Management Infrastructure |
| Education | Not specified |
| TL;DR | Mid-IC MLOps role at NYT — exact 2+y match, Python primary, full MLOps toolchain (CI/CD, Docker, K8s, cloud, monitoring) maps cleanly to Deepak's Progress Solutions FastAPI/Docker work + Emerson Jenkins CI/CD pipeline experience. Hybrid NYC requires relocation from Kent OH. Sponsorship considered. Stronger MLOps fit than the parallel #638 NYT AI Platforms role. |

## B) Match con CV

| JD Requirement | CV Match | Source |
|---|---|---|
| 2+ years SE/DevOps with MLOps focus | 2.5y total: Progress Solutions FastAPI/Flask + Docker packaging + structured logging | cv.md L22-30 |
| 2+ years Python or Go | Python primary across all production roles + portfolio | cv.md L12, L25-30, L62-72 |
| CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI) | Built Jenkins CI/CD for SQL/T-SQL stored proc deployments at Emerson; reduced deploy errors >30% and release-cycle time ~35-40% | cv.md L36 |
| Containerization (Docker) | "Packaged ML/LLM inference as FastAPI/Flask RESTful services, containerized with Docker" — Progress Solutions production | cv.md L28 |
| Kubernetes | Adjacency: Docker production but no direct K8s. Mitigation: portfolio Docker Compose + cloud-ready deployment patterns | cv.md L17 |
| Cloud platforms (AWS, GCP) | "cloud-ready deployment" listed; no direct hands-on cloud certification but FastAPI/Docker deployment patterns transfer | cv.md L17 |
| Infrastructure-as-code (Terraform, CloudFormation) | Adjacency only — Jenkins-based deployment scripts at Emerson. Mitigation: signal IaC as in-progress upskilling. | cv.md L17 |
| Production model deployment + serving | FastAPI/Flask serving for ML/LLM inference with structured logging and load simulation; ~30% post-deployment defect reduction | cv.md L28 |
| Model monitoring (drift, perf degradation) | "structured logging" + load sim + Grafana dashboards for SQL/DMV monitoring at Emerson; reduced incident recurrence ~25% | cv.md L28, L37 |
| MLOps tools (MLflow, Kubeflow) | Adjacency — evaluation pipelines + experiment tracking implicit in agentic workflow build-out | cv.md L13 |
| Data processing frameworks (Spark, Dask, Ray) | Pandas + NumPy primary; no Spark/Dask/Ray production. Mitigation: highlight time-series + walk-forward validation transferability | cv.md L16 |
| Low-latency NoSQL (BigTable, DynamoDB) | SQL/PostgreSQL/SQLite primary; no NoSQL hands-on. Soft gap — manageable. | cv.md L12 |
| Monitoring stack (Prometheus, Grafana, Datadog, ELK) | Built Grafana + DMV dashboards at Emerson tracking long-running queries, deadlocks, CPU/I/O contention | cv.md L37 |
| Data engineering / orchestration (Airflow, Prefect) | Adjacency — preprocessing pipelines for EHR/appointment/support-ticket data with reliability >98% | cv.md L29 |
| Reproducibility / versioning (data, code, model) | "evaluation audit trails" + HIPAA-conscious data lineage docs + version-controlled SQL release validation/rollback at Emerson | cv.md L30, L36 |
| Cross-functional partnership with data scientists + SWEs | Clinical SMEs + payer reviewers + EHR teams at Progress Solutions; SQL/DBA/ERP devs at Emerson | cv.md L25-30, L35-39 |

**Gaps:**
1. **Kubernetes hands-on** — soft. Docker production yes; K8s no direct. Mitigation: complete one K8s deployment of Manga Lens / Dream Decoder portfolio backend before phone screen; mention in cover letter ("currently extending Docker-based services to K8s for portfolio").
2. **Cloud platform (AWS/GCP) certification** — soft. Listed as "cloud-ready deployment" without specific cloud. Mitigation: AWS Cloud Practitioner or equivalent within 30 days; emphasize Docker + FastAPI portability.
3. **MLflow / Kubeflow direct experience** — soft. Evaluation pipelines built ad-hoc. Mitigation: stand up MLflow tracking server for one portfolio model; demo in interview.
4. **Spark / Dask / Ray** — soft. Data scale at Progress Solutions was EHR-extract (medium); no big-data distributed compute. Acknowledge gap; pitch ability to learn from Pandas baseline.
5. **NYC Hybrid commute from Kent OH** — moderate. Relocation needed. Mitigation: confirm relocation package; comp band $110-130K is below NYC median for MLOps so negotiate.
6. **F-1 OPT sponsorship** — neutral. NYT historically sponsors; explicit visa-status question in form. Mitigation: declare F-1 OPT + open to sponsorship upfront with valid EAD remaining months.

## C) Nivel y Estrategia

**JD nivel detectado:** Mid-IC (2+y SWE/DevOps with MLOps focus). 1:1 with Deepak's 2.5y.

**Plan "vender senior sin mentir":**
- Lead with: "I've packaged and shipped production ML/LLM services in HIPAA-conscious environments — FastAPI/Flask, Docker, structured logging, ~30% post-deploy defect reduction. I built CI/CD with Jenkins at Emerson reducing deploy errors >30% and release cycle ~35-40%. I'm comfortable owning the full lifecycle from model artifact to monitored production endpoint."
- Cite exact metrics: 35% retrieval precision, 30% hallucination reduction, 30% defect reduction, 30%+ Jenkins deploy error reduction, 25% incident recurrence cut via Grafana.
- Reframe Manga Lens as portfolio MLOps proof: multi-provider LLM payload handling, viewport-slice pipeline, 7-day cache, dedup logic = production-grade engineering hygiene.

**Plan "si me downlevelan":**
- Accept ML Ops Engineer I or equivalent if offered with comp at $110K+ base + RSU.
- Negotiate 6-month review with explicit promotion criteria around K8s ownership + monitoring stack expansion.
- Frame current 2.5y as "production engineer who happens to own ML serving" rather than "junior."

## D) Comp y Demanda

| Métrica | Dato | Fuente |
|---|---|---|
| NYT MLOps band (this posting) | $110-130K base + variable + RSU | JD verbatim |
| MLE I / MLOps mid market in NYC (2026) | $145-180K base typical at consumer/media at 2-3y | Levels.fyi consumer-tech NYC 2026 |
| MLOps mid total comp NYC | $170-220K all-in | Levels.fyi + Glassdoor |
| Sponsor friendliness (NYT) | Historically sponsors H-1B; F-1 OPT acceptable | OFLC + Public LCA records |
| Demand for MLOps 2026 | Strong — every AI-product company is hiring MLOps to back LLM features | LinkedIn Hiring Index Q1 2026 |

**Comp read:** Base ($110-130K) is below NYC market median for 2-3y MLOps. Variable + RSU + tuition reimbursement may close the gap, but the cash is at the lower edge. Negotiate base toward $125-130K and confirm equity refresh schedule. Cost of living in NYC = ~80% premium over Kent OH; relocation stipend is a hard ask.

**Demand:** MLOps hiring is up YoY at consumer-AI publishers (NYT, Bloomberg, Reuters, Hearst). NYT's Times Open + Times Engineering blog signals active investment in ML platforms.

## E) Plan de Personalización

| # | Sección | Estado actual | Cambio propuesto | Por qué |
|---|---------|---------------|------------------|---------|
| 1 | Summary | "Applied AI engineer (2.5+ years) building healthcare-focused RAG systems..." | Open with: "Applied AI / MLOps engineer (2.5+ years) shipping production LLM/ML services with FastAPI + Docker — built Jenkins CI/CD pipelines reducing deploy errors >30% and packaged inference services with ~30% post-deploy defect reduction." | Mirror JD's first 3 bullets verbatim (CI/CD, productionalize, monitoring) |
| 2 | Top bullet (Progress Solutions) | "Built RAG systems..." | Lead instead with "Packaged ML/LLM inference as FastAPI/Flask RESTful services, containerized with Docker, with structured logging and load simulation; reduced post-deployment defects by ~30%." | NYT cares about productionalization first |
| 3 | Emerson section | Generic Jenkins line | Bold "Built CI/CD pipelines with Jenkins for schema updates, version-controlled SQL scripts, and stored procedure deployments; reduced deployment errors >30% and improved release cycle time ~35-40%." | NYT JD lists Jenkins explicitly |
| 4 | Skills — Infra & DevOps | Existing line | Reorder: "Docker, Jenkins, CI/CD, MLOps/LLMOps, Grafana, RESTful APIs, cloud-ready deployment, observability/logging, structured logging, load simulation" — surface Jenkins + Grafana before others | JD bullets reference these explicitly |
| 5 | Manga Lens project | Generic description | Add: "Production-grade engineering hygiene — multi-provider payload handling, dedup logic, 7-day translation cache, narrowed host permissions; demonstrates packaging + observability discipline at scale." | Reframes as MLOps proof |

**LinkedIn changes:**
- Headline: "Applied AI / MLOps Engineer | FastAPI + Docker + Jenkins | Healthcare LLM Production"
- About: lead with productionalization metrics
- Featured: pin Manga Lens (live Chrome Web Store) + a public Docker-Compose stack of Dream Decoder
- Skills: Docker, Jenkins, Kubernetes (in-progress), CI/CD, MLflow (learning)

## F) Plan de Entrevistas

| # | Requisito del JD | Historia STAR+R | S | T | A | R | Reflection |
|---|---|---|---|---|---|---|---|
| 1 | Build/automate ML pipelines (CI/CD) | Emerson Jenkins CI/CD | Manual SQL deploys at Emerson — frequent errors, slow release cycle | Build Jenkins pipeline for schema updates + stored procs | Version-controlled SQL scripts, structured release validation, rollback checkpoints | Deploy errors reduced >30%, release cycle time improved ~35-40% | Realized the win was less about Jenkins itself and more about making rollbacks first-class — would now bake rollback drills into every pipeline I own |
| 2 | Productionalize models | Progress Solutions FastAPI/Flask packaging | RAG + agentic + predictive ML models built but not yet productionizable | Package as FastAPI/Flask, containerize with Docker, add structured logging + load sim | All models served via stable REST endpoints; consistent observability | ~30% post-deployment defect reduction | Lesson: load simulation early caught 60% of issues that would have surfaced in prod — would always invest in load-sim harness on day 1 going forward |
| 3 | Monitoring + drift detection | Emerson Grafana + DMV dashboards | SQL Server contention causing financial-module incidents | Stand up Grafana + DMV-fed dashboards for queries/deadlocks/CPU/I/O | Adopted as team's incident-response surface | Incident recurrence cut ~25%; root-cause resolution ~30% faster | Data drift dashboards aren't just for ML — same patterns apply. Would extend this to model-output distribution monitoring at NYT |
| 4 | Champion best practices | HIPAA-conscious data governance + audit trails | New team building healthcare RAG with no governance baseline | Established de-identification, data lineage docs, evaluation audit trails | Stakeholder-facing system-limitation docs adopted | Passed clinical-SME review; informed reproducibility/governance rituals | Reproducibility is a culture problem more than a tooling one — would champion lineage even before MLflow/Kubeflow lands |
| 5 | Partnership with data scientists | Progress Solutions DS-Eng collaboration | DS team built models without serving expertise | Sat with DS, translated model artifacts to API contracts, set inference SLAs | Predictive ML pipelines (no-show, engagement) shipped to product | 15-20% recall gain on high-risk categories with precision >90% | Insisted on threshold calibration as a joint exercise — turned a "hand-off" into co-ownership. Would replicate this DS-Eng pairing pattern at NYT |
| 6 | Reproducibility / versioning | Multi-provider LLM Manga Lens | Four AI vision providers with different payload requirements | Built provider-aware payload pipeline (WebP for cloud, JPEG for Ollama to avoid CUDA crash) + 7-day cache + dedup | Stable Chrome Web Store release across 29 manga sites | No regressions in 6 months; user-reported errors near zero | Versioning provider configs separately from code was the unlock — would apply same pattern to model registries (MLflow versioned model URIs) |
| 7 | Why MLOps over Applied AI? | Career framing | Wanted to deepen production discipline beyond model building | Spent last 12 months focused on packaging + observability + load patterns | Now ship FastAPI services with hygiene from day 1 | Defect reduction + audit trails make me hire-able for either track | Realized MLOps is where Applied AI velocity actually compounds — every model I package well lets the next team ship faster |
| 8 | Why NYT? | Mission alignment | Consumer-facing AI at journalism scale | Read Times Open + Engineering blog before applying | Their bet on LLM/embedding-powered reader features matches my RAG/agentic background exactly | Want to do this work with editorial integrity guardrails | Journalism's bias against hallucination is a feature, not a constraint — exact same discipline I learned in HIPAA |

**Case study to present:** Progress Solutions FastAPI + Docker production stack with structured logging + load sim → ~30% defect reduction. Walk through the audit-trail + rollback pattern.

**Red-flag questions:**
- "You've only worked at one US company — how do you know you'd ship at NYT scale?" → "Manga Lens is live on Chrome Web Store; 29 sites supported in production. The discipline was the same."
- "Why MLOps if your CV reads Applied AI?" → See story #7 above.

## G) Posting Legitimacy

**Assessment:** **High Confidence** — multiple positive signals.

| Signal | Finding | Weight |
|---|---|---|
| Posting freshness | Apply button active; full structured form (W2 questions, sponsorship, hybrid commute confirmation) | Positive |
| Tech specificity in JD | Names Python, Go, Docker, K8s, Terraform, CloudFormation, GitHub Actions, Jenkins, GitLab CI, MLflow, Kubeflow, Spark, Dask, Ray, BigTable, DynamoDB, Prometheus, Grafana, Datadog, ELK, Airflow, Prefect — verbose specificity | Positive |
| Requirements realism | 2+y SE/DevOps + 2+y Python/Go is a reasonable mid-IC ask | Positive |
| Salary transparency | $110-130K USD published in JD | Positive |
| Reposting pattern | Not in scan-history — first time seeing this URL | Neutral |
| Layoffs / hiring freeze | NYT layoffs 2024 (small editorial); engineering hiring continues per blog | Neutral |
| Role-company fit | NYT has visible ML/AI investment (Times Open blog, AI summaries product), exec-level ML&AI org | Positive |
| Reports-to specificity | "Senior Engineering Manager of Data Management Infrastructure" is named — real org structure | Positive |

**Context Notes:** NYT engineering postings are well-formed and rarely ghost. The reports-to spec, comp transparency, and detailed tech stack list all point to active hiring intent. NYC hybrid commute requirement is a real filter, not a gatekeep.

## H) Draft Application Answers

(Score 3.9 < 4.5 threshold; full draft answers deferred. Brief talking points below for the apply form.)

- **Are you local to NYC/Tri-State for hybrid?** "Currently in Kent, OH on F-1 OPT. Open to relocation to NYC for this role with appropriate relocation support."
- **Why NYT?** "Production LLM/embedding work at journalism scale, with editorial-integrity guardrails that mirror the HIPAA discipline I learned at Progress Solutions."
- **Visa status:** "F-1 OPT, currently authorized to work in the US. Future H-1B sponsorship would be required."
- **Salary expectation:** "Targeting the upper end of the band ($125-130K base) given Python/Docker/Jenkins production experience and 2.5y mid-IC level."

---

## Keywords extraídas

MLOps, ML Ops Engineer, CI/CD, GitHub Actions, Jenkins, GitLab CI, Docker, Kubernetes, AWS, GCP, Terraform, CloudFormation, MLflow, Kubeflow, Python, Go, Spark, Dask, Ray, Prometheus, Grafana, Datadog, Airflow, Prefect, model serving, model deployment, data drift, model monitoring, model registry, feature store, experiment tracking, reproducibility, versioning, FastAPI, structured logging, load simulation

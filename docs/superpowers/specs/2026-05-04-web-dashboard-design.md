# Web Dashboard for career-ops

**Date:** 2026-05-04
**Status:** Approved
**Goal:** Add a web dashboard and API to career-ops so users can visually track applications, manage their pipeline, discover jobs, and configure sources — without modifying any existing plugin functionality.

---

## Principles

1. **Additive only** — no existing files are rewritten; the markdown-first plugin stays as-is
2. **Markdown stays source of truth** — the database is a convenience layer; delete it and rebuild from markdown with zero data loss
3. **Graceful degradation** — if the API is down, Claude Code and all scripts work exactly as before
4. **PR-worthy** — clean architecture, strict TypeScript, tested sync logic, professional UI

---

## Project Structure

```
career-ops/
├── web/                            # NEW — self-contained web dashboard
│   ├── docker-compose.yml          # Postgres 16
│   ├── Dockerfile                  # Future containerization
│   ├── .env.example                # DB credentials, port config
│   │
│   ├── server/                     # Backend: Fastify + Drizzle + TypeScript
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts            # Fastify bootstrap
│   │   │   ├── config/
│   │   │   │   └── env.ts          # Zod-validated env config
│   │   │   ├── db/
│   │   │   │   ├── schema.ts       # Drizzle ORM schema (4 tables)
│   │   │   │   ├── migrations/     # Drizzle-kit generated migrations
│   │   │   │   ├── seed.ts         # Import from markdown files
│   │   │   │   └── client.ts       # DB connection
│   │   │   ├── modules/
│   │   │   │   ├── applications/
���   │   │   │   │   ├── router.ts   # GET list, GET :id, PATCH :id, GET stats
│   │   │   │   │   ├── service.ts  # Business logic + markdown sync
│   │   │   │   │   └── schema.ts   # Zod request/response schemas
│   │   │   │   ├── pipeline/
│   │   │   │   │   ├── router.ts   # GET grouped, PATCH :id/move
│   │   │   │   │   └── service.ts  # Status transition validation
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── router.ts   # GET list, POST ingest, PATCH :id, POST :id/to-pipeline
│   │   │   │   │   ├── service.ts  # Feed logic + pipeline.md writes
│   │   │   │   │   └── schema.ts
│   │   │   │   ├── sources/
│   │   │   │   │   ├── router.ts   # CRUD + portals.yml sync
│   │   │   │   │   ├── service.ts
│   │   │   │   │   └── schema.ts
│   │   │   │   └── sync/
│   │   │   │       ├── router.ts   # POST import, POST export, GET status
│   │   │   │       ├── service.ts  # Markdown ↔ Postgres sync logic
│   │   │   │       └── parsers.ts  # Markdown table + YAML parsers
│   │   │   └── shared/
│   │   │       ├── errors.ts       # Typed error classes
│   │   │       └── middleware.ts   # Request logging, error handler
│   │   └── tests/
│   │       ├── sync.test.ts        # Sync module tests (critical path)
│   │       └── pipeline.test.ts    # Status transition tests
│   │
│   └── client/                     # Frontend: React 19 + Vite + TypeScript
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── main.tsx
│           ├── routes/
│           │   ├── __root.tsx      # Shell: sidebar + topbar
│           │   ├── index.tsx       # Applications table
│           │   ├── pipeline.tsx    # Kanban board
│           │   ├── feed.tsx        # Job discovery feed
│           │   └── sources.tsx     # Source management
│           ├── components/
│           │   ├── ui/             # shadcn/ui primitives
│           │   ├── applications/   # Table, filters, status badges, row expand
│           │   ├── pipeline/       # Kanban columns, drag-drop cards
│           │   ├── feed/           # Job cards, accept/dismiss actions
│           │   └── sources/        # Source list, add/edit forms, scan button
│           ├── lib/
│           │   ├── api.ts          # Typed fetch client
│           │   ├── queries.ts      # TanStack Query hooks
│           │   └── types.ts        # Shared DTO types
│           └── styles/
│               └── globals.css     # Tailwind base + theme
```

---

## Data Model

### applications

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| number | INTEGER | Sequential, from tracker. Unique. |
| company | VARCHAR | |
| role | VARCHAR | |
| score | DECIMAL(2,1) | Nullable |
| status | VARCHAR | Canonical states from templates/states.yml |
| url | VARCHAR | Nullable, job posting URL |
| report_path | VARCHAR | Nullable, e.g. `reports/001-acme-2026-05-04.md` |
| pdf_generated | BOOLEAN | Default false |
| notes | TEXT | Nullable |
| applied_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Check constraint on `status`: must be one of the canonical states (Evaluated, Applied, Responded, Interview, Offer, Rejected, Discarded, SKIP).

### status_history

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| application_id | UUID | FK → applications |
| from_status | VARCHAR | Nullable (first entry) |
| to_status | VARCHAR | |
| changed_at | TIMESTAMP | |
| source | VARCHAR | 'dashboard' or 'claude' |

### discovered_jobs

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| title | VARCHAR | |
| company | VARCHAR | |
| url | VARCHAR | Unique |
| source_id | UUID | FK → sources |
| location | VARCHAR | Nullable |
| posted_at | TIMESTAMP | Nullable |
| raw_data | JSONB | Full API response for reference |
| status | VARCHAR | 'new', 'reviewed', 'sent_to_pipeline', 'dismissed' |
| created_at | TIMESTAMP | |

### sources

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | VARCHAR | Display name |
| type | VARCHAR | 'greenhouse', 'ashby', 'lever', 'custom' |
| config | JSONB | board_token, title_filter, etc. |
| enabled | BOOLEAN | Default true |
| last_scanned_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## API Endpoints

### Applications

```
GET    /api/applications            ?status=&minScore=&maxScore=&search=&page=&limit=
GET    /api/applications/:id        → application + status_history[]
PATCH  /api/applications/:id        { status?, notes? } → syncs to applications.md
GET    /api/applications/stats      → { byStatus: {}, avgScore, totalCount, recentActivity[] }
```

### Pipeline (Kanban)

```
GET    /api/pipeline                → { columns: [{ status, applications[] }] }
PATCH  /api/pipeline/:id/move       { toStatus } → validates transition, writes status_history, syncs markdown
```

### Discovered Jobs (Feed)

```
GET    /api/jobs                    ?status=new&source_id=&search=&page=&limit=
POST   /api/jobs/ingest             [{ title, company, url, source, ... }] — called by scan.mjs
PATCH  /api/jobs/:id                { status: 'dismissed' | 'reviewed' }
POST   /api/jobs/:id/to-pipeline    → writes URL to data/pipeline.md, marks sent_to_pipeline
```

### Sources

```
GET    /api/sources                 → sources[] with last_scanned_at, job counts
POST   /api/sources                 { name, type, config } → syncs to portals.yml
PATCH  /api/sources/:id             { config?, enabled? } → syncs to portals.yml
DELETE /api/sources/:id             → syncs to portals.yml
```

### Sync

```
POST   /api/sync/import             → parses applications.md + portals.yml → upserts into Postgres
POST   /api/sync/export             → writes Postgres state → markdown files
GET    /api/sync/status             → { lastImport, lastExport, drift: boolean }
```

---

## Sync Logic

### Direction 1: Claude Code → Dashboard

Claude evaluates a job → writes report → runs `merge-tracker.mjs`. We add one optional API call at the end of `merge-tracker.mjs`:

```javascript
// At the end of merge-tracker.mjs (additive)
try {
  await fetch('http://localhost:3000/api/sync/import', { method: 'POST' });
} catch { /* API down — no-op, markdown is still truth */ }
```

Same pattern for `scan.mjs` — after scanning, optionally post results to `/api/jobs/ingest`.

### Direction 2: Dashboard → Claude Code

User moves a Kanban card or updates notes. The API service:
1. Updates Postgres (application row + status_history)
2. Reads `data/applications.md`, finds the matching row by number, updates the status/notes field, writes back
3. Claude Code sees the change next time it reads the file

### Direction 3: Seed / Rebuild

`npm run web:seed` calls `POST /api/sync/import`:
1. Parses `data/applications.md` → upserts applications
2. Parses `portals.yml` → upserts sources
3. Scans `reports/` directory → links report paths to applications

Idempotent. Uses application `number` + `company` + `role` as dedup key.

### Markdown is always recoverable

If the database is lost:
1. `npm run web:db:up && npm run web:migrate`
2. `npm run web:seed`
3. All data restored from markdown files

---

## Frontend Pages

### Applications (`/`) — Home

- TanStack Table with columns: #, Date, Company, Role, Score, Status, PDF, Report, Notes
- Filter bar: status multi-select, score range, text search
- Sortable columns
- Click row to expand: full notes, report link, status history timeline
- Status badges: color-coded (green=Offer, blue=Interview, yellow=Applied, gray=Evaluated, red=Rejected)

### Pipeline (`/pipeline`) — Kanban

- Columns: Evaluated → Applied → Responded → Interview → Offer
- Collapsed archive: Rejected, Discarded, SKIP
- Cards: company, role, score badge, days-in-stage counter
- Drag-and-drop via @dnd-kit (calls PATCH /api/pipeline/:id/move)
- Click card → detail panel

### Feed (`/feed`) — Job Discovery

- Card layout: title, company, location, source badge, posted date
- Two actions: Send to Pipeline (green) / Dismiss (gray)
- Filter by source, search by keyword
- New job count badge in sidebar nav

### Sources (`/sources`) — Portal Management

- Source list: name, type badge, enabled toggle, last scanned, job count
- Add form: name, type, board token/URL, title filters
- Inline edit, delete with confirmation
- "Scan Now" button per source

### Design System

- Tailwind CSS + shadcn/ui
- Clean, minimal, professional — generous whitespace, clear hierarchy
- Dark/light mode via shadcn theme toggle
- Responsive (works on laptop, no mobile target needed)

---

## Tech Stack

### Server

| Concern | Choice | Why |
|---------|--------|-----|
| Runtime | Node.js + TypeScript | Matches career-ops ecosystem |
| Framework | Fastify | Fast, typed, schema validation built-in, lean |
| ORM | Drizzle | Lightweight, great TS DX, SQL-like API, clean migrations |
| Database | PostgreSQL 16 | Via Docker. Robust, JSONB for flexible config |
| Validation | Zod | Already used in career-ops patterns, shared with client types |
| Testing | Vitest | Fast, native ESM, compatible with Vite tooling |

### Client

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | React 19 | Industry standard, large ecosystem |
| Build | Vite | Fast dev, clean builds |
| Routing | TanStack Router | Type-safe, file-based |
| Server state | TanStack Query | Caching, refetch, optimistic updates for Kanban |
| Data grid | TanStack Table | Headless, fully customizable for applications table |
| Styling | Tailwind CSS + shadcn/ui | Consistent design, copy-in components |
| Drag-and-drop | @dnd-kit | Lightweight, accessible, good for Kanban |
| Forms | React Hook Form + Zod | Validated source config forms |

---

## Changes to Existing Files

Minimal and additive:

| File | Change |
|------|--------|
| `merge-tracker.mjs` | Add optional `fetch('http://localhost:3000/api/sync/import')` at end (try/catch, silent fail) |
| `scan.mjs` | Add optional `fetch('http://localhost:3000/api/jobs/ingest', ...)` after scan results (try/catch, silent fail) |
| `CLAUDE.md` | Add "Web Dashboard" section documenting sync API usage |
| `package.json` (root) | Add `web:*` scripts |
| `.gitignore` | Add `web/server/dist/`, `web/client/dist/` |

No mode files, templates, evaluation logic, or plugin system files are touched.

---

## npm Scripts (added to root package.json)

```json
{
  "web:dev": "concurrently \"npm run web:server:dev\" \"npm run web:client:dev\"",
  "web:server:dev": "cd web/server && npm run dev",
  "web:client:dev": "cd web/client && npm run dev",
  "web:db:up": "cd web && docker compose up -d",
  "web:db:down": "cd web && docker compose down",
  "web:migrate": "cd web/server && npx drizzle-kit migrate",
  "web:seed": "cd web/server && npx tsx src/db/seed.ts",
  "web:build": "cd web/server && npm run build && cd ../client && npm run build",
  "web:start": "cd web/server && npm start"
}
```

### Ports

- Fastify API: `localhost:3000`
- Vite dev server: `localhost:5173` (proxies `/api/*` to `:3000`)
- Production: Fastify serves the built client static files on `:3000` (single port)

### First-run

```bash
npm run web:db:up        # start Postgres via Docker
npm run web:migrate      # create tables
npm run web:seed         # import existing applications.md + portals.yml
npm run web:dev          # open localhost:5173 (dev) or localhost:3000 (prod)
```

---

## Testing Strategy

- **Sync module** (critical path): unit tests for markdown parsing, upsert logic, markdown write-back. Covers round-trip: markdown → DB → markdown produces identical output.
- **Pipeline transitions**: unit tests for valid/invalid status transitions.
- **API routes**: integration tests against a test Postgres instance.
- **Frontend**: no unit tests (small app, high churn during development). Manual testing via the dev server.

---

## Out of Scope (not in this PR)

- Authentication / authorization (localhost only)
- Profile editing page (future PR)
- CV upload / management page (future PR)
- Interview prep viewer (future PR)
- Analytics / charts page (future PR)
- Email tracking integration (future PR)
- Mobile responsive design
- Automated E2E tests

# Web Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a web dashboard (React + Fastify + Postgres) to career-ops for visual application tracking, Kanban pipeline, job discovery feed, and source management — additive only, no existing files rewritten.

**Architecture:** A self-contained `web/` directory with a Fastify API server backed by Postgres (via Drizzle ORM) and a React client (Vite + TanStack). A sync module bridges the existing markdown files and the database. Existing scripts get optional API calls that fail silently if the dashboard is down.

**Tech Stack:** Fastify 5, Drizzle ORM, PostgreSQL 16 (Docker), Zod, Vitest (server); React 19, Vite 6, TanStack Router/Query/Table, Tailwind CSS 3, shadcn/ui, @dnd-kit (client)

**Spec:** `docs/superpowers/specs/2026-05-04-web-dashboard-design.md`

---

## File Map

### Server (`web/server/`)

| File | Responsibility |
|------|----------------|
| `src/index.ts` | Fastify bootstrap, plugin registration, route mounting, static file serving (prod) |
| `src/config/env.ts` | Zod schema for env vars (DATABASE_URL, PORT, CAREER_OPS_ROOT) |
| `src/db/client.ts` | Drizzle client creation from DATABASE_URL |
| `src/db/schema.ts` | All 4 Drizzle table definitions (applications, status_history, discovered_jobs, sources) |
| `src/db/seed.ts` | CLI script: calls sync service to import markdown → DB |
| `src/modules/sync/parsers.ts` | Pure functions: parseApplicationsMd(), parsePortalsYml(), serializeApplicationsMd() |
| `src/modules/sync/service.ts` | importFromMarkdown(), exportToMarkdown(), getSyncStatus() |
| `src/modules/sync/router.ts` | POST /api/sync/import, POST /api/sync/export, GET /api/sync/status |
| `src/modules/applications/schema.ts` | Zod schemas for list query params, patch body, response shapes |
| `src/modules/applications/service.ts` | list(), getById(), update(), getStats() — updates markdown on writes |
| `src/modules/applications/router.ts` | GET /api/applications, GET /api/applications/stats, GET /api/applications/:id, PATCH /api/applications/:id |
| `src/modules/pipeline/service.ts` | getGrouped(), moveCard() — validates transitions, writes status_history |
| `src/modules/pipeline/router.ts` | GET /api/pipeline, PATCH /api/pipeline/:id/move |
| `src/modules/jobs/schema.ts` | Zod schemas for ingest payload, list query, to-pipeline body |
| `src/modules/jobs/service.ts` | list(), ingest(), dismiss(), sendToPipeline() — writes to pipeline.md |
| `src/modules/jobs/router.ts` | GET /api/jobs, POST /api/jobs/ingest, PATCH /api/jobs/:id, POST /api/jobs/:id/to-pipeline |
| `src/modules/sources/schema.ts` | Zod schemas for create/update source |
| `src/modules/sources/service.ts` | list(), create(), update(), remove() — syncs to portals.yml |
| `src/modules/sources/router.ts` | GET /api/sources, POST /api/sources, PATCH /api/sources/:id, DELETE /api/sources/:id |
| `src/shared/errors.ts` | AppError class, NotFoundError, ValidationError |
| `src/shared/middleware.ts` | Error handler plugin, request logger plugin |
| `tests/sync.test.ts` | Markdown parsing round-trip tests, YAML parsing tests |
| `tests/pipeline.test.ts` | Status transition validation tests |

### Client (`web/client/`)

| File | Responsibility |
|------|----------------|
| `src/main.tsx` | React root, QueryClientProvider, RouterProvider |
| `src/lib/api.ts` | Typed fetch wrapper (GET, POST, PATCH, DELETE) |
| `src/lib/types.ts` | Application, Job, Source, PipelineColumn, StatusHistory DTOs |
| `src/lib/queries.ts` | TanStack Query hooks: useApplications, usePipeline, useJobs, useSources, mutations |
| `src/lib/constants.ts` | Status colors, status labels, canonical states list |
| `src/routes/__root.tsx` | App shell: sidebar nav + main content area |
| `src/routes/index.tsx` | Applications table page |
| `src/routes/pipeline.tsx` | Kanban board page |
| `src/routes/feed.tsx` | Job discovery feed page |
| `src/routes/sources.tsx` | Source management page |
| `src/components/ui/*` | shadcn/ui primitives (button, badge, card, input, select, table, dialog, dropdown-menu) |
| `src/components/applications/applications-table.tsx` | TanStack Table with columns, sorting, row expansion |
| `src/components/applications/status-badge.tsx` | Color-coded status badge component |
| `src/components/applications/filters.tsx` | Filter bar: status multi-select, score range, search |
| `src/components/pipeline/kanban-board.tsx` | @dnd-kit DndContext + columns |
| `src/components/pipeline/kanban-column.tsx` | Droppable column with header + card list |
| `src/components/pipeline/kanban-card.tsx` | Draggable card: company, role, score, days-in-stage |
| `src/components/feed/job-card.tsx` | Job card: title, company, location, source badge, actions |
| `src/components/feed/feed-filters.tsx` | Source filter, keyword search |
| `src/components/sources/source-list.tsx` | Source table with toggle, scan button |
| `src/components/sources/source-form.tsx` | Add/edit source form (React Hook Form + Zod) |
| `src/styles/globals.css` | Tailwind directives + shadcn theme variables |

### Root changes

| File | Change |
|------|--------|
| `web/docker-compose.yml` | NEW: Postgres 16 service |
| `web/.env.example` | NEW: DATABASE_URL, PORT, CAREER_OPS_ROOT |
| `package.json` | ADD: web:* scripts |
| `.gitignore` | ADD: web/server/dist/, web/client/dist/, web/.env |
| `merge-tracker.mjs` | ADD: optional fetch to sync API (line ~367) |
| `scan.mjs` | ADD: optional fetch to jobs ingest API (line ~356) |

---

## Task 1: Docker Compose + Project Scaffolding

**Files:**
- Create: `web/docker-compose.yml`
- Create: `web/.env.example`
- Create: `web/server/package.json`
- Create: `web/server/tsconfig.json`
- Create: `web/client/package.json`
- Create: `web/client/tsconfig.json`
- Create: `web/client/vite.config.ts`

- [ ] **Step 1: Create Docker Compose for Postgres**

```yaml
# web/docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: career_ops
      POSTGRES_USER: career_ops
      POSTGRES_PASSWORD: career_ops_dev
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

- [ ] **Step 2: Create web/.env.example**

```env
DATABASE_URL=postgres://career_ops:career_ops_dev@localhost:5432/career_ops
PORT=3000
# Absolute path to the career-ops project root (parent of web/)
CAREER_OPS_ROOT=..
```

- [ ] **Step 3: Create web/server/package.json**

```json
{
  "name": "@career-ops/server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "fastify": "^5.2.1",
    "@fastify/cors": "^11.0.1",
    "@fastify/static": "^8.1.0",
    "drizzle-orm": "^0.44.1",
    "postgres": "^3.4.7",
    "zod": "^3.24.4",
    "js-yaml": "^4.1.1"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^22.15.0",
    "drizzle-kit": "^0.31.0",
    "tsx": "^4.19.4",
    "typescript": "^5.7.3",
    "vitest": "^3.1.3"
  }
}
```

- [ ] **Step 4: Create web/server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 5: Create web/client/package.json**

```json
{
  "name": "@career-ops/client",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@tanstack/react-router": "^1.120.4",
    "@tanstack/react-query": "^5.75.5",
    "@tanstack/react-table": "^8.21.3",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "react-hook-form": "^7.55.0",
    "@hookform/resolvers": "^5.0.1",
    "zod": "^3.24.4",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0",
    "lucide-react": "^0.487.0",
    "class-variance-authority": "^0.7.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.5",
    "@tanstack/router-devtools": "^1.120.4",
    "@tanstack/react-query-devtools": "^5.75.5",
    "@tanstack/router-plugin": "^1.120.4",
    "@vitejs/plugin-react": "^4.5.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.3.5"
  }
}
```

- [ ] **Step 6: Create web/client/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 7: Create web/client/vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [TanStackRouterVite({ routesDirectory: "./src/routes" }), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 8: Install dependencies + start Postgres**

Run:
```bash
cd web && docker compose up -d
cd web/server && npm install
cd web/client && npm install
```

Expected: Postgres running on :5432, both node_modules populated.

- [ ] **Step 9: Commit**

```bash
git add web/docker-compose.yml web/.env.example web/server/package.json web/server/tsconfig.json web/server/package-lock.json web/client/package.json web/client/tsconfig.json web/client/vite.config.ts web/client/package-lock.json
git commit -m "feat(web): scaffold project — Docker Compose, server + client packages"
```

---

## Task 2: Database Schema + Drizzle Config

**Files:**
- Create: `web/server/src/db/schema.ts`
- Create: `web/server/src/db/client.ts`
- Create: `web/server/src/config/env.ts`
- Create: `web/server/drizzle.config.ts`

- [ ] **Step 1: Create env config with Zod validation**

```typescript
// web/server/src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  CAREER_OPS_ROOT: z.string().default(".."),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  return envSchema.parse(process.env);
}
```

- [ ] **Step 2: Create Drizzle schema with all 4 tables**

```typescript
// web/server/src/db/schema.ts
import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    number: integer("number").notNull().unique(),
    company: varchar("company", { length: 255 }).notNull(),
    role: varchar("role", { length: 500 }).notNull(),
    score: decimal("score", { precision: 2, scale: 1 }),
    status: varchar("status", { length: 50 }).notNull().default("Evaluated"),
    url: varchar("url", { length: 2048 }),
    reportPath: varchar("report_path", { length: 500 }),
    pdfGenerated: boolean("pdf_generated").notNull().default(false),
    notes: text("notes"),
    appliedAt: timestamp("applied_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const statusHistory = pgTable("status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  fromStatus: varchar("from_status", { length: 50 }),
  toStatus: varchar("to_status", { length: 50 }).notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
  source: varchar("source", { length: 20 }).notNull().default("dashboard"),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(),
  config: jsonb("config").notNull().default({}),
  enabled: boolean("enabled").notNull().default(true),
  lastScannedAt: timestamp("last_scanned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const discoveredJobs = pgTable(
  "discovered_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 500 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    url: varchar("url", { length: 2048 }).notNull().unique(),
    sourceId: uuid("source_id").references(() => sources.id, { onDelete: "set null" }),
    location: varchar("location", { length: 255 }),
    postedAt: timestamp("posted_at", { withTimezone: true }),
    rawData: jsonb("raw_data"),
    status: varchar("status", { length: 50 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
);
```

- [ ] **Step 3: Create DB client**

```typescript
// web/server/src/db/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
```

- [ ] **Step 4: Create Drizzle config**

```typescript
// web/server/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 5: Generate and run the migration**

Run:
```bash
cd web/server
cp ../env.example .env  # use the defaults
DATABASE_URL=postgres://career_ops:career_ops_dev@localhost:5432/career_ops npx drizzle-kit generate
DATABASE_URL=postgres://career_ops:career_ops_dev@localhost:5432/career_ops npx drizzle-kit migrate
```

Expected: Migration SQL file created in `src/db/migrations/`, tables created in Postgres.

- [ ] **Step 6: Verify tables exist**

Run:
```bash
docker exec -it $(docker ps -q -f ancestor=postgres:16-alpine) psql -U career_ops -c "\dt"
```

Expected: 4 tables listed (applications, status_history, discovered_jobs, sources).

- [ ] **Step 7: Commit**

```bash
git add web/server/src/config/env.ts web/server/src/db/schema.ts web/server/src/db/client.ts web/server/drizzle.config.ts web/server/src/db/migrations/
git commit -m "feat(web): database schema — 4 tables with Drizzle migrations"
```

---

## Task 3: Shared Utilities + Fastify Bootstrap

**Files:**
- Create: `web/server/src/shared/errors.ts`
- Create: `web/server/src/shared/middleware.ts`
- Create: `web/server/src/index.ts`

- [ ] **Step 1: Create error classes**

```typescript
// web/server/src/shared/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} '${id}' not found`, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}
```

- [ ] **Step 2: Create middleware plugins**

```typescript
// web/server/src/shared/middleware.ts
import type { FastifyInstance } from "fastify";
import { AppError } from "./errors.js";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  });
}
```

- [ ] **Step 3: Create Fastify server entry point**

```typescript
// web/server/src/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadEnv } from "./config/env.js";
import { createDb } from "./db/client.js";
import { errorHandler } from "./shared/middleware.js";

// Module routers will be imported here as they're built
// import { syncRouter } from "./modules/sync/router.js";
// etc.

async function main() {
  const env = loadEnv();
  const db = createDb(env.DATABASE_URL);

  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(errorHandler);

  // Decorate app with db and env for route handlers
  app.decorate("db", db);
  app.decorate("env", env);

  // Health check
  app.get("/api/health", async () => ({ status: "ok" }));

  // Module routers registered here as they're built

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
```

- [ ] **Step 4: Create Fastify type augmentation**

```typescript
// web/server/src/types.ts
import type { Database } from "./db/client.js";
import type { Env } from "./config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    env: Env;
  }
}
```

- [ ] **Step 5: Test the server starts**

Run:
```bash
cd web/server
DATABASE_URL=postgres://career_ops:career_ops_dev@localhost:5432/career_ops npx tsx src/index.ts &
sleep 2
curl http://localhost:3000/api/health
kill %1
```

Expected: `{"status":"ok"}`

- [ ] **Step 6: Commit**

```bash
git add web/server/src/shared/ web/server/src/index.ts web/server/src/types.ts
git commit -m "feat(web): Fastify server bootstrap with health endpoint"
```

---

## Task 4: Sync Parsers (TDD)

**Files:**
- Create: `web/server/src/modules/sync/parsers.ts`
- Create: `web/server/tests/sync.test.ts`

This is the critical path — the markdown ↔ database bridge. Test-first.

- [ ] **Step 1: Write failing test for parseApplicationsMd**

```typescript
// web/server/tests/sync.test.ts
import { describe, it, expect } from "vitest";
import {
  parseApplicationsMd,
  serializeApplicationsMd,
  parsePortalsYml,
} from "../src/modules/sync/parsers.js";

describe("parseApplicationsMd", () => {
  it("parses a well-formed applications.md table", () => {
    const md = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
| 1 | 2026-04-01 | Acme Corp | AI Engineer | 4.2/5 | Applied | ✅ | [1](reports/001-acme-corp-2026-04-01.md) | Strong fit |
| 2 | 2026-04-05 | Globex | ML Lead | 3.8/5 | Evaluated | ❌ | [2](reports/002-globex-2026-04-05.md) | Needs review |
`;

    const result = parseApplicationsMd(md);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      number: 1,
      date: "2026-04-01",
      company: "Acme Corp",
      role: "AI Engineer",
      score: "4.2",
      status: "Applied",
      pdfGenerated: true,
      reportPath: "reports/001-acme-corp-2026-04-01.md",
      notes: "Strong fit",
    });
    expect(result[1]).toEqual({
      number: 2,
      date: "2026-04-05",
      company: "Globex",
      role: "ML Lead",
      score: "3.8",
      status: "Evaluated",
      pdfGenerated: false,
      reportPath: "reports/002-globex-2026-04-05.md",
      notes: "Needs review",
    });
  });

  it("returns empty array for empty or header-only table", () => {
    const md = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
`;
    expect(parseApplicationsMd(md)).toEqual([]);
  });

  it("handles missing notes column", () => {
    const md = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
| 1 | 2026-04-01 | TestCo | Dev | 3.5/5 | Evaluated | ❌ | [1](reports/001-testco-2026-04-01.md) |  |
`;
    const result = parseApplicationsMd(md);
    expect(result[0].notes).toBe("");
  });
});

describe("serializeApplicationsMd", () => {
  it("round-trips: parse then serialize produces equivalent markdown", () => {
    const original = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
| 1 | 2026-04-01 | Acme Corp | AI Engineer | 4.2/5 | Applied | ✅ | [1](reports/001-acme-corp-2026-04-01.md) | Strong fit |
| 2 | 2026-04-05 | Globex | ML Lead | 3.8/5 | Evaluated | ❌ | [2](reports/002-globex-2026-04-05.md) | Needs review |
`;
    const parsed = parseApplicationsMd(original);
    const serialized = serializeApplicationsMd(parsed);
    const reparsed = parseApplicationsMd(serialized);

    expect(reparsed).toEqual(parsed);
  });
});

describe("parsePortalsYml", () => {
  it("parses tracked companies into source records", () => {
    const yml = `
title_filter:
  positive: ["AI", "ML"]
  negative: ["Junior"]

tracked_companies:
  - name: OpenAI
    careers_url: https://jobs.ashbyhq.com/openai
    enabled: true
  - name: Anthropic
    api: https://boards-api.greenhouse.io/v1/boards/anthropic/jobs
    enabled: false
`;

    const result = parsePortalsYml(yml);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: "OpenAI",
      type: "ashby",
      config: {
        careers_url: "https://jobs.ashbyhq.com/openai",
        title_filter: { positive: ["AI", "ML"], negative: ["Junior"] },
      },
      enabled: true,
    });
    expect(result[1]).toEqual({
      name: "Anthropic",
      type: "greenhouse",
      config: {
        api: "https://boards-api.greenhouse.io/v1/boards/anthropic/jobs",
        title_filter: { positive: ["AI", "ML"], negative: ["Junior"] },
      },
      enabled: false,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd web/server && npx vitest run tests/sync.test.ts
```

Expected: FAIL — module `../src/modules/sync/parsers.js` not found.

- [ ] **Step 3: Implement parsers**

```typescript
// web/server/src/modules/sync/parsers.ts
import yaml from "js-yaml";

export interface ParsedApplication {
  number: number;
  date: string;
  company: string;
  role: string;
  score: string | null;
  status: string;
  pdfGenerated: boolean;
  reportPath: string | null;
  notes: string;
}

export function parseApplicationsMd(md: string): ParsedApplication[] {
  const lines = md.split("\n");
  const results: ParsedApplication[] = [];

  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    if (line.includes("---")) continue;

    const cells = line.split("|").map((s) => s.trim());
    // cells[0] is empty (before first |), data starts at cells[1]
    const num = parseInt(cells[1]);
    if (isNaN(num) || num === 0) continue; // skip header row

    const scoreRaw = cells[5] || "";
    const scoreMatch = scoreRaw.match(/([\d.]+)/);

    const reportRaw = cells[8] || "";
    const reportMatch = reportRaw.match(/\]\(([^)]+)\)/);

    results.push({
      number: num,
      date: cells[2] || "",
      company: cells[3] || "",
      role: cells[4] || "",
      score: scoreMatch ? scoreMatch[1] : null,
      status: cells[6] || "Evaluated",
      pdfGenerated: (cells[7] || "").includes("✅"),
      reportPath: reportMatch ? reportMatch[1] : null,
      notes: (cells[9] || "").trim(),
    });
  }

  return results;
}

export function serializeApplicationsMd(apps: ParsedApplication[]): string {
  const header = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|`;

  const rows = apps.map((a) => {
    const score = a.score ? `${a.score}/5` : "";
    const pdf = a.pdfGenerated ? "✅" : "❌";
    const report = a.reportPath
      ? `[${a.number}](${a.reportPath})`
      : "";
    return `| ${a.number} | ${a.date} | ${a.company} | ${a.role} | ${score} | ${a.status} | ${pdf} | ${report} | ${a.notes} |`;
  });

  return header + "\n" + rows.join("\n") + "\n";
}

interface ParsedSource {
  name: string;
  type: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

export function parsePortalsYml(content: string): ParsedSource[] {
  const doc = yaml.load(content) as Record<string, unknown>;
  const companies = (doc.tracked_companies || []) as Record<string, unknown>[];
  const titleFilter = doc.title_filter || {};

  return companies.map((c) => {
    const careersUrl = (c.careers_url as string) || "";
    const api = (c.api as string) || "";
    let type = "custom";

    if (api.includes("greenhouse") || careersUrl.match(/greenhouse\.io/)) {
      type = "greenhouse";
    } else if (careersUrl.match(/ashbyhq\.com/)) {
      type = "ashby";
    } else if (careersUrl.match(/lever\.co/)) {
      type = "lever";
    }

    const config: Record<string, unknown> = { title_filter: titleFilter };
    if (careersUrl) config.careers_url = careersUrl;
    if (api) config.api = api;

    return {
      name: c.name as string,
      type,
      config,
      enabled: c.enabled !== false,
    };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
cd web/server && npx vitest run tests/sync.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add web/server/src/modules/sync/parsers.ts web/server/tests/sync.test.ts
git commit -m "feat(web): sync parsers with TDD — markdown + YAML parsing and round-trip"
```

---

## Task 5: Sync Service + Routes

**Files:**
- Create: `web/server/src/modules/sync/service.ts`
- Create: `web/server/src/modules/sync/router.ts`
- Create: `web/server/src/db/seed.ts`

- [ ] **Step 1: Create sync service**

```typescript
// web/server/src/modules/sync/service.ts
import { eq } from "drizzle-orm";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Database } from "../../db/client.js";
import { applications, sources } from "../../db/schema.js";
import {
  parseApplicationsMd,
  parsePortalsYml,
  serializeApplicationsMd,
  type ParsedApplication,
} from "./parsers.js";

export class SyncService {
  constructor(
    private db: Database,
    private careerOpsRoot: string,
  ) {}

  async importFromMarkdown(): Promise<{ applications: number; sources: number }> {
    let appCount = 0;
    let srcCount = 0;

    // Import applications.md
    const appsPath = join(this.careerOpsRoot, "data/applications.md");
    if (existsSync(appsPath)) {
      const md = readFileSync(appsPath, "utf-8");
      const parsed = parseApplicationsMd(md);
      for (const app of parsed) {
        await this.upsertApplication(app);
        appCount++;
      }
    }

    // Import portals.yml
    const portalsPath = join(this.careerOpsRoot, "portals.yml");
    if (existsSync(portalsPath)) {
      const yml = readFileSync(portalsPath, "utf-8");
      const parsed = parsePortalsYml(yml);
      for (const src of parsed) {
        await this.db
          .insert(sources)
          .values({
            name: src.name,
            type: src.type,
            config: src.config,
            enabled: src.enabled,
          })
          .onConflictDoUpdate({
            target: sources.name,
            set: {
              type: src.type,
              config: src.config,
              enabled: src.enabled,
              updatedAt: new Date(),
            },
          });
        srcCount++;
      }
    }

    return { applications: appCount, sources: srcCount };
  }

  private async upsertApplication(app: ParsedApplication) {
    const existing = await this.db
      .select()
      .from(applications)
      .where(eq(applications.number, app.number))
      .limit(1);

    if (existing.length > 0) {
      await this.db
        .update(applications)
        .set({
          company: app.company,
          role: app.role,
          score: app.score,
          status: app.status,
          reportPath: app.reportPath,
          pdfGenerated: app.pdfGenerated,
          notes: app.notes,
          updatedAt: new Date(),
        })
        .where(eq(applications.number, app.number));
    } else {
      await this.db.insert(applications).values({
        number: app.number,
        company: app.company,
        role: app.role,
        score: app.score,
        status: app.status,
        reportPath: app.reportPath,
        pdfGenerated: app.pdfGenerated,
        notes: app.notes,
        createdAt: app.date ? new Date(app.date) : new Date(),
      });
    }
  }

  async exportToMarkdown(): Promise<{ written: string[] }> {
    const written: string[] = [];

    // Export applications → applications.md
    const allApps = await this.db
      .select()
      .from(applications)
      .orderBy(applications.number);

    if (allApps.length > 0) {
      const parsed = allApps.map((a) => ({
        number: a.number,
        date: a.createdAt.toISOString().slice(0, 10),
        company: a.company,
        role: a.role,
        score: a.score,
        status: a.status,
        pdfGenerated: a.pdfGenerated,
        reportPath: a.reportPath,
        notes: a.notes || "",
      }));

      const md = serializeApplicationsMd(parsed);
      const appsPath = join(this.careerOpsRoot, "data/applications.md");
      writeFileSync(appsPath, md, "utf-8");
      written.push("data/applications.md");
    }

    return { written };
  }

  async getSyncStatus() {
    const appCount = await this.db.select().from(applications);
    const srcCount = await this.db.select().from(sources);
    return {
      applicationsInDb: appCount.length,
      sourcesInDb: srcCount.length,
    };
  }
}
```

- [ ] **Step 2: Create sync router**

```typescript
// web/server/src/modules/sync/router.ts
import type { FastifyInstance } from "fastify";
import { SyncService } from "./service.js";

export async function syncRouter(app: FastifyInstance) {
  const service = new SyncService(app.db, app.env.CAREER_OPS_ROOT);

  app.post("/api/sync/import", async (_request, reply) => {
    const result = await service.importFromMarkdown();
    return reply.send(result);
  });

  app.post("/api/sync/export", async (_request, reply) => {
    const result = await service.exportToMarkdown();
    return reply.send(result);
  });

  app.get("/api/sync/status", async (_request, reply) => {
    const result = await service.getSyncStatus();
    return reply.send(result);
  });
}
```

- [ ] **Step 3: Create seed script**

```typescript
// web/server/src/db/seed.ts
import "dotenv/config";
import { loadEnv } from "../config/env.js";
import { createDb } from "./client.js";
import { SyncService } from "../modules/sync/service.js";
import { resolve } from "path";

async function main() {
  const env = loadEnv();
  const db = createDb(env.DATABASE_URL);
  const root = resolve(env.CAREER_OPS_ROOT);

  console.log(`Seeding from: ${root}`);
  const service = new SyncService(db, root);
  const result = await service.importFromMarkdown();

  console.log(`Imported ${result.applications} applications, ${result.sources} sources`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

- [ ] **Step 4: Register sync router in index.ts**

Add to `web/server/src/index.ts` — import and register:

```typescript
import { syncRouter } from "./modules/sync/router.js";

// Inside main(), after errorHandler registration:
await app.register(syncRouter);
```

- [ ] **Step 5: Add dotenv to server dependencies**

Run:
```bash
cd web/server && npm install dotenv
```

- [ ] **Step 6: Test the seed script**

Run:
```bash
cd web/server
DATABASE_URL=postgres://career_ops:career_ops_dev@localhost:5432/career_ops CAREER_OPS_ROOT=../.. npx tsx src/db/seed.ts
```

Expected: "Imported 0 applications, N sources" (0 apps because applications.md doesn't exist yet; N sources if portals.yml exists).

- [ ] **Step 7: Commit**

```bash
git add web/server/src/modules/sync/ web/server/src/db/seed.ts
git commit -m "feat(web): sync service — markdown import, seed script, sync routes"
```

---

## Task 6: Applications Module

**Files:**
- Create: `web/server/src/modules/applications/schema.ts`
- Create: `web/server/src/modules/applications/service.ts`
- Create: `web/server/src/modules/applications/router.ts`

- [ ] **Step 1: Create Zod request/response schemas**

```typescript
// web/server/src/modules/applications/schema.ts
import { z } from "zod";

export const CANONICAL_STATUSES = [
  "Evaluated", "Applied", "Responded", "Interview",
  "Offer", "Rejected", "Discarded", "SKIP",
] as const;

export const listQuerySchema = z.object({
  status: z.string().optional(),
  minScore: z.coerce.number().min(0).max(5).optional(),
  maxScore: z.coerce.number().min(0).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const patchBodySchema = z.object({
  status: z.enum(CANONICAL_STATUSES).optional(),
  notes: z.string().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
export type PatchBody = z.infer<typeof patchBodySchema>;
```

- [ ] **Step 2: Create applications service**

```typescript
// web/server/src/modules/applications/service.ts
import { eq, desc, sql, and, gte, lte, or, ilike } from "drizzle-orm";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Database } from "../../db/client.js";
import { applications, statusHistory } from "../../db/schema.js";
import { NotFoundError } from "../../shared/errors.js";
import type { ListQuery, PatchBody } from "./schema.js";

export class ApplicationsService {
  constructor(
    private db: Database,
    private careerOpsRoot: string,
  ) {}

  async list(query: ListQuery) {
    const conditions = [];

    if (query.status) {
      const statuses = query.status.split(",");
      conditions.push(
        or(...statuses.map((s) => eq(applications.status, s.trim())))!,
      );
    }
    if (query.minScore !== undefined) {
      conditions.push(gte(applications.score, String(query.minScore)));
    }
    if (query.maxScore !== undefined) {
      conditions.push(lte(applications.score, String(query.maxScore)));
    }
    if (query.search) {
      const term = `%${query.search}%`;
      conditions.push(
        or(
          ilike(applications.company, term),
          ilike(applications.role, term),
          ilike(applications.notes, term),
        )!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (query.page - 1) * query.limit;

    const [rows, countResult] = await Promise.all([
      this.db
        .select()
        .from(applications)
        .where(where)
        .orderBy(desc(applications.number))
        .limit(query.limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(applications)
        .where(where),
    ]);

    return {
      data: rows,
      total: Number(countResult[0].count),
      page: query.page,
      limit: query.limit,
    };
  }

  async getById(id: string) {
    const [app] = await this.db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!app) throw new NotFoundError("Application", id);

    const history = await this.db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.applicationId, id))
      .orderBy(desc(statusHistory.changedAt));

    return { ...app, statusHistory: history };
  }

  async update(id: string, body: PatchBody) {
    const [existing] = await this.db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!existing) throw new NotFoundError("Application", id);

    if (body.status && body.status !== existing.status) {
      await this.db.insert(statusHistory).values({
        applicationId: id,
        fromStatus: existing.status,
        toStatus: body.status,
        source: "dashboard",
      });
    }

    const [updated] = await this.db
      .update(applications)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    // Sync back to applications.md
    this.syncToMarkdown(updated);

    return updated;
  }

  async getStats() {
    const rows = await this.db.select().from(applications);

    const byStatus: Record<string, number> = {};
    let totalScore = 0;
    let scoreCount = 0;

    for (const row of rows) {
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
      if (row.score) {
        totalScore += parseFloat(row.score);
        scoreCount++;
      }
    }

    return {
      byStatus,
      avgScore: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0,
      totalCount: rows.length,
    };
  }

  private syncToMarkdown(app: typeof applications.$inferSelect) {
    const appsPath = join(this.careerOpsRoot, "data/applications.md");
    if (!existsSync(appsPath)) return;

    const content = readFileSync(appsPath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith("|")) continue;
      const cells = line.split("|").map((s) => s.trim());
      const num = parseInt(cells[1]);
      if (num === app.number) {
        // Update status and notes in-place
        cells[6] = ` ${app.status} `;
        if (app.notes !== null && app.notes !== undefined) {
          cells[9] = ` ${app.notes} `;
        }
        lines[i] = cells.join("|");
        break;
      }
    }

    writeFileSync(appsPath, lines.join("\n"), "utf-8");
  }
}
```

- [ ] **Step 3: Create applications router**

```typescript
// web/server/src/modules/applications/router.ts
import type { FastifyInstance } from "fastify";
import { ApplicationsService } from "./service.js";
import { listQuerySchema, patchBodySchema } from "./schema.js";

export async function applicationsRouter(app: FastifyInstance) {
  const service = new ApplicationsService(app.db, app.env.CAREER_OPS_ROOT);

  app.get("/api/applications", async (request, reply) => {
    const query = listQuerySchema.parse(request.query);
    const result = await service.list(query);
    return reply.send(result);
  });

  // stats must be registered before :id to avoid route conflict
  app.get("/api/applications/stats", async (_request, reply) => {
    const result = await service.getStats();
    return reply.send(result);
  });

  app.get<{ Params: { id: string } }>(
    "/api/applications/:id",
    async (request, reply) => {
      const result = await service.getById(request.params.id);
      return reply.send(result);
    },
  );

  app.patch<{ Params: { id: string } }>(
    "/api/applications/:id",
    async (request, reply) => {
      const body = patchBodySchema.parse(request.body);
      const result = await service.update(request.params.id, body);
      return reply.send(result);
    },
  );
}
```

- [ ] **Step 4: Register in index.ts**

Add to `web/server/src/index.ts`:

```typescript
import { applicationsRouter } from "./modules/applications/router.js";

// Inside main(), after syncRouter:
await app.register(applicationsRouter);
```

- [ ] **Step 5: Commit**

```bash
git add web/server/src/modules/applications/
git commit -m "feat(web): applications module — list, detail, update, stats with markdown sync"
```

---

## Task 7: Pipeline Module (TDD)

**Files:**
- Create: `web/server/src/modules/pipeline/service.ts`
- Create: `web/server/src/modules/pipeline/router.ts`
- Create: `web/server/tests/pipeline.test.ts`

- [ ] **Step 1: Write failing test for status transitions**

```typescript
// web/server/tests/pipeline.test.ts
import { describe, it, expect } from "vitest";
import { validateTransition, KANBAN_COLUMNS } from "../src/modules/pipeline/service.js";

describe("validateTransition", () => {
  it("allows Evaluated → Applied", () => {
    expect(validateTransition("Evaluated", "Applied")).toBe(true);
  });

  it("allows Applied → Interview", () => {
    expect(validateTransition("Applied", "Interview")).toBe(true);
  });

  it("allows Interview → Offer", () => {
    expect(validateTransition("Interview", "Offer")).toBe(true);
  });

  it("allows any status → Rejected", () => {
    expect(validateTransition("Applied", "Rejected")).toBe(true);
    expect(validateTransition("Interview", "Rejected")).toBe(true);
  });

  it("allows any status → Discarded", () => {
    expect(validateTransition("Evaluated", "Discarded")).toBe(true);
    expect(validateTransition("Applied", "Discarded")).toBe(true);
  });

  it("allows any status → SKIP", () => {
    expect(validateTransition("Evaluated", "SKIP")).toBe(true);
  });

  it("rejects Offer → Evaluated (backwards)", () => {
    expect(validateTransition("Offer", "Evaluated")).toBe(false);
  });

  it("rejects same → same", () => {
    expect(validateTransition("Applied", "Applied")).toBe(false);
  });
});

describe("KANBAN_COLUMNS", () => {
  it("has the 5 active columns in order", () => {
    expect(KANBAN_COLUMNS).toEqual([
      "Evaluated", "Applied", "Responded", "Interview", "Offer",
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd web/server && npx vitest run tests/pipeline.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement pipeline service**

```typescript
// web/server/src/modules/pipeline/service.ts
import { eq } from "drizzle-orm";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Database } from "../../db/client.js";
import { applications, statusHistory } from "../../db/schema.js";
import { NotFoundError, ValidationError } from "../../shared/errors.js";

export const KANBAN_COLUMNS = [
  "Evaluated", "Applied", "Responded", "Interview", "Offer",
] as const;

const ARCHIVE_STATUSES = ["Rejected", "Discarded", "SKIP"] as const;

// Forward-only transitions + any → archive
const COLUMN_ORDER = new Map(KANBAN_COLUMNS.map((s, i) => [s, i]));

export function validateTransition(from: string, to: string): boolean {
  if (from === to) return false;

  // Any status can move to archive
  if ((ARCHIVE_STATUSES as readonly string[]).includes(to)) return true;

  const fromIdx = COLUMN_ORDER.get(from);
  const toIdx = COLUMN_ORDER.get(to);

  // Both must be active columns, and movement must be forward
  if (fromIdx === undefined || toIdx === undefined) return false;
  return toIdx > fromIdx;
}

export class PipelineService {
  constructor(
    private db: Database,
    private careerOpsRoot: string,
  ) {}

  async getGrouped() {
    const rows = await this.db.select().from(applications);

    const columns = KANBAN_COLUMNS.map((status) => ({
      status,
      applications: rows.filter((r) => r.status === status),
    }));

    const archive = rows.filter((r) =>
      (ARCHIVE_STATUSES as readonly string[]).includes(r.status),
    );

    return { columns, archive };
  }

  async moveCard(id: string, toStatus: string) {
    const [app] = await this.db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!app) throw new NotFoundError("Application", id);

    if (!validateTransition(app.status, toStatus)) {
      throw new ValidationError(
        `Cannot move from '${app.status}' to '${toStatus}'`,
      );
    }

    await this.db.insert(statusHistory).values({
      applicationId: id,
      fromStatus: app.status,
      toStatus,
      source: "dashboard",
    });

    const [updated] = await this.db
      .update(applications)
      .set({ status: toStatus, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();

    // Sync to markdown
    this.syncStatusToMarkdown(updated.number, toStatus);

    return updated;
  }

  private syncStatusToMarkdown(appNumber: number, newStatus: string) {
    const appsPath = join(this.careerOpsRoot, "data/applications.md");
    if (!existsSync(appsPath)) return;

    const content = readFileSync(appsPath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith("|")) continue;
      const cells = lines[i].split("|").map((s) => s.trim());
      if (parseInt(cells[1]) === appNumber) {
        cells[6] = ` ${newStatus} `;
        lines[i] = cells.join("|");
        break;
      }
    }

    writeFileSync(appsPath, lines.join("\n"), "utf-8");
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
cd web/server && npx vitest run tests/pipeline.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Create pipeline router**

```typescript
// web/server/src/modules/pipeline/router.ts
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { PipelineService } from "./service.js";

const moveBodySchema = z.object({
  toStatus: z.string(),
});

export async function pipelineRouter(app: FastifyInstance) {
  const service = new PipelineService(app.db, app.env.CAREER_OPS_ROOT);

  app.get("/api/pipeline", async (_request, reply) => {
    const result = await service.getGrouped();
    return reply.send(result);
  });

  app.patch<{ Params: { id: string } }>(
    "/api/pipeline/:id/move",
    async (request, reply) => {
      const { toStatus } = moveBodySchema.parse(request.body);
      const result = await service.moveCard(request.params.id, toStatus);
      return reply.send(result);
    },
  );
}
```

- [ ] **Step 6: Register in index.ts**

Add to `web/server/src/index.ts`:

```typescript
import { pipelineRouter } from "./modules/pipeline/router.js";

// Inside main():
await app.register(pipelineRouter);
```

- [ ] **Step 7: Commit**

```bash
git add web/server/src/modules/pipeline/ web/server/tests/pipeline.test.ts
git commit -m "feat(web): pipeline module — Kanban grouping, validated status transitions (TDD)"
```

---

## Task 8: Jobs Module

**Files:**
- Create: `web/server/src/modules/jobs/schema.ts`
- Create: `web/server/src/modules/jobs/service.ts`
- Create: `web/server/src/modules/jobs/router.ts`

- [ ] **Step 1: Create Zod schemas**

```typescript
// web/server/src/modules/jobs/schema.ts
import { z } from "zod";

export const jobsListQuerySchema = z.object({
  status: z.string().optional(),
  sourceId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const ingestBodySchema = z.array(
  z.object({
    title: z.string(),
    company: z.string(),
    url: z.string().url(),
    source: z.string().optional(),
    location: z.string().optional(),
    postedAt: z.string().optional(),
    rawData: z.record(z.unknown()).optional(),
  }),
);

export type JobsListQuery = z.infer<typeof jobsListQuerySchema>;
export type IngestBody = z.infer<typeof ingestBodySchema>;
```

- [ ] **Step 2: Create jobs service**

```typescript
// web/server/src/modules/jobs/service.ts
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Database } from "../../db/client.js";
import { discoveredJobs, sources } from "../../db/schema.js";
import { NotFoundError } from "../../shared/errors.js";
import type { JobsListQuery, IngestBody } from "./schema.js";

export class JobsService {
  constructor(
    private db: Database,
    private careerOpsRoot: string,
  ) {}

  async list(query: JobsListQuery) {
    const conditions = [];

    if (query.status) {
      conditions.push(eq(discoveredJobs.status, query.status));
    }
    if (query.sourceId) {
      conditions.push(eq(discoveredJobs.sourceId, query.sourceId));
    }
    if (query.search) {
      const term = `%${query.search}%`;
      conditions.push(
        or(
          ilike(discoveredJobs.title, term),
          ilike(discoveredJobs.company, term),
        )!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (query.page - 1) * query.limit;

    const [rows, countResult] = await Promise.all([
      this.db
        .select()
        .from(discoveredJobs)
        .where(where)
        .orderBy(desc(discoveredJobs.createdAt))
        .limit(query.limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(discoveredJobs)
        .where(where),
    ]);

    return {
      data: rows,
      total: Number(countResult[0].count),
      page: query.page,
      limit: query.limit,
    };
  }

  async ingest(jobs: IngestBody) {
    let inserted = 0;
    let skipped = 0;

    for (const job of jobs) {
      try {
        await this.db.insert(discoveredJobs).values({
          title: job.title,
          company: job.company,
          url: job.url,
          location: job.location,
          postedAt: job.postedAt ? new Date(job.postedAt) : null,
          rawData: job.rawData || null,
          status: "new",
        });
        inserted++;
      } catch (err: unknown) {
        // Unique constraint on URL — skip duplicates
        if (
          err instanceof Error &&
          err.message.includes("unique")
        ) {
          skipped++;
        } else {
          throw err;
        }
      }
    }

    return { inserted, skipped };
  }

  async updateStatus(id: string, status: string) {
    const [job] = await this.db
      .select()
      .from(discoveredJobs)
      .where(eq(discoveredJobs.id, id))
      .limit(1);

    if (!job) throw new NotFoundError("Job", id);

    const [updated] = await this.db
      .update(discoveredJobs)
      .set({ status })
      .where(eq(discoveredJobs.id, id))
      .returning();

    return updated;
  }

  async sendToPipeline(id: string) {
    const [job] = await this.db
      .select()
      .from(discoveredJobs)
      .where(eq(discoveredJobs.id, id))
      .limit(1);

    if (!job) throw new NotFoundError("Job", id);

    // Append to data/pipeline.md
    const pipelinePath = join(this.careerOpsRoot, "data/pipeline.md");
    const entry = `- [ ] ${job.url} | ${job.company} | ${job.title}\n`;

    if (existsSync(pipelinePath)) {
      const content = readFileSync(pipelinePath, "utf-8");
      // Find Pendientes section or append at end
      const marker = "## Pendientes";
      const idx = content.indexOf(marker);
      if (idx !== -1) {
        const afterMarker = idx + marker.length;
        const nextSection = content.indexOf("\n## ", afterMarker);
        const insertAt = nextSection === -1 ? content.length : nextSection;
        const updated =
          content.slice(0, insertAt) + "\n" + entry + content.slice(insertAt);
        writeFileSync(pipelinePath, updated, "utf-8");
      } else {
        writeFileSync(pipelinePath, content + "\n" + marker + "\n\n" + entry, "utf-8");
      }
    } else {
      writeFileSync(
        pipelinePath,
        `# Pipeline\n\n## Pendientes\n\n${entry}`,
        "utf-8",
      );
    }

    // Update status in DB
    const [updated] = await this.db
      .update(discoveredJobs)
      .set({ status: "sent_to_pipeline" })
      .where(eq(discoveredJobs.id, id))
      .returning();

    return updated;
  }
}
```

- [ ] **Step 3: Create jobs router**

```typescript
// web/server/src/modules/jobs/router.ts
import type { FastifyInstance } from "fastify";
import { JobsService } from "./service.js";
import { jobsListQuerySchema, ingestBodySchema } from "./schema.js";
import { z } from "zod";

const patchBodySchema = z.object({
  status: z.enum(["dismissed", "reviewed"]),
});

export async function jobsRouter(app: FastifyInstance) {
  const service = new JobsService(app.db, app.env.CAREER_OPS_ROOT);

  app.get("/api/jobs", async (request, reply) => {
    const query = jobsListQuerySchema.parse(request.query);
    const result = await service.list(query);
    return reply.send(result);
  });

  app.post("/api/jobs/ingest", async (request, reply) => {
    const jobs = ingestBodySchema.parse(request.body);
    const result = await service.ingest(jobs);
    return reply.send(result);
  });

  app.patch<{ Params: { id: string } }>(
    "/api/jobs/:id",
    async (request, reply) => {
      const { status } = patchBodySchema.parse(request.body);
      const result = await service.updateStatus(request.params.id, status);
      return reply.send(result);
    },
  );

  app.post<{ Params: { id: string } }>(
    "/api/jobs/:id/to-pipeline",
    async (request, reply) => {
      const result = await service.sendToPipeline(request.params.id);
      return reply.send(result);
    },
  );
}
```

- [ ] **Step 4: Register in index.ts**

Add to `web/server/src/index.ts`:

```typescript
import { jobsRouter } from "./modules/jobs/router.js";

// Inside main():
await app.register(jobsRouter);
```

- [ ] **Step 5: Commit**

```bash
git add web/server/src/modules/jobs/
git commit -m "feat(web): jobs module — discovery feed, ingest from scan, send to pipeline"
```

---

## Task 9: Sources Module

**Files:**
- Create: `web/server/src/modules/sources/schema.ts`
- Create: `web/server/src/modules/sources/service.ts`
- Create: `web/server/src/modules/sources/router.ts`

- [ ] **Step 1: Create Zod schemas**

```typescript
// web/server/src/modules/sources/schema.ts
import { z } from "zod";

export const createSourceSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["greenhouse", "ashby", "lever", "custom"]),
  config: z.record(z.unknown()).default({}),
  enabled: z.boolean().default(true),
});

export const updateSourceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.enum(["greenhouse", "ashby", "lever", "custom"]).optional(),
  config: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
});

export type CreateSource = z.infer<typeof createSourceSchema>;
export type UpdateSource = z.infer<typeof updateSourceSchema>;
```

- [ ] **Step 2: Create sources service**

```typescript
// web/server/src/modules/sources/service.ts
import { eq, sql } from "drizzle-orm";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import type { Database } from "../../db/client.js";
import { sources, discoveredJobs } from "../../db/schema.js";
import { NotFoundError } from "../../shared/errors.js";
import type { CreateSource, UpdateSource } from "./schema.js";

export class SourcesService {
  constructor(
    private db: Database,
    private careerOpsRoot: string,
  ) {}

  async list() {
    const rows = await this.db.select().from(sources);

    // Get job counts per source
    const jobCounts = await this.db
      .select({
        sourceId: discoveredJobs.sourceId,
        count: sql<number>`count(*)`,
      })
      .from(discoveredJobs)
      .groupBy(discoveredJobs.sourceId);

    const countMap = new Map(
      jobCounts.map((r) => [r.sourceId, Number(r.count)]),
    );

    return rows.map((row) => ({
      ...row,
      jobCount: countMap.get(row.id) || 0,
    }));
  }

  async create(body: CreateSource) {
    const [source] = await this.db
      .insert(sources)
      .values(body)
      .returning();

    this.syncToPortalsYml();
    return source;
  }

  async update(id: string, body: UpdateSource) {
    const [existing] = await this.db
      .select()
      .from(sources)
      .where(eq(sources.id, id))
      .limit(1);

    if (!existing) throw new NotFoundError("Source", id);

    const [updated] = await this.db
      .update(sources)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(sources.id, id))
      .returning();

    this.syncToPortalsYml();
    return updated;
  }

  async remove(id: string) {
    const [existing] = await this.db
      .select()
      .from(sources)
      .where(eq(sources.id, id))
      .limit(1);

    if (!existing) throw new NotFoundError("Source", id);

    await this.db.delete(sources).where(eq(sources.id, id));
    this.syncToPortalsYml();
  }

  private syncToPortalsYml() {
    const portalsPath = join(this.careerOpsRoot, "portals.yml");

    // Read existing portals.yml to preserve title_filter and other config
    let existingDoc: Record<string, unknown> = {};
    if (existsSync(portalsPath)) {
      existingDoc = yaml.load(readFileSync(portalsPath, "utf-8")) as Record<string, unknown>;
    }

    // Get all sources from DB synchronously is not ideal —
    // but this runs after a write, so we do a fire-and-forget async
    this.db
      .select()
      .from(sources)
      .then((allSources) => {
        const companies = allSources.map((s) => {
          const config = s.config as Record<string, unknown>;
          const entry: Record<string, unknown> = {
            name: s.name,
            enabled: s.enabled,
          };
          if (config.careers_url) entry.careers_url = config.careers_url;
          if (config.api) entry.api = config.api;
          return entry;
        });

        const doc = {
          ...existingDoc,
          tracked_companies: companies,
        };

        writeFileSync(portalsPath, yaml.dump(doc, { lineWidth: 120 }), "utf-8");
      })
      .catch((err) => {
        console.error("Failed to sync portals.yml:", err);
      });
  }
}
```

- [ ] **Step 3: Create sources router**

```typescript
// web/server/src/modules/sources/router.ts
import type { FastifyInstance } from "fastify";
import { SourcesService } from "./service.js";
import { createSourceSchema, updateSourceSchema } from "./schema.js";

export async function sourcesRouter(app: FastifyInstance) {
  const service = new SourcesService(app.db, app.env.CAREER_OPS_ROOT);

  app.get("/api/sources", async (_request, reply) => {
    const result = await service.list();
    return reply.send(result);
  });

  app.post("/api/sources", async (request, reply) => {
    const body = createSourceSchema.parse(request.body);
    const result = await service.create(body);
    return reply.status(201).send(result);
  });

  app.patch<{ Params: { id: string } }>(
    "/api/sources/:id",
    async (request, reply) => {
      const body = updateSourceSchema.parse(request.body);
      const result = await service.update(request.params.id, body);
      return reply.send(result);
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/api/sources/:id",
    async (request, reply) => {
      await service.remove(request.params.id);
      return reply.status(204).send();
    },
  );
}
```

- [ ] **Step 4: Register in index.ts and finalize server**

Update `web/server/src/index.ts` to register all routers:

```typescript
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { resolve, join } from "path";
import { existsSync } from "fs";
import { loadEnv } from "./config/env.js";
import { createDb } from "./db/client.js";
import { errorHandler } from "./shared/middleware.js";
import { syncRouter } from "./modules/sync/router.js";
import { applicationsRouter } from "./modules/applications/router.js";
import { pipelineRouter } from "./modules/pipeline/router.js";
import { jobsRouter } from "./modules/jobs/router.js";
import { sourcesRouter } from "./modules/sources/router.js";

async function main() {
  const env = loadEnv();
  env.CAREER_OPS_ROOT = resolve(env.CAREER_OPS_ROOT);

  const db = createDb(env.DATABASE_URL);

  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(errorHandler);

  app.decorate("db", db);
  app.decorate("env", env);

  // API routes
  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(syncRouter);
  await app.register(applicationsRouter);
  await app.register(pipelineRouter);
  await app.register(jobsRouter);
  await app.register(sourcesRouter);

  // Serve static client in production
  const clientDist = join(import.meta.dirname, "../../client/dist");
  if (existsSync(clientDist)) {
    await app.register(fastifyStatic, {
      root: clientDist,
      prefix: "/",
      wildcard: false,
    });
    // SPA fallback
    app.setNotFoundHandler((_request, reply) => {
      return reply.sendFile("index.html");
    });
  }

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
```

- [ ] **Step 5: Run all server tests**

Run:
```bash
cd web/server && npx vitest run
```

Expected: All tests pass (sync parsers + pipeline transitions).

- [ ] **Step 6: Commit**

```bash
git add web/server/src/modules/sources/ web/server/src/index.ts
git commit -m "feat(web): sources module + finalized server with all routes"
```

---

## Task 10: Client Scaffold + App Shell

**Files:**
- Create: `web/client/src/main.tsx`
- Create: `web/client/src/styles/globals.css`
- Create: `web/client/tailwind.config.ts`
- Create: `web/client/postcss.config.js`
- Create: `web/client/src/lib/api.ts`
- Create: `web/client/src/lib/types.ts`
- Create: `web/client/src/lib/constants.ts`
- Create: `web/client/src/lib/queries.ts`
- Create: `web/client/src/routes/__root.tsx`
- Create: `web/client/index.html`

- [ ] **Step 1: Create index.html**

```html
<!-- web/client/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>career-ops dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create Tailwind + PostCSS config**

```typescript
// web/client/tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

```javascript
// web/client/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Create globals.css with shadcn theme vars**

```css
/* web/client/src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 4: Create shared types, API client, constants**

```typescript
// web/client/src/lib/types.ts
export interface Application {
  id: string;
  number: number;
  company: string;
  role: string;
  score: string | null;
  status: string;
  url: string | null;
  reportPath: string | null;
  pdfGenerated: boolean;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
  source: string;
}

export interface ApplicationDetail extends Application {
  statusHistory: StatusHistoryEntry[];
}

export interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  url: string;
  sourceId: string | null;
  location: string | null;
  postedAt: string | null;
  rawData: unknown;
  status: string;
  createdAt: string;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  enabled: boolean;
  lastScannedAt: string | null;
  createdAt: string;
  updatedAt: string;
  jobCount: number;
}

export interface PipelineColumn {
  status: string;
  applications: Application[];
}

export interface PipelineData {
  columns: PipelineColumn[];
  archive: Application[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AppStats {
  byStatus: Record<string, number>;
  avgScore: number;
  totalCount: number;
}
```

```typescript
// web/client/src/lib/api.ts
const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) =>
    request<void>(path, { method: "DELETE" }),
};
```

```typescript
// web/client/src/lib/constants.ts
export const STATUS_COLORS: Record<string, string> = {
  Evaluated: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Applied: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Responded: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Interview: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  Offer: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Discarded: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  SKIP: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export const KANBAN_COLUMNS = [
  "Evaluated", "Applied", "Responded", "Interview", "Offer",
] as const;

export const SOURCE_TYPES = ["greenhouse", "ashby", "lever", "custom"] as const;
```

- [ ] **Step 5: Create TanStack Query hooks**

```typescript
// web/client/src/lib/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type {
  Application,
  ApplicationDetail,
  AppStats,
  DiscoveredJob,
  Source,
  PipelineData,
  Paginated,
} from "./types";

// ── Applications ──────────────────────────────────
export function useApplications(params?: Record<string, string>) {
  const search = params ? "?" + new URLSearchParams(params).toString() : "";
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => api.get<Paginated<Application>>(`/applications${search}`),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => api.get<ApplicationDetail>(`/applications/${id}`),
    enabled: !!id,
  });
}

export function useAppStats() {
  return useQuery({
    queryKey: ["applications", "stats"],
    queryFn: () => api.get<AppStats>("/applications/stats"),
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; status?: string; notes?: string }) =>
      api.patch<Application>(`/applications/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}

// ── Pipeline ──────────────────────────────────────
export function usePipeline() {
  return useQuery({
    queryKey: ["pipeline"],
    queryFn: () => api.get<PipelineData>("/pipeline"),
  });
}

export function useMoveCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, toStatus }: { id: string; toStatus: string }) =>
      api.patch<Application>(`/pipeline/${id}/move`, { toStatus }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

// ── Jobs ──────────────────────────────────────────
export function useJobs(params?: Record<string, string>) {
  const search = params ? "?" + new URLSearchParams(params).toString() : "";
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => api.get<Paginated<DiscoveredJob>>(`/jobs${search}`),
  });
}

export function useDismissJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<DiscoveredJob>(`/jobs/${id}`, { status: "dismissed" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useSendToPipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post<DiscoveredJob>(`/jobs/${id}/to-pipeline`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

// ── Sources ───────────────────────────────────────
export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: () => api.get<Source[]>("/sources"),
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Source, "id" | "createdAt" | "updatedAt" | "lastScannedAt" | "jobCount">) =>
      api.post<Source>("/sources", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sources"] }),
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Source>) =>
      api.patch<Source>(`/sources/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sources"] }),
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sources/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sources"] }),
  });
}
```

- [ ] **Step 6: Create main.tsx + root route (app shell)**

```tsx
// web/client/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: true },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

```tsx
// web/client/src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Columns3, Rss, Radio } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Applications", icon: LayoutDashboard },
  { to: "/pipeline", label: "Pipeline", icon: Columns3 },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/sources", label: "Sources", icon: Radio },
] as const;

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-card px-3 py-6 flex flex-col gap-1">
        <h1 className="text-lg font-semibold px-3 mb-6">career-ops</h1>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors [&.active]:bg-accent [&.active]:text-accent-foreground [&.active]:font-medium"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  ),
});
```

- [ ] **Step 7: Init shadcn/ui and install core components**

Run:
```bash
cd web/client
npx shadcn@latest init -d
npx shadcn@latest add badge button card input select table dialog dropdown-menu
```

- [ ] **Step 8: Create placeholder route files so the app builds**

```tsx
// web/client/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <div className="text-xl font-semibold">Applications — coming next</div>,
});
```

```tsx
// web/client/src/routes/pipeline.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pipeline")({
  component: () => <div className="text-xl font-semibold">Pipeline — coming next</div>,
});
```

```tsx
// web/client/src/routes/feed.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feed")({
  component: () => <div className="text-xl font-semibold">Feed — coming next</div>,
});
```

```tsx
// web/client/src/routes/sources.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sources")({
  component: () => <div className="text-xl font-semibold">Sources — coming next</div>,
});
```

- [ ] **Step 9: Verify client builds and runs**

Run:
```bash
cd web/client && npm run dev
```

Expected: Vite dev server on :5173, sidebar with 4 nav links, placeholder pages render.

- [ ] **Step 10: Commit**

```bash
git add web/client/
git commit -m "feat(web): client scaffold — app shell, routing, API client, query hooks, shadcn/ui"
```

---

## Task 11: Applications Page

**Files:**
- Create: `web/client/src/components/applications/status-badge.tsx`
- Create: `web/client/src/components/applications/filters.tsx`
- Create: `web/client/src/components/applications/applications-table.tsx`
- Modify: `web/client/src/routes/index.tsx`

- [ ] **Step 1: Create StatusBadge component**

```tsx
// web/client/src/components/applications/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={STATUS_COLORS[status] || ""}>
      {status}
    </Badge>
  );
}
```

- [ ] **Step 2: Create Filters component**

```tsx
// web/client/src/components/applications/filters.tsx
import { Input } from "@/components/ui/input";
import { KANBAN_COLUMNS } from "@/lib/constants";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
}

const ALL_STATUSES = [...KANBAN_COLUMNS, "Rejected", "Discarded", "SKIP"];

export function Filters({ search, onSearchChange, statusFilter, onStatusFilterChange }: FiltersProps) {
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter((s) => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <Input
        placeholder="Search company, role, or notes..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              statusFilter.includes(status)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ApplicationsTable component**

```tsx
// web/client/src/components/applications/applications-table.tsx
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import type { Application } from "@/lib/types";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

const columns: ColumnDef<Application>[] = [
  { accessorKey: "number", header: "#", size: 50 },
  { accessorKey: "createdAt", header: "Date", cell: ({ getValue }) => {
    const d = getValue<string>();
    return d ? new Date(d).toLocaleDateString() : "";
  }},
  { accessorKey: "company", header: "Company" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "score", header: "Score", cell: ({ getValue }) => {
    const s = getValue<string | null>();
    return s ? `${s}/5` : "-";
  }},
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => (
    <StatusBadge status={getValue<string>()} />
  )},
  { accessorKey: "pdfGenerated", header: "PDF", size: 50, cell: ({ getValue }) => (
    getValue<boolean>() ? "✅" : "❌"
  )},
  { accessorKey: "notes", header: "Notes", cell: ({ getValue }) => (
    <span className="text-muted-foreground text-sm truncate max-w-[200px] block">
      {getValue<string | null>() || ""}
    </span>
  )},
];

interface Props {
  data: Application[];
}

export function ApplicationsTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "number", desc: true }]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No applications yet. Evaluate some jobs to get started.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 4: Wire up the Applications route**

```tsx
// web/client/src/routes/index.tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useApplications, useAppStats } from "@/lib/queries";
import { ApplicationsTable } from "@/components/applications/applications-table";
import { Filters } from "@/components/applications/filters";

export const Route = createFileRoute("/")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (statusFilter.length > 0) params.status = statusFilter.join(",");

  const { data, isLoading } = useApplications(params);
  const { data: stats } = useAppStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        {stats && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{stats.totalCount} total</span>
            <span>avg {stats.avgScore}/5</span>
          </div>
        )}
      </div>

      <Filters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="text-muted-foreground py-8 text-center">Loading...</div>
      ) : (
        <ApplicationsTable data={data?.data || []} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add web/client/src/components/applications/ web/client/src/routes/index.tsx
git commit -m "feat(web): applications page — data table with sorting, filtering, status badges"
```

---

## Task 12: Pipeline (Kanban) Page

**Files:**
- Create: `web/client/src/components/pipeline/kanban-board.tsx`
- Create: `web/client/src/components/pipeline/kanban-column.tsx`
- Create: `web/client/src/components/pipeline/kanban-card.tsx`
- Modify: `web/client/src/routes/pipeline.tsx`

- [ ] **Step 1: Create KanbanCard component**

```tsx
// web/client/src/components/pipeline/kanban-card.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import type { Application } from "@/lib/types";

interface Props {
  app: Application;
}

export function KanbanCard({ app }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app.id, data: { status: app.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const daysInStage = Math.floor(
    (Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="font-medium text-sm">{app.company}</div>
      <div className="text-xs text-muted-foreground mt-1 truncate">{app.role}</div>
      <div className="flex items-center justify-between mt-2">
        {app.score && (
          <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded">
            {app.score}/5
          </span>
        )}
        <span className="text-xs text-muted-foreground">{daysInStage}d</span>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Create KanbanColumn component**

```tsx
// web/client/src/components/pipeline/kanban-column.tsx
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import type { Application } from "@/lib/types";

interface Props {
  status: string;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-64 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-sm">{status}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 rounded-lg min-h-[200px] transition-colors ${
          isOver ? "bg-accent/50" : "bg-muted/30"
        }`}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <KanbanCard key={app.id} app={app} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create KanbanBoard component**

```tsx
// web/client/src/components/pipeline/kanban-board.tsx
import { DndContext, DragEndEvent, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { useState } from "react";
import type { PipelineData, Application } from "@/lib/types";

interface Props {
  data: PipelineData;
  onMoveCard: (id: string, toStatus: string) => void;
}

export function KanbanBoard({ data, onMoveCard }: Props) {
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  function handleDragStart(event: { active: { id: string | number } }) {
    const id = String(event.active.id);
    const app = data.columns
      .flatMap((c) => c.applications)
      .find((a) => a.id === id);
    setActiveApp(app || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const appId = String(active.id);
    const targetStatus = String(over.id);

    // Find the app's current status
    const currentApp = data.columns
      .flatMap((c) => c.applications)
      .find((a) => a.id === appId);

    if (currentApp && currentApp.status !== targetStatus) {
      onMoveCard(appId, targetStatus);
    }
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            applications={col.applications}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp && <KanbanCard app={activeApp} />}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 4: Wire up the Pipeline route**

```tsx
// web/client/src/routes/pipeline.tsx
import { createFileRoute } from "@tanstack/react-router";
import { usePipeline, useMoveCard } from "@/lib/queries";
import { KanbanBoard } from "@/components/pipeline/kanban-board";

export const Route = createFileRoute("/pipeline")({
  component: PipelinePage,
});

function PipelinePage() {
  const { data, isLoading } = usePipeline();
  const moveCard = useMoveCard();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pipeline</h1>
      {isLoading || !data ? (
        <div className="text-muted-foreground py-8 text-center">Loading...</div>
      ) : (
        <KanbanBoard
          data={data}
          onMoveCard={(id, toStatus) => moveCard.mutate({ id, toStatus })}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add web/client/src/components/pipeline/ web/client/src/routes/pipeline.tsx
git commit -m "feat(web): pipeline page — Kanban board with drag-and-drop status transitions"
```

---

## Task 13: Feed Page

**Files:**
- Create: `web/client/src/components/feed/job-card.tsx`
- Create: `web/client/src/components/feed/feed-filters.tsx`
- Modify: `web/client/src/routes/feed.tsx`

- [ ] **Step 1: Create JobCard component**

```tsx
// web/client/src/components/feed/job-card.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, MapPin, ExternalLink } from "lucide-react";
import type { DiscoveredJob } from "@/lib/types";

interface Props {
  job: DiscoveredJob;
  onSendToPipeline: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function JobCard({ job, onSendToPipeline, onDismiss }: Props) {
  const postedAgo = job.postedAt
    ? `${Math.floor((Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24))}d ago`
    : "";

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </a>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
        )}
        {postedAgo && <span>{postedAgo}</span>}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <Badge variant="outline" className="text-xs">
          {job.status}
        </Badge>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDismiss(job.id)}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" /> Dismiss
          </Button>
          <Button
            size="sm"
            onClick={() => onSendToPipeline(job.id)}
          >
            <ArrowRight className="h-4 w-4 mr-1" /> Evaluate
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Create FeedFilters component**

```tsx
// web/client/src/components/feed/feed-filters.tsx
import { Input } from "@/components/ui/input";
import { useSources } from "@/lib/queries";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (value: string) => void;
}

export function FeedFilters({ search, onSearchChange, sourceFilter, onSourceFilterChange }: Props) {
  const { data: sources } = useSources();

  return (
    <div className="flex gap-3 mb-4">
      <Input
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <select
        value={sourceFilter}
        onChange={(e) => onSourceFilterChange(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">All sources</option>
        {sources?.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 3: Wire up the Feed route**

```tsx
// web/client/src/routes/feed.tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useJobs, useDismissJob, useSendToPipeline } from "@/lib/queries";
import { JobCard } from "@/components/feed/job-card";
import { FeedFilters } from "@/components/feed/feed-filters";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const params: Record<string, string> = { status: "new" };
  if (search) params.search = search;
  if (sourceFilter) params.sourceId = sourceFilter;

  const { data, isLoading } = useJobs(params);
  const dismiss = useDismissJob();
  const sendToPipeline = useSendToPipeline();

  const jobCount = data?.total || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Feed</h1>
        <span className="text-sm text-muted-foreground">
          {jobCount} new {jobCount === 1 ? "job" : "jobs"}
        </span>
      </div>

      <FeedFilters
        search={search}
        onSearchChange={setSearch}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
      />

      {isLoading ? (
        <div className="text-muted-foreground py-8 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSendToPipeline={(id) => sendToPipeline.mutate(id)}
              onDismiss={(id) => dismiss.mutate(id)}
            />
          ))}
          {data?.data.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No new jobs. Run a scan to discover more.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add web/client/src/components/feed/ web/client/src/routes/feed.tsx
git commit -m "feat(web): feed page — job discovery cards with send-to-pipeline and dismiss"
```

---

## Task 14: Sources Page

**Files:**
- Create: `web/client/src/components/sources/source-list.tsx`
- Create: `web/client/src/components/sources/source-form.tsx`
- Modify: `web/client/src/routes/sources.tsx`

- [ ] **Step 1: Create SourceForm component**

```tsx
// web/client/src/components/sources/source-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SOURCE_TYPES } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(SOURCE_TYPES),
  careersUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (data: { name: string; type: string; config: Record<string, unknown> }) => void;
  onCancel: () => void;
}

export function SourceForm({ onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", type: "greenhouse", careersUrl: "" },
  });

  function handleFormSubmit(values: FormValues) {
    onSubmit({
      name: values.name,
      type: values.type,
      config: values.careersUrl ? { careers_url: values.careersUrl } : {},
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3 p-4 border rounded-lg">
      <div>
        <Input placeholder="Company name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <select {...register("type")} className="rounded-md border bg-background px-3 py-2 text-sm">
        {SOURCE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <div>
        <Input placeholder="Careers URL (e.g. https://jobs.ashbyhq.com/company)" {...register("careersUrl")} />
        {errors.careersUrl && <p className="text-xs text-destructive mt-1">{errors.careersUrl.message}</p>}
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Source</Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create SourceList component**

```tsx
// web/client/src/components/sources/source-list.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Source } from "@/lib/types";

interface Props {
  sources: Source[];
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

export function SourceList({ sources, onToggleEnabled, onDelete }: Props) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Jobs</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Last Scanned</th>
            <th className="text-left px-4 py-3 text-sm font-medium">Enabled</th>
            <th className="text-right px-4 py-3 text-sm font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id} className="border-b last:border-0">
              <td className="px-4 py-3 text-sm font-medium">{source.name}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{source.type}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{source.jobCount}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {source.lastScannedAt ? new Date(source.lastScannedAt).toLocaleDateString() : "Never"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleEnabled(source.id, !source.enabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    source.enabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      source.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(source.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          {sources.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No sources configured. Add one to start scanning.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Wire up the Sources route**

```tsx
// web/client/src/routes/sources.tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSources, useCreateSource, useUpdateSource, useDeleteSource } from "@/lib/queries";
import { SourceList } from "@/components/sources/source-list";
import { SourceForm } from "@/components/sources/source-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/sources")({
  component: SourcesPage,
});

function SourcesPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: sources, isLoading } = useSources();
  const createSource = useCreateSource();
  const updateSource = useUpdateSource();
  const deleteSource = useDeleteSource();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sources</h1>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Source
        </Button>
      </div>

      {showForm && (
        <div className="mb-4">
          <SourceForm
            onSubmit={(data) => {
              createSource.mutate(data as Parameters<typeof createSource.mutate>[0]);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground py-8 text-center">Loading...</div>
      ) : (
        <SourceList
          sources={sources || []}
          onToggleEnabled={(id, enabled) => updateSource.mutate({ id, enabled })}
          onDelete={(id) => {
            if (confirm("Delete this source?")) deleteSource.mutate(id);
          }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add web/client/src/components/sources/ web/client/src/routes/sources.tsx
git commit -m "feat(web): sources page — CRUD list with toggle, add form, delete"
```

---

## Task 15: Integration — Existing Script Modifications

**Files:**
- Modify: `merge-tracker.mjs` (line ~367)
- Modify: `scan.mjs` (line ~356)
- Modify: `package.json` (root)
- Modify: `.gitignore`

- [ ] **Step 1: Add optional sync call to merge-tracker.mjs**

At the end of `merge-tracker.mjs` (after line 377, before the file ends), add:

```javascript
// Notify dashboard (optional — fails silently if dashboard is not running)
try {
  await fetch('http://localhost:3000/api/sync/import', { method: 'POST' });
} catch { /* dashboard not running — no-op */ }
```

- [ ] **Step 2: Add optional ingest call to scan.mjs**

In `scan.mjs`, after line 356 (after `console.log` for results saved), inside the `if (newOffers.length > 0)` block and after writing to files, add:

```javascript
    // Notify dashboard (optional — fails silently if dashboard is not running)
    try {
      const payload = newOffers.map(o => ({
        title: o.title, company: o.company, url: o.url,
        source: o.source, location: o.location || undefined,
      }));
      await fetch('http://localhost:3000/api/jobs/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch { /* dashboard not running — no-op */ }
```

- [ ] **Step 3: Add web:* scripts to root package.json**

Add to the `scripts` object in the root `package.json`:

```json
"web:dev": "concurrently \"npm run web:server:dev\" \"npm run web:client:dev\"",
"web:server:dev": "cd web/server && npm run dev",
"web:client:dev": "cd web/client && npm run dev",
"web:db:up": "cd web && docker compose up -d",
"web:db:down": "cd web && docker compose down",
"web:migrate": "cd web/server && npx drizzle-kit migrate",
"web:seed": "cd web/server && npx tsx src/db/seed.ts",
"web:build": "cd web/server && npm run build && cd ../client && npm run build",
"web:start": "cd web/server && npm start",
"web:test": "cd web/server && npx vitest run"
```

Also add `concurrently` as a dev dependency:

```bash
npm install -D concurrently
```

- [ ] **Step 4: Update .gitignore**

Append to `.gitignore`:

```
# Web dashboard
web/server/dist/
web/client/dist/
web/.env
web/server/.env
```

- [ ] **Step 5: Commit**

```bash
git add merge-tracker.mjs scan.mjs package.json .gitignore
git commit -m "feat(web): integrate dashboard sync into existing scripts + add web:* npm scripts"
```

---

## Task 16: Documentation

**Files:**
- Create: `docs/WEB_DASHBOARD.md`

- [ ] **Step 1: Write documentation**

```markdown
# Web Dashboard

A visual dashboard for career-ops — track applications, manage your pipeline, discover jobs, and configure sources.

## Quick Start

```bash
# 1. Start Postgres
npm run web:db:up

# 2. Create tables
npm run web:migrate

# 3. Import existing data (applications.md, portals.yml)
npm run web:seed

# 4. Start dev servers (API on :3000, client on :5173)
npm run web:dev
```

Open http://localhost:5173

## Pages

- **Applications** (`/`) — Filterable, sortable table of all evaluated jobs
- **Pipeline** (`/pipeline`) — Kanban board: drag cards between Evaluated → Applied → Interview → Offer
- **Feed** (`/feed`) — New jobs from scans. Send to pipeline or dismiss.
- **Sources** (`/sources`) — Add, toggle, or remove companies to scan

## How Sync Works

The dashboard and Claude Code share the same data through markdown files:

- **Claude evaluates a job** → writes report + updates applications.md → `merge-tracker.mjs` pings the dashboard API → database updates
- **You move a Kanban card** → API updates the database + writes back to applications.md → Claude sees the change
- **You run a scan** → `scan.mjs` saves to pipeline.md + posts to dashboard API → new jobs appear in the Feed

If the dashboard isn't running, everything works exactly as before. Markdown files are always the source of truth.

## Tech Stack

- **Server:** Fastify, Drizzle ORM, PostgreSQL, Zod, TypeScript
- **Client:** React 19, Vite, TanStack (Router, Query, Table), Tailwind CSS, shadcn/ui, @dnd-kit

## Scripts

| Command | Description |
|---------|-------------|
| `npm run web:dev` | Start both server + client in dev mode |
| `npm run web:db:up` | Start Postgres via Docker |
| `npm run web:db:down` | Stop Postgres |
| `npm run web:migrate` | Run database migrations |
| `npm run web:seed` | Import markdown data into database |
| `npm run web:build` | Production build |
| `npm run web:start` | Start production server |
| `npm run web:test` | Run server tests |
```

- [ ] **Step 2: Commit**

```bash
git add docs/WEB_DASHBOARD.md
git commit -m "docs(web): add dashboard setup and usage documentation"
```

- [ ] **Step 3: Run full test suite to verify nothing is broken**

Run:
```bash
cd web/server && npx vitest run
node test-all.mjs
```

Expected: All server tests pass. Existing career-ops tests still pass (64/65, same dashboard build skip as before).

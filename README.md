# Metriq

**Evidence-first hiring built around auditions, not assumptions.**

Metriq is a proof-of-work hiring platform: candidates complete structured **auditions** (stages, artifacts, rubrics), and hiring teams review **real work** instead of proxy signals alone. This repository is the **MVP monorepo**—product surfaces, shared UI, API types, and a preview-friendly mock layer while core auth and tenancy evolve.

---

## Why Metriq exists

Traditional hiring optimizes for **resumes and interviews**. That misses how people actually perform on the job. Metriq is designed for teams who want to:

- **Evaluate work samples and scenarios** with explicit criteria (rubrics), not vibes alone.
- **Keep a durable evidence trail**—what was submitted, how it was scored, and how decisions were made.
- **Move faster on strong signal**—pipeline and review flows built for throughput without dropping rigor.

### Who it is for

| Audience | Need |
|----------|------|
| **Hiring managers & panelists** | A clear queue of submissions to review, compare, and decide on—with context and rubric guidance. |
| **Talent / recruiting / eng leadership** | Visibility into funnels, audition health, and where candidates stall—without replacing the ATS on day one. |
| **Candidates** | A fair, structured way to **show proof**—auditions, artifacts, and results they can point to in a proof-oriented profile. |
| **Org / IT (later)** | Organization-level settings, workspaces (departments), and seat allocation—**foundation routes exist**; full SSO and enforcement come in a later auth pass. |

---

## Product model (MVP)

- **Auditions** — Role- or opening-scoped evaluations made of **stages** (instructions, timeboxes, deliverables).
- **Rubrics & signal** — Scoring dimensions that keep reviews consistent and auditable.
- **Pipeline** — Candidates move through stages; the UI reflects status, ownership, and review load.
- **Proof profile (candidate-facing)** — Highlights and artifacts that support a narrative of demonstrated skill.

Today’s codebase emphasizes **end-to-end UX** with **mock data** so flows can be designed and tested before production backends harden.

---

## Surfaces & routing

The web app is role-gated with a **preview cookie** (`metriq.role`: `candidate` | `employer` | `admin`). There is **no real SSO** in this pass—middleware enforces area access so demos stay coherent.

| Area | Path | Purpose |
|------|------|---------|
| **Candidate** | `/candidate/*` | Auditions, stages, submissions, results, proof profile, settings—candidate experience. |
| **Organization** | `/employer/*` | Org console: overview, **workspaces**, **seats**, billing/security stubs—procurement-style shell. |
| **Department workspace** | `/dept/[workspaceSlug]/*` | Day-to-day hiring ops for a workspace: dashboard, auditions, pipeline, review, compare, analytics, team, settings, submission detail. |
| **Admin** | `/admin` | Platform-style overview (mock). |
| **Login** | `/login` | Sets the preview role cookie and sends you to the right home. |

Legacy bookmarks under `/employer/...` that used to mean “employer app” are **redirected** to the default workspace under `/dept/<slug>/...` (see `apps/web/middleware.ts` and `apps/web/src/mocks/tenancy.ts`).

---

## Monorepo layout

| Package | Role |
|---------|------|
| `apps/web` | **Next.js 15** (App Router), layouts, pages, middleware, preview mocks, tRPC client. |
| `packages/ui` | **Design system**—shell, tables, panels, modals, toasts, form primitives, audition/review building blocks. |
| `packages/api` | **tRPC** routers and server wiring shared with the web app. |
| `packages/types` | Shared **TypeScript** domain types (e.g. roles). |
| `packages/validators` | **Zod** schemas shared across client and server. |
| `packages/db` | Database access layer (Kysely-oriented; evolves with the product). |
| `packages/config` | Shared **TypeScript / tooling** config. |

---

## Tech stack

- **Runtime:** Node.js 20+
- **App:** React 19, Next.js 15, Tailwind CSS
- **Data layer:** tRPC 11, TanStack Query, SuperJSON
- **Package manager:** pnpm 9 (workspaces)

---

## Getting started

**Prerequisites:** Node **≥ 20.11** and pnpm **9** (see root `package.json` `engines` / `packageManager`).

```bash
# Install all workspace dependencies
pnpm install

# Environment: copy `.env.example` to `.env`, fill in secrets, then encrypt for git:
#   pnpm env:encrypt
# Commit the encrypted `.env`. Share `DOTENV_PRIVATE_KEY` (from `.env.keys`) via your secret manager — never commit `.env.keys`.
# Defaults match docker-compose Postgres for local DB.

# Start Postgres, then migrate + seed:
pnpm db:up
pnpm db:migrate
pnpm db:seed

# Seed scripts live in packages/db/seeds/ (0001_*.ts, …) and run in one transaction via src/run-seeds.ts.

# Local dev (Next dev server for apps/web; decrypts via dotenvx)
pnpm dev
```

Configuration lives in **`.env` at the repo root** (encrypted when committed; decrypted at runtime by [dotenvx](https://github.com/dotenvx/dotenvx) via `apps/web` scripts and root `db:*` commands). Next still resolves the repo root in `apps/web/next.config.ts`. Optional plaintext overrides: `.env.local` (gitignored). For Docker, `DATABASE_URL` defaults to `postgres://postgres:postgres@127.0.0.1:5432/metriq`.

Open [http://localhost:3000](http://localhost:3000). You will be redirected through **`/login`** until a preview role is chosen.

**Other useful commands:**

```bash
pnpm build      # Production build (apps/web)
pnpm start      # Start production server (after build)
pnpm lint       # ESLint (apps/web)
pnpm typecheck  # TypeScript across packages (parallel)
```

---

## Preview auth & tenancy

- **Role cookie:** `metriq.role` — set from `/login`; middleware restricts `/candidate`, `/employer`, `/dept`, and `/admin`.
- **Employer vs workspace:** Both org (`/employer`) and department (`/dept/...`) use the **same employer role** for now; future Better Auth / org plugins can split membership without changing the URL shape.
- **tRPC headers:** Department routes send **`x-metriq-workspace-slug`** and **`x-metriq-org-slug`** when **`NEXT_PUBLIC_METRIQ_ORG_SLUG`** is set (must match the seeded demo org’s `company.slug`, e.g. `metriq`). The API also reads **`METRIQ_ORG_SLUG`** for the same value. There is no hardcoded default in code — configure both in root `.env` (see `apps/web/src/app/providers.tsx` and `apps/web/src/app/api/trpc/[trpc]/route.ts`).
- **Admin API:** Set **`METRIQ_ADMIN_API_KEY`** in the environment for `admin/*` tRPC procedures to run (role must still be `admin`).

See [`docs/roadmap.md`](docs/roadmap.md) for the implementation checklist.

---

## Project status

This is an **active MVP**: UI and flows are ahead of or alongside hardened multi-tenant auth, billing, and ATS integrations. Treat production claims in marketing copy as **aspirational** until those modules land.

---

## License

Private repository unless otherwise noted by the maintainers.

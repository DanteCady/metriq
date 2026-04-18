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

# Local dev (Next dev server for apps/web)
pnpm dev
```

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
- **tRPC stub header:** On department routes, the client may send **`x-metriq-workspace-slug`** for future procedure scoping (see `apps/web/src/app/providers.tsx`).

---

## Project status

This is an **active MVP**: UI and flows are ahead of or alongside hardened multi-tenant auth, billing, and ATS integrations. Treat production claims in marketing copy as **aspirational** until those modules land.

---

## License

Private repository unless otherwise noted by the maintainers.

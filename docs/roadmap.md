# Metriq implementation roadmap

Phased delivery (auth last). Use this checklist with the database migrations in `packages/db/migrations/`.

## Phase 1 — Tenancy

- [x] `company.slug`, `workspace` table, seed workspaces
- [x] tRPC scope from `x-metriq-org-slug` + `x-metriq-workspace-slug`
- [x] `tenancy` router (`resolveWorkspace`, `listWorkspaces`)

## Phase 2 — Auditions

- [x] `audition` + JSON `definition`, `audition_invite`, `audition_application`
- [x] `submission` nullable `simulation_id`, `audition_id`, `audition_stage_id`
- [x] `audition` router + employer UI wired to DB

## Phase 3 — Candidate loop

- [x] `candidate.redeemInvite`, `myApplications`, invite creation on `audition` router
- [x] Candidate auditions page reads `?invite=` query param
- [x] `submission.startAuditionSubmission`

## Phase 4 — Employer ops

- [x] `employer.pipelineSubmissions`, submission review decisions (`recordSubmissionDecision`)
- [x] Pipeline page uses API when data exists

## Phase 5 — Seats / membership

- [x] `workspace_membership` table + seed
- [x] `employer.workspaceMembers`

## Phase 6 — Labs

- Tier A (artifacts) is the default; Tier B/C requires infra. See `docs/labs-execution.md`.

## Phase 7 — Admin

- [x] `adminProcedure` gated by `METRIQ_ADMIN_API_KEY` + role `admin`

## Phase 8 — Auth

- Replace `metriq.role` cookie with Better Auth (or chosen stack); map sessions to `workspace_membership` / org records.

## Cross-cutting

- Blob storage, email, queues, audit log, rate limits: stubs under `apps/web/src/lib/` (`email.ts`, `audit.ts`, `feature-flags.ts`, `rate-limit.ts`).

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres |
| `METRIQ_ORG_SLUG` | Server: org slug for tRPC when header absent (must match seeded `company.slug`, e.g. `metriq`) |
| `NEXT_PUBLIC_METRIQ_ORG_SLUG` | Client: sends `x-metriq-org-slug` on `/dept/*` (same value as server) |
| `METRIQ_ADMIN_API_KEY` | Enables admin tRPC procedures |

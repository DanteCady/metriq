---
name: Production UI revamp
overview: Remove role switching and deliver production-grade Candidate + Employer experiences with a cohesive modern SaaS shell, role-based routing, and complete page maps for auditions, submissions, review, pipeline, analytics, and collaboration.
todos:
  - id: role-switch-removal
    content: Remove role switcher + role store; refactor `AppFrame` into per-role layouts + nav.
    status: completed
  - id: auth-routing
    content: Implement auth-role-based routing + guards + default redirects.
    status: completed
  - id: ui-system-patterns
    content: Extend `@metriq/ui` with toolbar/breadcrumbs/sidebar sections and tighten interaction states.
    status: completed
  - id: candidate-production
    content: Build production-grade candidate pages (dashboard, auditions, stages/submit, submissions, results, proof, settings).
    status: completed
  - id: employer-production
    content: Build production-grade employer pages (dashboard, auditions builder, pipeline, review, compare, analytics, team, settings).
    status: completed
  - id: polish
    content: Responsive behavior, accessibility pass, empty/loading/error consistency, deep-linking for filters/tabs.
    status: completed
isProject: false
---

# Production-grade Candidate + Employer UI revamp

## Goals
- Eliminate demo/role-switcher feel by removing `RoleSwitcher` + local role store.
- Ship full, cohesive SaaS UX for **Candidate** and **Employer** with consistent navigation, page patterns, and polish.
- Implement **auth-role-based routing** so users always land in the correct app area.

## Information architecture (pages)

### Candidate app (core)
- **Dashboard** (`/candidate`)
  - Snapshot: active auditions, drafts needing submission, recent results, proof profile completeness.
- **Auditions**
  - Inbox (`/candidate/auditions`) with filters, tabs, search.
  - Audition overview (`/candidate/auditions/[auditionId]`): stages, deliverables, rubric summary, due dates.
  - Stage work (`/candidate/auditions/[auditionId]/stages/[stageId]`): instructions, inputs, required artifacts.
  - Stage submit (`/candidate/auditions/[auditionId]/stages/[stageId]/submit`): artifact upload/links/text, validations.
- **Submissions**
  - Submissions list (`/candidate/submissions`): status, role/company, last activity.
  - Submission detail (`/candidate/submissions/[submissionId]`): artifacts, timeline, stage status.
- **Results**
  - Results list/entry (`/candidate/results` optional) and/or deep link (`/candidate/results/[submissionId]`).
  - Results detail: rubric breakdown, evidence-linked feedback, next steps.
- **Proof profile** (`/candidate/proof`)
  - Evidence library, highlights grouped by capability, “shareable profile” readiness.
- **Settings** (`/candidate/settings`)
  - Profile, notifications, privacy/share.

### Employer app (core)
- **Dashboard** (`/employer`)
  - KPIs: auditions active, candidates in review, time-to-decision, evaluator throughput.
- **Auditions (builder + management)**
  - Auditions list (`/employer/auditions`): status, role, volume, conversion.
  - Create/edit audition (`/employer/auditions/new`, `/employer/auditions/[auditionId]/edit`)
    - Stage builder, deliverables, rubric attach/create, preview candidate experience.
  - Invitations (`/employer/auditions/[auditionId]/invites`): invite links, emails, tracking.
- **Pipeline**
  - Pipeline view (`/employer/pipeline` or `/employer/auditions/[auditionId]/pipeline`)
    - Kanban/table hybrid: invited → active → submitted → reviewed → decision.
    - Bulk actions, assignments, SLA indicators.
- **Review (evidence-first)**
  - Review queue (`/employer/review`): submissions needing review, assigned-to-me.
  - Submission review (`/employer/submissions/[submissionId]`)
    - Artifact viewer, rubric scoring, notes, decision controls.
  - Compare candidates (`/employer/compare?submissionIds=...`)
    - Side-by-side evidence + rubric deltas.
- **Analytics** (`/employer/analytics`)
  - Funnel, time-to-stage, rubric distribution, signal quality.
- **Collaboration**
  - Team (`/employer/team`): members, roles, permissions.
  - Comments/mentions and assignments integrated into review/pipeline surfaces.
- **Settings** (`/employer/settings`)
  - Org profile, integrations, notification defaults.

## Employer assessments & simulators (customizable, not “quizzes”)

### Assessment building blocks (composer model)
- **Audition**: the container (role, level, time budget, scoring mode, visibility, invite policy).
- **Stages**: ordered units of work; each stage defines:
  - **Prompt/brief** (rich text + attachments)
  - **Inputs** (datasets, mock APIs, code starter, constraints, acceptance criteria)
  - **Deliverables** (artifacts the candidate submits)
  - **Evaluation** (rubric criteria tied to evidence; optional auto-checks)
  - **Timing** (recommended minutes, due dates/SLAs, timebox if needed)
- **Artifacts (deliverables)**: flexible evidence types:
  - Text write-up, link, file upload, code snippet, repo link, screenshot/video, structured form (short answers), “decision log”.
- **Rubrics**: criterion-based scoring with anchors (1–4/1–5), weighted criteria, required evidence links, and reviewer guidance.

### Simulator/assessment types to support (v1 → v2 ladder)
These are templates over the composer model (same primitives, different defaults and auto-checks).

#### v1 (ship first; high signal; feasible UI)
- **WorkSample_Brief**: “Here’s context, make a plan.” Deliverables: approach, trade-offs, risks, timeline.
- **Debugging_Incident**: logs + symptoms → root cause, fix, regression tests, postmortem notes.
- **PR_Review**: review a diff, identify issues, propose changes; optionally provide patch suggestions.
- **DesignDoc_Mini**: write a concise design doc (requirements, API, data model, rollout).
- **Data_Analysis**: dataset + question → analysis narrative + chart/table outputs + decision.
- **Customer_Support_Triage** (role dependent): prioritize tickets, draft responses, escalation rules.

#### v2 (adds richer interactivity)
- **CaseStudy_MultiStage**: branching stages based on candidate choices; evidence at each decision point.
- **Sandboxed_Coding**: in-browser/editor-based coding with unit tests and runtime constraints.
- **API_Integration**: integrate with mock API; evaluate correctness + resilience + observability.
- **System_Design_Live**: timed prompts + iterative clarifications; produces architecture + trade-offs.

#### v3 (advanced; optional)
- **Collaboration_Sim**: async “teammate” messages, handoffs, requirement changes; measures comms + execution.
- **Roleplay_SalesOrPM**: structured discovery + follow-up; artifacts include notes and next-step plan.

### Customization knobs employers expect
- **Stage library + templates** (start from templates, then customize everything)
- **Deliverable requirements**: required/optional, minimum content checks, max length/file types
- **Rubric editor**: weights, anchors, reviewer guidance, “evidence required” toggle
- **Review workflow**: single reviewer vs panel, assignments, blind review, calibration
- **Auto-checks (optional)**: lint/test pass, link reachable, file present, schema validation
- **Candidate experience**: timebox vs self-paced, hints, allowed tools, accessibility needs
- **Anti-cheat posture**: statement of allowed resources, attribution prompts, integrity attestation

### Employer builder pages implied by this taxonomy
- **Template picker** (choose assessment type) → creates audition scaffold
- **Stage builder** (reorder, edit prompts, attach inputs, define deliverables)
- **Rubric editor** (criteria, weights, anchors, reviewer guidance)
- **Preview mode** (candidate view + submission simulation)
- **Publish & invites** (access policy, links, tracking, messaging)

## Layout + navigation (modern SaaS)

### Shared shell principles
- One **AppFrame** pattern per role: sticky topbar, left sidebar, consistent max width.
- Standard page structure:
  - `PageHeader` with title, description, primary action, secondary actions, optional meta.
  - Body uses `Panel`/`Surface` with consistent spacing and empty/loading/error states.
- Navigation model:
  - Candidate sidebar: Dashboard, Auditions, Submissions, Results, Proof profile, Settings.
  - Employer sidebar: Dashboard, Auditions, Pipeline, Review, Analytics, Team, Settings.

### Theme direction
- Clean neutral base with subtle elevation and strong typography (already started in `packages/ui/src/components/app-shell.tsx` and `surface.tsx`).
- Tighten interaction states:
  - Active nav states, focus rings, hover affordances.
  - Dense/tight variants for tables and rubric grids.
- Introduce consistent “system” patterns in `@metriq/ui`:
  - `AppSidebarSection` (grouped nav + optional badges)
  - `PageSubnav` / breadcrumbs for deep resources (audition → submission).
  - `Toolbar` (filters/search/sort + primary actions).

## Role-based routing (remove role switching)
- Delete/stop using:
  - `apps/web/src/components/role-switcher.tsx`
  - `apps/web/src/state/role-store.ts`
  - Role-dependent nav logic in `apps/web/src/components/app-frame.tsx`
- Replace with:
  - Role-specific layouts: `apps/web/src/app/candidate/layout.tsx` and `apps/web/src/app/employer/layout.tsx` that supply role nav.
  - Auth-based guards:
    - Middleware or server-side layout gate that redirects users without the right role.
    - Default app entry redirects to `/candidate` or `/employer` based on session role.

## “Production-grade” feature polish checklist (applies across pages)
- Loading skeletons, empty states, error states with retry.
- Search/filter/sort patterns consistent across lists.
- Deep-linkable states (selected tab, filters, selected audition).
- Responsive behavior:
  - Sidebar collapses to drawer on mobile.
  - Tables become cards/stacked rows.
- Accessibility:
  - Focus management for modal/drawer, ARIA labels, keyboard nav.
- UX safety:
  - Confirmations for destructive actions, autosave for builders.

## Key files (implementation anchors)
- App shell primitives:
  - `packages/ui/src/components/app-shell.tsx`
  - `packages/ui/src/components/sidebar-nav.tsx`
  - `packages/ui/src/components/top-nav.tsx`
  - `packages/ui/src/components/page.tsx` (`PageHeader`, `PageSection`)
- Current frame to refactor:
  - `apps/web/src/components/app-frame.tsx`
- Candidate routes today:
  - `apps/web/src/app/candidate/**/page.tsx`
- Employer route today:
  - `apps/web/src/app/employer/page.tsx`

## Rollout strategy
- Phase 1: Routing + nav
  - Remove role switcher; create role layouts; guard routes.
- Phase 2: Candidate production pass
  - Dashboard → Auditions → Submissions → Results → Proof profile.
- Phase 3: Employer production pass
  - Dashboard → Auditions builder → Pipeline → Review → Compare → Analytics → Team.
- Phase 4: System polish
  - Responsive nav, breadcrumbs, toolbar patterns, final visual consistency.

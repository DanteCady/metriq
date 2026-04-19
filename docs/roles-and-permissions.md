# Metriq roles and permissions

This file is **intentionally separate** from [`metriq-spec.md`](./metriq-spec.md). The product spec stays high-level; this doc is the living glossary for **personas, hiring roles, seats, and permissions** and may change more often as auth and org modeling land.

This document outlines **who exists in the product**, what we call them, and what they are allowed to do in the **current preview** versus what we intend long term. It is meant for product, design, and engineering alignment before hardening auth (e.g. Better Auth + org/workspace plugins).

There are **three different “role” concepts** in play:

1. **App session role** — which *application shell* you use after sign-in (`candidate`, `employer`, `admin`). Today this is simulated with a cookie in `apps/web/middleware.ts`.
2. **Organization and workspace membership** — who belongs to the **company**, which **department workspace** they operate in, and what **job function** they have for hiring (Admin, Hiring manager, Reviewer, etc.).
3. **Job / audition context** — the **requisition** (e.g. “Frontend Engineer”) is *not* a permission role; it is content inside hiring workflows.

---

## 1. App session roles (routing persona)

These control **which routes** you can access in the demo (`metriq.role` cookie).

| Role (cookie) | Home route | Purpose |
|----------------|------------|---------|
| **candidate** | `/candidate` | Applicant experience: auditions, submissions, results, proof profile, settings. |
| **employer** | `/employer` (org console) and `/dept/...` (workspace) | Customer-side hiring organization: company-level console **and** department workspaces. Same session role today; split by URL prefix (see middleware). |
| **admin** | `/admin` | **Metriq platform** operations (catalog, templates, moderation) — not the hiring company’s day-to-day pipeline. |

**Note:** In production, one human might hold **multiple** memberships (e.g. org billing admin + reviewer in one workspace). The session might still be a single login with **context switching** or **org/workspace switcher**, rather than three disjoint “roles” in the cookie sense.

---

## 2. Organization vs department workspace

| Concept | Meaning in Metriq |
|---------|-------------------|
| **Organization (org)** | The **customer company** (e.g. Metriq (demo) in local seed): billing, seat pool, SSO intent, list of workspaces. Routes: `/employer`, `/employer/workspaces`, `/employer/seats`, `/employer/billing`, `/employer/security`. |
| **Workspace (dept)** | An **internal department or unit** with isolated hiring context (auditions, pipeline, team). Routes: `/dept/[workspaceSlug]/...`. Mock data: `mockWorkspaces` in `apps/web/src/mocks/tenancy.ts`. |

**Seat (today’s product intent):** A **seat** is a **licensed user who operates the platform** for the org/workspace (reviewers, hiring managers, admins) — **not** a count of candidates. Candidate volume is better handled as **usage or invites**, not seats (see org Seats UI copy).

---

## 3. Hiring team roles (workspace / org seat assignments)

Used in **org-wide seat assignments** and reviewer identity in mocks (`MockOrgSeatRow` in `apps/web/src/mocks/tenancy.ts`, aligned with `mockUniverse.reviewers` in `apps/web/src/mocks/universe.ts`).

| Role | Meaning (intended) |
|------|---------------------|
| **Admin** | Workspace (or org) **administrator**: members, settings, integrations as implemented; broad configuration power. |
| **Hiring manager** | **Owns hiring outcomes** for a scope: reqs, pipeline priorities, final decisions; may not configure every technical integration. |
| **Lead reviewer** | **Sets review quality bar**: rubric interpretation, calibration, escalations; often mentors reviewers. |
| **Reviewer** | **Scores and comments** on submissions/artifacts against the rubric; limited people admin. |

**Permissions matrix (target — not all enforced in preview):**

| Capability | Reviewer | Lead reviewer | Hiring manager | Admin |
|------------|:--------:|:-------------:|:--------------:|:-----:|
| View assigned submissions / evidence | Yes | Yes | Yes | Yes |
| Submit scores / feedback | Yes | Yes | Yes | Yes |
| Calibrate / resolve disagreements | Partial | Yes | Often | Yes |
| Edit audition / rubric (when allowed) | No | Sometimes | Yes | Yes |
| Invite / remove workspace members | No | Rarely | Often | Yes |
| Org billing / SSO (org console) | No | No | Sometimes | Yes |

Exact checks will move to the server when auth ships; this table is the **north star** for UX labels and guardrails.

---

## 4. Workspace “team” roles (dept team mock)

`apps/web/src/mocks/employer/team.ts` defines another small set used on some **department** team surfaces:

| Role | Meaning (intended) |
|------|---------------------|
| **Owner** | **Billing + irreversible org/workspace ownership** (or primary customer contact). Often one per workspace or org. |
| **Admin** | Same *word* as hiring Admin but scoped to **workspace administration** in this mock — in production we should **unify naming** with org/workspace Admin (e.g. “Workspace admin”). |
| **Reviewer** | Same family as hiring **Reviewer** — evaluation workload. |

**Known inconsistency:** `team.ts` uses **Owner | Admin | Reviewer** while seat assignments use **Admin | Hiring manager | Lead reviewer | Reviewer**. Product should **merge onto one taxonomy** (recommended: keep hiring roles in section 3 and map **Owner** to org-level or “Workspace owner”, not a third “Admin”).

---

## 5. Platform roles (Metriq internal)

| Persona | Routes | Meaning |
|---------|--------|---------|
| **Platform admin** | `/admin` | Operates **Metriq** cross-tenant: simulation catalog, rubric templates, moderation, audit-style views. **Not** hired into customer workspaces for normal review (unless “Metriq support” becomes a separate story). |

---

## 6. Candidate (applicant)

Not a “seat” in the licensing sense. **Candidate** is the **subject of evaluation**: invited or self-serve into auditions, submits artifacts, sees results (when published), curates proof profile.

---

## 7. Recommended additional roles (not fully in mocks yet)

These keep the product legitimate when third parties participate:

| Role | Meaning |
|------|---------|
| **External recruiter** | **Sourced** candidates and **coordinates** process; **scoped** access (specific reqs/workspaces), often **no** rubric configuration or billing. Seat-consuming **operator**. |
| **Agency partner admin** | Manages **multiple client orgs** or a dedicated agency workspace — future multi-org model. |
| **Read-only observer** | HM, compliance, or DEI **view** without scoring (audits, shadowing). |
| **Billing admin** (org) | **Payment + contract** only; no access to candidate PII if policy requires separation. |
| **Support / impersonation** | Metriq staff with **time-bound, audited** access — engineering/support, not a customer role. |

**Recruiter legitimacy:** Recruiters do **not** make Metriq illegitimate. Integrity comes from **who performed the audition** and **auditability**. Recruiters should be a **first-class scoped role**, not a second-class hack.

---

## 8. Implementation references (preview codebase)

| Area | File(s) |
|------|---------|
| Cookie role gate | `apps/web/middleware.ts` (`candidate` \| `employer` \| `admin`) |
| Org seat assignment types | `apps/web/src/mocks/tenancy.ts` (`MockOrgSeatRow.role`) |
| Reviewer roster seed | `apps/web/src/mocks/universe.ts` (`reviewers[].role`) |
| Dept team table mock | `apps/web/src/mocks/employer/team.ts` |
| Dept team directory / invites | `apps/web/src/mocks/employer/team-members.ts` |

---

## 9. Next steps (product + engineering)

1. **Unify** workspace team roles (`team.ts`) with org seat hiring roles (`tenancy.ts`) — single enum + display labels.
2. **Document** seat definition in pricing/README: **operator seats**, not candidates.
3. Add **recruiter** (or `external_recruiter`) to the enum with an explicit **permission matrix** row.
4. Replace cookie demo with **real memberships**: `user` × (`org` | `workspace`) × `role` with optional **impersonation** flag for support.

---

*Last updated: aligns with repository mocks and middleware as of the organization feature branch work.*

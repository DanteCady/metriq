You are a senior staff-level product engineer and startup architect.

I want you to design and build the first polished MVP of a startup called **Metriq**.

Metriq is a proof-of-work hiring platform where candidates are evaluated based on real-world job simulations, and employers hire based on performance data instead of resumes.

This must feel like a real, production-grade SaaS product — not a demo, not a toy app.

---

# 🚨 NON-NEGOTIABLE ENGINEERING RULES

1. **Minimal tech debt**
   - Clean abstractions
   - No sloppy shortcuts
   - Maintainable, scalable architecture

2. **File size discipline**
   - Max ~300–350 lines per file
   - Split logic into smaller modules
   - No bloated pages or components

3. **Component design**
   - Use props properly
   - Build reusable, composable components
   - Avoid tightly coupled UI logic

4. **No authentication (for now)**
   - Do NOT implement auth
   - Use a mock role switcher (candidate / employer / admin)
   - Architecture must support real auth later without refactor

5. **Multi-tenancy awareness**
   - Do NOT fully implement multi-tenancy
   - BUT design all domain models so adding `tenantId` later is trivial
   - Keep ownership boundaries clean (company, users, data)

---

# 🧱 REQUIRED STACK (STRICT)

- Next.js (App Router)
- TypeScript (TSX)
- Tailwind CSS
- shadcn/ui
- Zustand
- tRPC
- pnpm (workspace monorepo)
- Zod
- PostgreSQL
- Kysely (NOT Prisma)

Do NOT use Prisma.

---

# 🧠 DATABASE & DATA LAYER (IMPORTANT)

Use **Kysely** for all database interactions.

Requirements:

- Create a strongly typed database schema interface
- Organize queries into a clean data access layer (DAL)
- Do NOT inline SQL in random places
- Group queries by domain (candidate, employer, simulation, etc.)

Structure example:

packages/db:
  - db.ts (Kysely instance)
  - types.ts (DB schema types)
  - migrations/
  - seed/

packages/db/queries:
  - candidate.ts
  - employer.ts
  - simulation.ts
  - submission.ts
  - rubric.ts

Follow patterns:
- Typed query builders
- Reusable query functions
- No duplicated query logic

Seed realistic data for:
- candidates
- employers
- simulations
- submissions
- scores

---

# 🧱 MONOREPO STRUCTURE (MANDATORY)

Use pnpm workspaces.

Structure:

apps/web

packages/
  ui/
  db/
  api/
  validators/
  types/
  config/

Keep everything clean and modular.

---

# ⚙️ API LAYER (tRPC)

Use tRPC for all backend logic.

Create routers:
- candidateRouter
- employerRouter
- simulationRouter
- submissionRouter
- adminRouter

Rules:
- Strong Zod validation
- Typed inputs/outputs
- No business logic in components
- Keep procedures clean and focused

---

# 🧠 STATE MANAGEMENT (Zustand)

Use Zustand ONLY where appropriate:

Good use:
- role switcher (mock auth)
- UI state (filters, sorting)
- simulation progress (client-side)
- view preferences

Do NOT:
- store server data globally
- replace tRPC with Zustand

---

# 🎨 DESIGN SYSTEM (CRITICAL)

UI must feel:

- enterprise-grade
- modern
- minimal
- premium
- highly intentional

Inspiration:
- Linear
- Vercel
- Stripe Dashboard
- Ramp

Use:
- strong typography
- clean spacing
- subtle borders
- structured layouts
- high-quality tables
- proper loading + empty states

Avoid:
- clutter
- giant cards everywhere
- amateur UI

---

# 🧩 PRODUCT STRUCTURE

Support 3 roles via mock switcher:

- Candidate
- Employer
- Admin

---

# 👤 CANDIDATE EXPERIENCE

Dashboard:
- overview
- active simulations
- completed simulations
- recent scores
- performance metrics
- profile completion

Features:
- browse simulations
- start simulation
- submit work
- view results
- score breakdown

Simulation examples:
- debug task
- API design task
- PR review
- bug analysis

---

# 🏢 EMPLOYER EXPERIENCE

Dashboard:
- talent pool
- candidate leaderboard
- filters + search

Features:
- filter by score
- filter by skill
- filter by role
- view candidate profile
- view submission artifacts
- view score breakdown

Must feel like:
→ hiring intelligence platform

---

# 🛠 ADMIN EXPERIENCE

Dashboard:
- user management
- simulation management
- rubric management
- submission review

Admin can:
- create simulations
- define scoring criteria
- inspect results

---

# 🧠 DOMAIN MODEL (IMPORTANT)

Design for scale.

Core entities:

- candidate
- employer
- company
- simulation
- simulation_section
- rubric
- rubric_criterion
- submission
- submission_artifact
- evaluation
- score_breakdown

Relationships must be clean and extensible.

Keep future `tenantId` in mind.

---

# 🧪 VALIDATION

Use shared Zod schemas for:
- candidate profile
- simulation creation
- submissions
- filters

Do NOT duplicate validation logic.

---

# 🧩 UI COMPONENTS

Build reusable components:

- metric cards
- data tables (TanStack optional if needed)
- score badges
- progress bars
- filter panels
- detail views
- artifact viewers
- evaluation breakdown components

All must be:
- prop-driven
- reusable
- clean

---

# 🚀 OUTPUT EXPECTATION

Generate:

1. Full monorepo structure
2. Core database schema (Kysely types)
3. Seed data
4. tRPC routers
5. Key pages (candidate, employer, admin)
6. Reusable UI components
7. Zustand store (role switcher)
8. Clean, maintainable code

Do NOT:
- over-engineer
- skip structure
- dump everything in one file

Build this like a real startup foundation.

---

# FINAL GOAL

Metriq should look like:

A credible, modern hiring platform that:
- could be shown to early customers
- could be demoed to investors
- feels like a real SaaS product
- is built on a scalable foundation

Focus on:
- clarity
- structure
- quality
- extensibility

---

## Companion documentation (not duplicated here)

Role names, org vs workspace personas, seat meaning, and future roles (e.g. recruiters) live in a **separate** document so this spec stays stable while access control evolves: [`roles-and-permissions.md`](./roles-and-permissions.md).
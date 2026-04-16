# Metriq Global Rules

- Max file size: 300–350 LOC
- No Prisma, only Kysely
- No authentication
- Multi-tenancy aware design
- No business logic in UI
- DAL is the only place for DB access
- tRPC is the only API layer
- Zod schemas must be reused, not duplicated

## Product direction rules (proof-of-work first)
- Metriq is a **proof-of-work hiring** platform centered on **auditions** and **observable work** (not resumes/degrees, not generic assessments).
- Employers build: `role` → `audition` → `audition_stage` → `block` (lab/test/simulator/work sample) → `rubric` → `evaluation` → compare candidates.
- Candidates build a `proof_profile` from `submission` + `artifact` + `evaluation`.
- Do not scaffold generic dashboard CRUD pages unless the screen has clear product intent in these flows.
- Prefer “evidence-first” UX: artifacts + rubric breakdowns over vanity metrics.

## Git workflow rules
- Make small, focused commits per feature or phase
- Do NOT bundle unrelated changes into one commit
- Commit after completing logical units (e.g., Phase 0, DB schema, one router, one page group)

- Use clear commit messages:
  - feat: add candidate dashboard routes
  - feat: implement simulation DAL queries
  - refactor: extract shared table component
  - fix: correct submission status handling

- Do NOT rewrite large parts of the codebase without clear reason
- Do NOT delete working code unless replacing it with a better structured version

## Refactor rules
- Prefer incremental refactoring over large rewrites
- Extract shared logic instead of duplicating it
- Do NOT refactor unless:
  - duplication exists
  - file size exceeds limits
  - architecture boundaries are violated

  ## Dependency rules
- Do NOT install new libraries unless absolutely necessary
- Prefer built-in stack (Next.js, tRPC, Zustand, shadcn, Tailwind)
- If adding a dependency:
  - explain why
  - ensure it aligns with long-term architecture

  ## Naming rules
- Use consistent naming across:
  - routers (candidateRouter, employerRouter)
  - queries (getCandidateById, listSimulations)
  - components (PascalCase)
- Avoid vague names like:
  - utils.ts
  - helpers.ts
- Prefer domain-specific names

## Data integrity rules
- Never assume data shape without validation
- Always use Zod at API boundaries
- Keep DB schema and API contracts aligned
- Do not expose raw DB rows if transformation improves clarity

## UI consistency rules
- Reuse components from packages/ui before creating new ones
- Keep visual patterns consistent across candidate, employer, and admin views
- Avoid creating multiple variations of the same component

## Architecture boundaries
- apps/web owns routes, layouts, page composition, and client interactions
- packages/api owns tRPC routers and procedure composition
- packages/db owns Kysely instance, migrations, seeds, and DAL queries
- packages/validators owns shared Zod schemas
- packages/ui owns shared reusable UI components
- packages/types owns shared non-DB domain types
- packages/config owns shared config only

## Data/API discipline
- No SQL outside packages/db
- No validators defined ad hoc inside routers if they belong in packages/validators
- No API contracts invented by UI layers
- Do not expose raw DB rows if a mapped shape is clearer and safer
- Standardize list procedures around filters, sort, and pagination

## UI discipline
- Reuse packages/ui before creating new components
- Every async surface must have loading, empty, and error states
- Avoid inconsistent variants of the same component
- Favor dense, readable enterprise UI over oversized cards
- Keep components pure where possible: props in, UI out

## Refactor discipline
- Prefer incremental refactors over large rewrites
- Extract shared logic instead of duplicating it
- Refactor when:
  - duplication exists
  - boundaries are violated
  - file size exceeds limits
  - maintainability clearly improves

## Naming rules
- Use domain-specific names
- Avoid vague filenames like:
  - utils.ts
  - helpers.ts
  - misc.ts
- Keep naming consistent across:
  - routers
  - DAL queries
  - validators
  - components

## Anti-duplication rule
- Do not create new patterns if one already exists in the repo
- Reuse existing DAL, validators, UI components, and patterns
- Extend existing modules before creating parallel structures

## Technology references
Use official docs and canonical references before making architectural or API decisions.

- Next.js App Router: https://nextjs.org/docs/app
- React: https://react.dev/reference/react
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Zustand: https://zustand.docs.pmnd.rs/
- tRPC: https://trpc.io/docs
- Zod: https://zod.dev/
- Kysely: https://kysely.dev/docs/intro
- pnpm workspaces: https://pnpm.io/workspaces
- PostgreSQL: https://www.postgresql.org/docs/

## Documentation usage rule
- Prefer official documentation over blogs when making implementation decisions
- If uncertain about an API or pattern, check the official docs first
- Do not invent APIs or options that are not documented
- When using a library feature, follow the documented recommended pattern unless there is a strong project-specific reason not to
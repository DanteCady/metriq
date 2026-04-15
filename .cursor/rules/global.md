# Metriq Global Rules

- Max file size: 300–350 LOC
- No Prisma, only Kysely
- No authentication
- Multi-tenancy aware design
- No business logic in UI
- DAL is the only place for DB access
- tRPC is the only API layer
- Zod schemas must be reused, not duplicated

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
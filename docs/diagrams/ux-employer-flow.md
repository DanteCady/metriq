# Employer UX flow

High-level journey for **employer** users: **organization console** (`/employer/*`) vs **department workspace** (`/dept/[workspaceSlug]/*`). Middleware requires `metriq.role=employer` for both.

## Two surfaces

```mermaid
flowchart TB
  subgraph org["Organization console /employer"]
    O0["/employer — overview"]
    OW["/employer/workspaces"]
    OS["/employer/seats"]
    OB["/employer/billing"]
    OX["/employer/security"]
  end
  subgraph dept["Department workspace /dept/{slug}"]
    D0["/dept/{slug} — workspace home"]
    DP["…/pipeline"]
    DA["…/auditions (+ new, edit, invites)"]
    DR["…/review"]
    DC["…/compare"]
    DN["…/analytics"]
    DT["…/team"]
    DS["…/settings"]
    DU["…/submissions/{id}"]
  end
  org -->|"Switch workspace / deep link"| dept
```

## Middleware: legacy `/employer` app paths → default workspace

Operational URLs that used to live under `/employer/...` (except the org console routes) **redirect** to `/dept/{DEFAULT_WORKSPACE_SLUG}/...` so bookmarks and shared links stay stable.

```mermaid
flowchart TD
  E["Path under /employer"] --> Q{"Org-only route?\n(overview, workspaces,\nseats, billing, security)"}
  Q -->|Yes| Stay["Serve /employer/*"]
  Q -->|No| Redir["302 → /dept/{defaultSlug}{suffix}"]
  Redir --> Dept["e.g. /dept/engineering/pipeline"]
```

Default slug is defined in mocks (`DEFAULT_WORKSPACE_SLUG`, e.g. `engineering`) and used by `apps/web/middleware.ts`.

## Day-to-day hiring loop (department)

```mermaid
flowchart LR
  L["List auditions"] --> P["Pipeline / stages"]
  P --> V["Review submissions"]
  V --> C["Compare candidates"]
  C --> A["Analytics / team settings"]
```

## Entry from login

```mermaid
flowchart TD
  Login["/login — set employer role"] --> Choice{"Where to go?"}
  Choice --> Org["/employer — procurement / workspaces"]
  Choice --> Ops["/dept/{slug}/… — daily hiring"]
  Ops --> Resolve["Layout resolves workspaceSlug"]
```

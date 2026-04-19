# Workspace slug (`/dept/[workspaceSlug]`)

How the **department workspace slug** participates in routing, resolution, and data scope.

## URL shape

```mermaid
flowchart LR
  subgraph path["Path"]
    P["/dept/{workspaceSlug}/…"]
  end
  subgraph examples["Examples"]
    E1["/dept/engineering/pipeline"]
    E2["/dept/gtm/auditions"]
  end
  P --> examples
```

The slug is the **second segment** after `/dept/`. Client code builds these paths with helpers such as `deptPath(workspaceSlug, path)` (`apps/web/src/lib/dept-path.ts`).

## Resolution flow

When a page under `apps/web/src/app/dept/[workspaceSlug]/` loads, the layout resolves the slug to a workspace (database row or mock fallback).

```mermaid
flowchart TD
  A["Request: /dept/{slug}/…"] --> B["DeptWorkspaceLayout"]
  B --> C["resolveDeptWorkspace(slug)"]
  C --> D{"METRIQ_ORG_SLUG set?"}
  D -->|No| M["Mock: getWorkspaceBySlug(slug)"]
  D -->|Yes| E["createDb()"]
  E --> F["getCompanyBySlug(orgSlug)"]
  F --> G{"Company found?"}
  G -->|No| M
  G -->|Yes| H["getWorkspaceByCompanyAndSlug(company.id, slug)"]
  H --> I{"Row found?"}
  I -->|Yes| J["Return DB workspace + company"]
  I -->|No| M
  E --> K["DB error / exception"]
  K --> M
  M --> L{"Mock workspace?"}
  L -->|Yes| N["Render DeptWorkspaceFrame"]
  L -->|No| O["notFound() 404"]
  J --> N
```

## Data model (conceptual)

```mermaid
erDiagram
  COMPANY ||--o{ WORKSPACE : contains
  COMPANY {
    string slug "org identifier (METRIQ_ORG_SLUG)"
  }
  WORKSPACE {
    string slug "unique per company; used in URL"
    string name
  }
```

In Postgres, the workspace slug is scoped by **company** (`company_id` + `slug`), matching the URL segment under `/dept/[workspaceSlug]`.

## Legacy employer URLs

Non–org-console paths under `/employer/...` redirect to the **default workspace** slug (e.g. `engineering`) under `/dept/{slug}/...`, preserving the path suffix. See `apps/web/middleware.ts`.

```mermaid
flowchart LR
  L["/employer/pipeline"] --> R["302 → /dept/engineering/pipeline"]
  subgraph console["Org console (no redirect)"]
    C1["/employer"]
    C2["/employer/workspaces"]
    C3["/employer/seats"]
  end
```

# Candidate UX flow

High-level journey for the **candidate** area (`/candidate/*`). Access is enforced by preview **role cookie** middleware (`metriq.role=candidate`); non-candidates are redirected to their home or login.

## Entry and guard

```mermaid
flowchart TD
  Start(["User opens app"]) --> Root{"/"}
  Root -->|Has role cookie| Home["roleHome(candidate) → /candidate"]
  Root -->|No cookie| Login["/login"]
  Login --> SetRole["Set preview role + redirect"]
  SetRole --> Home
  Home --> Guard{"Middleware: /candidate/*"}
  Guard -->|role ≠ candidate| Redirect["Redirect to employer home or /login"]
  Guard -->|role = candidate| App["Candidate shell"]
```

## Primary navigation (screens)

```mermaid
flowchart LR
  subgraph home["Home"]
    C["/candidate"]
  end
  subgraph work["Auditions & work"]
    A["/candidate/auditions"]
    A1["…/auditions/{id}"]
    A2["…/stages/{stageId}"]
    A3["…/submit"]
    A4["…/evaluation"]
    A5["…/results"]
  end
  subgraph sims["Simulations"]
    S["/candidate/simulations"]
    S1["…/simulations/{id}"]
  end
  subgraph outcomes["Outcomes & profile"]
    R["/candidate/results"]
    R1["…/results/{submissionId}"]
    Sub["/candidate/submissions"]
    Sub1["…/submissions/{submissionId}"]
    P["/candidate/proof"]
  end
  subgraph settings["Settings"]
    Set["/candidate/settings"]
  end
  C --> A
  C --> S
  C --> R
  C --> Sub
  C --> P
  C --> Set
  A --> A1 --> A2 --> A3
  A1 --> A4
  A1 --> A5
  S --> S1
  R --> R1
  Sub --> Sub1
```

## Typical audition loop

```mermaid
journey
  title Candidate: audition to submission
  section Discover
    Open auditions list: 5: Candidate
    Open audition detail: 5: Candidate
  section Execute
    Work through stages: 4: Candidate
    Submit artifact / answers: 4: Candidate
  section Follow-up
    View evaluation or results: 3: Candidate
    Track submissions & proof profile: 3: Candidate
```

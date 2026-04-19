# Lab execution tiers

Authoring uses `LabConfig` in `apps/web/src/lib/audition-draft.ts` (`browser_stub` | `container_tbd`).

| Tier | Behavior |
|------|----------|
| A | Instructions + task text; candidate submits artifacts (text/code). **Shipped path.** |
| B | Embedded sandbox (iframe / WebContainer-style). Requires CSP, origin allowlist, isolation review. |
| C | Per-session containers driven by `LabStackPreset`. Highest cost; needs orchestration + security review. |

**Spike output:** choose B vs C based on languages, compliance, and cost before building runners.

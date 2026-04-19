# Metriq error codes

This document is the **canonical registry** for Metriq domain error codes. APIs and app logic should throw or handle using these identifiers—not ad-hoc `"Something went wrong"` strings or unnamed internal codes.

## How codes are used

- **Server (tRPC):** Failures use `throwMetriqError("METRIQ_…")` from `@metriq/api`. The HTTP-level shape remains a normal tRPC error; the response includes `data.metriqCode` for clients.
- **Client:** Transient feedback uses **toasts** (success / error / neutral). Items the user should be able to revisit use the **notification inbox** in the top bar. Client logging records the `metriqCode` when present.
- **TypeScript:** Codes and default messages live in `packages/types` (`METRIQ_ERRORS`, `MetriqErrorCode`) and must stay aligned with this file.

## Registry

| Metriq code | tRPC code | Default user message | Log |
|-------------|-----------|----------------------|-----|
| `METRIQ_AUTH_FORBIDDEN_ROLE` | `FORBIDDEN` | You do not have access to this action. | warn |
| `METRIQ_WORKSPACE_CONTEXT_REQUIRED` | `BAD_REQUEST` | Open this from a department workspace. | warn |
| `METRIQ_ADMIN_API_DISABLED` | `FORBIDDEN` | Admin API is disabled on this deployment. | warn |
| `METRIQ_CANDIDATE_INVITE_NOT_FOUND` | `NOT_FOUND` | That invite link is not valid. | warn |
| `METRIQ_CANDIDATE_INVITE_EXPIRED` | `BAD_REQUEST` | This invite has expired. | warn |
| `METRIQ_CANDIDATE_RECORD_MISSING` | `PRECONDITION_FAILED` | No candidate profile is available for this session. | error |
| `METRIQ_AUDITION_NOT_FOUND` | `NOT_FOUND` | That audition could not be found. | warn |
| `METRIQ_SUBMISSION_NOT_FOUND` | `NOT_FOUND` | That submission could not be found. | warn |
| `METRIQ_SUBMISSION_ARTIFACT_UPDATE_UNSUPPORTED` | `BAD_REQUEST` | Updating this artifact is not supported yet. | warn |
| `METRIQ_SUBMISSION_EVAL_MISSING` | `PRECONDITION_FAILED` | No evaluation exists for this submission yet. | warn |
| `METRIQ_SIMULATION_NO_CANDIDATES` | `PRECONDITION_FAILED` | No candidates exist to start a simulation. | warn |
| `METRIQ_INTERNAL_UNEXPECTED` | `INTERNAL_SERVER_ERROR` | Something went wrong. Try again shortly. | error |

## Adding a new code

1. Add a row to the table above with a clear, product-specific name.
2. Add the matching entry to `METRIQ_ERRORS` in `packages/types/src/metriq-error-codes.ts`.
3. Use `throwMetriqError("METRIQ_YOUR_CODE", { message?: string })` on the server (`@metriq/api`).
4. On the web app, prefer `useNotify()` from `apps/web/src/lib/use-notify.ts`: `success` / `error` / `info` for local feedback, and `fromTrpcError(err, { title })` for failed mutations so logs include `metriqCode` when present. Use `surface: "both"` when the user should also see an inbox row in the top bar.

Do **not** introduce parallel “generic” enums in routers; extend this registry instead.

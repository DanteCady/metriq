import type { Kysely } from "kysely";

import { createDb, getDb, type Database, type DbScope } from "@metriq/db";
import type { CompanyEntitlements, EmployerScope, MetriqSessionBundle, Role } from "@metriq/types";

export type TrpcContext = {
  db: Kysely<Database>;
  /** Legacy preview header; prefer `persona` + session. */
  role: Role;
  /** Resolved app shell for routing (may match legacy `role`). */
  persona: Role;
  scope?: DbScope;
  /** Better Auth session + user when cookies present. */
  authSession: MetriqSessionBundle;
  /** Active employer workspace scope when resolved. */
  employerScope?: EmployerScope;
  /** Plan projection for `scope.companyId` when present. */
  entitlements?: CompanyEntitlements | null;
};

export function createTrpcContext(opts?: {
  role?: Role;
  persona?: Role;
  db?: Kysely<Database>;
  scope?: DbScope;
  authSession?: MetriqSessionBundle;
  employerScope?: EmployerScope;
  entitlements?: CompanyEntitlements | null;
}): TrpcContext {
  const persona = opts?.persona ?? opts?.role ?? "candidate";
  const legacyRole = opts?.role ?? persona;
  return {
    role: legacyRole,
    persona,
    db: opts?.db ?? getDb(),
    scope: opts?.scope,
    authSession: opts?.authSession ?? null,
    employerScope: opts?.employerScope,
    entitlements: opts?.entitlements,
  };
}

export { createDb, getDb };

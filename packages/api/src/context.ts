import type { Kysely } from "kysely";

import type { Role } from "@metriq/types";
import { createDb, type Database, type DbScope } from "@metriq/db";

export type TrpcContext = {
  db: Kysely<Database>;
  role: Role;
  scope?: DbScope;
};

export function createTrpcContext(opts?: {
  role?: Role;
  db?: Kysely<Database>;
  scope?: DbScope;
}): TrpcContext {
  return {
    role: opts?.role ?? "candidate",
    db: opts?.db ?? createDb(),
    scope: opts?.scope,
  };
}

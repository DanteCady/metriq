import type { Kysely } from "kysely";

import type { Database } from "@metriq/db";
import { createDb } from "@metriq/db";
import type { Role } from "@metriq/types";

export type TrpcContext = {
  db: Kysely<Database>;
  role: Role;
};

export function createTrpcContext(opts?: { role?: Role; db?: Kysely<Database> }): TrpcContext {
  return {
    role: opts?.role ?? "candidate",
    db: opts?.db ?? createDb(),
  };
}

import type { Kysely } from "kysely";

import { createDb, type Database, type DbScope } from "@metriq/db";

export type ApiContext = {
  db: Kysely<Database>;
  scope?: DbScope;
};

export function createApiContext(input?: { scope?: DbScope }) {
  return { db: createDb(), scope: input?.scope } satisfies ApiContext;
}


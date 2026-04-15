import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, NewEmployer, Uuid } from "../types";

export async function listEmployersByCompany(
  db: Kysely<Database>,
  companyId: Uuid,
  _scope?: DbScope,
) {
  return db
    .selectFrom("employer")
    .selectAll()
    .where("company_id", "=", companyId)
    .orderBy("created_at", "desc")
    .execute();
}

export async function createEmployer(db: Kysely<Database>, input: NewEmployer, _scope?: DbScope) {
  return db.insertInto("employer").values(input).returningAll().executeTakeFirstOrThrow();
}


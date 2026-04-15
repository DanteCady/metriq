import type { Kysely } from "kysely";

import type { Database, NewEmployer, Uuid } from "../types.js";

export async function listEmployersByCompany(db: Kysely<Database>, companyId: Uuid) {
  return db
    .selectFrom("employer")
    .selectAll()
    .where("company_id", "=", companyId)
    .orderBy("created_at", "desc")
    .execute();
}

export async function createEmployer(db: Kysely<Database>, input: NewEmployer) {
  return db.insertInto("employer").values(input).returningAll().executeTakeFirstOrThrow();
}


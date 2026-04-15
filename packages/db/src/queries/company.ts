import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, NewCompany } from "../types";

export async function listCompanies(db: Kysely<Database>, _scope?: DbScope) {
  return db.selectFrom("company").selectAll().orderBy("created_at", "desc").execute();
}

export async function createCompany(db: Kysely<Database>, input: NewCompany, _scope?: DbScope) {
  return db.insertInto("company").values(input).returningAll().executeTakeFirstOrThrow();
}


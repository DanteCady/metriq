import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, NewWorkspace, Uuid, WorkspaceUpdate } from "../types";

export async function getWorkspaceById(db: Kysely<Database>, id: Uuid, _scope?: DbScope) {
  return db.selectFrom("workspace").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function getWorkspaceByCompanyAndSlug(
  db: Kysely<Database>,
  companyId: Uuid,
  slug: string,
  _scope?: DbScope,
) {
  return db
    .selectFrom("workspace")
    .selectAll()
    .where("company_id", "=", companyId)
    .where("slug", "=", slug)
    .executeTakeFirst();
}

export async function listWorkspacesByCompanyId(db: Kysely<Database>, companyId: Uuid, _scope?: DbScope) {
  return db
    .selectFrom("workspace")
    .selectAll()
    .where("company_id", "=", companyId)
    .orderBy("name", "asc")
    .execute();
}

export async function createWorkspace(db: Kysely<Database>, input: NewWorkspace, _scope?: DbScope) {
  return db.insertInto("workspace").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateWorkspace(
  db: Kysely<Database>,
  id: Uuid,
  patch: WorkspaceUpdate,
  _scope?: DbScope,
) {
  return db.updateTable("workspace").set(patch).where("id", "=", id).returningAll().executeTakeFirst();
}

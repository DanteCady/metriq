import { sql, type Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, Uuid } from "../types";

export async function getAuditionById(db: Kysely<Database>, id: Uuid, scope?: DbScope) {
  let q = db.selectFrom("audition").selectAll().where("id", "=", id);
  if (scope?.workspaceId) {
    q = q.where("workspace_id", "=", scope.workspaceId);
  }
  return q.executeTakeFirst();
}

export async function listAuditionsByWorkspaceId(db: Kysely<Database>, workspaceId: Uuid, _scope?: DbScope) {
  return db
    .selectFrom("audition")
    .selectAll()
    .where("workspace_id", "=", workspaceId)
    .orderBy("updated_at", "desc")
    .execute();
}

export async function upsertAuditionDraft(
  db: Kysely<Database>,
  input: {
    id: Uuid;
    workspace_id: Uuid;
    title: string;
    level: string | null;
    template: string | null;
    timebox_minutes: number | null;
    definition: unknown;
  },
  _scope?: DbScope,
) {
  const existing = await db.selectFrom("audition").select("id").where("id", "=", input.id).executeTakeFirst();
  if (existing) {
    return db
      .updateTable("audition")
      .set({
        title: input.title,
        level: input.level,
        template: input.template,
        timebox_minutes: input.timebox_minutes,
        definition: input.definition,
        updated_at: sql`now()`,
      })
      .where("id", "=", input.id)
      .where("workspace_id", "=", input.workspace_id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  return db
    .insertInto("audition")
    .values({
      id: input.id,
      workspace_id: input.workspace_id,
      title: input.title,
      status: "draft",
      level: input.level,
      template: input.template,
      timebox_minutes: input.timebox_minutes,
      definition: input.definition,
      updated_at: sql`now()`,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function publishAudition(db: Kysely<Database>, id: Uuid, workspaceId: Uuid, _scope?: DbScope) {
  return db
    .updateTable("audition")
    .set({ status: "published", updated_at: sql`now()` })
    .where("id", "=", id)
    .where("workspace_id", "=", workspaceId)
    .returningAll()
    .executeTakeFirst();
}

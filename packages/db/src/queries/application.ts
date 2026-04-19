import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, Uuid } from "../types";

export async function upsertAuditionApplication(
  db: Kysely<Database>,
  input: {
    audition_id: Uuid;
    workspace_id: Uuid;
    candidate_id: Uuid;
    invite_id?: Uuid | null;
    status?: string;
  },
  _scope?: DbScope,
) {
  const existing = await db
    .selectFrom("audition_application")
    .selectAll()
    .where("audition_id", "=", input.audition_id)
    .where("candidate_id", "=", input.candidate_id)
    .executeTakeFirst();

  if (existing) {
    return db
      .updateTable("audition_application")
      .set({
        status: input.status ?? existing.status,
        invite_id: input.invite_id ?? existing.invite_id,
      })
      .where("id", "=", existing.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  return db
    .insertInto("audition_application")
    .values({
      audition_id: input.audition_id,
      workspace_id: input.workspace_id,
      candidate_id: input.candidate_id,
      invite_id: input.invite_id ?? null,
      status: input.status ?? "active",
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function listApplicationsForCandidate(db: Kysely<Database>, candidateId: Uuid, _scope?: DbScope) {
  return db
    .selectFrom("audition_application")
    .innerJoin("audition", "audition.id", "audition_application.audition_id")
    .select([
      "audition_application.id as application_id",
      "audition_application.status as application_status",
      "audition.id as audition_id",
      "audition.title as audition_title",
      "audition.status as audition_status",
      "audition.timebox_minutes",
      "audition.workspace_id",
    ])
    .where("audition_application.candidate_id", "=", candidateId)
    .orderBy("audition_application.created_at", "desc")
    .execute();
}

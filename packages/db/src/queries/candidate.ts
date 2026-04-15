import type { Kysely } from "kysely";

import type { CandidateUpdate, Database, NewCandidate, Uuid } from "../types.js";

export async function getCandidateById(db: Kysely<Database>, id: Uuid) {
  return db.selectFrom("candidate").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function listCandidates(db: Kysely<Database>) {
  return db.selectFrom("candidate").selectAll().orderBy("created_at", "desc").execute();
}

export async function createCandidate(db: Kysely<Database>, input: NewCandidate) {
  return db.insertInto("candidate").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateCandidate(db: Kysely<Database>, id: Uuid, patch: CandidateUpdate) {
  return db
    .updateTable("candidate")
    .set(patch)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}


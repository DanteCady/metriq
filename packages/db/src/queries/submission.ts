import type { Kysely } from "kysely";

import type {
  Database,
  NewSubmission,
  NewSubmissionArtifact,
  SubmissionUpdate,
  Uuid,
} from "../types.js";

export async function getSubmissionById(db: Kysely<Database>, submissionId: Uuid) {
  const submission = await db
    .selectFrom("submission")
    .selectAll()
    .where("id", "=", submissionId)
    .executeTakeFirst();

  if (!submission) return null;

  const artifacts = await db
    .selectFrom("submission_artifact")
    .selectAll()
    .where("submission_id", "=", submissionId)
    .orderBy("created_at", "asc")
    .execute();

  return { submission, artifacts };
}

export async function listSubmissionsByCandidateId(db: Kysely<Database>, candidateId: Uuid) {
  return db
    .selectFrom("submission")
    .selectAll()
    .where("candidate_id", "=", candidateId)
    .orderBy("created_at", "desc")
    .execute();
}

export async function createSubmission(db: Kysely<Database>, input: NewSubmission) {
  return db.insertInto("submission").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateSubmission(db: Kysely<Database>, submissionId: Uuid, patch: SubmissionUpdate) {
  return db
    .updateTable("submission")
    .set(patch)
    .where("id", "=", submissionId)
    .returningAll()
    .executeTakeFirst();
}

export async function addSubmissionArtifact(db: Kysely<Database>, input: NewSubmissionArtifact) {
  return db
    .insertInto("submission_artifact")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function removeSubmissionArtifact(db: Kysely<Database>, artifactId: Uuid) {
  return db.deleteFrom("submission_artifact").where("id", "=", artifactId).executeTakeFirst();
}


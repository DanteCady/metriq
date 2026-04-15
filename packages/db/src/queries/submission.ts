import type { Kysely } from "kysely";

import type { DbScope } from "../scope.js";
import type {
  Database,
  NewSubmission,
  NewSubmissionArtifact,
  SubmissionUpdate,
  Uuid,
} from "../types.js";

export async function getSubmissionById(db: Kysely<Database>, submissionId: Uuid, _scope?: DbScope) {
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

export async function listSubmissionsByCandidateId(
  db: Kysely<Database>,
  candidateId: Uuid,
  _scope?: DbScope,
) {
  return db
    .selectFrom("submission")
    .selectAll()
    .where("candidate_id", "=", candidateId)
    .orderBy("created_at", "desc")
    .execute();
}

export async function createSubmission(db: Kysely<Database>, input: NewSubmission, _scope?: DbScope) {
  return db.insertInto("submission").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateSubmission(
  db: Kysely<Database>,
  submissionId: Uuid,
  patch: SubmissionUpdate,
  _scope?: DbScope,
) {
  return db
    .updateTable("submission")
    .set(patch)
    .where("id", "=", submissionId)
    .returningAll()
    .executeTakeFirst();
}

export async function addSubmissionArtifact(
  db: Kysely<Database>,
  input: NewSubmissionArtifact,
  _scope?: DbScope,
) {
  return db
    .insertInto("submission_artifact")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function removeSubmissionArtifact(db: Kysely<Database>, artifactId: Uuid, _scope?: DbScope) {
  return db.deleteFrom("submission_artifact").where("id", "=", artifactId).executeTakeFirst();
}

export async function listSubmissions(
  db: Kysely<Database>,
  input: { status?: "draft" | "submitted"; limit: number; offset: number },
  _scope?: DbScope,
) {
  const base = db.selectFrom("submission");
  const filtered = input.status ? base.where("status", "=", input.status) : base;

  const totalRow = await filtered
    .select((eb) => eb.fn.countAll<number>().as("total"))
    .executeTakeFirstOrThrow();

  const total = Number(totalRow.total ?? 0);

  const items = await filtered
    .selectAll()
    .orderBy("created_at", "desc")
    .limit(input.limit)
    .offset(input.offset)
    .execute();

  return { total, items };
}


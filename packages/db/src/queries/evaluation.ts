import type { Kysely } from "kysely";

import type { Database, NewEvaluation, NewScoreBreakdown, Uuid } from "../types.js";

export async function getEvaluationBySubmissionId(db: Kysely<Database>, submissionId: Uuid) {
  const evaluation = await db
    .selectFrom("evaluation")
    .selectAll()
    .where("submission_id", "=", submissionId)
    .executeTakeFirst();

  if (!evaluation) return null;

  const breakdown = await db
    .selectFrom("score_breakdown")
    .innerJoin("rubric_criterion", "rubric_criterion.id", "score_breakdown.criterion_id")
    .select([
      "score_breakdown.id",
      "score_breakdown.evaluation_id",
      "score_breakdown.criterion_id",
      "score_breakdown.score",
      "score_breakdown.notes",
      "rubric_criterion.name as criterion_name",
      "rubric_criterion.position as criterion_position",
      "rubric_criterion.weight as criterion_weight",
      "rubric_criterion.max_score as criterion_max_score",
    ])
    .where("score_breakdown.evaluation_id", "=", evaluation.id)
    .orderBy("rubric_criterion.position", "asc")
    .execute();

  return { evaluation, breakdown };
}

export async function createEvaluation(db: Kysely<Database>, input: NewEvaluation) {
  return db.insertInto("evaluation").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function createScoreBreakdownRow(db: Kysely<Database>, input: NewScoreBreakdown) {
  return db.insertInto("score_breakdown").values(input).returningAll().executeTakeFirstOrThrow();
}


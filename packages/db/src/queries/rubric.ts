import type { Kysely } from "kysely";

import type { Database, NewRubric, NewRubricCriterion, Uuid } from "../types.js";

export async function getRubricBySimulationId(db: Kysely<Database>, simulationId: Uuid) {
  const rubric = await db
    .selectFrom("rubric")
    .selectAll()
    .where("simulation_id", "=", simulationId)
    .executeTakeFirst();

  if (!rubric) return null;

  const criteria = await db
    .selectFrom("rubric_criterion")
    .selectAll()
    .where("rubric_id", "=", rubric.id)
    .orderBy("position", "asc")
    .execute();

  return { rubric, criteria };
}

export async function createRubric(db: Kysely<Database>, input: NewRubric) {
  return db.insertInto("rubric").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function createRubricCriterion(db: Kysely<Database>, input: NewRubricCriterion) {
  return db
    .insertInto("rubric_criterion")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}


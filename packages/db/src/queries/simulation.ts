import type { Kysely } from "kysely";

import type { DbScope } from "../scope.js";
import type { Database, NewSimulation, NewSimulationSection, Uuid } from "../types.js";

export async function listSimulations(db: Kysely<Database>, _scope?: DbScope) {
  return db.selectFrom("simulation").selectAll().orderBy("created_at", "desc").execute();
}

export async function getSimulationDetail(db: Kysely<Database>, simulationId: Uuid, _scope?: DbScope) {
  const simulation = await db
    .selectFrom("simulation")
    .selectAll()
    .where("id", "=", simulationId)
    .executeTakeFirst();

  if (!simulation) return null;

  const sections = await db
    .selectFrom("simulation_section")
    .selectAll()
    .where("simulation_id", "=", simulationId)
    .orderBy("position", "asc")
    .execute();

  return { simulation, sections };
}

export async function createSimulation(db: Kysely<Database>, input: NewSimulation, _scope?: DbScope) {
  return db.insertInto("simulation").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function addSimulationSection(
  db: Kysely<Database>,
  input: NewSimulationSection,
  _scope?: DbScope,
) {
  return db
    .insertInto("simulation_section")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function startSimulation(
  db: Kysely<Database>,
  input: { candidateId: Uuid; simulationId: Uuid },
  _scope?: DbScope,
) {
  return db
    .insertInto("submission")
    .values({
      candidate_id: input.candidateId,
      simulation_id: input.simulationId,
      status: "draft",
      started_at: new Date(),
      submitted_at: null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}


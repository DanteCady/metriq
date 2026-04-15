import type { Kysely } from "kysely";

import type { Database, NewSimulation, NewSimulationSection, Uuid } from "../types.js";

export async function listSimulations(db: Kysely<Database>) {
  return db.selectFrom("simulation").selectAll().orderBy("created_at", "desc").execute();
}

export async function getSimulationDetail(db: Kysely<Database>, simulationId: Uuid) {
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

export async function createSimulation(db: Kysely<Database>, input: NewSimulation) {
  return db.insertInto("simulation").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function addSimulationSection(db: Kysely<Database>, input: NewSimulationSection) {
  return db
    .insertInto("simulation_section")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}


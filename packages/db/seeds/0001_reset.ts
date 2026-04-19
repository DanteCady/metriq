import { sql } from "kysely";

import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx): Promise<void> {
  await sql`
    truncate table
      notification,
      score_breakdown,
      evaluation,
      submission_artifact,
      submission,
      audition_application,
      audition_invite,
      audition,
      workspace_membership,
      rubric_criterion,
      rubric,
      simulation_section,
      simulation,
      employer,
      workspace,
      company,
      candidate
    restart identity
    cascade;
  `.execute(trx);
}

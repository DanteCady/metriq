import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`create extension if not exists "pgcrypto";`.execute(db);

  await db.schema
    .createTable("company")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("employer")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("company_id", "uuid", (c) =>
      c.notNull().references("company.id").onDelete("cascade"),
    )
    .addColumn("email", "text", (c) => c.notNull())
    .addColumn("full_name", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex("employer_company_id_idx").on("employer").column("company_id").execute();
  await db.schema.createIndex("employer_email_ux").unique().on("employer").column("email").execute();

  await db.schema
    .createTable("candidate")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("email", "text", (c) => c.notNull())
    .addColumn("full_name", "text", (c) => c.notNull())
    .addColumn("headline", "text")
    .addColumn("bio", "text")
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex("candidate_email_ux").unique().on("candidate").column("email").execute();

  await db.schema
    .createTable("simulation")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("summary", "text", (c) => c.notNull())
    .addColumn("simulation_type", "text", (c) => c.notNull())
    .addColumn("difficulty", "text", (c) => c.notNull())
    .addColumn("estimated_minutes", "integer", (c) => c.notNull())
    .addColumn("skills", sql`text[]`)
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("simulation_section")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("simulation_id", "uuid", (c) =>
      c.notNull().references("simulation.id").onDelete("cascade"),
    )
    .addColumn("position", "integer", (c) => c.notNull())
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("prompt", "text", (c) => c.notNull())
    .addColumn("required_artifacts", "jsonb")
    .execute();

  await db.schema
    .createIndex("simulation_section_simulation_id_position_ux")
    .unique()
    .on("simulation_section")
    .columns(["simulation_id", "position"])
    .execute();

  await db.schema
    .createTable("rubric")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("simulation_id", "uuid", (c) =>
      c.notNull().references("simulation.id").onDelete("cascade"),
    )
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("rubric_simulation_id_ux")
    .unique()
    .on("rubric")
    .column("simulation_id")
    .execute();

  await db.schema
    .createTable("rubric_criterion")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("rubric_id", "uuid", (c) => c.notNull().references("rubric.id").onDelete("cascade"))
    .addColumn("position", "integer", (c) => c.notNull())
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("description", "text")
    .addColumn("weight", sql`numeric(5,2)`, (c) => c.notNull())
    .addColumn("max_score", "integer", (c) => c.notNull().defaultTo(5))
    .execute();

  await db.schema
    .createIndex("rubric_criterion_rubric_id_position_ux")
    .unique()
    .on("rubric_criterion")
    .columns(["rubric_id", "position"])
    .execute();

  await db.schema
    .createTable("submission")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("simulation_id", "uuid", (c) =>
      c.notNull().references("simulation.id").onDelete("restrict"),
    )
    .addColumn("candidate_id", "uuid", (c) =>
      c.notNull().references("candidate.id").onDelete("cascade"),
    )
    .addColumn("status", "text", (c) => c.notNull())
    .addColumn("started_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .addColumn("submitted_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex("submission_candidate_id_idx").on("submission").column("candidate_id").execute();
  await db.schema.createIndex("submission_simulation_id_idx").on("submission").column("simulation_id").execute();
  await db.schema.createIndex("submission_status_idx").on("submission").column("status").execute();

  await db.schema
    .createTable("submission_artifact")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("submission_id", "uuid", (c) =>
      c.notNull().references("submission.id").onDelete("cascade"),
    )
    .addColumn("kind", "text", (c) => c.notNull())
    .addColumn("label", "text", (c) => c.notNull())
    .addColumn("content", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("submission_artifact_submission_id_idx")
    .on("submission_artifact")
    .column("submission_id")
    .execute();

  await db.schema
    .createTable("evaluation")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("submission_id", "uuid", (c) =>
      c.notNull().references("submission.id").onDelete("cascade"),
    )
    .addColumn("overall_score", sql`numeric(5,2)`, (c) => c.notNull())
    .addColumn("summary", "text")
    .addColumn("evaluated_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("evaluation_submission_id_ux")
    .unique()
    .on("evaluation")
    .column("submission_id")
    .execute();

  await db.schema
    .createTable("score_breakdown")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("evaluation_id", "uuid", (c) =>
      c.notNull().references("evaluation.id").onDelete("cascade"),
    )
    .addColumn("criterion_id", "uuid", (c) =>
      c.notNull().references("rubric_criterion.id").onDelete("restrict"),
    )
    .addColumn("score", sql`numeric(5,2)`, (c) => c.notNull())
    .addColumn("notes", "text")
    .execute();

  await db.schema
    .createIndex("score_breakdown_evaluation_id_idx")
    .on("score_breakdown")
    .column("evaluation_id")
    .execute();

  await db.schema
    .createIndex("score_breakdown_evaluation_id_criterion_id_ux")
    .unique()
    .on("score_breakdown")
    .columns(["evaluation_id", "criterion_id"])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("score_breakdown").ifExists().execute();
  await db.schema.dropTable("evaluation").ifExists().execute();
  await db.schema.dropTable("submission_artifact").ifExists().execute();
  await db.schema.dropTable("submission").ifExists().execute();
  await db.schema.dropTable("rubric_criterion").ifExists().execute();
  await db.schema.dropTable("rubric").ifExists().execute();
  await db.schema.dropTable("simulation_section").ifExists().execute();
  await db.schema.dropTable("simulation").ifExists().execute();
  await db.schema.dropTable("candidate").ifExists().execute();
  await db.schema.dropTable("employer").ifExists().execute();
  await db.schema.dropTable("company").ifExists().execute();
}


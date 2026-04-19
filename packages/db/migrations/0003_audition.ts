import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("audition")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("workspace_id", "uuid", (c) =>
      c.notNull().references("workspace.id").onDelete("cascade"),
    )
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("status", "text", (c) => c.notNull().defaultTo("draft"))
    .addColumn("level", "text")
    .addColumn("template", "text")
    .addColumn("timebox_minutes", "integer")
    .addColumn("definition", "jsonb", (c) => c.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex("audition_workspace_id_idx").on("audition").column("workspace_id").execute();
  await db.schema.createIndex("audition_workspace_status_idx").on("audition").columns(["workspace_id", "status"]).execute();

  await db.schema
    .createTable("audition_invite")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("token", "text", (c) => c.notNull().unique())
    .addColumn("audition_id", "uuid", (c) =>
      c.notNull().references("audition.id").onDelete("cascade"),
    )
    .addColumn("workspace_id", "uuid", (c) =>
      c.notNull().references("workspace.id").onDelete("cascade"),
    )
    .addColumn("email", "text")
    .addColumn("expires_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("audition_application")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("audition_id", "uuid", (c) =>
      c.notNull().references("audition.id").onDelete("cascade"),
    )
    .addColumn("workspace_id", "uuid", (c) =>
      c.notNull().references("workspace.id").onDelete("cascade"),
    )
    .addColumn("candidate_id", "uuid", (c) =>
      c.notNull().references("candidate.id").onDelete("cascade"),
    )
    .addColumn("status", "text", (c) => c.notNull().defaultTo("active"))
    .addColumn("invite_id", "uuid", (c) => c.references("audition_invite.id").onDelete("set null"))
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("audition_application_audition_candidate_ux")
    .unique()
    .on("audition_application")
    .columns(["audition_id", "candidate_id"])
    .execute();

  await sql`ALTER TABLE submission ALTER COLUMN simulation_id DROP NOT NULL`.execute(db);

  await db.schema
    .alterTable("submission")
    .addColumn("audition_id", "uuid", (c) => c.references("audition.id").onDelete("cascade"))
    .execute();

  await db.schema.alterTable("submission").addColumn("audition_stage_id", "text").execute();

  await db.schema.createIndex("submission_audition_id_idx").on("submission").column("audition_id").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex("submission_audition_id_idx").on("submission").ifExists().execute();
  await db.schema.alterTable("submission").dropColumn("audition_stage_id").execute();
  await db.schema.alterTable("submission").dropColumn("audition_id").execute();
  await sql`DELETE FROM submission WHERE simulation_id IS NULL`.execute(db);
  await sql`ALTER TABLE submission ALTER COLUMN simulation_id SET NOT NULL`.execute(db);

  await db.schema.dropTable("audition_application").ifExists().execute();
  await db.schema.dropTable("audition_invite").ifExists().execute();
  await db.schema.dropTable("audition").ifExists().execute();
}

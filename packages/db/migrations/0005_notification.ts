import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("notification")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("candidate_id", "uuid", (c) => c.references("candidate.id").onDelete("cascade"))
    .addColumn("employer_id", "uuid", (c) => c.references("employer.id").onDelete("cascade"))
    .addColumn("workspace_id", "uuid", (c) => c.references("workspace.id").onDelete("set null"))
    .addColumn("category", "text", (c) => c.notNull())
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("body", "text", (c) => c.notNull())
    .addColumn("link_href", "text")
    .addColumn("read_at", "timestamptz")
    .addColumn("metadata", "jsonb")
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await sql`
    alter table notification
    add constraint notification_recipient_chk
    check ((candidate_id is not null)::int + (employer_id is not null)::int = 1)
  `.execute(db);

  await db.schema
    .createIndex("notification_candidate_created_idx")
    .on("notification")
    .columns(["candidate_id", "created_at"])
    .execute();

  await db.schema
    .createIndex("notification_employer_created_idx")
    .on("notification")
    .columns(["employer_id", "created_at"])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("notification").ifExists().execute();
}

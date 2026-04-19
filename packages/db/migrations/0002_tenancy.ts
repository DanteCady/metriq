import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("company").addColumn("slug", "text").execute();
  await sql`
    UPDATE company SET slug = 'acme-analytics' WHERE name = 'Acme Analytics';
    UPDATE company SET slug = 'northwind' WHERE name = 'Northwind Systems';
    UPDATE company SET slug = 'org-' || substr(id::text, 1, 8) WHERE slug IS NULL;
  `.execute(db);
  await db.schema.alterTable("company").alterColumn("slug", (c) => c.setNotNull()).execute();
  await db.schema.createIndex("company_slug_ux").unique().on("company").column("slug").execute();

  await db.schema
    .createTable("workspace")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("company_id", "uuid", (c) =>
      c.notNull().references("company.id").onDelete("cascade"),
    )
    .addColumn("slug", "text", (c) => c.notNull())
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("seat_limit", "integer")
    .addColumn("seats_used", "integer")
    .addColumn("status", "text", (c) => c.notNull().defaultTo("active"))
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex("workspace_company_id_slug_ux")
    .unique()
    .on("workspace")
    .columns(["company_id", "slug"])
    .execute();

  await db.schema.createIndex("workspace_company_id_idx").on("workspace").column("company_id").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("workspace").ifExists().execute();
  await db.schema.dropIndex("company_slug_ux").ifExists().on("company").execute();
  await db.schema.alterTable("company").dropColumn("slug").execute();
}

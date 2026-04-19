import { sql, type Kysely } from "kysely";

/** Links Metriq `company` / `candidate` / `workspace_membership` to Better Auth `organization` / `user`. Adds entitlement projection for plan gating. */
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("company")
    .addColumn("organization_id", "uuid", (c) => c.references("organization.id").onDelete("set null"))
    .execute();
  await db.schema.createIndex("company_organization_id_ux").unique().on("company").column("organization_id").execute();

  await sql`
    alter table candidate
      add column "user_id" uuid references auth_user ("id") on delete set null;
  `.execute(db);
  await sql`create unique index candidate_user_id_ux on candidate ("user_id") where "user_id" is not null;`.execute(db);

  await sql`
    alter table workspace_membership
      add column "user_id" uuid references auth_user ("id") on delete cascade;
  `.execute(db);
  await sql`
    create unique index workspace_membership_workspace_user_ux
      on workspace_membership (workspace_id, user_id)
      where user_id is not null;
  `.execute(db);

  await db.schema
    .createTable("company_entitlement")
    .addColumn("company_id", "uuid", (c) => c.primaryKey().references("company.id").onDelete("cascade"))
    .addColumn("plan_key", "text", (c) => c.notNull().defaultTo("starter"))
    .addColumn("subscription_status", "text", (c) => c.notNull().defaultTo("none"))
    .addColumn("limits", "jsonb", (c) => c.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn("features", "jsonb", (c) => c.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn("updated_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("company_entitlement").ifExists().execute();
  await sql`drop index if exists workspace_membership_workspace_user_ux;`.execute(db);
  await db.schema.alterTable("workspace_membership").dropColumn("user_id").execute();
  await sql`drop index if exists candidate_user_id_ux;`.execute(db);
  await db.schema.alterTable("candidate").dropColumn("user_id").execute();
  await db.schema.dropIndex("company_organization_id_ux").on("company").execute();
  await db.schema.alterTable("company").dropColumn("organization_id").execute();
}

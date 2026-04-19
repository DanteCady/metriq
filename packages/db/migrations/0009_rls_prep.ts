import { sql, type Kysely } from "kysely";

/**
 * Placeholder for tenant RLS: policies will use `current_setting('app.user_id', true)` set per request.
 * Application code should run `set_config('app.user_id', …, true)` inside the same transaction as tenant queries.
 */
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    create or replace function app_current_user_id() returns uuid
    language sql
    stable
    as $$
      select nullif(current_setting('app.user_id', true), '')::uuid
    $$;
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`drop function if exists app_current_user_id();`.execute(db);
}

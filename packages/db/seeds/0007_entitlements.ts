import { sql, type Kysely } from "kysely";

import type { Database } from "../src/types";

/** Default plan projection for every company (demo / pre-Stripe). */
export async function seed(db: Kysely<Database>): Promise<void> {
  await sql`
    insert into company_entitlement (company_id, plan_key, subscription_status, limits, features)
    select
      c.id,
      'starter',
      'none',
      '{}'::jsonb,
      '{}'::jsonb
    from company c
    on conflict (company_id) do nothing;
  `.execute(db);
}

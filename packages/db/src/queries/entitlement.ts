import type { Kysely } from "kysely";

import type { Selectable } from "kysely";

import type { CompanyEntitlementTable, Database } from "../types";

export type CompanyEntitlementRow = Selectable<CompanyEntitlementTable>;

export async function getCompanyEntitlement(
  db: Kysely<Database>,
  companyId: string,
): Promise<CompanyEntitlementRow | undefined> {
  return db
    .selectFrom("company_entitlement")
    .selectAll()
    .where("company_id", "=", companyId)
    .executeTakeFirst();
}

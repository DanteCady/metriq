import type { Kysely } from "kysely";

import type { Database } from "@metriq/db";
import { entitlementQueries } from "@metriq/db";
import type { CompanyEntitlements, PlanKey } from "@metriq/types";

const PLAN_KEYS: PlanKey[] = ["starter", "pro", "enterprise"];

function isPlanKey(v: string): v is PlanKey {
  return (PLAN_KEYS as string[]).includes(v);
}

/** Default when no `company_entitlement` row exists (e.g. before Stripe sync). */
export function defaultEntitlements(): CompanyEntitlements {
  return {
    planKey: "starter",
    subscriptionStatus: "none",
    limits: {},
    features: {},
  };
}

export async function loadCompanyEntitlements(
  db: Kysely<Database>,
  companyId: string,
): Promise<CompanyEntitlements> {
  const row = await entitlementQueries.getCompanyEntitlement(db, companyId);
  if (!row) return defaultEntitlements();

  const planKey = isPlanKey(row.plan_key) ? row.plan_key : "starter";
  const limits = typeof row.limits === "object" && row.limits !== null ? (row.limits as Record<string, unknown>) : {};
  const featuresRaw = typeof row.features === "object" && row.features !== null ? (row.features as Record<string, unknown>) : {};

  return {
    planKey,
    subscriptionStatus: row.subscription_status,
    limits,
    features: {
      sso: Boolean(featuresRaw.sso),
      apiAccess: Boolean(featuresRaw.apiAccess),
      ...featuresRaw,
    },
  };
}

export function requireFeature(ent: CompanyEntitlements, key: "sso" | "apiAccess"): boolean {
  if (key === "sso") return Boolean(ent.features.sso);
  if (key === "apiAccess") return Boolean(ent.features.apiAccess);
  return false;
}

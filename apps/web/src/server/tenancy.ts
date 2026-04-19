import { companyQueries, createDb, workspaceQueries } from "@metriq/db";

import { getWorkspaceBySlug } from "../mocks/tenancy";

/**
 * Resolve a department workspace for `/dept/[workspaceSlug]`.
 * Uses Postgres when `METRIQ_ORG_SLUG` matches seeded `company.slug`; falls back to mock workspaces if DB is unreachable or org env is unset.
 */
export async function resolveDeptWorkspace(workspaceSlug: string) {
  const orgSlug = process.env.METRIQ_ORG_SLUG?.trim();
  if (!orgSlug) {
    const mock = getWorkspaceBySlug(workspaceSlug);
    return mock ? { kind: "mock" as const, workspace: mock } : null;
  }
  try {
    const db = createDb();
    try {
      const company = await companyQueries.getCompanyBySlug(db, orgSlug);
      if (!company) return { kind: "mock" as const, workspace: getWorkspaceBySlug(workspaceSlug) };
      const row = await workspaceQueries.getWorkspaceByCompanyAndSlug(db, company.id, workspaceSlug);
      if (row) {
        return {
          kind: "db" as const,
          company,
          workspace: row,
        };
      }
    } finally {
      await db.destroy();
    }
  } catch {
    // ignore — fallback below
  }
  const mock = getWorkspaceBySlug(workspaceSlug);
  return mock ? { kind: "mock" as const, workspace: mock } : null;
}

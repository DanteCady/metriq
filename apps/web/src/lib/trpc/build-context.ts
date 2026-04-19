import { createTrpcContext, loadCompanyEntitlements } from "@metriq/api";
import type { DbScope } from "@metriq/db";
import { companyQueries, getDb, workspaceQueries } from "@metriq/db";
import type { EmployerScope, MetriqSessionBundle, Role } from "@metriq/types";

import { auth } from "@/lib/auth";

function parseRole(header: string | null): Role {
  if (header === "admin" || header === "employer" || header === "candidate") return header;
  return "candidate";
}

function toSessionBundle(session: Awaited<ReturnType<typeof auth.api.getSession>>): MetriqSessionBundle {
  if (!session?.user || !session.session) return null;
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role ?? null,
    },
    session: {
      id: session.session.id,
      activeOrganizationId: session.session.activeOrganizationId ?? null,
    },
  };
}

function resolveOrgSlug(req: Request): string | undefined {
  const header = req.headers.get("x-metriq-org-slug")?.trim();
  const fromEnv = process.env.METRIQ_ORG_SLUG?.trim();
  return header || fromEnv || undefined;
}

/**
 * Builds tRPC context: Better Auth session, legacy role header, workspace scope, entitlements.
 * When no session, preview headers still resolve `scope` for demo DB flows.
 */
export async function buildTrpcContextFromRequest(req: Request) {
  const role = parseRole(req.headers.get("x-metriq-role"));
  const db = getDb();

  const rawSession = await auth.api.getSession({ headers: req.headers });
  const authSession = toSessionBundle(rawSession);

  const orgSlug = resolveOrgSlug(req);
  const workspaceSlug = req.headers.get("x-metriq-workspace-slug")?.trim() || undefined;

  let scope: DbScope | undefined;
  let employerScope: EmployerScope | undefined;
  let entitlements = null;

  if (orgSlug) {
    const company = await companyQueries.getCompanyBySlug(db, orgSlug);
    if (company) {
      if (workspaceSlug) {
        const ws = await workspaceQueries.getWorkspaceByCompanyAndSlug(db, company.id, workspaceSlug);
        if (ws) {
          scope = { companyId: company.id, workspaceId: ws.id, tenantId: company.id };
          entitlements = await loadCompanyEntitlements(db, company.id);

          if (authSession?.user.id) {
            const membership = await db
              .selectFrom("workspace_membership")
              .selectAll()
              .where("workspace_id", "=", ws.id)
              .where("user_id", "=", authSession.user.id)
              .executeTakeFirst();
            if (membership?.user_id && company.organization_id) {
              employerScope = {
                companyId: company.id,
                organizationId: company.organization_id,
                workspaceId: ws.id,
                workspaceRole: membership.role,
              };
            }
          }
        } else {
          scope = { companyId: company.id, tenantId: company.id };
          entitlements = await loadCompanyEntitlements(db, company.id);
        }
      } else {
        scope = { companyId: company.id, tenantId: company.id };
        entitlements = await loadCompanyEntitlements(db, company.id);
      }
    }
  }

  return createTrpcContext({
    role,
    persona: role,
    db,
    scope,
    authSession,
    employerScope,
    entitlements,
  });
}

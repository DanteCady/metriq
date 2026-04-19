/** Narrow view of Better Auth session/user for tRPC (no secrets). */
export type MetriqAuthUser = {
  id: string;
  email: string;
  name: string;
  role?: string | null;
};

export type MetriqAuthSession = {
  id: string;
  activeOrganizationId?: string | null;
};

export type MetriqSessionBundle = {
  user: MetriqAuthUser;
  session: MetriqAuthSession;
} | null;

export type PlanKey = "starter" | "pro" | "enterprise";

/** Denormalized projection for guards + UI (server-driven). */
export type CompanyEntitlements = {
  planKey: PlanKey;
  subscriptionStatus: string;
  limits: Record<string, unknown>;
  features: {
    sso?: boolean;
    apiAccess?: boolean;
    [k: string]: unknown;
  };
};

/** Resolved employer scope for a single tRPC request. */
export type EmployerScope = {
  companyId: string;
  organizationId: string;
  workspaceId: string;
  workspaceRole: string;
};

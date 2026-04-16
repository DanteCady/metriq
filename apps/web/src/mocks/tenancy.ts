/**
 * Multi-tenant foundation (mock): Organization → Workspace (dept) → seats.
 * Real auth / Better Auth + org plugin will replace cookie role + static data later.
 */
import { mockUniverse } from "./universe";

export type MockWorkspace = {
  id: string;
  slug: string;
  name: string;
  seatLimit: number;
  seatsUsed: number;
  status: "active" | "trial" | "archived";
};

export type MockOrganization = {
  id: string;
  name: string;
  legalName: string;
  slug: string;
  primaryDomain: string;
};

/** Default workspace for demo links and legacy redirects. */
export const DEFAULT_WORKSPACE_SLUG = "engineering";

export const mockOrganization: MockOrganization = {
  id: "org_nw_001",
  name: mockUniverse.orgName,
  legalName: mockUniverse.orgLegalName,
  slug: mockUniverse.orgSlug,
  primaryDomain: mockUniverse.primaryDomain,
};

export const mockWorkspaces: MockWorkspace[] = [
  { id: "ws_eng", slug: "engineering", name: "Engineering", seatLimit: 25, seatsUsed: 18, status: "active" },
  { id: "ws_gtm", slug: "gtm", name: "GTM & Sales", seatLimit: 15, seatsUsed: 9, status: "active" },
  { id: "ws_fin", slug: "finance", name: "Finance & BizOps", seatLimit: 10, seatsUsed: 4, status: "trial" },
];

export type MockOrgSeatRow = {
  id: string;
  email: string;
  name: string;
  workspaceSlug: string;
  role: "Admin" | "Hiring manager" | "Lead reviewer" | "Reviewer";
};

/** Cross-workspace seat assignments (org-wide view). */
export const mockOrgSeatAssignments: MockOrgSeatRow[] = [
  { id: "seat_1", email: "aisha.khan@northwindlabs.io", name: "Aisha Khan", workspaceSlug: "engineering", role: "Lead reviewer" },
  { id: "seat_2", email: "marcus.chen@northwindlabs.io", name: "Marcus Chen", workspaceSlug: "gtm", role: "Hiring manager" },
  { id: "seat_3", email: "jordan.lee@northwindlabs.io", name: "Jordan Lee", workspaceSlug: "engineering", role: "Reviewer" },
  { id: "seat_4", email: "sam.rivera@northwindlabs.io", name: "Sam Rivera", workspaceSlug: "engineering", role: "Admin" },
];

export const mockOrgSeatPool = {
  purchasedSeats: 50,
  assignedSeats: mockOrgSeatAssignments.length,
  allocatedByWorkspace: mockWorkspaces.map((w) => ({ slug: w.slug, name: w.name, seatsUsed: w.seatsUsed, seatLimit: w.seatLimit })),
};

export function getWorkspaceBySlug(slug: string): MockWorkspace | undefined {
  return mockWorkspaces.find((w) => w.slug === slug);
}

export function workspaceLabel(slug: string): string {
  return getWorkspaceBySlug(slug)?.name ?? slug;
}

/**
 * Single demo tenant — reuse across employer, candidate, and admin mocks for a coherent product feel.
 */
export const mockUniverse = {
  orgName: "Northwind Labs",
  orgLegalName: "Northwind Labs, Inc.",
  orgSlug: "northwind-labs",
  primaryDomain: "northwindlabs.io",
  supportEmail: "talent@northwindlabs.io",
  timezone: "America/New_York",
  dataRegion: "US (East)",
  reviewers: [
    { id: "rev_01", name: "Aisha Khan", role: "Lead reviewer" as const, email: "aisha.khan@northwindlabs.io" },
    { id: "rev_02", name: "Marcus Chen", role: "Hiring manager" as const, email: "marcus.chen@northwindlabs.io" },
    { id: "rev_03", name: "Jordan Lee", role: "Reviewer" as const, email: "jordan.lee@northwindlabs.io" },
    { id: "rev_04", name: "Sam Rivera", role: "Admin" as const, email: "sam.rivera@northwindlabs.io" },
  ],
  candidateNames: ["Riley Park", "Devon Singh", "Casey Ortiz", "Morgan Ali"],
  auditionTitles: [
    "Frontend debugging incident (React)",
    "Mini design doc: Evidence-first review workflow",
    "PR review: TypeScript + API contracts",
  ],
} as const;

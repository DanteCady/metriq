/**
 * Single demo tenant — reuse across employer, candidate, and admin mocks for a coherent product feel.
 */
export const mockUniverse = {
  orgName: "Metriq (demo)",
  orgLegalName: "Metriq Demo LLC",
  orgSlug: "metriq",
  primaryDomain: "demo.metriq.dev",
  supportEmail: "talent@demo.metriq.dev",
  timezone: "America/New_York",
  dataRegion: "US (East)",
  reviewers: [
    { id: "rev_01", name: "Aisha Khan", role: "Lead reviewer" as const, email: "aisha.khan@demo.metriq.dev" },
    { id: "rev_02", name: "Marcus Chen", role: "Hiring manager" as const, email: "marcus.chen@demo.metriq.dev" },
    { id: "rev_03", name: "Jordan Lee", role: "Reviewer" as const, email: "jordan.lee@demo.metriq.dev" },
    { id: "rev_04", name: "Sam Rivera", role: "Admin" as const, email: "sam.rivera@demo.metriq.dev" },
  ],
  candidateNames: ["Riley Park", "Devon Singh", "Casey Ortiz", "Morgan Ali"],
  auditionTitles: [
    "Frontend debugging incident (React)",
    "Mini design doc: Evidence-first review workflow",
    "PR review: TypeScript + API contracts",
  ],
} as const;

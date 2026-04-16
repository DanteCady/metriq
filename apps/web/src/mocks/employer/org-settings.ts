import { mockUniverse } from "../universe";

export const mockEmployerOrgProfile = {
  displayName: mockUniverse.orgName,
  legalName: mockUniverse.orgLegalName,
  slug: mockUniverse.orgSlug,
  primaryDomain: mockUniverse.primaryDomain,
  supportEmail: mockUniverse.supportEmail,
  timezone: mockUniverse.timezone,
  dataRegion: mockUniverse.dataRegion,
  sso: { provider: "Okta (preview)", status: "not_connected" as const },
  auditRetentionDays: 400,
};

export const mockEmployerAuditEvents = [
  { id: "ae_1", at: "2026-04-15T09:12:00.000Z", actor: "Sam Rivera", action: "Updated integration · Greenhouse sandbox" },
  { id: "ae_2", at: "2026-04-14T16:40:00.000Z", actor: "Aisha Khan", action: "Published audition · Mini design doc" },
  { id: "ae_3", at: "2026-04-13T11:05:00.000Z", actor: "Jordan Lee", action: "Exported pipeline CSV · Q2 campus hiring" },
];

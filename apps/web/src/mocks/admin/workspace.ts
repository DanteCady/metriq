import { mockUniverse } from "../universe";

export const mockAdminSimulationCatalog = [
  { id: "sim_ux_01", name: "UX incident triage", version: "v3", status: "published" as const, updatedAt: "2026-04-12T10:00:00.000Z" },
  { id: "sim_ts_02", name: "TypeScript contract review", version: "v2", status: "draft" as const, updatedAt: "2026-04-08T14:30:00.000Z" },
  { id: "sim_data_03", name: "Dataset narrative", version: "v1", status: "published" as const, updatedAt: "2026-03-29T09:15:00.000Z" },
];

export const mockAdminRubricTemplates = [
  { id: "rub_eng_01", name: "Engineering · Evidence-first", criteria: 6, org: mockUniverse.orgName, updatedAt: "2026-04-10T11:00:00.000Z" },
  { id: "rub_des_02", name: "Design · Mini doc", criteria: 5, org: "Platform default", updatedAt: "2026-04-02T16:45:00.000Z" },
];

export const mockAdminModerationQueue = [
  { id: "mod_1", type: "Content flag", subject: "Artifact text · submission sub_8f2a", openedAt: "2026-04-15T08:10:00.000Z", priority: "P2" as const },
  { id: "mod_2", type: "PII report", subject: "Candidate message export", openedAt: "2026-04-14T19:02:00.000Z", priority: "P1" as const },
];

export const mockAdminAuditTail = [
  { id: "ad_1", at: "2026-04-15T07:55:00.000Z", actor: "platform@metriq.dev", action: "Published simulation sim_ux_01" },
  { id: "ad_2", at: "2026-04-14T22:11:00.000Z", actor: "platform@metriq.dev", action: "Rolled back rubric template rub_des_02 to v1.4" },
];

import { mockUniverse } from "../universe";

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  pctOfPrev: number | null;
  avgHoursInStage: number;
};

export const mockEmployerFunnelStages: FunnelStage[] = [
  { key: "invited", label: "Invited", count: 248, pctOfPrev: null, avgHoursInStage: 18 },
  { key: "active", label: "Active", count: 186, pctOfPrev: 0.75, avgHoursInStage: 42 },
  { key: "submitted", label: "Submitted", count: 94, pctOfPrev: 0.51, avgHoursInStage: 12 },
  { key: "reviewing", label: "In review", count: 61, pctOfPrev: 0.65, avgHoursInStage: 28 },
  { key: "decision", label: "Decision", count: 38, pctOfPrev: 0.62, avgHoursInStage: 36 },
];

export const mockEmployerFunnelSummary = {
  org: mockUniverse.orgName,
  cohort: "Last 30 days · All published auditions",
  inviteToSubmit: 0.38,
  submitToDecision: 0.4,
  topDropoff: "Active → Submitted",
  topDropoffNote: "Candidates stall when the evidence checklist is unclear mid-stage.",
};

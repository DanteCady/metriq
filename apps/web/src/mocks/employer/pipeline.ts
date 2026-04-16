export type PipelineStatus = "invited" | "active" | "submitted" | "reviewing" | "decision";

import { mockUniverse } from "../universe";

export type PipelineCandidateRow = {
  id: string;
  name: string;
  auditionId: string;
  auditionTitle: string;
  status: PipelineStatus;
  assignedTo?: string;
  updatedAt: string;
  scoreHint?: string;
};

export const mockPipeline: PipelineCandidateRow[] = [
  {
    id: "cand_001",
    name: "Alex Chen",
    auditionId: "aud_demo_001",
    auditionTitle: "Frontend Debugging Incident (React)",
    status: "submitted",
    assignedTo: mockUniverse.reviewers[2]?.name ?? "Jordan Lee",
    updatedAt: "2026-04-12T14:20:00.000Z",
    scoreHint: "Strong",
  },
  {
    id: "cand_002",
    name: "Sam Rivera",
    auditionId: "aud_demo_001",
    auditionTitle: "Frontend Debugging Incident (React)",
    status: "reviewing",
    assignedTo: mockUniverse.reviewers[2]?.name ?? "Jordan Lee",
    updatedAt: "2026-04-13T10:05:00.000Z",
    scoreHint: "Mixed",
  },
  {
    id: "cand_003",
    name: "Taylor Kim",
    auditionId: "aud_demo_003",
    auditionTitle: "PR Review: TypeScript + API contracts",
    status: "active",
    assignedTo: mockUniverse.reviewers[0]?.name ?? "Aisha Khan",
    updatedAt: "2026-04-14T09:50:00.000Z",
  },
  {
    id: "cand_004",
    name: "Morgan Lee",
    auditionId: "aud_demo_002",
    auditionTitle: "Mini Design Doc: Evidence-first review workflow",
    status: "invited",
    updatedAt: "2026-04-11T18:30:00.000Z",
  },
];


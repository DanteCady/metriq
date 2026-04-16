import { mockUniverse } from "../universe";

export type MockEmployerSubmissionArtifact = {
  id: string;
  type: "text" | "link";
  label: string;
  content: string;
};

export type MockEmployerRubricScore = {
  key: string;
  criterion: string;
  description: string;
  weight: number;
  score: number;
  max: number;
};

export type MockEmployerSubmissionDetail = {
  submissionId: string;
  candidateName: string;
  candidateEmail: string;
  auditionTitle: string;
  submittedAt: string;
  stageLabel: string;
  artifacts: MockEmployerSubmissionArtifact[];
  rubric: MockEmployerRubricScore[];
  decision: {
    status: "in_review" | "shortlisted" | "rejected";
    primaryReviewer: string;
    lastActivityAt: string;
    notes: string;
  };
};

export function mockEmployerSubmissionDetail(submissionId: string): MockEmployerSubmissionDetail {
  const suffix = submissionId.slice(0, 8) || "demo";
  return {
    submissionId,
    candidateName: mockUniverse.candidateNames[1] ?? "Devon Singh",
    candidateEmail: "devon.singh@email.example",
    auditionTitle: mockUniverse.auditionTitles[0] ?? "Frontend debugging incident (React)",
    submittedAt: "2026-04-14T16:22:00.000Z",
    stageLabel: "Submit evidence",
    artifacts: [
      {
        id: "ea_1",
        type: "text",
        label: "Reproduction & impact",
        content:
          "Repro: load `/candidate` with network offline → blank error surface. Impact: candidates abandon before proof curation; weak first impression for hiring teams.",
      },
      {
        id: "ea_2",
        type: "link",
        label: "Pull request",
        content: "https://example.com/pr/metriq-candidate-resilience",
      },
      {
        id: "ea_3",
        type: "text",
        label: "Mitigations & trade-offs",
        content:
          "Chose mock-first rendering with explicit preview affordances over skeleton-only UX so evaluators still see intent. Trade-off: more client bundle size until code-splitting lands.",
      },
    ],
    rubric: [
      {
        key: "r1",
        criterion: "Reasoning & trade-offs",
        description: "Assumptions explicit; alternatives considered; risk called out.",
        weight: 0.35,
        score: 4,
        max: 5,
      },
      {
        key: "r2",
        criterion: "Execution quality",
        description: "Patch quality, correctness, and fit with existing patterns.",
        weight: 0.35,
        score: 4,
        max: 5,
      },
      {
        key: "r3",
        criterion: "Communication",
        description: "Skimmable structure; evidence easy to navigate for reviewers.",
        weight: 0.3,
        score: 5,
        max: 5,
      },
    ],
    decision: {
      status: "in_review",
      primaryReviewer: mockUniverse.reviewers[0]?.name ?? "Aisha Khan",
      lastActivityAt: "2026-04-15T09:40:00.000Z",
      notes: `Submission ${suffix}: rubric draft scores captured; awaiting second reviewer for calibration.`,
    },
  };
}

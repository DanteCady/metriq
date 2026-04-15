import type { SimulationType, SubmissionStatus } from "@metriq/types";

export type ArtifactType = "text" | "link";

export type SimulationSection = {
  id: string;
  title: string;
  instructions: string;
  requiredArtifacts: Array<{ label: string; type: ArtifactType }>;
};

export type Simulation = {
  id: string;
  title: string;
  type: SimulationType;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  skills: string[];
  summary: string;
  sections: SimulationSection[];
};

export type SubmissionArtifact = {
  id: string;
  type: ArtifactType;
  label: string;
  content: string;
};

export type Submission = {
  id: string;
  simulationId: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  artifacts: SubmissionArtifact[];
};

export type ScoreBreakdownItem = {
  criterion: string;
  weight: number;
  score: number; // 0..100
  notes?: string;
};

export type EvaluationResult = {
  submissionId: string;
  overallScore: number; // 0..100
  summary: string;
  breakdown: ScoreBreakdownItem[];
};

export const simulationsFixture: Simulation[] = [
  {
    id: "sim_debug_task_01",
    title: "Debug a flaky test suite",
    type: "debug_task",
    difficulty: "medium",
    estimatedMinutes: 60,
    skills: ["TypeScript", "Testing", "Debugging"],
    summary:
      "You’ll analyze a failing CI run, form hypotheses, and propose fixes. The goal is sound debugging process and clear communication.",
    sections: [
      {
        id: "sec_context",
        title: "Context",
        instructions:
          "A test suite intermittently fails on CI. Review the failure logs, explain likely root causes, and propose concrete fixes that reduce flakiness.",
        requiredArtifacts: [
          { label: "Root cause analysis", type: "text" },
          { label: "Proposed fix (PR / diff link)", type: "link" },
        ],
      },
      {
        id: "sec_followup",
        title: "Follow-up",
        instructions:
          "Add a short note on how you’d prevent similar issues (tooling, test design, observability, etc.).",
        requiredArtifacts: [{ label: "Prevention plan", type: "text" }],
      },
    ],
  },
  {
    id: "sim_api_design_01",
    title: "Design an API for audit events",
    type: "api_design",
    difficulty: "hard",
    estimatedMinutes: 75,
    skills: ["API Design", "Data modeling", "Trade-offs"],
    summary:
      "Design a small API surface for emitting and querying audit events. We care about correctness, extensibility, and crisp interfaces.",
    sections: [
      {
        id: "sec_problem",
        title: "Problem",
        instructions:
          "Define endpoints (or RPC methods), payloads, and key constraints. Include examples and error cases. Keep it simple but scalable.",
        requiredArtifacts: [
          { label: "API proposal", type: "text" },
          { label: "Example requests/responses", type: "text" },
        ],
      },
    ],
  },
  {
    id: "sim_pr_review_01",
    title: "Code review: performance regression",
    type: "pr_review",
    difficulty: "easy",
    estimatedMinutes: 35,
    skills: ["Code review", "Performance", "Communication"],
    summary:
      "You’ll review a PR diff and leave feedback. Focus on correctness, performance, maintainability, and prioritization.",
    sections: [
      {
        id: "sec_review",
        title: "Review",
        instructions:
          "Write the review you’d leave on the PR. Call out issues, questions, and suggestions. Separate must-fix from nice-to-have.",
        requiredArtifacts: [{ label: "PR review feedback", type: "text" }],
      },
    ],
  },
];

export function createEvaluationFixture(submissionId: string, simulation: Simulation): EvaluationResult {
  const breakdown: ScoreBreakdownItem[] = [
    {
      criterion: "Clarity",
      weight: 0.25,
      score: 82,
      notes: "Clear structure and rationale; a few areas could be tightened with concrete examples.",
    },
    {
      criterion: "Technical correctness",
      weight: 0.35,
      score: 76,
      notes: "Good instincts; missed one edge case in the proposed approach.",
    },
    {
      criterion: "Pragmatism",
      weight: 0.25,
      score: 88,
      notes: "Great trade-offs and prioritization; strong MVP sensibility.",
    },
    {
      criterion: "Communication",
      weight: 0.15,
      score: 84,
      notes: "Professional tone and readable writing.",
    },
  ];

  const overallScore =
    breakdown.reduce((acc, item) => acc + item.score * item.weight, 0) / breakdown.reduce((a, i) => a + i.weight, 0);

  return {
    submissionId,
    overallScore: Math.round(overallScore),
    summary: `Strong work on “${simulation.title}”. Your submission shows good judgment and clean communication. A few details could be strengthened with deeper edge-case coverage.`,
    breakdown,
  };
}


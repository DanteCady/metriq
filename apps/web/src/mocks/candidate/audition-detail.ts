export type MockStage = {
  id: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  requiredArtifacts: string[];
  constraints: string[];
};

export type MockAuditionDetail = {
  auditionId: string;
  roleTitle: string;
  companyName: string;
  roleSummary: string;
  totalEstimatedMinutes: number;
  stages: MockStage[];
  rubricSummary: {
    scale: "1-4";
    criteria: { key: string; label: string; intent: string }[];
  };
};

export const mockAuditionDetail: MockAuditionDetail = {
  auditionId: "sim_demo_debug",
  roleTitle: "Frontend Engineer (Product Systems)",
  companyName: "Arcfield Labs",
  roleSummary:
    "You’ll diagnose a real UX bug, propose a fix that preserves product intent, and ship evidence that’s easy to evaluate: reproduction, root cause, and a clean patch plan.",
  totalEstimatedMinutes: 75,
  stages: [
    {
      id: "stage_1",
      title: "Triage & reproduction",
      objective: "Prove you can quickly isolate a real issue and define a fixable scope.",
      estimatedMinutes: 20,
      requiredArtifacts: ["Repro steps", "Root cause hypothesis"],
      constraints: ["No library changes", "Focus on user-visible impact", "Document assumptions explicitly"],
    },
    {
      id: "stage_2",
      title: "Fix proposal",
      objective: "Prove you can design a robust fix with clear trade-offs and risks.",
      estimatedMinutes: 25,
      requiredArtifacts: ["Fix plan", "Risks & mitigations"],
      constraints: ["Prefer minimal surface area", "Avoid regressions; call out edge cases"],
    },
    {
      id: "stage_3",
      title: "Evidence package",
      objective: "Prove you can package your work so another engineer can evaluate it fast.",
      estimatedMinutes: 30,
      requiredArtifacts: ["Patch / PR link", "Before/after notes"],
      constraints: ["Make it skimmable", "Point to the exact lines/areas that matter"],
    },
  ],
  rubricSummary: {
    scale: "1-4",
    criteria: [
      { key: "execution", label: "Execution quality", intent: "Correctness, completeness, minimal regressions." },
      { key: "reasoning", label: "Reasoning", intent: "Assumptions, trade-offs, and decision clarity." },
      { key: "communication", label: "Communication", intent: "Skimmable, structured, evaluator-friendly evidence." },
      { key: "product", label: "Product judgment", intent: "Maintains intended UX and reduces risk." },
    ],
  },
};


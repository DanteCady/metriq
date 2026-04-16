export type MockCriterion = {
  key: string;
  label: string;
  score: number;
  max: number;
  rationale: string;
  evidenceArtifactIds: string[];
};

export type MockEvaluation = {
  overallScore: number;
  maxScore: number;
  summary: string;
  criteria: MockCriterion[];
};

export const mockEvaluation: MockEvaluation = {
  overallScore: 13,
  maxScore: 16,
  summary:
    "Strong evidence packaging and clear trade-offs. The work is evaluator-friendly and focused on user impact. Minor gap: call out a couple more edge cases and success metrics.",
  criteria: [
    {
      key: "execution",
      label: "Execution quality",
      score: 3,
      max: 4,
      rationale: "Fix approach is plausible and low-risk; could benefit from an explicit rollback plan.",
      evidenceArtifactIds: ["art_3", "art_4"],
    },
    {
      key: "reasoning",
      label: "Reasoning",
      score: 4,
      max: 4,
      rationale: "Assumptions are stated and trade-offs are explicit; risks are identified with mitigations.",
      evidenceArtifactIds: ["art_2", "art_4"],
    },
    {
      key: "communication",
      label: "Communication",
      score: 3,
      max: 4,
      rationale: "Structured and skimmable. Add a short 'how to evaluate' section to speed review further.",
      evidenceArtifactIds: ["art_4"],
    },
    {
      key: "product",
      label: "Product judgment",
      score: 3,
      max: 4,
      rationale: "Prioritizes candidate experience and proof story; could add clearer success criteria.",
      evidenceArtifactIds: ["art_1", "art_4"],
    },
  ],
};


export type RubricCriterionDistribution = {
  criterionId: string;
  label: string;
  auditionTitle: string;
  /** 5 buckets strong → weak */
  buckets: [number, number, number, number, number];
  evidenceLinkedPct: number;
  reviewerAlignment: "high" | "medium" | "watch";
};

export const mockEmployerRubricDistributions: RubricCriterionDistribution[] = [
  {
    criterionId: "crit_reasoning",
    label: "Reasoning & trade-offs",
    auditionTitle: "Mini design doc: Evidence-first review workflow",
    buckets: [12, 28, 14, 4, 2],
    evidenceLinkedPct: 0.91,
    reviewerAlignment: "high",
  },
  {
    criterionId: "crit_comm",
    label: "Communication",
    auditionTitle: "Mini design doc: Evidence-first review workflow",
    buckets: [18, 22, 16, 3, 1],
    evidenceLinkedPct: 0.88,
    reviewerAlignment: "medium",
  },
  {
    criterionId: "crit_exec",
    label: "Execution quality",
    auditionTitle: "Frontend debugging incident (React)",
    buckets: [9, 21, 19, 6, 3],
    evidenceLinkedPct: 0.84,
    reviewerAlignment: "watch",
  },
];

export const mockEmployerSignalQuality = {
  rubricDriftScore: 0.08,
  note: "Drift is within tolerance when evidence is required per criterion.",
  topAction: "Tighten reviewer guidance on “Execution quality” anchors for the React incident template.",
};

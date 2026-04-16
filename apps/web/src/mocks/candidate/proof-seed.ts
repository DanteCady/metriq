import type { MockProofHighlight } from "./proof-types";

/** Initial highlights when local storage is empty — keeps first load feeling “alive”. */
export const mockProofSeedHighlights: MockProofHighlight[] = [
  {
    id: "h_seed_exec",
    title: "Shipped a resilient mock-backed candidate flow",
    capability: "Execution",
    artifactId: "art_4",
    summary:
      "Problem → approach → outcome: replaced brittle error-only states with structured evidence-first UX and clear deliverables.",
  },
  {
    id: "h_seed_reason",
    title: "Clear root-cause narrative under failure conditions",
    capability: "Reasoning",
    artifactId: "art_2",
    summary: "Documented reproduction path and hypothesis for backend dependency gaps without hand-wavy conclusions.",
  },
];

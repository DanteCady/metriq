export type MockArtifact = {
  id: string;
  type: "text" | "link";
  label: string;
  content: string;
};

export type MockSubmission = {
  id: string;
  status: "draft" | "submitted";
  artifacts: MockArtifact[];
};

export const mockSubmissionDraft: MockSubmission = {
  id: "sub_demo_active",
  status: "draft",
  artifacts: [
    {
      id: "art_1",
      type: "text",
      label: "Triage & reproduction: Repro steps",
      content:
        "1) Open the candidate proof profile\n2) Observe hard failure when backend is unavailable\n3) Expected: graceful demo mode with mock artifacts\n\nImpact: blocks the candidate from curating proof; breaks the product story.",
    },
    {
      id: "art_2",
      type: "text",
      label: "Triage & reproduction: Root cause hypothesis",
      content:
        "UI currently depends on tRPC for candidate/submission data. When DB/auth fails, we show an error state rather than a realistic fallback. Add mock data + a “demo mode” affordance.",
    },
  ],
};

export const mockSubmissionSubmitted: MockSubmission = {
  id: "sub_demo_completed",
  status: "submitted",
  artifacts: [
    {
      id: "art_3",
      type: "link",
      label: "Evidence package: Patch / PR link",
      content: "https://example.com/pr/123",
    },
    {
      id: "art_4",
      type: "text",
      label: "Evidence package: Before/after notes",
      content:
        "Before: error-only experience when backend unavailable.\nAfter: mock-backed candidate flow with clear UI hierarchy, deliverables checklist, and evidence-first results.",
    },
  ],
};


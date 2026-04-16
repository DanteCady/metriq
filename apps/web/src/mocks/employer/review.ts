export type ReviewQueueItem = {
  submissionId: string;
  candidateName: string;
  auditionTitle: string;
  assignedTo: string;
  submittedAt: string;
  evidenceCount: number;
  status: "needs_review" | "in_progress" | "completed";
};

export const mockReviewQueue: ReviewQueueItem[] = [
  {
    submissionId: "sub_demo_completed",
    candidateName: "Alex Chen",
    auditionTitle: "Frontend Debugging Incident (React)",
    assignedTo: "Jordan",
    submittedAt: "2026-04-12T13:10:00.000Z",
    evidenceCount: 4,
    status: "needs_review",
  },
  {
    submissionId: "sub_demo_active",
    candidateName: "Sam Rivera",
    auditionTitle: "Frontend Debugging Incident (React)",
    assignedTo: "Jordan",
    submittedAt: "2026-04-13T09:40:00.000Z",
    evidenceCount: 2,
    status: "in_progress",
  },
];


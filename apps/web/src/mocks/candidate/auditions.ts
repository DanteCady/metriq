export type MockAudition = {
  auditionId: string;
  roleTitle: string;
  companyName: string;
  estimatedMinutes: number;
  status: "invited" | "active" | "completed";
  submissionId: string;
};

export const mockAuditions: MockAudition[] = [
  {
    auditionId: "sim_demo_debug",
    roleTitle: "Frontend Engineer (Product Systems)",
    companyName: "Arcfield Labs",
    estimatedMinutes: 75,
    status: "active",
    submissionId: "sub_demo_active",
  },
  {
    auditionId: "sim_demo_api",
    roleTitle: "Full‑Stack Engineer (Platform)",
    companyName: "Northwind Health",
    estimatedMinutes: 90,
    status: "invited",
    submissionId: "sub_demo_invited",
  },
  {
    auditionId: "sim_demo_review",
    roleTitle: "Staff Engineer (Quality & Delivery)",
    companyName: "Ledgerline",
    estimatedMinutes: 60,
    status: "completed",
    submissionId: "sub_demo_completed",
  },
];


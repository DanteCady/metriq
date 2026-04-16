export type EmployerAuditionStatus = "draft" | "published" | "archived";

export type EmployerAudition = {
  id: string;
  title: string;
  level: "Junior" | "Mid" | "Senior" | "Staff";
  template:
    | "WorkSample_Brief"
    | "Debugging_Incident"
    | "PR_Review"
    | "DesignDoc_Mini"
    | "Data_Analysis"
    | "Customer_Support_Triage";
  status: EmployerAuditionStatus;
  timeboxMinutes: number;
  createdAt: string;
};

export const mockEmployerAuditions: EmployerAudition[] = [
  {
    id: "aud_demo_001",
    title: "Frontend Debugging Incident (React)",
    level: "Mid",
    template: "Debugging_Incident",
    status: "published",
    timeboxMinutes: 75,
    createdAt: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "aud_demo_002",
    title: "Mini Design Doc: Evidence-first review workflow",
    level: "Senior",
    template: "DesignDoc_Mini",
    status: "draft",
    timeboxMinutes: 60,
    createdAt: "2026-04-08T09:00:00.000Z",
  },
  {
    id: "aud_demo_003",
    title: "PR Review: TypeScript + API contracts",
    level: "Junior",
    template: "PR_Review",
    status: "published",
    timeboxMinutes: 45,
    createdAt: "2026-04-10T16:00:00.000Z",
  },
];


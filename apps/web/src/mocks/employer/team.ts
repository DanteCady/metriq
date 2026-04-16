export type TeamMember = {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Reviewer";
  email: string;
};

export const mockTeam: TeamMember[] = [
  { id: "tm_001", name: "Jordan Park", role: "Owner", email: "jordan@metriq.example" },
  { id: "tm_002", name: "Avery Singh", role: "Admin", email: "avery@metriq.example" },
  { id: "tm_003", name: "Riley Gomez", role: "Reviewer", email: "riley@metriq.example" },
];


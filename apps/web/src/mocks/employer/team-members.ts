import { mockUniverse } from "../universe";

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Hiring manager" | "Lead reviewer" | "Reviewer";
  lastActiveAt: string;
  reviewsCompleted30d: number;
  status: "active" | "invited";
};

export const mockEmployerTeamMembers: TeamMemberRow[] = mockUniverse.reviewers.map((r, i) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role === "Lead reviewer" ? "Lead reviewer" : r.role === "Hiring manager" ? "Hiring manager" : r.role === "Admin" ? "Admin" : "Reviewer",
  lastActiveAt: `2026-04-${String(14 - i).padStart(2, "0")}T${10 + i}:30:00.000Z`,
  reviewsCompleted30d: 22 - i * 4,
  status: "active" as const,
}));

export const mockEmployerTeamInvites = [
  { email: "priya.n@northwindlabs.io", role: "Reviewer" as const, sentAt: "2026-04-12T15:00:00.000Z" },
  { email: "eli.b@northwindlabs.io", role: "Hiring manager" as const, sentAt: "2026-04-10T11:20:00.000Z" },
];

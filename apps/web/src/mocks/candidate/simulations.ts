export type MockSimulation = {
  id: string;
  title: string;
  summary: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  skills: string[];
};

export const mockSimulations: MockSimulation[] = [
  {
    id: "sim_demo_001",
    title: "Debugging incident: Proof profile fallback",
    summary: "Diagnose a user-facing failure, propose a fix, and submit evidence.",
    type: "debugging",
    difficulty: "medium",
    estimatedMinutes: 75,
    skills: ["React", "TypeScript", "UX"],
  },
  {
    id: "sim_demo_002",
    title: "Mini design doc: Evidence-first review workflow",
    summary: "Write a concise design doc with trade-offs and rollout plan.",
    type: "design",
    difficulty: "hard",
    estimatedMinutes: 60,
    skills: ["Systems", "API", "Communication"],
  },
];


import { mockUniverse } from "../universe";

/**
 * Demo-only profile fields for the candidate “job board” style account page.
 */
export const mockCandidateAccountProfile = {
  displayName: mockUniverse.candidateNames[0] ?? "Riley Park",
  headline: "Product-focused engineer — shipping evidence-first candidate experiences.",
  location: "Brooklyn, NY",
  primaryEmail: "riley.park@email.example",
  phone: "+1 (555) 010-4291",
  openTo: ["Full-time", "Remote-friendly", "Senior IC roles", "Startup & growth-stage"],
  about:
    "I care about hiring loops that respect candidate time: clear rubrics, realistic timeboxes, and feedback that ties to what you actually shipped. On Metriq I practice the same bar I expect from teams — tight narratives, reproducible evidence, and explicit trade-offs.",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "System design",
    "API design",
    "Accessibility",
    "Design systems",
    "Technical writing",
    "Incident response",
    "Mentoring",
  ],
  interests: ["Fair hiring", "Developer experience", "Design ops", "Climate tech (volunteer)"],
  awards: [
    {
      id: "aw_1",
      title: "Top audition signal — execution",
      year: "2026",
      issuer: "Arcfield Labs (preview loop)",
    },
    {
      id: "aw_2",
      title: "Internal hackweek — best narrative",
      year: "2025",
      issuer: "Previous org (reference on request)",
    },
  ],
  ratings: [
    {
      id: "rt_1",
      label: "Frontend Engineer (Product Systems)",
      score: 13,
      max: 16,
      reviewCount: 3,
      context: `${mockUniverse.orgName} audition`,
    },
    {
      id: "rt_2",
      label: "Mini design doc — evidence-first review",
      score: 11,
      max: 12,
      reviewCount: 2,
      context: "Simulation rubric",
    },
  ],
  resume: {
    fileName: "Riley_Park_resume_2026.pdf",
    updatedLabel: "Updated April 2026",
    pages: 2,
  },
} as const;

import { z } from "zod";

export const candidateProfileSchema = z.object({
  displayName: z.string().min(2).max(80),
  headline: z.string().min(2).max(120).optional(),
  location: z.string().min(2).max(120).optional(),
  bio: z.string().min(0).max(600).optional(),
  primaryRole: z.string().min(2).max(80).optional(),
  skills: z.array(z.string().min(1).max(40)).max(50).default([]),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;


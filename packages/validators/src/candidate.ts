import { z } from "zod";

export const candidateProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  headline: z.string().min(2).max(120).optional(),
  bio: z.string().min(0).max(600).optional(),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;


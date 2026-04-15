import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25),
  offset: z.number().int().min(0).default(0),
});

export const talentPoolFiltersSchema = z.object({
  search: z.string().max(120).optional(),
  minScore: z.number().min(0).max(100).optional(),
  role: z.string().max(80).optional(),
  skills: z.array(z.string().min(1).max(40)).max(20).optional(),
  sort: z.enum(["score_desc", "score_asc", "recent_desc"]).default("score_desc"),
  pagination: paginationSchema.default({ limit: 25, offset: 0 }),
});

export type TalentPoolFiltersInput = z.infer<typeof talentPoolFiltersSchema>;


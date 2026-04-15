import { z } from "zod";

export const simulationTypeSchema = z.enum(["debug_task", "api_design", "pr_review", "bug_analysis"]);

export const createSimulationSchema = z.object({
  title: z.string().min(4).max(140),
  type: simulationTypeSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
  estimatedMinutes: z.number().int().min(10).max(600),
  skills: z.array(z.string().min(1).max(40)).max(50).default([]),
  summary: z.string().min(10).max(600),
});

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>;


import { z } from "zod";

import { candidateQueries, simulationQueries, submissionQueries } from "@metriq/db";
import { createSimulationSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

type SimulationType = "debug_task" | "api_design" | "pr_review" | "bug_analysis";
type Difficulty = "easy" | "medium" | "hard";

export const simulationRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const rows = await simulationQueries.listSimulations(ctx.db);
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      summary: s.summary,
      type: s.simulation_type as SimulationType,
      difficulty: s.difficulty as Difficulty,
      estimatedMinutes: s.estimated_minutes,
      skills: s.skills ?? [],
    }));
  }),

  detail: publicProcedure
    .input(z.object({ simulationId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const detail = await simulationQueries.getSimulationDetail(ctx.db, input.simulationId);
      if (!detail) return null;

      const s = detail.simulation;
      return {
        id: s.id,
        title: s.title,
        summary: s.summary,
        type: s.simulation_type as SimulationType,
        difficulty: s.difficulty as Difficulty,
        estimatedMinutes: s.estimated_minutes,
        skills: s.skills ?? [],
        sections: detail.sections.map((sec) => ({
          id: sec.id,
          position: sec.position,
          title: sec.title,
          prompt: sec.prompt,
          requiredArtifacts: sec.required_artifacts as unknown,
        })),
      };
    }),

  startSimulation: publicProcedure
    .input(z.object({ simulationId: z.string().min(1), candidateId: z.string().min(1).optional() }))
    .mutation(async ({ ctx, input }) => {
      const candidateId =
        input.candidateId ?? (await candidateQueries.listCandidates(ctx.db)).at(0)?.id ?? null;
      if (!candidateId) throw new Error("No candidates exist to start a simulation.");

      const submission = await submissionQueries.createSubmission(ctx.db, {
        candidate_id: candidateId,
        simulation_id: input.simulationId,
        status: "draft",
        started_at: new Date(),
        submitted_at: null,
      });

      return { submissionId: submission.id };
    }),

  create: publicProcedure.input(createSimulationSchema).mutation(async ({ ctx, input }) => {
    return simulationQueries.createSimulation(ctx.db, {
      title: input.title,
      summary: input.summary,
      simulation_type: input.simulationType,
      difficulty: input.difficulty,
      estimated_minutes: input.estimatedMinutes,
      skills: input.skills.length > 0 ? input.skills : null,
    });
  }),
});


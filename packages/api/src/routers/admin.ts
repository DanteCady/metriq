import { z } from "zod";

import { evaluationQueries, rubricQueries, simulationQueries, submissionQueries } from "@metriq/db";
import { createSimulationSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  listSimulations: publicProcedure.query(async ({ ctx }) => {
    return simulationQueries.listSimulations(ctx.db, ctx.scope);
  }),

  createSimulation: publicProcedure.input(createSimulationSchema).mutation(async ({ ctx, input }) => {
    return simulationQueries.createSimulation(ctx.db, {
      title: input.title,
      summary: input.summary,
      simulation_type: input.simulationType,
      difficulty: input.difficulty,
      estimated_minutes: input.estimatedMinutes,
      skills: input.skills.length > 0 ? input.skills : null,
    }, ctx.scope);
  }),

  listSubmissions: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["draft", "submitted"]).optional(),
          limit: z.number().int().min(1).max(100).default(25),
          offset: z.number().int().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const status = input?.status;
      const limit = input?.limit ?? 25;
      const offset = input?.offset ?? 0;
      return submissionQueries.listSubmissions(ctx.db, { status, limit, offset }, ctx.scope);
    }),

  getSubmission: publicProcedure.input(z.object({ submissionId: z.string().min(1) })).query(async ({ ctx, input }) => {
    return submissionQueries.getSubmissionById(ctx.db, input.submissionId, ctx.scope);
  }),

  getRubricForSimulation: publicProcedure
    .input(z.object({ simulationId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return rubricQueries.getRubricBySimulationId(ctx.db, input.simulationId, ctx.scope);
    }),

  createEvaluation: publicProcedure
    .input(
      z.object({
        submissionId: z.string().min(1),
        overallScore: z.string().min(1),
        summary: z.string().min(1).optional(),
        breakdown: z
          .array(
            z.object({
              criterionId: z.string().min(1),
              score: z.string().min(1),
              notes: z.string().min(1).optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const evaluation = await evaluationQueries.createEvaluation(ctx.db, {
        submission_id: input.submissionId,
        overall_score: input.overallScore,
        summary: input.summary ?? null,
        evaluated_at: new Date(),
      }, ctx.scope);

      for (const row of input.breakdown) {
        await evaluationQueries.createScoreBreakdownRow(ctx.db, {
          evaluation_id: evaluation.id,
          criterion_id: row.criterionId,
          score: row.score,
          notes: row.notes ?? null,
        }, ctx.scope);
      }

      return evaluationQueries.getEvaluationBySubmissionId(ctx.db, input.submissionId, ctx.scope);
    }),
});


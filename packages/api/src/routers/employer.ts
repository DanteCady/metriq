import { z } from "zod";

import { candidateQueries, evaluationQueries, submissionQueries } from "@metriq/db";
import { talentPoolFiltersSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const employerRouter = createTRPCRouter({
  listTalentPool: publicProcedure.input(talentPoolFiltersSchema).query(async ({ ctx, input }) => {
    return candidateQueries.listTalentPool(ctx.db, input, ctx.scope);
  }),

  getCandidateProfile: publicProcedure
    .input(z.object({ candidateId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return candidateQueries.getCandidateById(ctx.db, input.candidateId, ctx.scope);
    }),

  getCandidateSubmissions: publicProcedure
    .input(z.object({ candidateId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return submissionQueries.listSubmissionsByCandidateId(ctx.db, input.candidateId, ctx.scope);
    }),

  getCandidateScoreBreakdown: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return evaluationQueries.getEvaluationBySubmissionId(ctx.db, input.submissionId, ctx.scope);
    }),
});


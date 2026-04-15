import { z } from "zod";

import { candidateQueries } from "@metriq/db";
import { candidateProfileSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const candidateRouter = createTRPCRouter({
  getDashboard: publicProcedure
    .input(z.object({ candidateId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return candidateQueries.getCandidateDashboardStats(ctx.db, input.candidateId, ctx.scope);
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return candidateQueries.listCandidates(ctx.db, ctx.scope);
  }),

  byId: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    return candidateQueries.getCandidateById(ctx.db, input.id, ctx.scope);
  }),

  updateProfile: publicProcedure
    .input(z.object({ id: z.string().min(1), profile: candidateProfileSchema }))
    .mutation(async ({ ctx, input }) => {
      return candidateQueries.updateCandidate(ctx.db, input.id, {
        full_name: input.profile.fullName,
        headline: input.profile.headline ?? null,
        bio: input.profile.bio ?? null,
      }, ctx.scope);
    }),
});


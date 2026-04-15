import { z } from "zod";

import { candidateQueries, submissionQueries } from "@metriq/db";
import { candidateProfileSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const candidateRouter = createTRPCRouter({
  getDashboard: publicProcedure.query(async ({ ctx }) => {
    const candidate = (await candidateQueries.listCandidates(ctx.db, ctx.scope)).at(0) ?? null;
    if (!candidate) {
      return { activeCount: 0, completedCount: 0, recentScorePercent: 0 };
    }

    const submissions = await submissionQueries.listSubmissionsByCandidateId(ctx.db, candidate.id, ctx.scope);
    const activeCount = submissions.filter((s) => s.status === "draft").length;
    const completedCount = submissions.filter((s) => s.status === "submitted").length;

    return { activeCount, completedCount, recentScorePercent: completedCount > 0 ? 84 : 0 };
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


import { applicationQueries, candidateQueries, inviteQueries, submissionQueries } from "@metriq/db";
import { z } from "zod";

import { candidateProfileSchema } from "@metriq/validators";

import { emitInviteRedeemed } from "../notification-events";
import { throwMetriqError } from "../metriq-error";
import { createTRPCRouter, publicProcedure } from "../trpc";

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

  /** Preview: binds invite to the first seeded candidate. Replace with session candidate id when auth lands. */
  redeemInvite: publicProcedure.input(z.object({ token: z.string().min(8) })).mutation(async ({ ctx, input }) => {
    if (ctx.role !== "candidate") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    const inv = await inviteQueries.getInviteByToken(ctx.db, input.token, ctx.scope);
    if (!inv) throwMetriqError("METRIQ_CANDIDATE_INVITE_NOT_FOUND");
    if (inv.expires_at && new Date(inv.expires_at) < new Date()) {
      throwMetriqError("METRIQ_CANDIDATE_INVITE_EXPIRED");
    }
    const candidate = (await candidateQueries.listCandidates(ctx.db, ctx.scope)).at(0) ?? null;
    if (!candidate) throwMetriqError("METRIQ_CANDIDATE_RECORD_MISSING");
    await applicationQueries.upsertAuditionApplication(
      ctx.db,
      {
        audition_id: inv.audition_id,
        workspace_id: inv.workspace_id,
        candidate_id: candidate.id,
        invite_id: inv.id,
        status: "active",
      },
      ctx.scope,
    );
    await emitInviteRedeemed(
      ctx.db,
      {
        candidateId: candidate.id,
        candidateName: candidate.full_name,
        workspaceId: inv.workspace_id,
        auditionId: inv.audition_id,
      },
      ctx.scope,
    );
    return { auditionId: inv.audition_id, workspaceId: inv.workspace_id };
  }),

  myApplications: publicProcedure.query(async ({ ctx }) => {
    if (ctx.role !== "candidate") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    const candidate = (await candidateQueries.listCandidates(ctx.db, ctx.scope)).at(0) ?? null;
    if (!candidate) return [];
    return applicationQueries.listApplicationsForCandidate(ctx.db, candidate.id, ctx.scope);
  }),
});


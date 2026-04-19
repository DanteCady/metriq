import { candidateQueries, evaluationQueries, membershipQueries, submissionQueries } from "@metriq/db";
import { z } from "zod";

import { talentPoolFiltersSchema } from "@metriq/validators";

import { emitSubmissionDecision } from "../notification-events";
import { throwMetriqError } from "../metriq-error";
import { createTRPCRouter, publicProcedure } from "../trpc";

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

  pipelineSubmissions: publicProcedure.query(async ({ ctx }) => {
    if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    if (!ctx.scope?.workspaceId) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED", { message: "Workspace required" });
    const rows = await submissionQueries.listSubmissionsByWorkspaceId(
      ctx.db,
      ctx.scope.workspaceId,
      { limit: 80, offset: 0 },
      ctx.scope,
    );
    const enriched = await Promise.all(
      rows.map(async (s) => {
        const cand = await candidateQueries.getCandidateById(ctx.db, s.candidate_id, ctx.scope);
        return {
          submissionId: s.id,
          candidateName: cand?.full_name ?? "Candidate",
          status: s.status,
          auditionId: s.audition_id,
        };
      }),
    );
    return enriched;
  }),

  workspaceMembers: publicProcedure.query(async ({ ctx }) => {
    if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    if (!ctx.scope?.workspaceId) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED");
    return membershipQueries.listMembershipByWorkspaceId(ctx.db, ctx.scope.workspaceId, ctx.scope);
  }),

  recordSubmissionDecision: publicProcedure
    .input(z.object({ submissionId: z.string().min(1), decision: z.enum(["advance", "hold", "reject"]) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
      if (!ctx.scope?.workspaceId) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED");
      const res = await submissionQueries.getSubmissionById(ctx.db, input.submissionId, ctx.scope);
      if (!res?.submission) throwMetriqError("METRIQ_SUBMISSION_NOT_FOUND");
      await emitSubmissionDecision(
        ctx.db,
        {
          candidateId: res.submission.candidate_id,
          submissionId: input.submissionId,
          decision: input.decision,
        },
        ctx.scope,
      );
      return {
        ok: true as const,
        submissionId: input.submissionId,
        decision: input.decision,
        recordedAt: new Date().toISOString(),
      };
    }),
});


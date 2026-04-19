import { candidateQueries, evaluationQueries, submissionQueries } from "@metriq/db";
import { z } from "zod";
import { submitSubmissionSchema, upsertArtifactSchema } from "@metriq/validators";

import { throwMetriqError } from "../metriq-error";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const submissionRouter = createTRPCRouter({
  getSubmission: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const res = await submissionQueries.getSubmissionById(ctx.db, input.submissionId, ctx.scope);
      if (!res) return null;

      return {
        id: res.submission.id,
        simulationId: res.submission.simulation_id ?? null,
        auditionId: res.submission.audition_id ?? null,
        candidateId: res.submission.candidate_id,
        status: res.submission.status as "draft" | "submitted",
        artifacts: res.artifacts.map((a) => ({
          id: a.id,
          type: a.kind as "text" | "link",
          label: a.label,
          content: a.content,
        })),
      };
    }),

  byCandidateId: publicProcedure
    .input(z.object({ candidateId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return submissionQueries.listSubmissionsByCandidateId(ctx.db, input.candidateId, ctx.scope);
    }),

  addArtifact: publicProcedure.input(upsertArtifactSchema).mutation(async ({ ctx, input }) => {
    if (input.artifactId) {
      throwMetriqError("METRIQ_SUBMISSION_ARTIFACT_UPDATE_UNSUPPORTED");
    }

    return submissionQueries.addSubmissionArtifact(ctx.db, {
      submission_id: input.submissionId,
      kind: input.type,
      label: input.label,
      content: input.content,
    }, ctx.scope);
  }),

  removeArtifact: publicProcedure
    .input(z.object({ submissionId: z.string().min(1), artifactId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return submissionQueries.removeSubmissionArtifact(ctx.db, input.artifactId, ctx.scope);
    }),

  submit: publicProcedure.input(submitSubmissionSchema).mutation(async ({ ctx, input }) => {
    return submissionQueries.updateSubmission(ctx.db, input.submissionId, {
      status: "submitted",
      submitted_at: new Date(),
    }, ctx.scope);
  }),

  startAuditionSubmission: publicProcedure
    .input(
      z.object({
        auditionId: z.string().uuid(),
        auditionStageId: z.string().min(1),
        candidateId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "candidate") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
      const candidateId =
        input.candidateId ?? (await candidateQueries.listCandidates(ctx.db, ctx.scope)).at(0)?.id;
      if (!candidateId) throwMetriqError("METRIQ_CANDIDATE_RECORD_MISSING");
      return submissionQueries.createAuditionSubmission(
        ctx.db,
        {
          audition_id: input.auditionId,
          audition_stage_id: input.auditionStageId,
          candidate_id: candidateId,
        },
        ctx.scope,
      );
    }),

  getResult: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const evalRes = await evaluationQueries.getEvaluationBySubmissionId(ctx.db, input.submissionId, ctx.scope);
      if (!evalRes) throwMetriqError("METRIQ_SUBMISSION_EVAL_MISSING");

      const criteria = evalRes.breakdown.map((b) => ({
        key: b.criterion_id,
        label: b.criterion_name,
        score: Number(b.score),
        max: b.criterion_max_score,
        description: undefined as string | undefined,
        weight: Number(b.criterion_weight),
      }));

      const overallScore = Number(evalRes.evaluation.overall_score);
      const maxScore = criteria.reduce((acc, c) => acc + (c.max ?? 0), 0);

      return {
        submissionId: input.submissionId,
        simulation: { id: "unknown", title: "Simulation" },
        overallScore,
        maxScore,
        summary: evalRes.evaluation.summary ?? "",
        criteria,
      };
    }),
});


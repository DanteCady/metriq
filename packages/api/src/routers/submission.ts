import { z } from "zod";

import { evaluationQueries, submissionQueries } from "@metriq/db";
import { submitSubmissionSchema, upsertArtifactSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const submissionRouter = createTRPCRouter({
  getSubmission: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const res = await submissionQueries.getSubmissionById(ctx.db, input.submissionId);
      if (!res) return null;

      return {
        id: res.submission.id,
        simulationId: res.submission.simulation_id,
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
      return submissionQueries.listSubmissionsByCandidateId(ctx.db, input.candidateId);
    }),

  addArtifact: publicProcedure.input(upsertArtifactSchema).mutation(async ({ ctx, input }) => {
    if (input.artifactId) {
      // Updating artifacts isn't implemented yet; keep DAL writes centralized.
      throw new Error("Updating an existing artifact is not supported yet.");
    }

    return submissionQueries.addSubmissionArtifact(ctx.db, {
      submission_id: input.submissionId,
      kind: input.type,
      label: input.label,
      content: input.content,
    });
  }),

  removeArtifact: publicProcedure
    .input(z.object({ submissionId: z.string().min(1), artifactId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const sub = await submissionQueries.getSubmissionById(ctx.db, input.submissionId);
      if (!sub) return null;
      return submissionQueries.removeSubmissionArtifact(ctx.db, input.artifactId);
    }),

  submit: publicProcedure.input(submitSubmissionSchema).mutation(async ({ ctx, input }) => {
    return submissionQueries.updateSubmission(ctx.db, input.submissionId, {
      status: "submitted",
      submitted_at: new Date(),
    });
  }),

  getResult: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const evalRes = await evaluationQueries.getEvaluationBySubmissionId(ctx.db, input.submissionId);
      if (!evalRes) throw new Error("No evaluation exists for this submission yet.");

      const criteria = evalRes.breakdown.map((b) => ({
        key: b.criterion_id,
        label: b.criterion_name,
        score: Number(b.score),
        max: b.criterion_max_score,
        description: undefined as string | undefined,
        weight: Number(b.criterion_weight),
      }));

      const overallScore = Number(evalRes.evaluation.overallScore);
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


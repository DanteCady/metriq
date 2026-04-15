import { z } from "zod";

import { evaluationQueries, submissionQueries } from "@metriq/db";
import { submitSubmissionSchema, upsertArtifactSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const submissionRouter = createTRPCRouter({
  byId: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    return submissionQueries.getSubmissionById(ctx.db, input.id, ctx.scope);
  }),

  byCandidateId: publicProcedure
    .input(z.object({ candidateId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return submissionQueries.listSubmissionsByCandidateId(ctx.db, input.candidateId, ctx.scope);
    }),

  addArtifact: publicProcedure.input(upsertArtifactSchema).mutation(async ({ ctx, input }) => {
    if (input.artifactId) {
      // Updating artifacts isn't implemented yet; keep DAL writes centralized.
      throw new Error("Updating an existing artifact is not supported yet.");
    }

    return submissionQueries.addSubmissionArtifact(ctx.db, {
      submission_id: input.submissionId,
      kind: input.kind,
      label: input.label,
      content: input.content,
    }, ctx.scope);
  }),

  removeArtifact: publicProcedure
    .input(z.object({ artifactId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return submissionQueries.removeSubmissionArtifact(ctx.db, input.artifactId, ctx.scope);
    }),

  submit: publicProcedure.input(submitSubmissionSchema).mutation(async ({ ctx, input }) => {
    return submissionQueries.updateSubmission(ctx.db, input.submissionId, {
      status: "submitted",
      submitted_at: new Date(),
    }, ctx.scope);
  }),

  getResult: publicProcedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return evaluationQueries.getEvaluationBySubmissionId(ctx.db, input.submissionId, ctx.scope);
    }),
});


import { z } from "zod";

export const submissionStatusSchema = z.enum(["draft", "submitted"]);

export const artifactTypeSchema = z.enum(["text", "link"]);

export const upsertArtifactSchema = z.object({
  submissionId: z.string().min(1),
  artifactId: z.string().min(1).optional(),
  type: artifactTypeSchema,
  label: z.string().min(1).max(80),
  content: z.string().min(1).max(10_000),
});

export type UpsertArtifactInput = z.infer<typeof upsertArtifactSchema>;

export const submitSubmissionSchema = z.object({
  submissionId: z.string().min(1),
});


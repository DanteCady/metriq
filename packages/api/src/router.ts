import type { Role } from "@metriq/types";
import { createSimulationSchema, submitSubmissionSchema, upsertArtifactSchema } from "@metriq/validators";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create();

function requireRole(ctx: TrpcContext, allowed: Role[]) {
  if (!allowed.includes(ctx.role)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

type Simulation = {
  id: string;
  title: string;
  type: "debug_task" | "api_design" | "pr_review" | "bug_analysis";
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  skills: string[];
  summary: string;
};

type SubmissionArtifact = {
  id: string;
  type: "text" | "link";
  label: string;
  content: string;
};

type Submission = {
  id: string;
  simulationId: string;
  candidateId: string;
  status: "draft" | "submitted";
  artifacts: SubmissionArtifact[];
};

const simulations: Simulation[] = [
  {
    id: "sim_1",
    title: "Debug a failing checkout flow",
    type: "debug_task",
    difficulty: "medium",
    estimatedMinutes: 75,
    skills: ["TypeScript", "React", "Debugging"],
    summary: "Investigate a regression, identify root cause, and propose a fix with a short write-up.",
  },
  {
    id: "sim_2",
    title: "Design an API for candidate scoring",
    type: "api_design",
    difficulty: "hard",
    estimatedMinutes: 90,
    skills: ["API Design", "tRPC", "Zod"],
    summary: "Propose endpoints/procedures, request/response schemas, and trade-offs for a scoring system.",
  },
];

const submissions = new Map<string, Submission>();

function randomId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const simulationRouter = t.router({
  list: t.procedure
    .input(z.object({}).optional())
    .query(({ ctx }) => {
      requireRole(ctx, ["candidate", "admin", "employer"]);
      return simulations;
    }),
  detail: t.procedure
    .input(z.object({ simulationId: z.string().min(1) }))
    .query(({ input, ctx }) => {
      requireRole(ctx, ["candidate", "admin", "employer"]);
      const sim = simulations.find((s) => s.id === input.simulationId);
      if (!sim) throw new TRPCError({ code: "NOT_FOUND" });
      return sim;
    }),
  startSimulation: t.procedure
    .input(z.object({ simulationId: z.string().min(1), candidateId: z.string().min(1).optional() }))
    .mutation(({ input, ctx }) => {
      requireRole(ctx, ["candidate"]);
      const sim = simulations.find((s) => s.id === input.simulationId);
      if (!sim) throw new TRPCError({ code: "NOT_FOUND" });
      const submissionId = randomId("sub");
      const submission: Submission = {
        id: submissionId,
        simulationId: sim.id,
        candidateId: input.candidateId ?? "cand_1",
        status: "draft",
        artifacts: [],
      };
      submissions.set(submissionId, submission);
      return { submissionId };
    }),
  create: t.procedure.input(createSimulationSchema).mutation(({ ctx }) => {
    requireRole(ctx, ["admin"]);
    return { ok: true };
  }),
});

export const submissionRouter = t.router({
  getSubmission: t.procedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(({ input, ctx }) => {
      requireRole(ctx, ["candidate", "admin", "employer"]);
      const sub = submissions.get(input.submissionId);
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      return sub;
    }),
  addArtifact: t.procedure.input(upsertArtifactSchema).mutation(({ input, ctx }) => {
    requireRole(ctx, ["candidate"]);
    const sub = submissions.get(input.submissionId);
    if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
    if (sub.status !== "draft") throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot edit submitted submission" });

    const id = input.artifactId ?? randomId("art");
    const existingIdx = sub.artifacts.findIndex((a) => a.id === id);
    const artifact: SubmissionArtifact = { id, type: input.type, label: input.label, content: input.content };
    if (existingIdx >= 0) sub.artifacts[existingIdx] = artifact;
    else sub.artifacts.unshift(artifact);
    submissions.set(sub.id, sub);
    return { artifactId: id };
  }),
  removeArtifact: t.procedure
    .input(z.object({ submissionId: z.string().min(1), artifactId: z.string().min(1) }))
    .mutation(({ input, ctx }) => {
      requireRole(ctx, ["candidate"]);
      const sub = submissions.get(input.submissionId);
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      if (sub.status !== "draft") throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot edit submitted submission" });
      sub.artifacts = sub.artifacts.filter((a) => a.id !== input.artifactId);
      submissions.set(sub.id, sub);
      return { ok: true };
    }),
  submit: t.procedure.input(submitSubmissionSchema).mutation(({ input, ctx }) => {
    requireRole(ctx, ["candidate"]);
    const sub = submissions.get(input.submissionId);
    if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
    sub.status = "submitted";
    submissions.set(sub.id, sub);
    return { ok: true };
  }),
  getResult: t.procedure
    .input(z.object({ submissionId: z.string().min(1) }))
    .query(({ input, ctx }) => {
      requireRole(ctx, ["candidate", "admin", "employer"]);
      const sub = submissions.get(input.submissionId);
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      const sim = simulations.find((s) => s.id === sub.simulationId);
      if (!sim) throw new TRPCError({ code: "NOT_FOUND" });

      const criteria = [
        { key: "clarity", label: "Clarity", score: 18, max: 25, description: "Communicates approach and trade-offs clearly.", weight: 1 },
        { key: "correctness", label: "Correctness", score: 42, max: 50, description: "Solution is accurate and robust.", weight: 2 },
        { key: "craft", label: "Engineering craft", score: 18, max: 25, description: "Readable structure, good boundaries, good defaults.", weight: 1 },
      ];

      return {
        submissionId: sub.id,
        simulation: { id: sim.id, title: sim.title },
        overallScore: criteria.reduce((acc, c) => acc + c.score, 0),
        maxScore: criteria.reduce((acc, c) => acc + (c.max ?? 100), 0),
        summary: "Solid work overall. Next: tighten edge cases and add a brief test plan.",
        criteria,
      };
    }),
});

export const candidateRouter = t.router({
  getDashboard: t.procedure.query(({ ctx }) => {
    requireRole(ctx, ["candidate"]);
    return {
      activeCount: 1,
      completedCount: 0,
      recentScorePercent: 84,
    };
  }),
});

export const appRouter = t.router({
  simulation: simulationRouter,
  submission: submissionRouter,
  candidate: candidateRouter,
});

export type AppRouter = typeof appRouter;


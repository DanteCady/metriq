import { auditionQueries, inviteQueries } from "@metriq/db";
import { z } from "zod";

import { emitAuditionPublished } from "../notification-events";
import { throwMetriqError } from "../metriq-error";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const auditionRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    if (!ctx.scope?.workspaceId) {
      throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED", { message: "Workspace context required" });
    }
    return auditionQueries.listAuditionsByWorkspaceId(ctx.db, ctx.scope.workspaceId, ctx.scope);
  }),

  byId: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    if (ctx.role !== "employer" && ctx.role !== "candidate" && ctx.role !== "admin") {
      throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    }
    const scope = ctx.role === "employer" ? ctx.scope : undefined;
    const row = await auditionQueries.getAuditionById(ctx.db, input.id, scope);
    if (!row) return null;
    if (ctx.role === "candidate" && row.status !== "published") return null;
    return row;
  }),

  upsertDraft: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        level: z.string(),
        template: z.string(),
        timeboxMinutes: z.number(),
        stages: z.array(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
      if (!ctx.scope?.workspaceId) {
        throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED", {
          message: "Open this flow from a department workspace",
        });
      }
      const definition = { stages: input.stages };
      return auditionQueries.upsertAuditionDraft(
        ctx.db,
        {
          id: input.id,
          workspace_id: ctx.scope.workspaceId,
          title: input.title,
          level: input.level,
          template: input.template,
          timebox_minutes: input.timeboxMinutes,
          definition,
        },
        ctx.scope,
      );
    }),

  publish: publicProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
    if (!ctx.scope?.workspaceId) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED");
    const row = await auditionQueries.publishAudition(ctx.db, input.id, ctx.scope.workspaceId, ctx.scope);
    if (!row) throwMetriqError("METRIQ_AUDITION_NOT_FOUND");
    await emitAuditionPublished(
      ctx.db,
      { workspaceId: ctx.scope.workspaceId, auditionId: row.id, auditionTitle: row.title },
      ctx.scope,
    );
    return row;
  }),

  createInvite: publicProcedure
    .input(z.object({ auditionId: z.string().uuid(), email: z.string().email().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "employer") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
      if (!ctx.scope?.workspaceId) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED");
      const aud = await auditionQueries.getAuditionById(ctx.db, input.auditionId, ctx.scope);
      if (!aud) throwMetriqError("METRIQ_AUDITION_NOT_FOUND");
      return inviteQueries.createAuditionInvite(
        ctx.db,
        {
          audition_id: aud.id,
          workspace_id: aud.workspace_id,
          email: input.email ?? null,
        },
        ctx.scope,
      );
    }),
});

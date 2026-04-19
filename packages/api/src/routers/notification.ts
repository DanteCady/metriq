import { candidateQueries, employerQueries, notificationQueries, type NotificationRow } from "@metriq/db";
import { z } from "zod";

import type { TrpcContext } from "../context";
import { createTRPCRouter, publicProcedure } from "../trpc";

function mapRow(row: NotificationRow) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    body: row.body,
    linkHref: row.link_href,
    read: row.read_at !== null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

function workspaceFilterFromScope(scope: TrpcContext["scope"]) {
  return { workspaceId: scope?.workspaceId ?? undefined };
}

async function resolveRecipient(ctx: TrpcContext) {
  if (ctx.role === "candidate") {
    const c = (await candidateQueries.listCandidates(ctx.db, ctx.scope)).at(0);
    return c ? ({ kind: "candidate" as const, id: c.id }) : null;
  }
  if (ctx.role === "employer") {
    const companyId = ctx.scope?.companyId;
    if (!companyId) return null;
    const e = (await employerQueries.listEmployersByCompany(ctx.db, companyId, ctx.scope)).at(0);
    return e ? ({ kind: "employer" as const, id: e.id }) : null;
  }
  return null;
}

export const notificationRouter = createTRPCRouter({
  /** In-app inbox + unread count for the current session recipient. */
  inbox: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(40) }))
    .query(async ({ ctx, input }) => {
      if (ctx.role === "admin") {
        return { items: [] as ReturnType<typeof mapRow>[], unreadCount: 0 };
      }
      const recipient = await resolveRecipient(ctx);
      if (!recipient) {
        return { items: [] as ReturnType<typeof mapRow>[], unreadCount: 0 };
      }
      const filters = workspaceFilterFromScope(ctx.scope);
      if (recipient.kind === "candidate") {
        const [items, unreadCount] = await Promise.all([
          notificationQueries.listNotificationsForCandidate(ctx.db, recipient.id, { limit: input.limit }, ctx.scope),
          notificationQueries.countUnreadForCandidate(ctx.db, recipient.id, ctx.scope),
        ]);
        return { items: items.map(mapRow), unreadCount };
      }
      const [items, unreadCount] = await Promise.all([
        notificationQueries.listNotificationsForEmployer(ctx.db, recipient.id, filters, { limit: input.limit }, ctx.scope),
        notificationQueries.countUnreadForEmployer(ctx.db, recipient.id, filters, ctx.scope),
      ]);
      return { items: items.map(mapRow), unreadCount };
    }),

  markRead: publicProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const recipient = await resolveRecipient(ctx);
    if (!recipient || ctx.role === "admin") return { ok: false as const };
    await notificationQueries.markNotificationRead(ctx.db, input.id, recipient, ctx.scope);
    return { ok: true as const };
  }),

  markAllRead: publicProcedure.mutation(async ({ ctx }) => {
    const recipient = await resolveRecipient(ctx);
    if (!recipient || ctx.role === "admin") return { ok: false as const };
    const filters = workspaceFilterFromScope(ctx.scope);
    if (recipient.kind === "candidate") {
      await notificationQueries.markAllReadForCandidate(ctx.db, recipient.id, ctx.scope);
    } else {
      await notificationQueries.markAllReadForEmployer(ctx.db, recipient.id, filters, ctx.scope);
    }
    return { ok: true as const };
  }),

  /**
   * Creates a durable in-app notification for the current recipient (e.g. after a successful user action).
   * Does not send email; use for product-grade inbox alongside toasts.
   */
  create: publicProcedure
    .input(
      z.object({
        category: z.string().min(1).max(120).default("app.client"),
        title: z.string().min(1).max(200),
        body: z.string().min(1).max(4000),
        linkHref: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.role === "admin") {
        return { id: null as string | null };
      }
      const recipient = await resolveRecipient(ctx);
      if (!recipient) {
        return { id: null as string | null };
      }
      const row = await notificationQueries.insertNotification(
        ctx.db,
        {
          candidate_id: recipient.kind === "candidate" ? recipient.id : null,
          employer_id: recipient.kind === "employer" ? recipient.id : null,
          workspace_id: ctx.scope?.workspaceId ?? null,
          category: input.category,
          title: input.title,
          body: input.body,
          link_href: input.linkHref ?? null,
          read_at: null,
          metadata: null,
        },
        ctx.scope,
      );
      return { id: row.id };
    }),
});

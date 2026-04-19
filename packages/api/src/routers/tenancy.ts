import { z } from "zod";

import { companyQueries, workspaceQueries } from "@metriq/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const tenancyRouter = createTRPCRouter({
  getOrgBySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(async ({ ctx, input }) => {
    return companyQueries.getCompanyBySlug(ctx.db, input.slug, ctx.scope);
  }),

  listWorkspaces: publicProcedure.input(z.object({ orgSlug: z.string().min(1) })).query(async ({ ctx, input }) => {
    const company = await companyQueries.getCompanyBySlug(ctx.db, input.orgSlug, ctx.scope);
    if (!company) return [];
    return workspaceQueries.listWorkspacesByCompanyId(ctx.db, company.id, ctx.scope);
  }),

  resolveWorkspace: publicProcedure
    .input(z.object({ orgSlug: z.string().min(1), workspaceSlug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const company = await companyQueries.getCompanyBySlug(ctx.db, input.orgSlug, ctx.scope);
      if (!company) return null;
      const workspace = await workspaceQueries.getWorkspaceByCompanyAndSlug(
        ctx.db,
        company.id,
        input.workspaceSlug,
        ctx.scope,
      );
      if (!workspace) return null;
      return {
        company: { id: company.id, name: company.name, slug: company.slug },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          status: workspace.status,
          seatLimit: workspace.seat_limit,
          seatsUsed: workspace.seats_used,
        },
      };
    }),
});

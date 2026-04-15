import { z } from "zod";

import { simulationQueries } from "@metriq/db";
import { createSimulationSchema } from "@metriq/validators";

import { createTRPCRouter, publicProcedure } from "../trpc.js";

export const simulationRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return simulationQueries.listSimulations(ctx.db);
  }),

  detail: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    return simulationQueries.getSimulationDetail(ctx.db, input.id);
  }),

  create: publicProcedure.input(createSimulationSchema).mutation(async ({ ctx, input }) => {
    return simulationQueries.createSimulation(ctx.db, {
      title: input.title,
      summary: input.summary,
      simulation_type: input.simulationType,
      difficulty: input.difficulty,
      estimated_minutes: input.estimatedMinutes,
      skills: input.skills.length > 0 ? input.skills : null,
    });
  }),
});


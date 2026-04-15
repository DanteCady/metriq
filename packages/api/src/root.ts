import { createTRPCRouter } from "./trpc.js";
import { candidateRouter } from "./routers/candidate.js";
import { simulationRouter } from "./routers/simulation.js";
import { submissionRouter } from "./routers/submission.js";

export const appRouter = createTRPCRouter({
  candidate: candidateRouter,
  simulation: simulationRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;


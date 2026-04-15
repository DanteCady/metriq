import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { candidateRouter } from "./routers/candidate";
import { employerRouter } from "./routers/employer";
import { simulationRouter } from "./routers/simulation";
import { submissionRouter } from "./routers/submission";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  candidate: candidateRouter,
  employer: employerRouter,
  simulation: simulationRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;


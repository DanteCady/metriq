import { createTRPCRouter } from "./trpc.js";
import { adminRouter } from "./routers/admin.js";
import { candidateRouter } from "./routers/candidate.js";
import { employerRouter } from "./routers/employer.js";
import { simulationRouter } from "./routers/simulation.js";
import { submissionRouter } from "./routers/submission.js";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  candidate: candidateRouter,
  employer: employerRouter,
  simulation: simulationRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;


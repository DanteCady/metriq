import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { auditionRouter } from "./routers/audition";
import { candidateRouter } from "./routers/candidate";
import { employerRouter } from "./routers/employer";
import { notificationRouter } from "./routers/notification";
import { simulationRouter } from "./routers/simulation";
import { submissionRouter } from "./routers/submission";
import { tenancyRouter } from "./routers/tenancy";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  audition: auditionRouter,
  candidate: candidateRouter,
  employer: employerRouter,
  notification: notificationRouter,
  simulation: simulationRouter,
  submission: submissionRouter,
  tenancy: tenancyRouter,
});

export type AppRouter = typeof appRouter;


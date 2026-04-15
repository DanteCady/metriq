import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { ApiContext } from "./context.js";

const t = initTRPC.context<ApiContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;


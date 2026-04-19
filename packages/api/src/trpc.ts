import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { MetriqErrorCode } from "@metriq/types";

import type { TrpcContext } from "./context";
import type { MetriqTrpcCause } from "./metriq-error";
import { logServerMetriq, throwMetriqError } from "./metriq-error";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error instanceof TRPCError) {
      const c = error.cause as MetriqTrpcCause | undefined;
      if (c?.metriqCode) {
        return {
          ...shape,
          data: {
            ...shape.data,
            metriqCode: c.metriqCode as MetriqErrorCode,
          },
        };
      }
      if (error.code === "INTERNAL_SERVER_ERROR") {
        logServerMetriq("error", "METRIQ_INTERNAL_UNEXPECTED", {
          trpcMessage: error.message,
        });
      }
    }
    return shape;
  },
});

const adminMiddleware = t.middleware(({ ctx, next }) => {
  if (ctx.role !== "admin") throwMetriqError("METRIQ_AUTH_FORBIDDEN_ROLE");
  if (!process.env.METRIQ_ADMIN_API_KEY?.trim()) {
    throwMetriqError("METRIQ_ADMIN_API_DISABLED", {
      message: "Admin API disabled (set METRIQ_ADMIN_API_KEY)",
    });
  }
  return next({ ctx });
});

const authenticatedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.authSession) throwMetriqError("METRIQ_AUTH_UNAUTHORIZED");
  return next({ ctx: { ...ctx, authSession: ctx.authSession } });
});

const employerWorkspaceMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.employerScope) throwMetriqError("METRIQ_WORKSPACE_CONTEXT_REQUIRED");
  return next({ ctx });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(authenticatedMiddleware);
export const employerWorkspaceProcedure = t.procedure.use(authenticatedMiddleware).use(employerWorkspaceMiddleware);
export const adminProcedure = t.procedure.use(adminMiddleware);


import { appRouter } from "@metriq/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { buildTrpcContextFromRequest } from "@/lib/trpc/build-context";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => buildTrpcContextFromRequest(req),
  });
}

export { handler as GET, handler as POST };

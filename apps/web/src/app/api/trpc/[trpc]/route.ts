import { appRouter, createTrpcContext } from "@metriq/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function handler(req: Request) {
  const roleHeader = req.headers.get("x-metriq-role") ?? undefined;
  const role = roleHeader === "admin" || roleHeader === "employer" || roleHeader === "candidate" ? roleHeader : undefined;

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTrpcContext({ role }),
  });
}

export { handler as GET, handler as POST };


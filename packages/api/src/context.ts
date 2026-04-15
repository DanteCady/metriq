import type { Role } from "@metriq/types";

export type TrpcContext = {
  role: Role;
};

export function createTrpcContext(opts?: { role?: Role }): TrpcContext {
  return { role: opts?.role ?? "candidate" };
}


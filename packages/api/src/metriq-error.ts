import { TRPCError } from "@trpc/server";

import { METRIQ_ERRORS, type MetriqErrorCode } from "@metriq/types";

export type MetriqTrpcCause = {
  metriqCode: MetriqErrorCode;
  /** Optional original error for server logs only (not sent to client) */
  original?: unknown;
};

export function logServerMetriq(
  level: "warn" | "error",
  code: MetriqErrorCode | string,
  meta?: Record<string, unknown>,
) {
  const line = JSON.stringify({
    scope: "metriq.api",
    level,
    metriqCode: code,
    ts: new Date().toISOString(),
    ...meta,
  });
  if (level === "error") console.error(line);
  else console.warn(line);
}

/**
 * Preferred way to fail a procedure with a documented Metriq code.
 * The tRPC `errorFormatter` exposes `data.metriqCode` to the client.
 */
export function throwMetriqError(
  code: MetriqErrorCode,
  opts?: { message?: string; cause?: unknown; logMeta?: Record<string, unknown> },
): never {
  const def = METRIQ_ERRORS[code];
  logServerMetriq(def.logLevel, code, opts?.logMeta);
  const cause: MetriqTrpcCause = { metriqCode: code, original: opts?.cause };
  throw new TRPCError({
    code: def.trpc,
    message: opts?.message ?? def.defaultMessage,
    cause,
  });
}

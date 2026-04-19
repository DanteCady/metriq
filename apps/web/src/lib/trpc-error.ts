import type { TRPCClientError } from "@trpc/client";

import type { AppRouter } from "@metriq/api";
import { METRIQ_ERRORS, type MetriqErrorCode, isMetriqErrorCode } from "@metriq/types";

type TrpcErrorData = { metriqCode?: string };

export function getMetriqCodeFromUnknown(err: unknown): MetriqErrorCode | undefined {
  const e = err as TRPCClientError<AppRouter>;
  const data = e?.data as TrpcErrorData | undefined;
  const raw = data?.metriqCode;
  if (typeof raw === "string" && isMetriqErrorCode(raw)) return raw;
  return undefined;
}

/** Prefer server-provided message; fall back to registry default for known codes. */
export function getTrpcUserMessage(err: unknown, fallback: string): string {
  const e = err as TRPCClientError<AppRouter>;
  if (typeof e?.message === "string" && e.message.length > 0) return e.message;
  const code = getMetriqCodeFromUnknown(err);
  if (code) return METRIQ_ERRORS[code].defaultMessage;
  return fallback;
}

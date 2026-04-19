import type { MetriqErrorCode } from "@metriq/types";

function serializeError(err: unknown) {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return err;
}

/**
 * Structured client-side error logging. Swap implementation for a telemetry sink later.
 */
export function logClientError(
  message: string,
  err?: unknown,
  meta?: { metriqCode?: MetriqErrorCode } & Record<string, unknown>,
) {
  const payload = {
    scope: "metriq.web",
    level: "error" as const,
    message,
    error: err !== undefined ? serializeError(err) : undefined,
    ...meta,
    ts: new Date().toISOString(),
  };
  if (process.env.NODE_ENV === "development") {
    console.error("[Metriq]", payload);
  } else {
    console.error(JSON.stringify(payload));
  }
}

export function logClientWarn(message: string, meta?: Record<string, unknown>) {
  const payload = { scope: "metriq.web", level: "warn" as const, message, ...meta, ts: new Date().toISOString() };
  if (process.env.NODE_ENV === "development") {
    console.warn("[Metriq]", payload);
  } else {
    console.warn(JSON.stringify(payload));
  }
}

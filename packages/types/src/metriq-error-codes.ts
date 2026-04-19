/**
 * Metriq domain error codes. Human-oriented reference: docs/error-codes.md
 * Every API rejection that should be actionable in the product should use one of these
 * (not ad-hoc strings or generic TRPC messages alone).
 */

export type MetriqTrpcCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PRECONDITION_FAILED"
  | "INTERNAL_SERVER_ERROR";

export type MetriqErrorDefinition = {
  /** Stable identifier; listed in docs/error-codes.md */
  code: string;
  /** Maps to @trpc/server TRPCError `code` */
  trpc: MetriqTrpcCode;
  /** Default safe user-facing message (override per call when needed) */
  defaultMessage: string;
  logLevel: "warn" | "error";
};

export const METRIQ_ERRORS = {
  METRIQ_AUTH_UNAUTHORIZED: {
    code: "METRIQ_AUTH_UNAUTHORIZED",
    trpc: "UNAUTHORIZED",
    defaultMessage: "Sign in to continue.",
    logLevel: "warn",
  },
  METRIQ_AUTH_FORBIDDEN_ROLE: {
    code: "METRIQ_AUTH_FORBIDDEN_ROLE",
    trpc: "FORBIDDEN",
    defaultMessage: "You do not have access to this action.",
    logLevel: "warn",
  },
  METRIQ_WORKSPACE_CONTEXT_REQUIRED: {
    code: "METRIQ_WORKSPACE_CONTEXT_REQUIRED",
    trpc: "BAD_REQUEST",
    defaultMessage: "Open this from a department workspace.",
    logLevel: "warn",
  },
  METRIQ_ADMIN_API_DISABLED: {
    code: "METRIQ_ADMIN_API_DISABLED",
    trpc: "FORBIDDEN",
    defaultMessage: "Admin API is disabled on this deployment.",
    logLevel: "warn",
  },
  METRIQ_CANDIDATE_INVITE_NOT_FOUND: {
    code: "METRIQ_CANDIDATE_INVITE_NOT_FOUND",
    trpc: "NOT_FOUND",
    defaultMessage: "That invite link is not valid.",
    logLevel: "warn",
  },
  METRIQ_CANDIDATE_INVITE_EXPIRED: {
    code: "METRIQ_CANDIDATE_INVITE_EXPIRED",
    trpc: "BAD_REQUEST",
    defaultMessage: "This invite has expired.",
    logLevel: "warn",
  },
  METRIQ_CANDIDATE_RECORD_MISSING: {
    code: "METRIQ_CANDIDATE_RECORD_MISSING",
    trpc: "PRECONDITION_FAILED",
    defaultMessage: "No candidate profile is available for this session.",
    logLevel: "error",
  },
  METRIQ_AUDITION_NOT_FOUND: {
    code: "METRIQ_AUDITION_NOT_FOUND",
    trpc: "NOT_FOUND",
    defaultMessage: "That audition could not be found.",
    logLevel: "warn",
  },
  METRIQ_SUBMISSION_NOT_FOUND: {
    code: "METRIQ_SUBMISSION_NOT_FOUND",
    trpc: "NOT_FOUND",
    defaultMessage: "That submission could not be found.",
    logLevel: "warn",
  },
  METRIQ_SUBMISSION_ARTIFACT_UPDATE_UNSUPPORTED: {
    code: "METRIQ_SUBMISSION_ARTIFACT_UPDATE_UNSUPPORTED",
    trpc: "BAD_REQUEST",
    defaultMessage: "Updating this artifact is not supported yet.",
    logLevel: "warn",
  },
  METRIQ_SUBMISSION_EVAL_MISSING: {
    code: "METRIQ_SUBMISSION_EVAL_MISSING",
    trpc: "PRECONDITION_FAILED",
    defaultMessage: "No evaluation exists for this submission yet.",
    logLevel: "warn",
  },
  METRIQ_SIMULATION_NO_CANDIDATES: {
    code: "METRIQ_SIMULATION_NO_CANDIDATES",
    trpc: "PRECONDITION_FAILED",
    defaultMessage: "No candidates exist to start a simulation.",
    logLevel: "warn",
  },
  METRIQ_INTERNAL_UNEXPECTED: {
    code: "METRIQ_INTERNAL_UNEXPECTED",
    trpc: "INTERNAL_SERVER_ERROR",
    defaultMessage: "Something went wrong. Try again shortly.",
    logLevel: "error",
  },
} as const satisfies Record<string, MetriqErrorDefinition>;

export type MetriqErrorCode = keyof typeof METRIQ_ERRORS;

export function isMetriqErrorCode(value: string): value is MetriqErrorCode {
  return value in METRIQ_ERRORS;
}

/**
 * Session bridge for Phase 8 (Better Auth or similar).
 *
 * Today: routing uses the `metriq.role` cookie (`apps/web/middleware.ts`).
 * Next: validate JWT/session here and map to org/workspace membership.
 */
import type { Role } from "@metriq/types";

export type SessionPreview = {
  role: Role;
  /** Future: user id from IdP */
  subject?: string;
};

export function getPreviewSessionFromRoleCookie(cookieRole: string | undefined): SessionPreview | null {
  if (cookieRole === "candidate" || cookieRole === "employer" || cookieRole === "admin") {
    return { role: cookieRole };
  }
  return null;
}

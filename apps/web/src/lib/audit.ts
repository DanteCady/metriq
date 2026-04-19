/**
 * Hiring audit trail — persist to `audit_log` table + structured logs when schema lands.
 */
export function logHiringAction(_input: {
  action: string;
  workspaceId?: string;
  actor?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[audit]", _input);
  }
}

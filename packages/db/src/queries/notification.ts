import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, NewNotification, Uuid } from "../types";

export type NotificationListFilters = {
  /** When set (dept workspace), include org-wide (`workspace_id` null) and this workspace. */
  workspaceId?: Uuid | null;
};

export async function countUnreadForCandidate(db: Kysely<Database>, candidateId: Uuid, _scope?: DbScope) {
  const row = await db
    .selectFrom("notification")
    .select((eb) => eb.fn.countAll<number>().as("c"))
    .where("candidate_id", "=", candidateId)
    .where("read_at", "is", null)
    .executeTakeFirstOrThrow();
  return Number(row.c ?? 0);
}

export async function countUnreadForEmployer(
  db: Kysely<Database>,
  employerId: Uuid,
  filters: NotificationListFilters,
  _scope?: DbScope,
) {
  let q = db
    .selectFrom("notification")
    .select((eb) => eb.fn.countAll<number>().as("c"))
    .where("employer_id", "=", employerId)
    .where("read_at", "is", null);

  if (filters.workspaceId) {
    q = q.where((eb) =>
      eb.or([eb("workspace_id", "is", null), eb("workspace_id", "=", filters.workspaceId!)]),
    );
  }

  const row = await q.executeTakeFirstOrThrow();
  return Number(row.c ?? 0);
}

export async function listNotificationsForCandidate(
  db: Kysely<Database>,
  candidateId: Uuid,
  opts: { limit: number },
  _scope?: DbScope,
) {
  return db
    .selectFrom("notification")
    .selectAll()
    .where("candidate_id", "=", candidateId)
    .orderBy("created_at", "desc")
    .limit(opts.limit)
    .execute();
}

export async function listNotificationsForEmployer(
  db: Kysely<Database>,
  employerId: Uuid,
  filters: NotificationListFilters,
  opts: { limit: number },
  _scope?: DbScope,
) {
  let q = db
    .selectFrom("notification")
    .selectAll()
    .where("employer_id", "=", employerId)
    .orderBy("created_at", "desc")
    .limit(opts.limit);

  if (filters.workspaceId) {
    q = q.where((eb) =>
      eb.or([eb("workspace_id", "is", null), eb("workspace_id", "=", filters.workspaceId!)]),
    );
  }

  return q.execute();
}

export async function markNotificationRead(
  db: Kysely<Database>,
  id: Uuid,
  recipient: { kind: "candidate"; id: Uuid } | { kind: "employer"; id: Uuid },
  _scope?: DbScope,
) {
  let q = db
    .updateTable("notification")
    .set({ read_at: new Date() })
    .where("id", "=", id)
    .where("read_at", "is", null);

  if (recipient.kind === "candidate") {
    q = q.where("candidate_id", "=", recipient.id);
  } else {
    q = q.where("employer_id", "=", recipient.id);
  }

  return q.executeTakeFirst();
}

export async function markAllReadForCandidate(db: Kysely<Database>, candidateId: Uuid, _scope?: DbScope) {
  return db
    .updateTable("notification")
    .set({ read_at: new Date() })
    .where("candidate_id", "=", candidateId)
    .where("read_at", "is", null)
    .executeTakeFirst();
}

export async function markAllReadForEmployer(
  db: Kysely<Database>,
  employerId: Uuid,
  filters: NotificationListFilters,
  _scope?: DbScope,
) {
  let q = db
    .updateTable("notification")
    .set({ read_at: new Date() })
    .where("employer_id", "=", employerId)
    .where("read_at", "is", null);

  if (filters.workspaceId) {
    q = q.where((eb) =>
      eb.or([eb("workspace_id", "is", null), eb("workspace_id", "=", filters.workspaceId!)]),
    );
  }

  return q.executeTakeFirst();
}

export async function insertNotification(db: Kysely<Database>, row: NewNotification, _scope?: DbScope) {
  return db.insertInto("notification").values(row).returningAll().executeTakeFirstOrThrow();
}

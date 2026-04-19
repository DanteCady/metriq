import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, Uuid } from "../types";

export async function listMembershipByWorkspaceId(
  db: Kysely<Database>,
  workspaceId: Uuid,
  _scope?: DbScope,
) {
  return db
    .selectFrom("workspace_membership")
    .selectAll()
    .where("workspace_id", "=", workspaceId)
    .orderBy("email", "asc")
    .execute();
}

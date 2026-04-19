import { randomBytes } from "node:crypto";

import type { Kysely } from "kysely";

import type { DbScope } from "../scope";
import type { Database, Uuid } from "../types";

export async function createAuditionInvite(
  db: Kysely<Database>,
  input: {
    audition_id: Uuid;
    workspace_id: Uuid;
    email?: string | null;
    expiresAt?: Date | null;
  },
  _scope?: DbScope,
) {
  const token = randomBytes(24).toString("hex");
  return db
    .insertInto("audition_invite")
    .values({
      token,
      audition_id: input.audition_id,
      workspace_id: input.workspace_id,
      email: input.email ?? null,
      expires_at: input.expiresAt ?? null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getInviteByToken(db: Kysely<Database>, token: string, _scope?: DbScope) {
  return db.selectFrom("audition_invite").selectAll().where("token", "=", token).executeTakeFirst();
}

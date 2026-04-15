import type { Kysely } from "kysely";

import type { DbScope } from "../scope.js";
import type { CandidateUpdate, Database, NewCandidate, Uuid } from "../types.js";

export type TalentPoolFilters = {
  search?: string;
  sort: "score_desc" | "score_asc" | "recent_desc";
  pagination: { limit: number; offset: number };
  // placeholders for future joins
  minScore?: number;
  role?: string;
  skills?: string[];
};

export async function getCandidateById(db: Kysely<Database>, id: Uuid, _scope?: DbScope) {
  return db.selectFrom("candidate").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function listCandidates(db: Kysely<Database>, _scope?: DbScope) {
  return db.selectFrom("candidate").selectAll().orderBy("created_at", "desc").execute();
}

export async function createCandidate(db: Kysely<Database>, input: NewCandidate, _scope?: DbScope) {
  return db.insertInto("candidate").values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateCandidate(
  db: Kysely<Database>,
  id: Uuid,
  patch: CandidateUpdate,
  _scope?: DbScope,
) {
  return db
    .updateTable("candidate")
    .set(patch)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function getCandidateDashboardStats(db: Kysely<Database>, candidateId: Uuid, _scope?: DbScope) {
  const rows = await db
    .selectFrom("submission")
    .select(["status"])
    .where("candidate_id", "=", candidateId)
    .execute();

  const totalSubmissions = rows.length;
  const drafts = rows.filter((r) => r.status === "draft").length;
  const submitted = rows.filter((r) => r.status === "submitted").length;

  return { totalSubmissions, drafts, submitted };
}

export async function listTalentPool(
  db: Kysely<Database>,
  filters: TalentPoolFilters,
  _scope?: DbScope,
) {
  const q = (filters.search ?? "").trim();
  const like = q.length > 0 ? `%${q}%` : null;

  const base = db.selectFrom("candidate");

  const filtered =
    like === null
      ? base
      : base.where((eb) =>
          eb.or([
            eb("candidate.full_name", "ilike", like),
            eb("candidate.email", "ilike", like),
          ]),
        );

  const totalRow = await filtered
    .select((eb) => eb.fn.countAll<number>().as("total"))
    .executeTakeFirstOrThrow();

  const total = Number(totalRow.total ?? 0);

  // Sorting placeholder: without score joins, treat score sorts as "recent".
  const sort = filters.sort;
  const orderByRecent = sort === "recent_desc" || sort === "score_desc" || sort === "score_asc";

  const items = await filtered
    .selectAll()
    .orderBy("created_at", orderByRecent ? "desc" : "desc")
    .limit(filters.pagination.limit)
    .offset(filters.pagination.offset)
    .execute();

  return { total, items };
}


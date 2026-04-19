import { daysAgo } from "./lib";
import type { SeedContext } from "./context";
import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx, ctx: SeedContext): Promise<void> {
  const ava = ctx.candidates.find((c) => c.email === "ava.candidate@example")!;
  const diego = ctx.candidates.find((c) => c.email === "diego.candidate@example")!;
  const jordan = ctx.candidates.find((c) => c.email === "jordan.candidate@example")!;

  const draftSubmission = await trx
    .insertInto("submission")
    .values({
      candidate_id: ava.id,
      simulation_id: ctx.simBugHunt.id,
      status: "draft",
      started_at: daysAgo(1),
      submitted_at: null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx.insertInto("submission_artifact").values([
    {
      submission_id: draftSubmission.id,
      kind: "text",
      label: "Root cause analysis",
      content:
        "Retries never stop because the handler throws after persisting success; the ack is never returned so the provider retries.",
    },
  ]).execute();

  const submittedNoEval = await trx
    .insertInto("submission")
    .values({
      candidate_id: jordan.id,
      simulation_id: ctx.simPrReview.id,
      status: "submitted",
      started_at: daysAgo(3),
      submitted_at: daysAgo(2),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx.insertInto("submission_artifact").values([
    {
      submission_id: submittedNoEval.id,
      kind: "text",
      label: "Review notes",
      content:
        "Good decomposition overall, but the state machine can loop on refetch; suggest using a single source of truth and debounced filters.",
    },
  ]).execute();

  const submittedEval = await trx
    .insertInto("submission")
    .values({
      candidate_id: diego.id,
      simulation_id: ctx.simApiDesign.id,
      status: "submitted",
      started_at: daysAgo(10),
      submitted_at: daysAgo(9),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx.insertInto("submission_artifact").values([
    {
      submission_id: submittedEval.id,
      kind: "text",
      label: "API spec",
      content:
        "GET /reports/events?from=...&to=...&groupBy=...&cursor=... Returns aggregates; tenant derived from auth context (future).",
    },
    {
      submission_id: submittedEval.id,
      kind: "text",
      label: "Schema sketch",
      content:
        "events(tenant_id, occurred_at, type, ...), rollups(tenant_id, day, type, count). Index on (tenant_id, occurred_at).",
    },
  ]).execute();

  const evaluation = await trx
    .insertInto("evaluation")
    .values({
      submission_id: submittedEval.id,
      overall_score: "4.15",
      summary:
        "Strong data modeling instincts and thoughtful pagination. A bit light on error cases and consistency guarantees.",
      evaluated_at: daysAgo(8),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const rubricForSim2 = ctx.rubricRows.find((r) => r.simulation_id === ctx.simApiDesign.id)!;
  const criteriaForSim2 = ctx.criteria.filter((c) => c.rubric_id === rubricForSim2.id);

  const scores: Array<{ position: number; score: string; notes: string }> = [
    { position: 1, score: "4.50", notes: "Clear contract and correct approach." },
    { position: 2, score: "4.00", notes: "Well structured; a few ambiguous terms." },
    { position: 3, score: "4.25", notes: "Good trade-offs, realistic scope." },
    { position: 4, score: "3.50", notes: "Could add more about consistency + caching." },
  ];

  await trx
    .insertInto("score_breakdown")
    .values(
      scores.map((s) => {
        const criterion = criteriaForSim2.find((c) => c.position === s.position)!;
        return {
          evaluation_id: evaluation.id,
          criterion_id: criterion.id,
          score: s.score,
          notes: s.notes,
        };
      }),
    )
    .execute();
}

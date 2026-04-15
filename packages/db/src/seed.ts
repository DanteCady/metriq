import "dotenv/config";

import { sql } from "kysely";

import { createDb } from "./db.js";

type RequiredArtifact =
  | { kind: "link"; label: string }
  | { kind: "text"; label: string }
  | { kind: "fileRef"; label: string };

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function reset(db: ReturnType<typeof createDb>) {
  await sql`
    truncate table
      score_breakdown,
      evaluation,
      submission_artifact,
      submission,
      rubric_criterion,
      rubric,
      simulation_section,
      simulation,
      employer,
      company,
      candidate
    restart identity
    cascade;
  `.execute(db);
}

export async function seed() {
  const db = createDb();
  try {
    await db.transaction().execute(async (trx) => {
      await reset(trx);

      const companies = await trx
        .insertInto("company")
        .values([{ name: "Acme Analytics" }, { name: "Northwind Systems" }])
        .returningAll()
        .execute();

      const acme = companies[0]!;
      const northwind = companies[1]!;

      await trx.insertInto("employer").values([
        { company_id: acme.id, email: "morgan@acme.example", full_name: "Morgan Lee" },
        { company_id: acme.id, email: "priya@acme.example", full_name: "Priya Shah" },
        { company_id: northwind.id, email: "sam@nws.example", full_name: "Sam Rivera" },
      ]).execute();

      const candidates = await trx
        .insertInto("candidate")
        .values([
          {
            email: "ava.candidate@example",
            full_name: "Ava Chen",
            headline: "Full-stack engineer • React/Node",
            bio: "Shipped B2B SaaS features, comfortable across product + infra.",
          },
          {
            email: "diego.candidate@example",
            full_name: "Diego Martínez",
            headline: "Backend engineer • TypeScript/Postgres",
            bio: "Enjoys data modeling, performance, and pragmatic APIs.",
          },
          {
            email: "jordan.candidate@example",
            full_name: "Jordan Kim",
            headline: "Frontend engineer • Design systems",
            bio: "Builds polished UI systems and reliable component libraries.",
          },
          {
            email: "no-submissions@example",
            full_name: "Casey Patel",
            headline: "New to Metriq",
            bio: "Just signed up — no submissions yet.",
          },
        ])
        .returningAll()
        .execute();

      const simulations = await trx
        .insertInto("simulation")
        .values([
          {
            title: "Bug Hunt: Payments webhook retries",
            summary: "Diagnose why retries never stop and propose a safe fix.",
            simulation_type: "debug_task",
            difficulty: "medium",
            estimated_minutes: 60,
            skills: ["debugging", "node", "postgres"],
          },
          {
            title: "API Design: Multi-tenant reporting endpoint",
            summary: "Design an analytics endpoint with filters, pagination, and tenant scoping assumptions.",
            simulation_type: "api_design",
            difficulty: "hard",
            estimated_minutes: 75,
            skills: ["api", "data-modeling", "security"],
          },
          {
            title: "PR Review: UI state + data fetching",
            summary: "Review state/data-fetching changes and flag correctness and UX issues.",
            simulation_type: "pr_review",
            difficulty: "easy",
            estimated_minutes: 40,
            skills: ["react", "typescript", "ux"],
          },
        ])
        .returningAll()
        .execute();

      const simBugHunt = simulations[0]!;
      const simApiDesign = simulations[1]!;
      const simPrReview = simulations[2]!;

      const sectionDefs: Array<{
        simulationId: string;
        position: number;
        title: string;
        prompt: string;
        requiredArtifacts: RequiredArtifact[];
      }> = [
        {
          simulationId: simBugHunt.id,
          position: 1,
          title: "Repro + hypothesis",
          prompt:
            "You’re paged: the webhook handler is retrying forever. Find the bug and explain why retries never stop.",
          requiredArtifacts: [
            { kind: "text", label: "Root cause analysis" },
            { kind: "link", label: "Proposed fix PR (link)" },
          ],
        },
        {
          simulationId: simBugHunt.id,
          position: 2,
          title: "Fix plan",
          prompt:
            "Propose changes to ensure idempotency and correct retry semantics. Include DB constraints where relevant.",
          requiredArtifacts: [{ kind: "text", label: "Fix plan" }],
        },
        {
          simulationId: simApiDesign.id,
          position: 1,
          title: "Endpoint contract",
          prompt:
            "Design an endpoint for multi-tenant analytics. Define request/response, filters, pagination, and authorization assumptions.",
          requiredArtifacts: [{ kind: "text", label: "API spec" }],
        },
        {
          simulationId: simApiDesign.id,
          position: 2,
          title: "Schema sketch",
          prompt:
            "Sketch the minimal tables/indices needed for the reporting query and how you would enforce tenant scoping later.",
          requiredArtifacts: [{ kind: "text", label: "Schema sketch" }],
        },
        {
          simulationId: simPrReview.id,
          position: 1,
          title: "Review notes",
          prompt:
            "Review the PR changes. Call out correctness issues, performance concerns, and UX edge cases.",
          requiredArtifacts: [{ kind: "text", label: "Review notes" }],
        },
      ];

      await trx
        .insertInto("simulation_section")
        .values(
          sectionDefs.map((s) => ({
            simulation_id: s.simulationId,
            position: s.position,
            title: s.title,
            prompt: s.prompt,
            required_artifacts: s.requiredArtifacts,
          })),
        )
        .execute();

      const rubricRows = await trx
        .insertInto("rubric")
        .values(
          simulations.map((sim) => ({
            simulation_id: sim.id,
            title: `${sim.title} rubric`,
          })),
        )
        .returningAll()
        .execute();

      const criterionTemplates: Array<{ position: number; name: string; description: string; weight: string }> = [
        { position: 1, name: "Correctness", description: "Finds the right issue / proposes correct approach.", weight: "0.40" },
        { position: 2, name: "Clarity", description: "Communicates clearly and structures the response well.", weight: "0.25" },
        { position: 3, name: "Pragmatism", description: "Balances trade-offs and chooses sensible scope.", weight: "0.20" },
        { position: 4, name: "Depth", description: "Goes beyond the obvious; anticipates edge cases.", weight: "0.15" },
      ];

      const criteria = await trx
        .insertInto("rubric_criterion")
        .values(
          rubricRows.flatMap((rubric) =>
            criterionTemplates.map((t) => ({
              rubric_id: rubric.id,
              position: t.position,
              name: t.name,
              description: t.description,
              weight: t.weight,
              max_score: 5,
            })),
          ),
        )
        .returningAll()
        .execute();

      const ava = candidates.find((c) => c.email === "ava.candidate@example")!;
      const diego = candidates.find((c) => c.email === "diego.candidate@example")!;
      const jordan = candidates.find((c) => c.email === "jordan.candidate@example")!;

      const draftSubmission = await trx
        .insertInto("submission")
        .values({
          candidate_id: ava.id,
          simulation_id: simBugHunt.id,
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
          simulation_id: simPrReview.id,
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
          simulation_id: simApiDesign.id,
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

      const rubricForSim2 = rubricRows.find((r) => r.simulation_id === simApiDesign.id)!;
      const criteriaForSim2 = criteria.filter((c) => c.rubric_id === rubricForSim2.id);

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
    });
  } finally {
    await db.destroy();
  }
}

await seed();


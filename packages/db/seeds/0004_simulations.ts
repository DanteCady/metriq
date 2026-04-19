import type { RequiredArtifact } from "./lib";
import type { SeedContext } from "./context";
import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx, ctx: SeedContext): Promise<void> {
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

  ctx.simBugHunt = simulations[0]!;
  ctx.simApiDesign = simulations[1]!;
  ctx.simPrReview = simulations[2]!;

  const sectionDefs: Array<{
    simulationId: string;
    position: number;
    title: string;
    prompt: string;
    requiredArtifacts: RequiredArtifact[];
  }> = [
    {
      simulationId: ctx.simBugHunt.id,
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
      simulationId: ctx.simBugHunt.id,
      position: 2,
      title: "Fix plan",
      prompt:
        "Propose changes to ensure idempotency and correct retry semantics. Include DB constraints where relevant.",
      requiredArtifacts: [{ kind: "text", label: "Fix plan" }],
    },
    {
      simulationId: ctx.simApiDesign.id,
      position: 1,
      title: "Endpoint contract",
      prompt:
        "Design an endpoint for multi-tenant analytics. Define request/response, filters, pagination, and authorization assumptions.",
      requiredArtifacts: [{ kind: "text", label: "API spec" }],
    },
    {
      simulationId: ctx.simApiDesign.id,
      position: 2,
      title: "Schema sketch",
      prompt:
        "Sketch the minimal tables/indices needed for the reporting query and how you would enforce tenant scoping later.",
      requiredArtifacts: [{ kind: "text", label: "Schema sketch" }],
    },
    {
      simulationId: ctx.simPrReview.id,
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

  ctx.rubricRows = await trx
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

  ctx.criteria = await trx
    .insertInto("rubric_criterion")
    .values(
      ctx.rubricRows.flatMap((rubric) =>
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
}

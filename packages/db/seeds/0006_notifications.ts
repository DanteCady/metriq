import { daysAgo } from "./lib";
import type { SeedContext } from "./context";
import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx, ctx: SeedContext): Promise<void> {
  const ava = ctx.candidates.find((c) => c.email === "ava.candidate@example")!;
  const sam = await trx
    .selectFrom("employer")
    .selectAll()
    .where("email", "=", "sam@demo.metriq.dev")
    .executeTakeFirstOrThrow();

  await trx
    .insertInto("notification")
    .values([
      {
        candidate_id: ava.id,
        employer_id: null,
        workspace_id: null,
        category: "audition.reminder",
        title: "Finish your work sample",
        body: "You have an in-progress audition — submit before the window closes.",
        link_href: "/candidate/auditions",
        read_at: null,
        metadata: null,
      },
      {
        candidate_id: ava.id,
        employer_id: null,
        workspace_id: null,
        category: "submission.scored",
        title: "Your submission was reviewed",
        body: "Reviewers left feedback on your latest submission.",
        link_href: "/candidate/submissions",
        read_at: daysAgo(1),
        metadata: null,
      },
      {
        candidate_id: null,
        employer_id: sam.id,
        workspace_id: ctx.wsEng.id,
        category: "pipeline.submission_new",
        title: "New submission to review",
        body: "A candidate submitted stage work for a published audition.",
        link_href: null,
        read_at: null,
        metadata: null,
      },
      {
        candidate_id: null,
        employer_id: sam.id,
        workspace_id: null,
        category: "workspace.invite_sent",
        title: "Seat invite sent",
        body: "jamie.chen@acme.test was invited to the workspace.",
        read_at: daysAgo(2),
        metadata: null,
      },
    ])
    .execute();
}

import type { SeedContext } from "./context";
import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx, ctx: SeedContext): Promise<void> {
  ctx.candidates = await trx
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
}

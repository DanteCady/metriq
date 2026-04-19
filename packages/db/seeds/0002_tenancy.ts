import type { SeedContext } from "./context";
import type { SeedTrx } from "./trx";

export async function seed(trx: SeedTrx, ctx: SeedContext): Promise<void> {
  const companies = await trx
    .insertInto("company")
    .values([
      { name: "Acme Analytics", slug: "acme-analytics" },
      { name: "Metriq (demo)", slug: "metriq" },
    ])
    .returningAll()
    .execute();

  ctx.acme = companies[0]!;
  ctx.metriqDemo = companies[1]!;

  const workspaces = await trx
    .insertInto("workspace")
    .values([
      {
        company_id: ctx.metriqDemo.id,
        slug: "engineering",
        name: "Engineering",
        seat_limit: 25,
        seats_used: 18,
        status: "active",
      },
      {
        company_id: ctx.metriqDemo.id,
        slug: "gtm",
        name: "GTM & Sales",
        seat_limit: 15,
        seats_used: 9,
        status: "active",
      },
      {
        company_id: ctx.metriqDemo.id,
        slug: "finance",
        name: "Finance & BizOps",
        seat_limit: 10,
        seats_used: 4,
        status: "trial",
      },
    ])
    .returningAll()
    .execute();

  ctx.workspaces = workspaces;
  ctx.wsEng = workspaces.find((w) => w.slug === "engineering")!;
  ctx.wsGtm = workspaces.find((w) => w.slug === "gtm")!;

  await trx
    .insertInto("workspace_membership")
    .values([
      {
        workspace_id: ctx.wsEng.id,
        email: "aisha.khan@demo.metriq.dev",
        name: "Aisha Khan",
        role: "Lead reviewer",
      },
      {
        workspace_id: ctx.wsGtm.id,
        email: "marcus.chen@demo.metriq.dev",
        name: "Marcus Chen",
        role: "Hiring manager",
      },
      {
        workspace_id: ctx.wsEng.id,
        email: "sam.rivera@demo.metriq.dev",
        name: "Sam Rivera",
        role: "Admin",
      },
    ])
    .execute();

  await trx.insertInto("employer").values([
    { company_id: ctx.acme.id, email: "morgan@acme.example", full_name: "Morgan Lee" },
    { company_id: ctx.acme.id, email: "priya@acme.example", full_name: "Priya Shah" },
    { company_id: ctx.metriqDemo.id, email: "sam@demo.metriq.dev", full_name: "Sam Rivera" },
  ]).execute();
}

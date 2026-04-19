import { sql, type Kysely } from "kysely";

/** Rename legacy seeded demo company to Metriq-specific test org (aligns with `packages/db/seeds/*`). */
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    UPDATE company
    SET name = 'Metriq (demo)', slug = 'metriq'
    WHERE slug = 'northwind' OR name = 'Northwind Systems';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    UPDATE company
    SET name = 'Northwind Systems', slug = 'northwind'
    WHERE slug = 'metriq' AND name = 'Metriq (demo)';
  `.execute(db);
}

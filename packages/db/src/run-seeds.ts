import { createDb } from "./db";
import type { SeedContext } from "../seeds/context";
import { seed as seed0001 } from "../seeds/0001_reset";
import { seed as seed0002 } from "../seeds/0002_tenancy";
import { seed as seed0003 } from "../seeds/0003_candidates";
import { seed as seed0004 } from "../seeds/0004_simulations";
import { seed as seed0005 } from "../seeds/0005_submissions";
import { seed as seed0006 } from "../seeds/0006_notifications";
import { seed as seed0007 } from "../seeds/0007_entitlements";

/**
 * Runs all seed files in order (same pattern as migrations: add `seeds/0006_*.ts` and a line here).
 */
export async function runSeeds(): Promise<void> {
  const db = createDb();
  try {
    await db.transaction().execute(async (trx) => {
      const ctx = {} as SeedContext;
      await seed0001(trx);
      await seed0002(trx, ctx);
      await seed0003(trx, ctx);
      await seed0004(trx, ctx);
      await seed0005(trx, ctx);
      await seed0006(trx, ctx);
      await seed0007(trx);
    });
  } finally {
    await db.destroy();
  }
}

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runSeeds } from "./run-seeds";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

export async function seed() {
  await runSeeds();
}

await seed();

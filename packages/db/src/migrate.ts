import "dotenv/config";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

import { FileMigrationProvider, Migrator } from "kysely";

import { createDb } from "./db";

function usage(): never {
  // eslint-disable-next-line no-console
  console.error("Usage: tsx src/migrate.ts latest|down");
  process.exit(1);
}

const command = process.argv[2];
if (command !== "latest" && command !== "down") usage();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsFolder = path.join(__dirname, "..", "migrations");

const db = createDb();
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: migrationsFolder,
  }),
});

try {
  const result =
    command === "latest"
      ? await migrator.migrateToLatest()
      : await migrator.migrateDown();

  for (const it of result.results ?? []) {
    const status = it.status.toUpperCase();
    // eslint-disable-next-line no-console
    console.log(`${status} ${it.migrationName}`);
  }

  if (result.error) {
    // eslint-disable-next-line no-console
    console.error(result.error);
    process.exitCode = 1;
  }
} finally {
  await db.destroy();
}


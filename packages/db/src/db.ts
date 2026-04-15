import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import type { Database } from "./types";

const { Pool } = pg;

export type DbConfig = {
  connectionString?: string;
  max?: number;
};

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && url.trim().length > 0) return url;
  return "postgres://postgres:postgres@localhost:5432/metriq";
}

export function createDb(config: DbConfig = {}): Kysely<Database> {
  const pool = new Pool({
    connectionString: config.connectionString ?? getDatabaseUrl(),
    max: config.max ?? 10,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
}


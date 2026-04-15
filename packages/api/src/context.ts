import type { Kysely } from "kysely";

import type { Database } from "@metriq/db";

export type ApiContext = {
  db: Kysely<Database>;
};


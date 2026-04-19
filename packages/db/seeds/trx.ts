import type { Transaction } from "kysely";

import type { Database } from "../src/types";

export type SeedTrx = Transaction<Database>;

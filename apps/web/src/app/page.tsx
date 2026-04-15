import Link from "next/link";

import { AppShell } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";

function Topbar() {
  return (
    <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
      <div className="text-sm font-semibold tracking-tight">Metriq</div>
      <div className="flex items-center gap-2">
        <Link href="/candidate">
          <Button variant="secondary" size="sm">
            Candidate
          </Button>
        </Link>
        <Link href="/employer">
          <Button variant="secondary" size="sm">
            Employer
          </Button>
        </Link>
        <Link href="/admin">
          <Button variant="secondary" size="sm">
            Admin
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell topbar={<Topbar />}>
      <div className="prose prose-slate max-w-none dark:prose-invert">
        <h1>Metriq MVP</h1>
        <p>
          This is the initial scaffold. Next we’ll add the role switcher, real routes per role,
          Kysely + Postgres data, and tRPC-backed screens.
        </p>
      </div>
    </AppShell>
  );
}


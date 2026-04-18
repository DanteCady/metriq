import Link from "next/link";

import { Badge, Button, DataTable, PageHeader, Panel, StatCard, type DataTableColumn } from "@metriq/ui";

import { deptPath } from "../../lib/dept-path";
import { mockOrganization, mockOrgSeatPool, mockWorkspaces, DEFAULT_WORKSPACE_SLUG } from "../../mocks/tenancy";

type WsRow = (typeof mockWorkspaces)[0];

const wsColumns: DataTableColumn<WsRow>[] = [
  {
    key: "name",
    header: "Workspace",
    cell: (r) => (
      <div>
        <div className="font-medium text-foreground">{r.name}</div>
        <div className="font-mono text-xs text-muted-foreground">{r.slug}</div>
      </div>
    ),
  },
  { key: "seats", header: "Seats", align: "right", cell: (r) => `${r.seatsUsed} / ${r.seatLimit}` },
  {
    key: "status",
    header: "Status",
    cell: (r) => <Badge variant={r.status === "active" ? "success" : r.status === "trial" ? "warning" : "secondary"}>{r.status}</Badge>,
  },
  {
    key: "open",
    header: "",
    align: "right",
    cell: (r) => (
      <Link
        href={deptPath(r.slug, "")}
        className="inline-flex h-8 items-center justify-center rounded-md bg-muted px-3 text-sm font-medium text-foreground hover:bg-muted/80 dark:hover:bg-muted/70"
      >
        Open
      </Link>
    ),
  },
];

export default function EmployerOrgHomePage() {
  return (
    <>
      <PageHeader
        title="Organization"
        description={`${mockOrganization.name} — provision department workspaces, allocate seats, and connect identity providers (preview).`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <Link
            href={deptPath(DEFAULT_WORKSPACE_SLUG, "")}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Open default workspace
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Workspaces" value={mockWorkspaces.length} hint="Active and trial departments." />
        <StatCard label="Purchased seats" value={mockOrgSeatPool.purchasedSeats} hint="Org-wide license pool." />
        <StatCard label="Assigned seats" value={mockOrgSeatPool.assignedSeats} hint="People with access across workspaces." />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Workspaces" description="Each department runs hiring in an isolated workspace with its own pipeline and rubrics.">
          <DataTable columns={wsColumns} rows={mockWorkspaces} getRowKey={(r) => r.id} density="comfortable" />
          <div className="mt-4">
            <Button size="sm" variant="secondary" disabled title="Creating workspaces is disabled in this preview build.">
              Add workspace
            </Button>
          </div>
        </Panel>

        <Panel title="Seat allocation" description="How purchased seats are spread across workspaces (mock).">
          <ul className="space-y-2 text-sm">
            {mockOrgSeatPool.allocatedByWorkspace.map((row) => (
              <li key={row.slug} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-foreground">{row.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row.seatsUsed} / {row.seatLimit}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Next: connect Better Auth organization + SSO plugins; enforce seat limits per workspace at sign-in and invite time.
          </div>
        </Panel>
      </div>
    </>
  );
}

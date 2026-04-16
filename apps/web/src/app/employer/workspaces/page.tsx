import Link from "next/link";

import { Badge, Button, DataTable, PageHeader, Panel, type DataTableColumn } from "@metriq/ui";

import { deptPath } from "../../../lib/dept-path";
import { mockWorkspaces, type MockWorkspace } from "../../../mocks/tenancy";

const columns: DataTableColumn<MockWorkspace>[] = [
  { key: "name", header: "Name", cell: (r) => <span className="font-medium text-slate-900 dark:text-slate-50">{r.name}</span> },
  { key: "slug", header: "Slug", cell: (r) => <span className="font-mono text-xs">{r.slug}</span> },
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
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        Enter
      </Link>
    ),
  },
];

export default function EmployerWorkspacesPage() {
  return (
    <>
      <PageHeader
        title="Workspaces"
        description="Provision and manage department workspaces. Each workspace has its own auditions, pipeline, and team."
      />
      <div className="mt-6">
        <Panel title="All workspaces" description="Northwind demo data — real provisioning will use Better Auth org + workspace records.">
          <DataTable columns={columns} rows={mockWorkspaces} getRowKey={(r) => r.id} density="comfortable" />
          <div className="mt-4">
            <Button type="button" variant="secondary" size="sm" disabled title="Creating workspaces is disabled in this preview build.">
              Create workspace
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

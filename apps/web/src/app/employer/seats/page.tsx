import Link from "next/link";

import { Badge, DataTable, PageHeader, Panel, type DataTableColumn } from "@metriq/ui";

import { deptPath } from "../../../lib/dept-path";
import { mockOrgSeatAssignments, mockOrgSeatPool, type MockOrgSeatRow } from "../../../mocks/tenancy";

const columns: DataTableColumn<MockOrgSeatRow>[] = [
  { key: "name", header: "Person", cell: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "email", header: "Email", cell: (r) => <span className="text-sm text-muted-foreground">{r.email}</span> },
  { key: "role", header: "Role", cell: (r) => <Badge variant="outline">{r.role}</Badge> },
  {
    key: "ws",
    header: "Workspace",
    cell: (r) => (
      <Link href={deptPath(r.workspaceSlug, "")} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
        {r.workspaceSlug}
      </Link>
    ),
  },
];

export default function EmployerSeatsPage() {
  return (
    <>
      <PageHeader
        title="Seats"
        description={`Purchased ${mockOrgSeatPool.purchasedSeats} seats · ${mockOrgSeatPool.assignedSeats} assigned across workspaces (preview).`}
      />
      <div className="mt-6">
        <Panel title="Assignments" description="Who has access and where — foundation for seat enforcement at invite time.">
          <DataTable columns={columns} rows={mockOrgSeatAssignments} getRowKey={(r) => r.id} density="comfortable" />
        </Panel>
      </div>
    </>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, DataTable, DataTableToolbar, PageHeader, Panel, Surface, type DataTableColumn } from "@metriq/ui";

import { deptPath } from "../../../lib/dept-path";
import { mockOrganization, mockOrgSeatAssignments, mockOrgSeatPool, workspaceLabel, type MockOrgSeatRow } from "../../../mocks/tenancy";

function roleBadgeVariant(role: MockOrgSeatRow["role"]) {
  if (role === "Admin") return "secondary" as const;
  if (role === "Hiring manager") return "info" as const;
  if (role === "Lead reviewer") return "warning" as const;
  return "outline" as const;
}

export default function EmployerSeatsPage() {
  const router = useRouter();

  const columns = React.useMemo<DataTableColumn<MockOrgSeatRow>[]>(
    () => [
      {
        key: "name",
        header: "Person",
        cell: (r) => (
          <div>
            <div className="font-medium text-foreground">{r.name}</div>
            <div className="text-sm text-muted-foreground">{r.email}</div>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        cell: (r) => <Badge variant={roleBadgeVariant(r.role)}>{r.role}</Badge>,
      },
      {
        key: "ws",
        header: "Workspace",
        cell: (r) => (
          <Link
            href={deptPath(r.workspaceSlug, "")}
            className="font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {workspaceLabel(r.workspaceSlug)}
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <PageHeader
        title="Seats"
        description={`${mockOrganization.name} — purchased ${mockOrgSeatPool.purchasedSeats} seats, ${mockOrgSeatPool.assignedSeats} assigned. Limits apply per workspace.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <Button type="button" variant="secondary" onClick={() => router.push("/employer/workspaces")}>
            Workspaces
          </Button>
        }
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Surface className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Purchased</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{mockOrgSeatPool.purchasedSeats}</div>
          <p className="mt-1 text-xs text-muted-foreground">Org-wide pool</p>
        </Surface>
        <Surface className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{mockOrgSeatPool.assignedSeats}</div>
          <p className="mt-1 text-xs text-muted-foreground">People with access</p>
        </Surface>
        <Surface className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unassigned</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {mockOrgSeatPool.purchasedSeats - mockOrgSeatPool.assignedSeats}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Available to allocate</p>
        </Surface>
      </div>

      <div className="mt-6">
        <Panel title="Assignments" description="Who can operate hiring and in which workspace — foundation for invite-time enforcement.">
          <DataTable
            columns={columns}
            rows={mockOrgSeatAssignments}
            getRowKey={(r) => r.id}
            density="comfortable"
            onRowClick={(r) => router.push(deptPath(r.workspaceSlug, ""))}
            toolbar={
              <DataTableToolbar
                left={
                  <span className="text-sm text-muted-foreground">
                    {mockOrgSeatAssignments.length}{" "}
                    {mockOrgSeatAssignments.length === 1 ? "assignment" : "assignments"}
                  </span>
                }
              />
            }
          />
        </Panel>
      </div>
    </>
  );
}

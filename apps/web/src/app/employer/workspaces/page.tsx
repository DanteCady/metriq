"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, DataTable, DataTableToolbar, PageHeader, Panel, type DataTableColumn } from "@metriq/ui";

import { deptPath } from "../../../lib/dept-path";
import { mockOrganization, mockWorkspaces, type MockWorkspace } from "../../../mocks/tenancy";

export default function EmployerWorkspacesPage() {
  const router = useRouter();

  const columns = React.useMemo<DataTableColumn<MockWorkspace>[]>(
    () => [
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
      {
        key: "seats",
        header: "Seats",
        align: "right",
        cell: (r) => (
          <span className="tabular-nums text-muted-foreground">
            {r.seatsUsed} / {r.seatLimit}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge variant={r.status === "active" ? "success" : r.status === "trial" ? "warning" : "secondary"}>{r.status}</Badge>
        ),
      },
      {
        key: "open",
        header: "",
        align: "right",
        cell: (r) => (
          <Link
            href={deptPath(r.slug, "")}
            className="text-sm font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Enter workspace
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <PageHeader
        title="Workspaces"
        description={`Department sandboxes under ${mockOrganization.name}. Each has its own auditions, pipeline, and reviewers.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <Button type="button" variant="secondary" onClick={() => router.push("/employer")}>
            Org overview
          </Button>
        }
      />

      <p className="mt-4 text-sm text-muted-foreground">
        Use <strong className="font-medium text-foreground">Enter workspace</strong> to open hiring for that department. Row click does the same.
      </p>

      <div className="mt-6">
        <Panel title="All workspaces" description="Provisioning will be backed by org + workspace records; preview uses static rows.">
          <DataTable
            columns={columns}
            rows={mockWorkspaces}
            getRowKey={(r) => r.id}
            density="comfortable"
            onRowClick={(r) => router.push(deptPath(r.slug, ""))}
            toolbar={
              <DataTableToolbar
                left={
                  <span className="text-sm text-muted-foreground">
                    {mockWorkspaces.length} {mockWorkspaces.length === 1 ? "workspace" : "workspaces"}
                  </span>
                }
              />
            }
          />
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

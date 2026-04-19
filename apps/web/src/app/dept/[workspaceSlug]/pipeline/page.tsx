"use client";

import Link from "next/link";
import * as React from "react";
import { useParams } from "next/navigation";

import { Badge, DataTable, PageHeader, Panel, Toolbar } from "@metriq/ui";

import { trpc } from "../../../../app/providers";
import { deptPath } from "../../../../lib/dept-path";
import { mockPipeline } from "../../../../mocks/employer/pipeline";

type PipelineRow = {
  id: string;
  name: string;
  auditionTitle: string;
  status: string;
  assignedTo?: string;
  scoreHint?: string;
};

export default function DeptPipelinePage() {
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params?.workspaceSlug ?? "";
  const sub = (id: string) => deptPath(workspaceSlug, `/submissions/${encodeURIComponent(id)}`);

  const { data: serverRows = [] } = trpc.employer.pipelineSubmissions.useQuery(undefined, {
    enabled: Boolean(workspaceSlug),
  });

  const rows: PipelineRow[] = React.useMemo(() => {
    if (serverRows.length > 0) {
      return serverRows.map((r) => ({
        id: r.submissionId,
        name: r.candidateName,
        auditionTitle: r.auditionId ? `Audition ${r.auditionId.slice(0, 8)}…` : "Audition",
        status: r.status,
        assignedTo: "—",
        scoreHint: "—",
      }));
    }
    return mockPipeline;
  }, [serverRows]);

  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Track candidates through invited → active → submitted → reviewed → decision."
      />

      <div className="mt-6 grid gap-4">
        <Toolbar left={null} right={null} />
        <Panel title="Pipeline board" description="Kanban/table hybrid with assignments and SLAs. Shows database-backed rows when available.">
          <DataTable
            rows={rows}
            getRowKey={(r) => r.id}
            columns={[
              { key: "candidate", header: "Candidate", cell: (r) => r.name },
              { key: "audition", header: "Audition", cell: (r) => r.auditionTitle },
              {
                key: "status",
                header: "Status",
                cell: (r) => (
                  <Badge
                    variant={
                      r.status === "decision"
                        ? "success"
                        : r.status === "reviewing"
                          ? "warning"
                          : r.status === "submitted"
                            ? "outline"
                            : "secondary"
                    }
                  >
                    {r.status}
                  </Badge>
                ),
              },
              { key: "assigned", header: "Assigned", cell: (r) => r.assignedTo ?? "—" },
              { key: "score", header: "Signal", cell: (r) => r.scoreHint ?? "—" },
              {
                key: "actions",
                header: "",
                headerClassName: "text-right",
                className: "text-right",
                cell: (r) => (
                  <Link className="underline" href={sub(r.id)}>
                    Review
                  </Link>
                ),
              },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

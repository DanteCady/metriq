import Link from "next/link";

import { Badge, DataTable, PageHeader, Panel, Toolbar } from "@metriq/ui";

import { deptPath } from "../../../../lib/dept-path";
import { mockPipeline } from "../../../../mocks/employer/pipeline";

export default async function DeptPipelinePage({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = await params;
  const sub = (id: string) => deptPath(workspaceSlug, `/submissions/${encodeURIComponent(id)}`);

  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Track candidates through invited → active → submitted → reviewed → decision."
      />

      <div className="mt-6 grid gap-4">
        <Toolbar left={null} right={null} />
        <Panel title="Pipeline board" description="Kanban/table hybrid with assignments and SLAs.">
          <DataTable
            rows={mockPipeline}
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
                  <Link className="underline" href={sub(r.id === "cand_001" ? "sub_demo_completed" : "sub_demo_active")}>
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

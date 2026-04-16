import Link from "next/link";

import { Badge, DataTable, PageHeader, Panel, Toolbar, ToolbarGroup } from "@metriq/ui";

import { deptPath } from "../../../../lib/dept-path";
import { mockReviewQueue } from "../../../../mocks/employer/review";

export default async function DeptReviewQueuePage({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = await params;

  return (
    <>
      <PageHeader title="Review" description="Evidence-first submission review with rubric scoring, notes, and decisions." />

      <div className="mt-6 grid gap-4">
        <Toolbar
          left={
            <ToolbarGroup>
              <div className="text-sm text-slate-600 dark:text-slate-300">Queue</div>
            </ToolbarGroup>
          }
          right={null}
        />

        <Panel title="Submissions to review" description="Assigned submissions appear here.">
          <DataTable
            rows={mockReviewQueue}
            getRowKey={(r) => r.submissionId}
            columns={[
              {
                key: "candidate",
                header: "Candidate",
                cell: (r) => (
                  <div className="grid">
                    <div className="font-medium text-slate-900 dark:text-slate-50">{r.candidateName}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{r.auditionTitle}</div>
                  </div>
                ),
              },
              { key: "assignedTo", header: "Assigned", cell: (r) => r.assignedTo },
              { key: "evidence", header: "Evidence", cell: (r) => `${r.evidenceCount}` },
              {
                key: "status",
                header: "Status",
                cell: (r) => (
                  <Badge variant={r.status === "needs_review" ? "warning" : r.status === "in_progress" ? "outline" : "success"}>
                    {r.status.replaceAll("_", " ")}
                  </Badge>
                ),
              },
              {
                key: "open",
                header: "",
                headerClassName: "text-right",
                className: "text-right",
                cell: (r) => (
                  <Link className="underline" href={deptPath(workspaceSlug, `/submissions/${encodeURIComponent(r.submissionId)}`)}>
                    Open
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

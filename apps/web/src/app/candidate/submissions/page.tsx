"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, DataTable, EmptyState, PageHeader, Toolbar, ToolbarGroup } from "@metriq/ui";

import type { MockSubmission } from "../../../mocks/candidate/submission";
import { demoListSubmissions } from "../../../mocks/candidate/store";

function statusBadge(status: MockSubmission["status"]) {
  if (status === "submitted") {
    return <Badge variant="success">Submitted</Badge>;
  }
  if (status === "draft") {
    return <Badge variant="warning">Draft</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
}

export default function CandidateSubmissionsListPage() {
  const router = useRouter();
  const submissions = React.useMemo(() => demoListSubmissions(), []);

  return (
    <>
      <PageHeader
        title="Submissions"
        description="Your evidence packages across auditions and simulations."
        actions={
          <Button onClick={() => router.push("/candidate/auditions")}>Go to auditions</Button>
        }
      />

      <div className="mt-6 grid gap-4">
        <Toolbar
          left={
            <ToolbarGroup>
              <div className="text-sm text-muted-foreground">
                {submissions.length === 1 ? "1 package" : `${submissions.length} packages`}
              </div>
            </ToolbarGroup>
          }
          right={null}
        />

        <DataTable
          rows={submissions}
          getRowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/candidate/submissions/${r.id}`)}
          columns={[
            {
              key: "id",
              header: "Submission",
              cell: (r) => (
                <Link
                  href={`/candidate/submissions/${r.id}`}
                  className="font-medium text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.id.slice(0, 8)}
                </Link>
              ),
            },
            { key: "status", header: "Status", cell: (r) => statusBadge(r.status) },
            {
              key: "artifactCount",
              header: "Artifacts",
              align: "right",
              cell: (r) => <span className="font-medium tabular-nums text-foreground">{r.artifacts.length}</span>,
            },
          ]}
          emptyState={{
            title: "No submissions yet",
            description: "Start an audition or simulation to create your first submission.",
          }}
        />
      </div>
    </>
  );
}


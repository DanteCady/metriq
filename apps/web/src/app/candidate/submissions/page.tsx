"use client";

import * as React from "react";
import Link from "next/link";

import { Button, DataTable, EmptyState, PageHeader, Toolbar, ToolbarGroup } from "@metriq/ui";

import { demoListSubmissions } from "../../../mocks/candidate/store";

export default function CandidateSubmissionsListPage() {
  const submissions = React.useMemo(() => demoListSubmissions(), []);

  return (
    <>
      <PageHeader
        title="Submissions"
        description="Your evidence packages across auditions and simulations."
        actions={
          <Button variant="secondary" onClick={() => (window.location.href = "/candidate/auditions")}>
            Go to auditions
          </Button>
        }
      />

      <div className="mt-6 grid gap-4">
        <Toolbar
          left={
            <ToolbarGroup>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {`${submissions.length} total`}
              </div>
            </ToolbarGroup>
          }
          right={null}
        />

        <DataTable
          rows={submissions}
          getRowKey={(r) => r.id}
          columns={[
            {
              key: "id",
              header: "Submission",
              cell: (r) => (
                <Link href={`/candidate/submissions/${r.id}`} className="underline">
                  {r.id.slice(0, 8)}
                </Link>
              ),
            },
            { key: "status", header: "Status", cell: (r) => r.status },
            { key: "artifactCount", header: "Artifacts", cell: (r) => String(r.artifacts.length), className: "text-right", headerClassName: "text-right" },
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


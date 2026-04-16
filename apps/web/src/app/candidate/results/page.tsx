"use client";

import * as React from "react";
import Link from "next/link";

import { DataTable, EmptyState, PageHeader } from "@metriq/ui";

import { demoListSubmissions } from "../../../mocks/candidate/store";

export default function CandidateResultsListPage() {
  const submissions = React.useMemo(() => demoListSubmissions(), []);

  const rows = React.useMemo(() => {
    return submissions.filter((s) => s.status === "submitted");
  }, [submissions]);

  return (
    <>
      <PageHeader title="Results" description="Evaluation outputs tied to your submitted evidence." />

      <div className="mt-6 grid gap-4">
        {rows.length === 0 ? (
          <EmptyState
            title="No results yet"
            description="Submit a submission to generate results."
            actionLabel="Go to submissions"
            onAction={() => {
              window.location.href = "/candidate/submissions";
            }}
          />
        ) : null}

        {rows.length ? (
          <DataTable
            rows={rows}
            getRowKey={(r) => r.id}
            columns={[
              {
                key: "submission",
                header: "Submission",
                cell: (r) => (
                  <Link href={`/candidate/results/${r.id}`} className="underline">
                    {r.id.slice(0, 8)}
                  </Link>
                ),
              },
              { key: "status", header: "Status", cell: () => "evaluated" },
              { key: "evidence", header: "Evidence", cell: (r) => `${r.artifacts.length} artifacts` },
            ]}
          />
        ) : null}
      </div>
    </>
  );
}


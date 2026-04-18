"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, DataTable, DataTableToolbar, EmptyState, PageHeader } from "@metriq/ui";

import { demoListSubmissions } from "../../../mocks/candidate/store";

export default function CandidateResultsListPage() {
  const router = useRouter();
  const submissions = React.useMemo(() => demoListSubmissions(), []);

  const rows = React.useMemo(() => {
    return submissions.filter((s) => s.status === "submitted");
  }, [submissions]);

  return (
    <>
      <PageHeader
        title="Results"
        description="Rubric-style scores and reviewer notes for submissions that are fully submitted — not in-progress drafts."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <Button variant="secondary" onClick={() => router.push("/candidate/submissions")}>
            Submissions
          </Button>
        }
      />

      <p className="mt-4 text-sm text-muted-foreground">
        Draft evidence stays in <Link href="/candidate/submissions" className="font-medium text-primary hover:underline">Submissions</Link>
        {" "}until you submit; then it can show up here after evaluation.
      </p>

      <div className="mt-6 grid gap-4">
        {rows.length === 0 ? (
          <EmptyState
            title="No evaluated results yet"
            description="Submit a submission from an audition or simulation. Once it is marked submitted, evaluation-style results will appear in this list."
            actionLabel="Go to submissions"
            onAction={() => router.push("/candidate/submissions")}
          />
        ) : null}

        {rows.length ? (
          <DataTable
            rows={rows}
            getRowKey={(r) => r.id}
            onRowClick={(r) => router.push(`/candidate/results/${r.id}`)}
            toolbar={
              <DataTableToolbar
                left={
                  <span className="text-sm text-muted-foreground">
                    {rows.length === 1 ? "1 submission with results" : `${rows.length} submissions with results`}
                  </span>
                }
              />
            }
            columns={[
                {
                  key: "submission",
                  header: "Submission",
                  cell: (r) => (
                    <Link
                      href={`/candidate/results/${r.id}`}
                      className="font-medium text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {r.id.slice(0, 10)}
                    </Link>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: () => <Badge variant="success">Evaluated</Badge>,
                },
                {
                  key: "evidence",
                  header: "Evidence",
                  align: "right",
                  cell: (r) => (
                    <span className="font-medium tabular-nums text-foreground">{r.artifacts.length}</span>
                  ),
                },
              ]}
            />
        ) : null}
      </div>
    </>
  );
}

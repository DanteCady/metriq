"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { AppFrame } from "../../../../components/app-frame";
import { EmptyState, EvaluationBreakdown, LoadingState, PageHeader, PageSection, ScoreBadge } from "@metriq/ui";

import { trpc } from "../../../providers";

export default function CandidateResultsPage() {
  const params = useParams<{ submissionId: string }>();
  const submissionId = params?.submissionId ?? "";

  const result = trpc.submission.getResult.useQuery({ submissionId }, { enabled: Boolean(submissionId) });

  return (
    <AppFrame>
      <PageHeader
        title={result.data ? `Results: ${result.data.simulation.title}` : "Results"}
        description={result.data ? result.data.summary : "Loading evaluation…"}
        actions={
          result.data ? <ScoreBadge score={result.data.overallScore} max={result.data.maxScore} format="fraction" /> : null
        }
      />
      <div className="mt-6 grid gap-4">
        {result.isLoading ? <LoadingState /> : null}
        {result.isError ? (
          <EmptyState title="Couldn’t load results" description={result.error.message} actionLabel="Retry" onAction={() => result.refetch()} />
        ) : null}
        {result.data ? (
          <>
            <PageSection title="Summary">
              <div className="text-sm text-slate-700 dark:text-slate-200">{result.data.summary}</div>
            </PageSection>
            <EvaluationBreakdown criteria={result.data.criteria} />
          </>
        ) : null}
      </div>
    </AppFrame>
  );
}


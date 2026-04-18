"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { EmptyState, EvaluationBreakdown, PageHeader, PageSection, ScoreBadge } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../../mocks/candidate/audition-detail";
import { mockEvaluation } from "../../../../../mocks/candidate/evaluation";

export default function CandidateResultsOverviewPage() {
  const params = useParams<{ auditionId: string }>();
  const search = useSearchParams();

  const auditionId = params?.auditionId ?? "";
  const submissionId = search?.get("submissionId") ?? "";

  const error = null;

  return (
    <>
      <PageHeader
        title={`Results • ${mockAuditionDetail.roleTitle}`}
        description="Overall performance summary, criteria scores, and evaluator feedback tied to evidence."
        actions={<ScoreBadge score={mockEvaluation.overallScore} max={mockEvaluation.maxScore} format="fraction" />}
      />

      <div className="mt-6 grid gap-4">
        {error ? <EmptyState title="Couldn’t load results" description={error} actionLabel="Retry" onAction={() => window.location.reload()} /> : null}

        {!error ? (
          <>
            <PageSection title="Performance summary" description="A quick read of what was demonstrated.">
              <div className="grid gap-3 text-sm text-foreground">
                <div className="rounded-lg border border-border bg-card p-4">
                  {mockEvaluation.summary}
                </div>
                <div className="text-xs text-muted-foreground">Evaluation is evidence-linked.</div>
              </div>
            </PageSection>

            <EvaluationBreakdown
              criteria={mockEvaluation.criteria.map((c) => ({
                key: c.key,
                label: c.label,
                score: c.score,
                max: c.max,
                notes: <span className="text-sm text-muted-foreground">{c.rationale}</span>,
              }))}
              title="Criteria summary"
              description="Scores are meaningful only when tied to evidence and rationale."
            />

            <PageSection title="Feedback" description="Actionable notes connected to rubric criteria and evidence.">
              <div className="rounded-lg border border-border bg-muted/60 p-4 text-sm text-foreground">
                Each criterion includes rationale and evidence links on the evaluation detail screen.
              </div>
              <div className="mt-3">
                <Link
                  href={`/candidate/auditions/${auditionId}/evaluation?submissionId=${encodeURIComponent(submissionId)}`}
                  className="underline text-sm text-foreground"
                >
                  Open evaluation detail
                </Link>
              </div>
            </PageSection>
          </>
        ) : null}
      </div>
    </>
  );
}


"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { EvaluationBreakdown, PageHeader, PageSection, ScoreBadge } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../mocks/candidate/audition-detail";
import { mockEvaluation } from "../../../../mocks/candidate/evaluation";

export default function CandidateResultsPage() {
  const params = useParams<{ submissionId: string }>();
  const submissionId = params?.submissionId ?? "";

  return (
    <>
      <PageHeader
        title={`Results: ${mockAuditionDetail.roleTitle}`}
        description={mockEvaluation.summary}
        actions={<ScoreBadge score={mockEvaluation.overallScore} max={mockEvaluation.maxScore} format="fraction" />}
      />
      <div className="mt-6 grid gap-4">
        <PageSection title="Summary">
          <div className="text-sm text-slate-700 dark:text-slate-200">{mockEvaluation.summary}</div>
        </PageSection>
        <EvaluationBreakdown
          criteria={mockEvaluation.criteria.map((c) => ({
            key: c.key,
            label: c.label,
            score: c.score,
            max: c.max,
            notes: <span className="text-sm text-slate-600 dark:text-slate-300">{c.rationale}</span>,
          }))}
        />
      </div>
    </>
  );
}


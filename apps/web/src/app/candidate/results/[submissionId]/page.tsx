"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge, Button, EvaluationBreakdown, PageHeader, ScoreBadge } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../mocks/candidate/audition-detail";
import { mockEvaluation } from "../../../../mocks/candidate/evaluation";

export default function CandidateResultsPage() {
  const params = useParams<{ submissionId: string }>();
  const router = useRouter();
  const submissionId = params?.submissionId ?? "";
  const submissionShort = submissionId ? submissionId.slice(0, 12) : "—";

  const pct = mockEvaluation.maxScore > 0 ? (mockEvaluation.overallScore / mockEvaluation.maxScore) * 100 : 0;

  return (
    <>
      <PageHeader
        title="Evaluation results"
        description={mockAuditionDetail.roleTitle}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Preview data</Badge>
            <Badge variant="outline" className="tabular-nums">
              Submission {submissionShort}
            </Badge>
          </div>
        }
        actions={
          <Button variant="secondary" onClick={() => router.push("/candidate/results")}>
            All results
          </Button>
        }
      />

      <section className="relative mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div
          className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-primary"
          aria-hidden
        />
        <div className="bg-gradient-to-br from-primary/[0.06] via-transparent to-info/[0.04] px-6 pb-6 pl-7 pt-6 dark:from-primary/[0.1] dark:to-info/[0.06]">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Overall outcome</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-4xl font-bold tracking-tight text-foreground">{mockEvaluation.overallScore}</span>
              <span className="pb-1 text-xl font-medium text-muted-foreground">/ {mockEvaluation.maxScore}</span>
            </div>
            <ScoreBadge
              score={mockEvaluation.overallScore}
              max={mockEvaluation.maxScore}
              format="fraction"
              className="mb-1"
            />
            <span className="mb-1.5 ml-auto hidden text-sm text-muted-foreground sm:inline">
              {Math.round(pct)}% of rubric points captured
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{mockEvaluation.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {mockAuditionDetail.companyName} · Rubric-backed readout (demo)
          </p>
        </div>
      </section>

      <div className="mt-6">
        <EvaluationBreakdown
          title="Score breakdown"
          description="Each row is a criterion from the audition rubric. Bars show how much of that slice you captured; notes are reviewer-facing rationales."
          criteria={mockEvaluation.criteria.map((c) => ({
            key: c.key,
            label: c.label,
            score: c.score,
            max: c.max,
            notes: <span className="text-sm text-muted-foreground">{c.rationale}</span>,
          }))}
        />
      </div>
    </>
  );
}

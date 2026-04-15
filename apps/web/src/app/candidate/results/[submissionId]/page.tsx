"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { AppShell, Badge, EmptyState, PageHeader, PageSection } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";

import {
  selectResultBySubmissionId,
  selectSimulationById,
  selectSubmissionById,
  useCandidateStore,
} from "../../../../lib/candidate-store";

function ScoreBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
      <div className="h-full rounded-full bg-slate-900 dark:bg-slate-50" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function CandidateResultsPage() {
  const params = useParams<{ submissionId: string }>();
  const submissionId = params.submissionId;

  const submission = useCandidateStore(useMemo(() => selectSubmissionById(submissionId), [submissionId]));
  const simulation = useCandidateStore(
    useMemo(() => selectSimulationById(submission?.simulationId ?? "__missing__"), [submission?.simulationId]),
  );
  const result = useCandidateStore(useMemo(() => selectResultBySubmissionId(submissionId), [submissionId]));

  const isSubmitted = submission?.status === "submitted";

  return (
    <AppShell>
      <PageHeader
        title="Results"
        description={simulation ? simulation.title : submission ? `Submission ${submission.id}` : "Loading…"}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/candidate">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
            {submission ? (
              <Link href={`/candidate/submissions/${submission.id}`}>
                <Button variant="secondary" size="sm">
                  View submission
                </Button>
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        {!submission || !simulation ? (
          <PageSection>
            <EmptyState title="Submission not found" description="Return to the dashboard to start a simulation." />
          </PageSection>
        ) : !isSubmitted ? (
          <PageSection>
            <EmptyState
              title="Not submitted yet"
              description="Submit your work to receive a score breakdown."
              actionLabel="Continue submission"
              onAction={() => {
                location.assign(`/candidate/submissions/${submission.id}`);
              }}
            />
          </PageSection>
        ) : !result ? (
          <PageSection>
            <EmptyState
              title="Results pending"
              description="Your submission is in review. Check back soon."
              actionLabel="Back to dashboard"
              onAction={() => {
                location.assign("/candidate");
              }}
            />
          </PageSection>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <PageSection className="lg:col-span-1">
                <div className="text-sm text-slate-600 dark:text-slate-300">Overall score</div>
                <div className="mt-2 text-4xl font-semibold tracking-tight">{result.overallScore}</div>
                <div className="mt-4">
                  <ScoreBar score={result.overallScore} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="success">Submitted</Badge>
                  <Badge variant="secondary">{simulation.type.replaceAll("_", " ")}</Badge>
                  <Badge variant="secondary">{simulation.difficulty}</Badge>
                </div>
              </PageSection>

              <PageSection title="Summary" className="lg:col-span-2">
                <div className="text-sm text-slate-600 dark:text-slate-300">{result.summary}</div>
              </PageSection>
            </div>

            <PageSection title="Score breakdown" description="Criterion-level scoring with weights.">
              <div className="grid gap-3">
                {result.breakdown.map((item) => (
                  <div key={item.criterion} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{item.criterion}</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          Weight {(item.weight * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-40">
                          <ScoreBar score={item.score} />
                        </div>
                        <div className="w-10 text-right text-sm font-semibold">{item.score}</div>
                      </div>
                    </div>
                    {item.notes ? <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.notes}</div> : null}
                  </div>
                ))}
              </div>
            </PageSection>
          </>
        )}
      </div>
    </AppShell>
  );
}


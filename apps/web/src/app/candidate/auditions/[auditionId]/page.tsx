"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge, Button, EmptyState, PageHeader, PageSection, StageTimeline, type StageTimelineStatus } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../mocks/candidate/audition-detail";

export default function CandidateAuditionOverviewPage() {
  const router = useRouter();
  const params = useParams<{ auditionId: string }>();
  const auditionId = params?.auditionId ?? "";

  const submissionIdFromQuery =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("submissionId") ?? "" : "";

  const stages = React.useMemo(() => {
    const detail = mockAuditionDetail;
    return detail.stages.map((s, idx) => ({
      id: s.id,
      title: s.title,
      objective: s.objective,
      estimatedMinutes: s.estimatedMinutes,
      status: (idx === 0 ? "up_next" : "locked") as StageTimelineStatus,
    }));
  }, []);

  const requiredDeliverables = React.useMemo(() => {
    const flat = mockAuditionDetail.stages.flatMap((s) => s.requiredArtifacts);
    return Array.from(new Set(flat)).slice(0, 12);
  }, []);

  const error = null;

  return (
    <>
      <PageHeader
        title={mockAuditionDetail.roleTitle}
        description={mockAuditionDetail.roleSummary}
        eyebrow={<span>Audition • {mockAuditionDetail.companyName}</span>}
        actions={
          <Button
            onClick={async () => {
              const firstStageId = stages[0]?.id ?? null;
              if (firstStageId) {
                router.push(
                  `/candidate/auditions/${auditionId}/stages/${firstStageId}?submissionId=${encodeURIComponent(submissionIdFromQuery || "sub_demo_active")}`,
                );
              }
            }}
          >
            Start
          </Button>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {error ? <EmptyState title="Couldn’t load audition" description={error} actionLabel="Back to inbox" onAction={() => router.push("/candidate/auditions")} /> : null}

        {!error ? (
          <>
            <div className="grid gap-4">
              <PageSection title="Stage map" description="Your work is organized into stages. Each stage produces specific evidence.">
                <StageTimeline
                  stages={stages}
                  onStageClick={(stageId) => {
                    router.push(
                      `/candidate/auditions/${auditionId}/stages/${stageId}?submissionId=${encodeURIComponent(submissionIdFromQuery || "sub_demo_active")}`,
                    );
                  }}
                />
              </PageSection>

              <PageSection title="Deliverables" description="What you’ll submit as evidence (required unless marked optional in-stage).">
                {requiredDeliverables.length === 0 ? (
                  <EmptyState
                    title="Deliverables will appear here"
                    description="Structured deliverables will appear here."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {requiredDeliverables.map((d) => (
                      <Badge key={d} variant="outline">
                        {d}
                      </Badge>
                    ))}
                  </div>
                )}
              </PageSection>
            </div>

            <div className="grid gap-4">
              <PageSection title="Rubric (summary)" description="How your evidence is evaluated. Scores are tied to evidence and rationale.">
                <div className="grid gap-3 text-sm text-foreground">
                  <div className="rounded-lg border border-border bg-muted/60 p-4">
                    <div className="font-medium">Scoring scale</div>
                    <div className="mt-1 text-muted-foreground">1–4 per criterion (Not yet → Strongly demonstrated).</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium">Criteria</div>
                    <div className="mt-3 grid gap-2">
                      {mockAuditionDetail.rubricSummary.criteria.map((c) => (
                        <div key={c.key} className="rounded-md border border-border p-3 text-sm">
                          <div className="font-medium text-foreground">{c.label}</div>
                          <div className="mt-1 text-muted-foreground">{c.intent}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PageSection>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}


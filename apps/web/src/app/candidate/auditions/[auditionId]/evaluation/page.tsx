"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ArtifactViewer, EmptyState, EvidenceList, PageHeader, Panel, ScoreBadge } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../../mocks/candidate/audition-detail";
import { mockEvaluation } from "../../../../../mocks/candidate/evaluation";
import { demoGetSubmission } from "../../../../../mocks/candidate/store";

export default function CandidateEvaluationDetailPage() {
  const params = useParams<{ auditionId: string }>();
  const search = useSearchParams();

  const auditionId = params?.auditionId ?? "";
  const submissionId = search?.get("submissionId") ?? "";

  const sub = React.useMemo(() => demoGetSubmission(submissionId || "sub_demo_active"), [submissionId]);

  const [selectedArtifactId, setSelectedArtifactId] = React.useState<string | undefined>(undefined);

  const evidenceItems = React.useMemo(() => {
    return (sub.artifacts ?? []).map((a) => ({
      id: a.id,
      title: a.label,
      subtitle: a.type === "link" ? a.content : "Text artifact",
      meta: a.type === "link" ? "Link" : "Write-up",
    }));
  }, [sub.artifacts]);

  const selected = React.useMemo(() => {
    const artifacts = sub.artifacts ?? [];
    return artifacts.find((a) => a.id === selectedArtifactId) ?? artifacts[0] ?? null;
  }, [sub.artifacts, selectedArtifactId]);

  const error = null;

  return (
    <>
      <PageHeader
        title="Evaluation detail"
        eyebrow={<span>{mockAuditionDetail.roleTitle} • Results</span>}
        description="Rubric breakdown + rationale + evidence links. This view is evidence-first."
        actions={<ScoreBadge score={mockEvaluation.overallScore} max={mockEvaluation.maxScore} format="fraction" />}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {error ? <EmptyState title="Couldn’t load evaluation" description={error} actionLabel="Retry" onAction={() => window.location.reload()} /> : null}

        {!error ? (
          <>
            <div className="grid gap-4">
              <Panel title="Rubric breakdown" description="Criterion → score. Rationale/evidence will attach here." density="tight">
                <div className="grid gap-3">
                  {mockEvaluation.criteria.map((c) => (
                    <div key={c.key} className="rounded-md border border-border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-foreground">{c.label}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{c.rationale}</div>
                        </div>
                        <ScoreBadge score={c.score} max={c.max} format="fraction" size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <EvidenceList
                title="Evidence links"
                description="Artifacts referenced by the evaluation."
                items={evidenceItems}
                selectedId={selected?.id}
                onSelect={(id) => setSelectedArtifactId(id)}
                emptyState={{ title: "No artifacts found", description: "Submit artifacts to build an evidence trail." }}
              />
            </div>

            <div className="grid gap-4">
              <Panel title="Evidence preview" description="What the evaluator reads." density="tight">
                {selected ? (
                  <ArtifactViewer kind={selected.type} label={selected.label} value={selected.content} />
                ) : (
                  <div className="text-sm text-muted-foreground">Select an artifact to preview it.</div>
                )}
              </Panel>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}


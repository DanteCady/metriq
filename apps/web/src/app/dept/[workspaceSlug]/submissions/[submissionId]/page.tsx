"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { ArtifactViewer, Badge, Button, DefinitionList, PageHeader, Panel, RubricTable, type RubricCriterion } from "@metriq/ui";

import { deptPath } from "../../../../../lib/dept-path";
import { mockEmployerSubmissionDetail } from "../../../../../mocks/employer/submission-review";
import { mockUniverse } from "../../../../../mocks/universe";

export default function DeptSubmissionReviewPage() {
  const params = useParams<{ workspaceSlug: string; submissionId: string }>();
  const submissionId = params?.submissionId ?? "";
  const workspaceSlug = params?.workspaceSlug ?? "";

  const detail = React.useMemo(() => mockEmployerSubmissionDetail(submissionId || "sub_unknown"), [submissionId]);

  const rubricRows: RubricCriterion[] = detail.rubric.map((r) => ({
    key: r.key,
    criterion: r.criterion,
    description: `${r.description} · weight ${Math.round(r.weight * 100)}%`,
    weight: r.weight,
    score: r.score,
    max: r.max,
    notes: <span className="text-muted-foreground">Evidence: {detail.artifacts[0]?.label ?? "—"}</span>,
  }));

  const decisionBadge =
    detail.decision.status === "shortlisted" ? (
      <Badge variant="success">Shortlisted</Badge>
    ) : detail.decision.status === "rejected" ? (
      <Badge variant="destructive">Rejected</Badge>
    ) : (
      <Badge variant="warning">In review</Badge>
    );

  return (
    <>
      <PageHeader
        title="Submission review"
        description={`${detail.candidateName} · ${detail.auditionTitle}`}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Preview data</Badge>
            {decisionBadge}
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Back
            </Button>
            <Button
              onClick={() => {
                window.location.href = deptPath(workspaceSlug, "/compare");
              }}
            >
              Compare
            </Button>
          </div>
        }
      />

      <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
        <DefinitionList
          columns={2}
          items={[
            { term: "Candidate", description: `${detail.candidateName} · ${detail.candidateEmail}` },
            { term: "Organization", description: mockUniverse.orgName },
            { term: "Submitted", description: new Date(detail.submittedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) },
            { term: "Stage", description: detail.stageLabel },
            { term: "Submission id", description: detail.submissionId || "—" },
            { term: "Primary reviewer", description: detail.decision.primaryReviewer },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Evidence" description="Artifacts, links, and write-ups submitted for this stage." density="tight">
          <div className="grid gap-6">
            {detail.artifacts.map((a) => (
              <div key={a.id} className="rounded-lg border border-border p-3">
                <ArtifactViewer kind={a.type} label={a.label} value={a.content} />
              </div>
            ))}
          </div>
        </Panel>
        <div className="grid gap-4">
          <RubricTable
            title="Rubric"
            description="Criterion scores with anchored guidance — preview build shows draft scores."
            rows={rubricRows}
          />
          <Panel title="Decision" description="Shortlist, reject, or request follow-up once review is complete." density="tight">
            <p className="text-sm text-muted-foreground">{detail.decision.notes}</p>
            <div className="mt-3 text-xs text-muted-foreground">
              Last activity:{" "}
              {new Date(detail.decision.lastActivityAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" disabled title="Decision actions are disabled in this preview build.">
                Shortlist
              </Button>
              <Button type="button" variant="secondary" disabled title="Decision actions are disabled in this preview build.">
                Request changes
              </Button>
              <Button type="button" variant="destructive" disabled title="Decision actions are disabled in this preview build.">
                Reject
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

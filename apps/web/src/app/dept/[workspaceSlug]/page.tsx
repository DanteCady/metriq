"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge, Button, PageHeader, Panel, StatCard } from "@metriq/ui";

import { deptPath } from "../../../lib/dept-path";
import { mockEmployerKpis } from "../../../mocks/employer/analytics";
import { mockEmployerAuditions } from "../../../mocks/employer/auditions";
import { mockPipeline } from "../../../mocks/employer/pipeline";
import { mockUniverse } from "../../../mocks/universe";
import { workspaceLabel } from "../../../mocks/tenancy";

export default function DeptWorkspaceDashboardPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const slug = params?.workspaceSlug ?? "";
  const base = (p: string) => deptPath(slug, p);

  const pipelinePreview = mockPipeline.slice(0, 4);
  const auditionsPreview = mockEmployerAuditions.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`${workspaceLabel(slug)} · Dashboard`}
        description={`${mockUniverse.orgName} — workspace for auditions, evidence review, and rubric-backed decisions.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                window.location.href = base("/auditions/new");
              }}
            >
              New audition
            </Button>
            <Button variant="secondary" onClick={() => (window.location.href = base("/review"))}>
              Open review queue
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Active auditions" value={mockEmployerKpis.activeAuditions} hint="Published and collecting submissions." />
        <StatCard label="In review" value={mockEmployerKpis.candidatesInReview} hint="Awaiting rubric completion or decision." />
        <StatCard label="Avg time to decision" value={`${mockEmployerKpis.avgTimeToDecisionDays} days`} hint="Rolling 30-day window." />
        <StatCard label="Reviewer throughput" value={`${mockEmployerKpis.reviewerThroughputPerWeek}/wk`} hint="Median completed reviews per reviewer." />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Pipeline snapshot" description="Candidates closest to a decision — open pipeline for the full board.">
            <ul className="space-y-3 text-sm">
              {pipelinePreview.map((row) => (
                <li key={row.id} className="flex flex-col gap-1 rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{row.name}</span>
                    <Badge variant="outline">{row.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{row.auditionTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    Owner {row.assignedTo ?? "—"} · updated {new Date(row.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button size="sm" variant="secondary" onClick={() => (window.location.href = base("/pipeline"))}>
                View pipeline
              </Button>
            </div>
          </Panel>

          <Panel title="Auditions" description="Templates and live auditions your team is running.">
            <ul className="space-y-3 text-sm">
              {auditionsPreview.map((a) => (
                <li key={a.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{a.title}</span>
                    <Badge variant={a.status === "published" ? "success" : a.status === "draft" ? "secondary" : "outline"}>{a.status}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {a.level} · {a.timeboxMinutes} min · {a.template.replaceAll("_", " ")}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={base("/auditions")} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                Manage auditions
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Link href={base("/analytics")} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                Open analytics
              </Link>
            </div>
          </Panel>
        </div>

        <Panel title="Next actions" description="High-leverage shortcuts for this workspace.">
          <ol className="list-decimal space-y-3 pl-4 text-sm text-foreground">
            <li>Clear the review queue for candidates stuck in “reviewing”.</li>
            <li>Publish the draft design-doc audition before campus hiring opens.</li>
            <li>Review rubric drift on “Execution quality” in analytics.</li>
          </ol>
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            Workspace reviewers: {mockUniverse.reviewers.map((r) => r.name).join(" · ")}
          </div>
        </Panel>
      </div>
    </>
  );
}

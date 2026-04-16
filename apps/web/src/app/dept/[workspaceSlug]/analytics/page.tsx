import { Badge, DataTable, PageHeader, Panel, StatCard, type DataTableColumn } from "@metriq/ui";

import { mockEmployerRubricDistributions, mockEmployerSignalQuality } from "../../../../mocks/employer/analytics-rubric";
import { mockEmployerFunnelStages, mockEmployerFunnelSummary, type FunnelStage } from "../../../../mocks/employer/analytics-funnel";
import { mockUniverse } from "../../../../mocks/universe";
import type { RubricCriterionDistribution } from "../../../../mocks/employer/analytics-rubric";

const funnelColumns: DataTableColumn<FunnelStage>[] = [
  { key: "label", header: "Stage", cell: (r) => r.label },
  {
    key: "count",
    header: "Candidates",
    align: "right",
    cell: (r) => <span className="font-medium tabular-nums text-slate-900 dark:text-slate-50">{r.count}</span>,
  },
  {
    key: "pct",
    header: "Conv.",
    align: "right",
    cell: (r) => (r.pctOfPrev == null ? "—" : `${Math.round(r.pctOfPrev * 100)}%`),
  },
  {
    key: "sla",
    header: "Avg time in stage",
    align: "right",
    cell: (r) => `${r.avgHoursInStage}h`,
  },
];

function FunnelBarChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((s) => s.count), 1);
  return (
    <div className="grid gap-3">
      {stages.map((s) => (
        <div key={s.key} className="grid gap-1">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>{s.label}</span>
            <span className="tabular-nums text-slate-900 dark:text-slate-50">{s.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-[width] dark:bg-foreground/70"
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DistributionRow({ row }: { row: RubricCriterionDistribution }) {
  const total = row.buckets.reduce((a, b) => a + b, 0) || 1;
  const labels = ["Strong", "", "", "", "Weak"];
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{row.label}</div>
          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{row.auditionTitle}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{Math.round(row.evidenceLinkedPct * 100)}% evidence-linked</Badge>
          <Badge variant={row.reviewerAlignment === "high" ? "success" : row.reviewerAlignment === "medium" ? "warning" : "secondary"}>
            Alignment: {row.reviewerAlignment}
          </Badge>
        </div>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-md bg-muted">
        {row.buckets.map((n, i) => (
          <div
            key={i}
            className={[
              "first:rounded-l-md last:rounded-r-md",
              i === 0
                ? "bg-foreground"
                : i === 1
                  ? "bg-foreground/75"
                  : i === 2
                    ? "bg-foreground/45"
                    : i === 3
                      ? "bg-foreground/25"
                      : "bg-foreground/12",
            ].join(" ")}
            style={{ width: `${(n / total) * 100}%` }}
            title={`${labels[i] || "Band"} · ${n}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>Stronger signal</span>
        <span>Weaker signal</span>
      </div>
    </div>
  );
}

export default function EmployerAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description={`${mockEmployerFunnelSummary.cohort} · ${mockUniverse.orgName}`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
            <Badge variant="outline">Rubric-backed</Badge>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Invite → submit" value={`${Math.round(mockEmployerFunnelSummary.inviteToSubmit * 100)}%`} hint="Share of invited candidates who submit." />
        <StatCard label="Submit → decision" value={`${Math.round(mockEmployerFunnelSummary.submitToDecision * 100)}%`} hint="Of submissions that reach a final decision." />
        <StatCard label="Rubric drift" value={`${Math.round(mockEmployerSignalQuality.rubricDriftScore * 100)}%`} hint="Variance across reviewers on anchored criteria." />
        <StatCard label="Top drop-off" value={mockEmployerFunnelSummary.topDropoff} hint={mockEmployerFunnelSummary.topDropoffNote} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <Panel title="Pipeline funnel" description="Invited through decision — counts and conversion between stages.">
          <FunnelBarChart stages={mockEmployerFunnelStages} />
          <div className="mt-6">
            <DataTable columns={funnelColumns} rows={mockEmployerFunnelStages} getRowKey={(r) => r.key} density="comfortable" />
          </div>
        </Panel>

        <Panel title="Signal quality" description="Operational read on whether scores stay anchored to evidence.">
          <p className="text-sm text-slate-600 dark:text-slate-300">{mockEmployerSignalQuality.note}</p>
          <div className="mt-4 rounded-md border border-border bg-muted/80 p-4 text-sm text-foreground">
            <div className="font-semibold">Recommended next step</div>
            <p className="mt-1 text-muted-foreground">{mockEmployerSignalQuality.topAction}</p>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Rubric distributions" description="Per-criterion score bands with evidence linkage and reviewer alignment.">
          <div className="grid gap-4 lg:grid-cols-1">
            {mockEmployerRubricDistributions.map((row) => (
              <DistributionRow key={row.criterionId} row={row} />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

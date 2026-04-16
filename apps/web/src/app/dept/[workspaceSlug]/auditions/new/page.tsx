"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Button, PageHeader, Panel, SegmentedControl } from "@metriq/ui";

import { deptPath } from "../../../../../lib/dept-path";

type Template =
  | "WorkSample_Brief"
  | "Debugging_Incident"
  | "PR_Review"
  | "DesignDoc_Mini"
  | "Data_Analysis"
  | "Customer_Support_Triage";

const templates: { value: Template; label: string; description: string }[] = [
  { value: "WorkSample_Brief", label: "Work sample", description: "Context → plan → trade-offs → risks." },
  { value: "Debugging_Incident", label: "Debugging incident", description: "Logs + symptoms → root cause → fix → regression tests." },
  { value: "PR_Review", label: "PR review", description: "Review a diff, spot issues, propose changes." },
  { value: "DesignDoc_Mini", label: "Mini design doc", description: "Requirements → API/data model → rollout plan." },
  { value: "Data_Analysis", label: "Data analysis", description: "Dataset → analysis narrative → decision." },
  { value: "Customer_Support_Triage", label: "Support triage", description: "Prioritize, respond, escalate with policy." },
];

export default function DeptNewAuditionPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const slug = params?.workspaceSlug ?? "";
  const [template, setTemplate] = React.useState<Template>("WorkSample_Brief");

  const selected = templates.find((t) => t.value === template) ?? templates[0]!;

  return (
    <>
      <PageHeader
        title="New audition"
        description="Start from a high-signal template, then customize stages, deliverables, and rubric."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                window.location.href = deptPath(slug, "/auditions");
              }}
            >
              Create draft
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Template picker" description="Choose a starting point (everything is editable).">
          <div className="grid gap-3">
            <SegmentedControl
              value={template}
              onValueChange={(v) => setTemplate(v as Template)}
              options={templates.map((t) => ({ value: t.value, label: t.label }))}
            />
            <div className="text-sm text-slate-600 dark:text-slate-300">{selected.description}</div>
          </div>
        </Panel>

        <Panel title="What you can customize" description="No multiple-choice tests required.">
          <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
              Stages: prompts, inputs (datasets/mock APIs), timebox, and deliverables.
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              Artifacts: links, write-ups, uploads, code snippets, repo links, screenshots/video.
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              Rubric: weighted criteria with anchors + reviewer guidance, tied to evidence.
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              Workflow: assignments, blind review, calibration, and optional auto-checks.
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

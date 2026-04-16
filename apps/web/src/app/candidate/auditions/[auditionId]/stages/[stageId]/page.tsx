"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { BlockCard, Button, EmptyState, PageHeader, Panel } from "@metriq/ui";

import { mockAuditionDetail } from "../../../../../../mocks/candidate/audition-detail";
import { demoGetSubmission } from "../../../../../../mocks/candidate/store";

export default function CandidateStageWorkspacePage() {
  const router = useRouter();
  const params = useParams<{ auditionId: string; stageId: string }>();
  const search = useSearchParams();

  const auditionId = params?.auditionId ?? "";
  const stageId = params?.stageId ?? "";
  const submissionId = search?.get("submissionId") ?? "";

  const stage = React.useMemo(() => {
    return mockAuditionDetail.stages.find((s) => s.id === stageId) ?? null;
  }, [stageId]);

  const [sub, setSub] = React.useState(() => demoGetSubmission(submissionId || "sub_demo_active"));

  React.useEffect(() => {
    setSub(demoGetSubmission(submissionId || "sub_demo_active"));
  }, [submissionId]);

  const deliverables = stage?.requiredArtifacts.slice(0, 12) ?? [];
  const stageArtifacts = React.useMemo(() => {
    const title = stage?.title ?? "";
    const prefix = title ? `${title}:` : "";
    return (sub?.artifacts ?? []).filter((a) => (prefix ? a.label.startsWith(prefix) : true));
  }, [sub?.artifacts, stage?.title]);

  const error = null;

  return (
    <>
      <PageHeader
        title={stage?.title ?? "Stage workspace"}
        eyebrow={<span>{mockAuditionDetail.roleTitle} • Stage</span>}
        description={stage ? "Focus on the work. Keep your deliverables checklist complete." : "Loading stage…"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (!stage || !submissionId) return;
                router.push(
                  `/candidate/auditions/${auditionId}/stages/${stageId}/submit?submissionId=${encodeURIComponent(submissionId)}`,
                );
              }}
              disabled={!stage}
            >
              Review submission
            </Button>
            <Button
              onClick={() => {
                if (!stage || !submissionId) return;
                router.push(
                  `/candidate/auditions/${auditionId}/stages/${stageId}/submit?submissionId=${encodeURIComponent(submissionId)}`,
                );
              }}
              disabled={!stage}
            >
              Submit artifacts
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {error ? (
          <EmptyState title="Couldn’t load stage" description={error} actionLabel="Back to overview" onAction={() => router.push(`/candidate/auditions/${auditionId}`)} />
        ) : null}

        {stage && !error ? (
          <>
            <div className="grid gap-4">
              <Panel
                title="Objective"
                description="What this stage is meant to prove."
                density="tight"
                contentClassName="space-y-3"
              >
                <div className="text-sm text-slate-700 dark:text-slate-200">{stage.objective}</div>
              </Panel>

              <BlockCard title="Work block" typeLabel="work sample" description="Respond to the prompt with complete, evaluable evidence.">
                <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{stage.objective}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  You’ll submit artifacts on the next screen (links and/or write-ups).
                </div>
              </BlockCard>
            </div>

            <div className="grid gap-4">
              <Panel title="Constraints" description="Keep these visible while you work." density="tight">
                <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                  {stage.constraints.map((c) => (
                    <div key={c} className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                      {c}
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Product principle: clarity beats cleverness. If you make assumptions, state them in your artifact context.
                  </div>
                </div>
              </Panel>

              <Panel title="Deliverables checklist" description="Required items for this stage." density="tight">
                {deliverables.length === 0 ? (
                  <div className="text-sm text-slate-600 dark:text-slate-300">No structured deliverables available for this stage yet.</div>
                ) : (
                  <ul className="grid gap-2">
                    {deliverables.map((d) => {
                      const present = stageArtifacts.some((a) => a.label.toLowerCase().includes(d.toLowerCase()));
                      return (
                        <li key={d} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                          <div className="text-sm text-slate-900 dark:text-slate-50">{d}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{present ? "Added" : "Missing"}</div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-3 text-sm">
                  <Link
                    href={`/candidate/auditions/${auditionId}/stages/${stageId}/submit?submissionId=${encodeURIComponent(submissionId)}`}
                    className="underline text-slate-700 dark:text-slate-200"
                  >
                    Go to artifact submission
                  </Link>
                </div>
              </Panel>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}


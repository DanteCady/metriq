"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ArtifactViewer,
  Badge,
  Button,
  EmptyState,
  Modal,
  PageHeader,
  Panel,
  Textarea,
} from "@metriq/ui";

import { mockAuditionDetail } from "../../../../../../../mocks/candidate/audition-detail";
import { demoAddArtifact, demoGetSubmission, demoRemoveArtifact, demoSubmit } from "../../../../../../../mocks/candidate/store";

type ArtifactType = "text" | "link";

function defaultTypeForValue(value: string): ArtifactType {
  const v = value.trim();
  return v.startsWith("http://") || v.startsWith("https://") ? "link" : "text";
}

export default function CandidateArtifactSubmissionPage() {
  const router = useRouter();
  const params = useParams<{ auditionId: string; stageId: string }>();
  const search = useSearchParams();

  const auditionId = params?.auditionId ?? "";
  const stageId = params?.stageId ?? "";
  const submissionId = search?.get("submissionId") ?? "";

  const stage = React.useMemo(() => {
    return mockAuditionDetail.stages.find((s) => s.id === stageId) ?? null;
  }, [stageId]);

  const required = stage?.requiredArtifacts.slice(0, 12) ?? [];

  const stagePrefix = stage?.title ? `${stage.title}: ` : "";
  const [sub, setSub] = React.useState(() => demoGetSubmission(submissionId || "sub_demo_active"));

  React.useEffect(() => {
    setSub(demoGetSubmission(submissionId || "sub_demo_active"));
  }, [submissionId]);

  const stageArtifacts = React.useMemo(() => {
    return (sub?.artifacts ?? []).filter((a) => (stagePrefix ? a.label.startsWith(stagePrefix) : true));
  }, [sub?.artifacts, stagePrefix]);

  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState(required[0] ?? "");
  const [value, setValue] = React.useState("");

  const canEdit = sub?.status === "draft";

  const missing = required.filter((r) => !stageArtifacts.some((a) => a.label.toLowerCase().includes(r.toLowerCase())));

  const error = null;

  return (
    <>
      <PageHeader
        title="Artifact submission"
        eyebrow={stage ? <span>{mockAuditionDetail.roleTitle} • {stage.title}</span> : null}
        description="Make your evidence package complete and easy to evaluate."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setOpen(true)} disabled={!canEdit || !stage}>
              Add artifact
            </Button>
            <Button
              onClick={async () => {
                setSub(demoSubmit(submissionId || "sub_demo_active"));
                router.push(`/candidate/auditions/${auditionId}/results?submissionId=${encodeURIComponent(submissionId)}`);
              }}
              disabled={!sub || !canEdit || missing.length > 0}
            >
              Submit stage
            </Button>
          </div>
        }
        aside={
          missing.length === 0 ? (
            <Badge variant="secondary">Complete</Badge>
          ) : (
            <Badge variant="outline">{missing.length} missing</Badge>
          )
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {error ? <EmptyState title="Couldn’t load submission" description={error} actionLabel="Back" onAction={() => router.back()} /> : null}

        {stage && sub && !error ? (
          <>
            <div className="grid gap-4">
              <Panel title="Required artifacts" description="These must be present before you can submit." density="tight">
                {required.length === 0 ? (
                  <div className="text-sm text-slate-600 dark:text-slate-300">No required artifacts are defined for this stage yet.</div>
                ) : (
                  <ul className="grid gap-2">
                    {required.map((r) => {
                      const present = !missing.includes(r);
                      return (
                        <li key={r} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                          <div className="text-sm text-slate-900 dark:text-slate-50">{r}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{present ? "Added" : "Missing"}</div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              <Panel
                title="What the evaluator will see"
                description="A compact preview of your evidence. Add short context in your artifact content when helpful."
                density="tight"
              >
                {stageArtifacts.length === 0 ? (
                  <EmptyState title="No artifacts added yet" description="Add links and/or write-ups that directly satisfy the deliverables." />
                ) : (
                  <div className="grid gap-3">
                    {stageArtifacts.map((a) => (
                      <div key={a.id} className="grid gap-2">
                        <ArtifactViewer kind={a.type} label={a.label} value={a.content} />
                        {canEdit ? (
                          <div className="flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                setSub(demoRemoveArtifact(submissionId || "sub_demo_active", a.id));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <div className="grid gap-4">
              <Panel title="Submission meaning" description="Submitting locks your stage evidence for evaluation." density="tight">
                <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                    Once submitted, this stage is treated as final for evaluation. If you need to clarify something, add it as artifact context before submitting.
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      router.push(`/candidate/auditions/${auditionId}/stages/${stageId}?submissionId=${encodeURIComponent(submissionId)}`);
                    }}
                  >
                    Back to workspace
                  </Button>
                </div>
              </Panel>
            </div>
          </>
        ) : null}
      </div>

      <Modal
        open={open}
        title="Add artifact"
        description="Add either a link (PR, doc, repo) or a text write-up. Label it so it maps cleanly to a deliverable."
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const cleanLabel = label.trim();
                const cleanValue = value.trim();
                const type: ArtifactType = defaultTypeForValue(cleanValue);
                setSub(
                  demoAddArtifact(submissionId || "sub_demo_active", {
                    type,
                    label: `${stagePrefix}${cleanLabel}`,
                    content: cleanValue,
                  }),
                );
                setValue("");
                setOpen(false);
              }}
              disabled={!label.trim() || !value.trim()}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Deliverable label</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            >
              {(required.length > 0 ? required : ["Artifact"]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Artifact content</span>
            <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Paste a URL or write a short, structured response…" />
          </label>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tip: include 1–3 sentences of context (what it is, where to look, constraints/assumptions).
          </div>
        </div>
      </Modal>
    </>
  );
}


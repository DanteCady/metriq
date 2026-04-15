"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { AppFrame } from "../../../../components/app-frame";
import {
  Button,
  DataTable,
  EmptyState,
  LoadingState,
  Modal,
  PageHeader,
  PageSection,
  SubmissionArtifactViewer,
} from "@metriq/ui";

import { trpc } from "../../../providers";

type ArtifactType = "text" | "link";

export default function CandidateSubmissionPage() {
  const params = useParams<{ submissionId: string }>();
  const router = useRouter();
  const submissionId = params?.submissionId ?? "";

  const sub = trpc.submission.getSubmission.useQuery({ submissionId }, { enabled: Boolean(submissionId) });
  const addArtifact = trpc.submission.addArtifact.useMutation();
  const removeArtifact = trpc.submission.removeArtifact.useMutation();
  const submit = trpc.submission.submit.useMutation();

  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<ArtifactType>("text");
  const [label, setLabel] = React.useState("");
  const [content, setContent] = React.useState("");

  const canEdit = sub.data?.status === "draft";

  return (
    <AppFrame>
      <PageHeader
        title="Submission"
        description={sub.data ? `Status: ${sub.data.status}` : "Loading submission…"}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setOpen(true)} disabled={!canEdit}>
              Add artifact
            </Button>
            <Button
              onClick={async () => {
                await submit.mutateAsync({ submissionId });
                router.push(`/candidate/results/${submissionId}`);
              }}
              disabled={!sub.data || !canEdit || submit.isPending}
            >
              {submit.isPending ? "Submitting…" : "Submit"}
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        {sub.isLoading ? <LoadingState /> : null}
        {sub.isError ? <EmptyState title="Couldn’t load submission" description={sub.error.message} actionLabel="Retry" onAction={() => sub.refetch()} /> : null}

        {sub.data ? (
          <PageSection title="Artifacts" description="Add links or text write-ups as your submission evidence.">
            {sub.data.artifacts.length === 0 ? (
              <EmptyState title="No artifacts yet" description="Add at least one artifact before submitting." />
            ) : (
              <div className="grid gap-3">
                {sub.data.artifacts.map((a) => (
                  <div key={a.id} className="space-y-2">
                    <SubmissionArtifactViewer type={a.type} label={a.label} value={a.content} />
                    {canEdit ? (
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            await removeArtifact.mutateAsync({ submissionId, artifactId: a.id });
                            await sub.refetch();
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
          </PageSection>
        ) : null}

        {sub.data ? (
          <PageSection title="Debug panel" description="Useful while wiring end-to-end contracts.">
            <DataTable
              rows={sub.data.artifacts}
              getRowKey={(r) => r.id}
              columns={[
                { key: "label", header: "Label", cell: (r) => r.label },
                { key: "type", header: "Type", cell: (r) => r.type },
                { key: "len", header: "Chars", cell: (r) => String(r.content.length), className: "text-right", headerClassName: "text-right" },
              ]}
              emptyState={{ title: "No artifacts", description: "Add artifacts to see them here." }}
            />
          </PageSection>
        ) : null}
      </div>

      <Modal
        open={open}
        title="Add artifact"
        description="Add either a link (e.g. PR, doc) or a text write-up."
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await addArtifact.mutateAsync({
                  submissionId,
                  type,
                  label: label.trim(),
                  content: content.trim(),
                });
                setLabel("");
                setContent("");
                setOpen(false);
                await sub.refetch();
              }}
              disabled={!label.trim() || !content.trim() || addArtifact.isPending}
            >
              {addArtifact.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Type</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={type}
              onChange={(e) => setType(e.target.value as ArtifactType)}
            >
              <option value="text">Text</option>
              <option value="link">Link</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Label</span>
            <input
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Root cause write-up"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-600 dark:text-slate-300">{type === "link" ? "URL" : "Content"}</span>
            <textarea
              className="min-h-[140px] rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === "link" ? "https://…" : "Write your artifact…"}
            />
          </label>
        </div>
      </Modal>
    </AppFrame>
  );
}


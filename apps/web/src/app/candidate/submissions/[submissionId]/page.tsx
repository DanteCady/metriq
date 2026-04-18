"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Button,
  DataTable,
  EmptyState,
  Modal,
  PageHeader,
  PageSection,
  SubmissionArtifactViewer,
} from "@metriq/ui";

import { demoAddArtifact, demoGetSubmission, demoRemoveArtifact, demoSubmit } from "../../../../mocks/candidate/store";

type ArtifactType = "text" | "link";

export default function CandidateSubmissionPage() {
  const params = useParams<{ submissionId: string }>();
  const router = useRouter();
  const submissionId = params?.submissionId ?? "";

  const [sub, setSub] = React.useState(() => demoGetSubmission(submissionId || "sub_demo_active"));

  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<ArtifactType>("text");
  const [label, setLabel] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    setSub(demoGetSubmission(submissionId || "sub_demo_active"));
  }, [submissionId]);

  const canEdit = sub.status === "draft";

  return (
    <>
      <PageHeader
        title="Submission"
        description={`Status: ${sub.status}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setOpen(true)} disabled={!canEdit}>
              Add artifact
            </Button>
            <Button
              onClick={async () => {
                setSub(demoSubmit(submissionId || "sub_demo_active"));
                router.push(`/candidate/results/${submissionId}`);
              }}
              disabled={!canEdit}
            >
              Submit
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        <PageSection title="Artifacts" description="Add links or text write-ups as your submission evidence.">
          {sub.artifacts.length === 0 ? (
            <EmptyState title="No artifacts yet" description="Add at least one artifact before submitting." />
          ) : (
            <div className="grid gap-3">
              {sub.artifacts.map((a) => (
                <div key={a.id} className="space-y-2">
                  <SubmissionArtifactViewer type={a.type} label={a.label} value={a.content} />
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
        </PageSection>

        <PageSection title="Debug panel" description="Useful while wiring end-to-end contracts.">
          <DataTable
            rows={sub.artifacts}
            getRowKey={(r) => r.id}
            columns={[
              { key: "label", header: "Label", cell: (r) => r.label },
              { key: "type", header: "Type", cell: (r) => r.type },
              { key: "len", header: "Chars", cell: (r) => String(r.content.length), className: "text-right", headerClassName: "text-right" },
            ]}
            emptyState={{ title: "No artifacts", description: "Add artifacts to see them here." }}
          />
        </PageSection>

        {sub.status !== "draft" ? (
          <EmptyState
            title="Submission is locked"
            description="This submission has been submitted. In v1, editing is disabled after submit."
          />
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
                setSub(
                  demoAddArtifact(submissionId || "sub_demo_active", {
                    type,
                    label: label.trim(),
                    content: content.trim(),
                  }),
                );
                setLabel("");
                setContent("");
                setOpen(false);
              }}
              disabled={!label.trim() || !content.trim()}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Type</span>
            <select
              className="h-9 rounded-md border border-border bg-card px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as ArtifactType)}
            >
              <option value="text">Text</option>
              <option value="link">Link</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Label</span>
            <input
              className="h-9 rounded-md border border-border bg-card px-3 text-sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Root cause write-up"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">{type === "link" ? "URL" : "Content"}</span>
            <textarea
              className="min-h-[140px] rounded-md border border-border bg-card p-3 text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === "link" ? "https://…" : "Write your artifact…"}
            />
          </label>
        </div>
      </Modal>
    </>
  );
}


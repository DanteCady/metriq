"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppShell, Badge, EmptyState, PageHeader, PageSection } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";
import { Input } from "@metriq/ui/components/ui/input";
import { Textarea } from "@metriq/ui/components/ui/textarea";

import {
  selectSimulationById,
  selectSubmissionById,
  useCandidateStore,
} from "../../../../lib/candidate-store";

export default function CandidateSubmissionWorkAreaPage() {
  const router = useRouter();
  const params = useParams<{ submissionId: string }>();
  const submissionId = params.submissionId;

  const submission = useCandidateStore(useMemo(() => selectSubmissionById(submissionId), [submissionId]));
  const simulation = useCandidateStore(
    useMemo(() => selectSimulationById(submission?.simulationId ?? "__missing__"), [submission?.simulationId]),
  );

  const upsertArtifact = useCandidateStore((s) => s.upsertArtifact);
  const removeArtifact = useCandidateStore((s) => s.removeArtifact);
  const submitSubmission = useCandidateStore((s) => s.submitSubmission);

  const [newArtifactType, setNewArtifactType] = useState<"text" | "link">("text");
  const [newArtifactLabel, setNewArtifactLabel] = useState("");
  const [newArtifactContent, setNewArtifactContent] = useState("");

  const isSubmitted = submission?.status === "submitted";
  const hasMissingRequired =
    submission?.artifacts.some((a) => a.content.trim().length === 0 && a.label.trim().length > 0) ?? false;

  return (
    <AppShell>
      <PageHeader
        title={simulation ? simulation.title : "Submission"}
        description={submission ? `Submission ${submission.id}` : "Loading…"}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/candidate">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
            {submission ? (
              <>
                {isSubmitted ? (
                  <Link href={`/candidate/results/${submission.id}`}>
                    <Button size="sm">View results</Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      submitSubmission(submission.id);
                      router.push(`/candidate/results/${submission.id}`);
                    }}
                    disabled={!submission.artifacts.length || hasMissingRequired}
                  >
                    Submit
                  </Button>
                )}
              </>
            ) : null}
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        {!submission || !simulation ? (
          <PageSection>
            <EmptyState title="Submission not found" description="Return to the dashboard to start a simulation." />
          </PageSection>
        ) : (
          <>
            <PageSection title="Status" description="Drafts are editable until you submit.">
              <div className="flex flex-wrap items-center gap-2">
                {isSubmitted ? <Badge variant="success">Submitted</Badge> : <Badge variant="warning">Draft</Badge>}
                <Badge variant="secondary">{simulation.type.replaceAll("_", " ")}</Badge>
                <Badge variant="secondary">{simulation.difficulty}</Badge>
              </div>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Started {new Date(submission.startedAt).toLocaleString()}
                {submission.submittedAt ? ` · Submitted ${new Date(submission.submittedAt).toLocaleString()}` : null}
              </div>
              {!isSubmitted && hasMissingRequired ? (
                <div className="mt-3 text-sm text-amber-700 dark:text-amber-200">
                  Fill in all artifact contents before submitting.
                </div>
              ) : null}
            </PageSection>

            <PageSection title="Instructions" description="Use these prompts to structure your submission.">
              <div className="grid gap-3">
                {simulation.sections.map((sec) => (
                  <div key={sec.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="text-sm font-semibold">{sec.title}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sec.instructions}</div>
                    {sec.requiredArtifacts.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sec.requiredArtifacts.map((a) => (
                          <Badge key={`${sec.id}-${a.label}`} variant="outline">
                            {a.label} · {a.type}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </PageSection>

            <PageSection title="Artifacts" description="Add text answers and links.">
              {submission.artifacts.length === 0 ? (
                <EmptyState title="No artifacts yet" description="Add your first artifact below." />
              ) : (
                <div className="grid gap-3">
                  {submission.artifacts.map((a) => (
                    <div key={a.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{a.type}</Badge>
                            <Input
                              value={a.label}
                              onChange={(e) => upsertArtifact({ submissionId, artifactId: a.id, type: a.type, label: e.target.value, content: a.content })}
                              disabled={isSubmitted}
                              placeholder="Artifact label"
                            />
                          </div>
                          <div className="mt-3">
                            <Textarea
                              value={a.content}
                              onChange={(e) =>
                                upsertArtifact({
                                  submissionId,
                                  artifactId: a.id,
                                  type: a.type,
                                  label: a.label,
                                  content: e.target.value,
                                })
                              }
                              disabled={isSubmitted}
                              placeholder={a.type === "link" ? "Paste a URL…" : "Write your response…"}
                            />
                          </div>
                        </div>
                        <div className="shrink-0">
                          {!isSubmitted ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => removeArtifact({ submissionId, artifactId: a.id })}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSubmitted ? (
                <div className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="text-sm font-semibold">Add artifact</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="md:col-span-1">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Type</div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          variant={newArtifactType === "text" ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setNewArtifactType("text")}
                        >
                          Text
                        </Button>
                        <Button
                          type="button"
                          variant={newArtifactType === "link" ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setNewArtifactType("link")}
                        >
                          Link
                        </Button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="grid gap-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Label</div>
                          <div className="mt-2">
                            <Input value={newArtifactLabel} onChange={(e) => setNewArtifactLabel(e.target.value)} placeholder="e.g. Root cause analysis" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Content</div>
                          <div className="mt-2">
                            <Textarea value={newArtifactContent} onChange={(e) => setNewArtifactContent(e.target.value)} placeholder={newArtifactType === "link" ? "https://…" : "Write your response…"} />
                          </div>
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={() => {
                              const label = newArtifactLabel.trim();
                              const content = newArtifactContent.trim();
                              if (!label || !content) return;
                              upsertArtifact({ submissionId, type: newArtifactType, label, content });
                              setNewArtifactLabel("");
                              setNewArtifactContent("");
                            }}
                            disabled={!newArtifactLabel.trim() || !newArtifactContent.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </PageSection>
          </>
        )}
      </div>
    </AppShell>
  );
}


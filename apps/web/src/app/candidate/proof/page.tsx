"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ArtifactViewer, Badge, Button, EmptyState, EvidenceList, PageHeader, Panel, Textarea } from "@metriq/ui";
import { mockProofSeedHighlights } from "../../../mocks/candidate/proof-seed";
import type { MockProofHighlight } from "../../../mocks/candidate/proof-types";
import { mockSubmissionDraft, mockSubmissionSubmitted } from "../../../mocks/candidate/submission";
import { demoListSubmissions } from "../../../mocks/candidate/store";
import { mockUniverse } from "../../../mocks/universe";

function readHighlights(): MockProofHighlight[] {
  try {
    const raw = window.localStorage.getItem("metriq.proof.highlights.v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (h): h is MockProofHighlight =>
        Boolean(h) &&
        typeof (h as MockProofHighlight).id === "string" &&
        typeof (h as MockProofHighlight).title === "string" &&
        typeof (h as MockProofHighlight).capability === "string" &&
        typeof (h as MockProofHighlight).artifactId === "string" &&
        ((h as MockProofHighlight).summary === undefined || typeof (h as MockProofHighlight).summary === "string"),
    );
  } catch {
    return [];
  }
}

function writeHighlights(next: MockProofHighlight[]) {
  window.localStorage.setItem("metriq.proof.highlights.v1", JSON.stringify(next));
}

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
        {n}
      </span>
      {children}
    </h3>
  );
}

export default function CandidateProofProfilePage() {
  const router = useRouter();
  const submissions = React.useMemo(() => demoListSubmissions(), []);
  const [selectedSubmissionId, setSelectedSubmissionId] = React.useState<string | null>(null);
  const selectedId = selectedSubmissionId ?? submissions[0]?.id ?? null;

  const [selectedArtifactId, setSelectedArtifactId] = React.useState<string | undefined>(undefined);
  const [highlights, setHighlights] = React.useState<MockProofHighlight[]>([]);

  React.useEffect(() => {
    const existing = readHighlights();
    if (existing.length > 0) {
      setHighlights(existing);
      return;
    }
    writeHighlights(mockProofSeedHighlights);
    setHighlights(mockProofSeedHighlights);
  }, []);

  const demoArtifacts = React.useMemo(() => {
    return [...mockSubmissionDraft.artifacts, ...mockSubmissionSubmitted.artifacts];
  }, []);

  const selectedSubmission = submissions.find((s) => s.id === selectedId) ?? null;
  const artifacts = selectedSubmission?.artifacts?.length ? selectedSubmission.artifacts : demoArtifacts;
  const evidenceItems = artifacts.map((a) => ({
    id: a.id,
    title: a.label,
    subtitle: a.type === "link" ? a.content : "Text artifact",
    meta: a.type === "link" ? "Link" : "Write-up",
    status: highlights.some((h) => h.artifactId === a.id) ? (
      <Badge variant="success">On profile</Badge>
    ) : (
      <Badge variant="outline">Not highlighted</Badge>
    ),
  }));

  const selected = artifacts.find((a) => a.id === selectedArtifactId) ?? artifacts[0] ?? null;
  const highlightForSelected = highlights.find((h) => h.artifactId === selected?.id);

  const [capability, setCapability] = React.useState("Execution");
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");

  const canCreate = Boolean(selected && title.trim() && summary.trim());

  const grouped = React.useMemo(() => {
    const map = new Map<string, MockProofHighlight[]>();
    for (const h of highlights) {
      const arr = map.get(h.capability) ?? [];
      arr.push(h);
      map.set(h.capability, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [highlights]);

  const submissionShort = (id: string) => id.slice(0, 10);

  return (
    <>
      <PageHeader
        title="Proof profile"
        description="Turn submission evidence into short proof cards. Recruiters see the preview on the right — not your full raw timeline."
        actions={
          <Button variant="secondary" onClick={() => router.push("/candidate/auditions")}>
            Back to auditions
          </Button>
        }
      />

      <p className="mt-4 rounded-lg border border-border border-l-4 border-l-primary bg-primary/[0.04] px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:bg-primary/[0.07]">
        <span className="font-medium text-foreground">Three steps: </span>
        pick the submission that contains the work, select one artifact, then write the highlight. Switching submission reloads the evidence list.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)]">
        <div className="grid gap-6">
          <Panel
            title="Your highlights"
            description="What lives on your profile today, grouped by capability. “On profile” in the list below means that artifact already has a card here."
          >
            {grouped.length === 0 ? (
              <EmptyState
                title="No highlights yet"
                description="Use the builder below: pick evidence, then add a title and summary. Highlights appear here grouped by capability."
              />
            ) : (
              <div className="grid gap-3">
                {grouped.map(([cap, hs]) => (
                  <div key={cap} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-foreground">{cap}</div>
                      <Badge variant="outline">{hs.length}</Badge>
                    </div>
                    <ul className="mt-2 grid gap-2">
                      {hs.map((h) => (
                        <li key={h.id} className="flex flex-col gap-1 rounded-md border border-border bg-card p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-medium text-foreground">{h.title}</div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => {
                                setHighlights((prev) => {
                                  const next = prev.filter((x) => x.id !== h.id);
                                  writeHighlights(next);
                                  return next;
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          {h.summary ? <div className="text-xs leading-relaxed text-muted-foreground">{h.summary}</div> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Build a highlight"
            description="Work through the steps in order. The preview column shows the same structure a hiring team sees."
          >
            <div className="space-y-8">
              <section className="grid gap-3">
                <StepHeading n={1}>Choose submission</StepHeading>
                <p className="text-sm text-muted-foreground">
                  Submissions come from auditions and simulations. Only the selected package loads in the evidence list.
                </p>
                {submissions.length ? (
                  <div className="flex flex-wrap gap-2">
                    {submissions.slice(0, 8).map((s) => (
                      <Button
                        key={s.id}
                        size="sm"
                        variant={selectedId === s.id ? "default" : "secondary"}
                        className="tabular-nums"
                        onClick={() => {
                          setSelectedSubmissionId(s.id);
                          setSelectedArtifactId(undefined);
                        }}
                      >
                        <span className={selectedId === s.id ? "opacity-90" : "text-muted-foreground"}>
                          {s.status === "draft" ? "Draft" : "Submitted"}
                        </span>
                        <span aria-hidden> · </span>
                        <span>{submissionShort(s.id)}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No submissions yet"
                    description="Complete an audition or simulation to capture artifacts, then return here."
                    actionLabel="Go to auditions"
                    onAction={() => router.push("/candidate/auditions")}
                  />
                )}
              </section>

              <section className="grid gap-3 border-t border-border pt-8">
                <StepHeading n={2}>Select evidence</StepHeading>
                <p className="text-sm text-muted-foreground">
                  One row should be highlighted. That artifact is what your new proof card will cite.
                </p>
                <EvidenceList
                  embedded
                  items={evidenceItems}
                  selectedId={selected?.id}
                  onSelect={(id) => setSelectedArtifactId(id)}
                  emptyState={{
                    title: "No artifacts for this submission",
                    description: "Add artifacts while completing stages, or pick another submission above.",
                  }}
                />
              </section>

              <section className="grid gap-4 border-t border-border pt-8">
                <StepHeading n={3}>Describe the highlight</StepHeading>
                <div className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Evidence in use: </span>
                  <span className="font-medium text-foreground">{selected?.label ?? "—"}</span>
                  {highlightForSelected ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      This artifact already has a highlight (“{highlightForSelected.title}”). You can remove it above and
                      add a new one, or pick different evidence.
                    </span>
                  ) : null}
                </div>

                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Capability</span>
                  <select
                    className="h-9 rounded-md border border-border bg-card px-3 text-sm"
                    value={capability}
                    onChange={(e) => setCapability(e.target.value)}
                  >
                    <option value="Execution">Execution</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="Communication">Communication</option>
                    <option value="Quality">Quality</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Title</span>
                  <input
                    className="h-9 rounded-md border border-border bg-card px-3 text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Shipped a clear root-cause write-up + fix plan"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Summary</span>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Problem → approach → outcome → trade-offs. Keep it recruiter-scannable."
                  />
                </label>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!selected) return;
                    const next: MockProofHighlight = {
                      id: `h_${Math.random().toString(16).slice(2)}`,
                      title: title.trim(),
                      capability,
                      artifactId: selected.id,
                      summary: summary.trim(),
                    };
                    setHighlights((prev) => {
                      const updated = [next, ...prev];
                      writeHighlights(updated);
                      return updated;
                    });
                    setTitle("");
                    setSummary("");
                  }}
                  disabled={!canCreate}
                >
                  Add highlight to profile
                </Button>
                <p className="text-xs text-muted-foreground">
                  Demo: highlights are stored in this browser only ({mockUniverse.orgName} preview).
                </p>
              </section>
            </div>
          </Panel>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <Panel
            title="Employer preview"
            description="Read-only mock of a capability view. It follows the evidence and highlight you selected."
            density="tight"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-b from-card to-muted/60 shadow-sm dark:to-muted/40">
              <div className="border-b border-border bg-card/90 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Proof preview</div>
                    <div className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground">
                      {mockUniverse.candidateNames[0]}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Shared with {mockUniverse.orgName} · Evidence-linked profile
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Badge variant="success">Verified audition</Badge>
                    <Badge variant="info">Capability signal</Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Execution", "Reasoning", "Communication"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-primary/25 bg-primary/[0.06] font-medium text-foreground dark:bg-primary/[0.1]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4 p-4">
                {highlightForSelected ? (
                  <div className="rounded-lg border border-border bg-muted/70 p-3 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highlight</div>
                    <div className="mt-1 font-semibold text-foreground">{highlightForSelected.title}</div>
                    {highlightForSelected.summary ? (
                      <p className="mt-2 text-sm text-muted-foreground">{highlightForSelected.summary}</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No highlight for this artifact yet — add one in step 3 to show a headline here.
                  </p>
                )}
                {selected ? (
                  <ArtifactViewer kind={selected.type} label={selected.label} value={selected.content} />
                ) : (
                  <div className="text-sm text-muted-foreground">Select a submission with artifacts.</div>
                )}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

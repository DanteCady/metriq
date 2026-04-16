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
    status: highlights.some((h) => h.artifactId === a.id) ? <Badge variant="secondary">Highlighted</Badge> : <Badge variant="outline">Library</Badge>,
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

  const error = null;

  return (
    <>
      <PageHeader
        title="Proof profile"
        description="Curate durable capability signals backed by evidence — not a timeline of tests."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => router.push("/candidate/auditions")}>
              Back to auditions
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {!error ? (
          <>
            <div className="grid gap-4">
              <Panel title="Highlights" description="Your curated proof cards, grouped by capability." density="tight">
                {grouped.length === 0 ? (
                  <EmptyState title="No highlights yet" description="Select an artifact and add a short proof card to build your profile." />
                ) : (
                  <div className="grid gap-3">
                    {grouped.map(([cap, hs]) => (
                      <div key={cap} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{cap}</div>
                          <Badge variant="outline">{hs.length}</Badge>
                        </div>
                        <ul className="mt-2 grid gap-2">
                          {hs.map((h) => (
                            <li key={h.id} className="flex flex-col gap-1 rounded-md bg-slate-50/80 p-2 dark:bg-slate-900/50">
                              <div className="flex items-start justify-between gap-3">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{h.title}</div>
                                <Button
                                  size="sm"
                                  variant="ghost"
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
                              {h.summary ? <div className="text-xs text-slate-600 dark:text-slate-300">{h.summary}</div> : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Artifact library" description="Artifacts from your submissions — switch context without leaving proof." density="tight">
                {submissions.length ? (
                  <div className="flex flex-wrap gap-2">
                    {submissions.slice(0, 8).map((s) => (
                      <Button
                        key={s.id}
                        size="sm"
                        variant={selectedId === s.id ? "default" : "secondary"}
                        onClick={() => {
                          setSelectedSubmissionId(s.id);
                          setSelectedArtifactId(undefined);
                        }}
                      >
                        {s.status === "draft" ? "Active" : "Submitted"} • {s.id.slice(0, 6)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No artifacts yet"
                    description="Start an audition and submit artifacts to build your library."
                    actionLabel="Go to auditions"
                    onAction={() => router.push("/candidate/auditions")}
                  />
                )}
              </Panel>

              <EvidenceList
                title="Artifacts"
                description="Select evidence to preview or highlight."
                items={evidenceItems}
                selectedId={selected?.id}
                onSelect={(id) => setSelectedArtifactId(id)}
                emptyState={{ title: "No artifacts in this submission", description: "Add artifacts while completing an audition stage." }}
              />
            </div>

            <div className="grid gap-4">
              <Panel title="Employer preview" description="What hiring teams see when they open a capability card tied to evidence." density="tight">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-950/80">
                  <div className="border-b border-slate-200/80 bg-white/90 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/90">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Proof preview</div>
                        <div className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          {mockUniverse.candidateNames[0]}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          Shared with {mockUniverse.orgName} · Evidence-linked profile
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Badge variant="secondary">Verified audition</Badge>
                        <Badge variant="outline">Capability signal</Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Execution", "Reasoning", "Communication"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    {highlightForSelected ? (
                      <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm dark:border-indigo-900/40 dark:bg-indigo-950/30">
                        <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Highlight</div>
                        <div className="mt-1 font-semibold text-indigo-950 dark:text-indigo-50">{highlightForSelected.title}</div>
                        {highlightForSelected.summary ? (
                          <p className="mt-2 text-sm text-indigo-900/90 dark:text-indigo-100/90">{highlightForSelected.summary}</p>
                        ) : null}
                      </div>
                    ) : null}
                    {selected ? (
                      <ArtifactViewer kind={selected.type} label={selected.label} value={selected.content} />
                    ) : (
                      <div className="text-sm text-slate-600 dark:text-slate-300">Select an artifact.</div>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel title="Create highlight" description="Turn evidence into a reusable proof card." density="tight">
                <div className="grid gap-3">
                  <label className="grid gap-1 text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Capability</span>
                    <select
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                      value={capability}
                      onChange={(e) => setCapability(e.target.value)}
                    >
                      <option value="Execution">Execution</option>
                      <option value="Reasoning">Reasoning</option>
                      <option value="Communication">Communication</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Highlight title</span>
                    <input
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Shipped a clear root-cause write-up + fix plan"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Proof card summary</span>
                    <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Problem → approach → outcome → trade-offs. Keep it crisp." />
                  </label>
                  <Button
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
                    Add highlight
                  </Button>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Highlights are stored in this browser for the demo environment.
                  </div>
                </div>
              </Panel>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

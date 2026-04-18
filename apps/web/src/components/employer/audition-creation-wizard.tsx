"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Button,
  EmptyState,
  Input,
  Panel,
  SegmentedControl,
  Textarea,
  cn,
} from "@metriq/ui";

import type { EmployerAudition } from "../../mocks/employer/auditions";
import { AuditionBlockEditor } from "./audition-assessment-builder";
import { deptPath } from "../../lib/dept-path";
import {
  SEGMENT_KINDS,
  type AssessmentBlock,
  type AssessmentBlockKind,
  type AssessmentStage,
  type AuditionDraft,
  type AuditionTemplate,
  type DraftValidationIssue,
  type SegmentKind,
  QUESTIONNAIRE_BLOCK_KINDS,
  collectDraftValidationIssues,
  createBlock,
  createSeededStageForSegmentKind,
  effectiveSegmentKind,
  inferSegmentKindFromBlocks,
  newBlockId,
  newStageId,
  normalizeLabConfig,
  reseedStageForSegmentKind,
  segmentKindLabel,
} from "../../lib/audition-draft";

const TEMPLATES: { value: AuditionTemplate; label: string; description: string }[] = [
  { value: "WorkSample_Brief", label: "Work sample", description: "Context → plan → trade-offs → risks." },
  { value: "Debugging_Incident", label: "Debugging", description: "Logs + symptoms → root cause → fix." },
  { value: "PR_Review", label: "PR review", description: "Review a diff and propose changes." },
  { value: "DesignDoc_Mini", label: "Design doc", description: "Requirements → model → rollout." },
  { value: "Data_Analysis", label: "Data analysis", description: "Dataset → narrative → decision." },
  { value: "Customer_Support_Triage", label: "Support triage", description: "Prioritize and respond with policy." },
];

const LEVELS: EmployerAudition["level"][] = ["Junior", "Mid", "Senior", "Staff"];

const ACTIVITY_CHOICES: { kind: SegmentKind; title: string; body: string }[] = [
  { kind: "questionnaire", title: "Questionnaire", body: "Multiple choice, multi-select, and ordering questions in one segment." },
  { kind: "written", title: "Written response", body: "Long-form text with optional word limits." },
  { kind: "code", title: "Code", body: "In-session snippet task with language and starter code." },
  {
    kind: "lab",
    title: "Lab",
    body: "Configure a virtual environment (stack, tooling, task). Provisioning runs in Metriq when lab runners ship.",
  },
  { kind: "drag_drop", title: "Drag-and-drop", body: "Candidate orders items into the correct sequence." },
];

export type WizardStep = "basics" | "flow" | "review";

function replaceStage(stages: AssessmentStage[], stageId: string, next: AssessmentStage): AssessmentStage[] {
  return stages.map((s) => (s.id === stageId ? next : s));
}

function sumStageMinutes(stages: AssessmentStage[]): number {
  return stages.reduce((a, s) => a + s.timeboxMinutes, 0);
}

function duplicateStage(stage: AssessmentStage): AssessmentStage {
  const blocks: AssessmentBlock[] = stage.blocks.map((b) => {
    const id = newBlockId();
    return { ...b, id } as AssessmentBlock;
  });
  return {
    ...stage,
    id: newStageId(),
    title: `${stage.title} (copy)`,
    blocks,
  };
}

function activityLabel(stage: AssessmentStage): string {
  const k = effectiveSegmentKind(stage);
  if (k === "mixed") return "Mixed layout";
  if (k) return segmentKindLabel(k);
  return "Activity";
}

function segmentPreviewLine(stage: AssessmentStage): string {
  const primary = stage.blocks.find((b) => b.kind !== "instruction");
  if (!primary) return "—";
  switch (primary.kind) {
    case "written_response":
      return primary.config.prompt.trim() || "(No prompt yet)";
    case "single_choice":
    case "multi_choice":
      return primary.config.prompt.trim() || "(No question text yet)";
    case "ordering":
      return primary.config.prompt.trim() || "(No prompt yet)";
    case "code_snippet":
      return primary.config.prompt.trim() || "(No prompt yet)";
    case "lab": {
      const c = normalizeLabConfig(primary.config);
      return c.candidateTask.trim() || c.environmentSetup.trim() || "(Lab not configured yet)";
    }
    default:
      return "—";
  }
}

function QuestionnaireEditor({
  stage,
  onChange,
}: {
  stage: AssessmentStage;
  onChange: (s: AssessmentStage) => void;
}) {
  const instructions = stage.blocks.filter((b) => b.kind === "instruction");
  const questions = stage.blocks.filter((b) => QUESTIONNAIRE_BLOCK_KINDS.includes(b.kind as AssessmentBlockKind));

  const rebuildBlocks = (nextInst: AssessmentBlock[], nextQ: AssessmentBlock[]) => {
    onChange({ ...stage, blocks: [...nextInst, ...nextQ] });
  };

  const patchBlock = (id: string, fn: (b: AssessmentBlock) => AssessmentBlock) => {
    onChange({ ...stage, blocks: stage.blocks.map((b) => (b.id === id ? fn(b) : b)) });
  };

  const moveQuestion = (index: number, delta: number) => {
    const inst = instructions;
    const q = [...questions];
    const j = index + delta;
    if (j < 0 || j >= q.length) return;
    const t = q[index]!;
    q[index] = q[j]!;
    q[j] = t;
    rebuildBlocks(inst, q);
  };

  const addQuestion = (kind: "single_choice" | "multi_choice" | "ordering") => {
    const nb = createBlock(kind);
    rebuildBlocks(instructions, [...questions, nb]);
  };

  const removeQuestion = (id: string) => {
    rebuildBlocks(
      instructions,
      questions.filter((b) => b.id !== id),
    );
  };

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Opening text (optional)</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Shown before the first question.</p>
        {instructions.length === 0 ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() =>
              rebuildBlocks(
                [
                  {
                    id: newBlockId(),
                    title: "Candidate instructions",
                    kind: "instruction",
                    config: { body: "", requireAck: false },
                  },
                ],
                questions,
              )
            }
          >
            Add opening text
          </Button>
        ) : (
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            {instructions.map((b) => (
              <div key={b.id}>
                <AuditionBlockEditor block={b} onChange={(nb) => patchBlock(b.id, () => nb)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-700 dark:text-red-300"
                  onClick={() => rebuildBlocks([], questions)}
                >
                  Remove opening text
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Questions</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Candidates answer in order.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("single_choice")}>
              + One answer
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("multi_choice")}>
              + Multiple answers
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("ordering")}>
              + Order items
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-4">
          {questions.map((b, qi) => (
            <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Question {qi + 1}
                </span>
                <div className="flex flex-wrap gap-1">
                  <Button type="button" variant="ghost" size="sm" disabled={qi === 0} onClick={() => moveQuestion(qi, -1)}>
                    Up
                  </Button>
                  <Button type="button" variant="ghost" size="sm" disabled={qi === questions.length - 1} onClick={() => moveQuestion(qi, 1)}>
                    Down
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-red-700 dark:text-red-300" onClick={() => removeQuestion(b.id)}>
                    Remove
                  </Button>
                </div>
              </div>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-200">Label (outline)</span>
                <Input value={b.title} onChange={(e) => patchBlock(b.id, (cur) => ({ ...cur, title: e.target.value } as AssessmentBlock))} />
              </label>
              <div className="mt-3">
                <AuditionBlockEditor block={b} onChange={(nb) => patchBlock(b.id, () => nb)} />
              </div>
            </div>
          ))}
          {questions.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">Add at least one question.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InstructionPrimaryEditor({
  stage,
  onChange,
  primaryKind,
}: {
  stage: AssessmentStage;
  onChange: (s: AssessmentStage) => void;
  primaryKind: "written_response" | "code_snippet" | "lab" | "ordering";
}) {
  const instructions = stage.blocks.filter((b) => b.kind === "instruction");
  const primary = stage.blocks.find((b) => b.kind === primaryKind) ?? null;

  const setBlocks = (inst: AssessmentBlock[], prim: AssessmentBlock | null) => {
    const rest = stage.blocks.filter((b) => b.kind !== "instruction" && b.kind !== primaryKind);
    const next = [...inst, ...(prim ? [prim] : []), ...rest];
    onChange({ ...stage, blocks: next });
  };

  const patch = (id: string, fn: (b: AssessmentBlock) => AssessmentBlock) => {
    onChange({ ...stage, blocks: stage.blocks.map((b) => (b.id === id ? fn(b) : b)) });
  };

  if (!primary) {
    return <p className="text-sm text-amber-700 dark:text-amber-300">This activity is missing its main task block. Try changing the activity type and back.</p>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Candidate instructions</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Context and rules before the task.</p>
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          {instructions.length ? (
            instructions.map((b) => (
              <AuditionBlockEditor key={b.id} block={b} onChange={(nb) => patch(b.id, () => nb)} />
            ))
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setBlocks(
                  [
                    {
                      id: newBlockId(),
                      title: "Candidate instructions",
                      kind: "instruction",
                      config: { body: "", requireAck: true },
                    },
                  ],
                  primary,
                )
              }
            >
              Add instructions
            </Button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Task</h3>
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Task title (outline)</span>
            <Input value={primary.title} onChange={(e) => patch(primary.id, (cur) => ({ ...cur, title: e.target.value } as AssessmentBlock))} />
          </label>
          <div className="mt-3">
            <AuditionBlockEditor block={primary} onChange={(nb) => patch(primary.id, () => nb)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MixedSegmentResolver({
  stage,
  onChange,
}: {
  stage: AssessmentStage;
  onChange: (s: AssessmentStage) => void;
}) {
  const [pick, setPick] = React.useState<SegmentKind>("written");
  return (
    <Panel title="Choose activity type" description="This segment mixes different task types. Pick one layout to continue editing—we will replace content with a fresh template.">
      <div className="grid gap-3 sm:max-w-md">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Activity type</span>
          <select
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={pick}
            onChange={(e) => setPick(e.target.value as SegmentKind)}
          >
            {SEGMENT_KINDS.map((k) => (
              <option key={k} value={k}>
                {segmentKindLabel(k)}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          onClick={() => {
            if (!window.confirm("Replace this segment’s content with a new template for the selected type?")) return;
            onChange(reseedStageForSegmentKind(stage, pick));
          }}
        >
          Apply type and reset content
        </Button>
      </div>
    </Panel>
  );
}

function SegmentBodyEditor({ stage, onChange }: { stage: AssessmentStage; onChange: (s: AssessmentStage) => void }) {
  const eff = effectiveSegmentKind(stage);
  if (eff === "mixed") return <MixedSegmentResolver stage={stage} onChange={onChange} />;
  if (eff === "questionnaire") return <QuestionnaireEditor stage={stage} onChange={onChange} />;
  if (eff === "written") return <InstructionPrimaryEditor stage={stage} onChange={onChange} primaryKind="written_response" />;
  if (eff === "code") return <InstructionPrimaryEditor stage={stage} onChange={onChange} primaryKind="code_snippet" />;
  if (eff === "lab") return <InstructionPrimaryEditor stage={stage} onChange={onChange} primaryKind="lab" />;
  if (eff === "drag_drop") return <InstructionPrimaryEditor stage={stage} onChange={onChange} primaryKind="ordering" />;
  return (
    <Panel title="Empty activity" description="Add questions or pick an activity type from the flow list.">
      <p className="text-sm text-slate-600 dark:text-slate-400">This segment has no task blocks yet.</p>
    </Panel>
  );
}

export type AuditionCreationWizardProps = {
  draft: AuditionDraft;
  onDraftChange: (next: AuditionDraft) => void;
  /** When true, syncs `?segment=` in the URL for deep links from review. */
  syncSegmentToUrl?: boolean;
  initialStep?: WizardStep;
};

export function AuditionCreationWizard({
  draft,
  onDraftChange,
  syncSegmentToUrl = true,
  initialStep = "basics",
}: AuditionCreationWizardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [step, setStep] = React.useState<WizardStep>(initialStep);
  const [addOpen, setAddOpen] = React.useState(false);

  const draftRef = React.useRef(draft);
  draftRef.current = draft;

  const updateStage = React.useCallback(
    (stageId: string, next: AssessmentStage) => {
      onDraftChange({ ...draftRef.current, stages: replaceStage(draftRef.current.stages, stageId, next) });
    },
    [onDraftChange],
  );

  const setStages = React.useCallback(
    (stages: AssessmentStage[]) => {
      onDraftChange({ ...draftRef.current, stages });
    },
    [onDraftChange],
  );

  const syncUrlToSegment = React.useCallback(
    (id: string | null) => {
      if (!syncSegmentToUrl || !pathname) return;
      const q = new URLSearchParams(searchParams?.toString() ?? "");
      if (id) q.set("segment", id);
      else q.delete("segment");
      const qs = q.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [syncSegmentToUrl, pathname, router, searchParams],
  );

  /** Default `?segment=` when missing or invalid so selection is deep-linkable. */
  React.useEffect(() => {
    if (!syncSegmentToUrl || !pathname) return;
    if (!draft.stages.length) {
      if (searchParams?.get("segment")) syncUrlToSegment(null);
      return;
    }
    const p = searchParams?.get("segment");
    if (p && draft.stages.some((s) => s.id === p)) return;
    syncUrlToSegment(draft.stages[0]!.id);
  }, [draft.stages, pathname, router, searchParams, syncSegmentToUrl, syncUrlToSegment]);

  const segmentParam = searchParams?.get("segment") ?? "";
  const selectedSegmentId =
    segmentParam && draft.stages.some((s) => s.id === segmentParam) ? segmentParam : draft.stages[0]?.id ?? "";

  const selectSegment = (id: string) => {
    syncUrlToSegment(id);
  };

  const moveStage = (stageId: string, dir: "up" | "down") => {
    const idx = draft.stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= draft.stages.length) return;
    const next = [...draft.stages];
    const t = next[idx]!;
    next[idx] = next[j]!;
    next[j] = t;
    setStages(next);
  };

  const removeStage = (stageId: string) => {
    const next = draft.stages.filter((s) => s.id !== stageId);
    setStages(next);
    if (selectedSegmentId === stageId) {
      syncUrlToSegment(next[0]?.id ?? null);
    }
  };

  const addStage = (kind: SegmentKind) => {
    const s = createSeededStageForSegmentKind(kind);
    setStages([...draftRef.current.stages, s]);
    setAddOpen(false);
    syncUrlToSegment(s.id);
    setStep("flow");
  };

  const changeSegmentKind = (stageId: string, kind: SegmentKind) => {
    const s = draft.stages.find((x) => x.id === stageId);
    if (!s) return;
    const inferred = inferSegmentKindFromBlocks(s);
    const sameStored = s.segmentKind === kind;
    const sameInferred = inferred !== "mixed" && inferred !== null && inferred === kind && !s.segmentKind;
    if (sameStored || sameInferred) return;
    if (!window.confirm("Replace this activity’s content with a template for the new type?")) return;
    updateStage(stageId, reseedStageForSegmentKind(s, kind));
  };

  const selected = draft.stages.find((s) => s.id === selectedSegmentId) ?? null;
  const stageSum = sumStageMinutes(draft.stages);
  const issues = React.useMemo(() => collectDraftValidationIssues(draft), [draft]);

  const inferredForSelected = selected ? inferSegmentKindFromBlocks(selected) : null;
  const typeSelectValue: SegmentKind | "__mixed__" =
    selected?.segmentKind ??
    (inferredForSelected === "mixed" || inferredForSelected === null ? "__mixed__" : inferredForSelected);

  const jumpToIssue = (issue: DraftValidationIssue) => {
    if (issue.stageId) {
      selectSegment(issue.stageId);
      setStep("flow");
    }
  };

  return (
    <div className="mt-6 grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={step}
          onValueChange={(v) => setStep(v as WizardStep)}
          options={[
            { value: "basics", label: "Basics" },
            { value: "flow", label: "Flow" },
            { value: "review", label: "Review" },
          ]}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In-session tasks only—no file uploads or external-only links in v1.
        </p>
      </div>

      {step === "basics" ? (
        <Panel title="Audition basics" description="Role container. Next, build the candidate flow as ordered activities.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-slate-800 dark:text-slate-200">Audition title</span>
              <Input
                value={draft.title}
                onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
                placeholder="e.g. Senior Backend — incident response audition"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Level</span>
              <select
                className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                value={draft.level}
                onChange={(e) => onDraftChange({ ...draft, level: e.target.value as EmployerAudition["level"] })}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Overall time budget (minutes)</span>
              <Input
                type="number"
                min={5}
                max={480}
                value={draft.timeboxMinutes}
                onChange={(e) => onDraftChange({ ...draft, timeboxMinutes: Number(e.target.value) || 0 })}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sum of activity times right now: {stageSum} min. Set overall to match or allow buffer.
              </span>
            </label>
            <div className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Scenario template</span>
              <SegmentedControl
                value={draft.template}
                onValueChange={(v) => onDraftChange({ ...draft, template: v as AuditionTemplate })}
                options={TEMPLATES.map((t) => ({ value: t.value, label: t.label }))}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">{TEMPLATES.find((t) => t.value === draft.template)?.description}</p>
            </div>
            <div className="sm:col-span-2">
              <Button type="button" onClick={() => setStep("flow")}>
                Continue to flow
              </Button>
            </div>
          </div>
        </Panel>
      ) : null}

      {step === "flow" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <Panel title="Candidate flow" description="Ordered activities. Reorder with Up/Down.">
            {draft.stages.length === 0 ? (
              <EmptyState
                title="Build your flow"
                description="Add the first in-session activity: questionnaire, written work, code, lab, or ordering."
                actionLabel="Add activity"
                onAction={() => setAddOpen(true)}
              />
            ) : (
              <>
                <ol className="grid gap-2">
                  {draft.stages.map((s, idx) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => selectSegment(s.id)}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left transition-colors",
                          selectedSegmentId === s.id && Boolean(selectedSegmentId)
                            ? "border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/30"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
                        )}
                      >
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Step {idx + 1}</div>
                        <div className="font-medium text-slate-900 dark:text-slate-50">{s.title || "Untitled"}</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{activityLabel(s)} · {s.timeboxMinutes} min</div>
                      </button>
                      <div className="mt-1 flex flex-wrap gap-1 pl-1">
                        <Button type="button" variant="ghost" size="sm" disabled={idx === 0} onClick={() => moveStage(s.id, "up")}>
                          Up
                        </Button>
                        <Button type="button" variant="ghost" size="sm" disabled={idx === draft.stages.length - 1} onClick={() => moveStage(s.id, "down")}>
                          Down
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const dup = duplicateStage(s);
                            setStages([...draftRef.current.stages, dup]);
                            syncUrlToSegment(dup.id);
                          }}
                        >
                          Duplicate
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="text-red-700 dark:text-red-300" onClick={() => removeStage(s.id)}>
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
                <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => setAddOpen(true)}>
                  Add activity
                </Button>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Total activity time: {stageSum} min</p>
              </>
            )}
          </Panel>

          <div className="min-h-[280px]">
            {!selected ? (
              <Panel title="Configure activity" description="Select an activity from the list or add one.">
                <p className="text-sm text-slate-600 dark:text-slate-400">Nothing selected.</p>
              </Panel>
            ) : (
              <Panel
                title={selected.title || "Activity"}
                description={activityLabel(selected)}
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      Type
                      <select
                        className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-800 dark:bg-slate-950"
                        value={typeSelectValue}
                        onChange={(e) => {
                          const v = e.target.value as SegmentKind | "__mixed__";
                          if (v === "__mixed__") return;
                          if (v === selected.segmentKind) return;
                          changeSegmentKind(selected.id, v);
                        }}
                      >
                        {typeSelectValue === "__mixed__" ? (
                          <option value="__mixed__" disabled>
                            Mixed layout…
                          </option>
                        ) : null}
                        {SEGMENT_KINDS.map((k) => (
                          <option key={k} value={k}>
                            {segmentKindLabel(k)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                }
              >
                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Activity title</span>
                    <Input
                      value={selected.title}
                      onChange={(e) => updateStage(selected.id, { ...selected, title: e.target.value })}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Activity time (minutes)</span>
                    <Input
                      type="number"
                      min={1}
                      max={240}
                      value={selected.timeboxMinutes}
                      onChange={(e) =>
                        updateStage(selected.id, { ...selected, timeboxMinutes: Number(e.target.value) || 1 })
                      }
                    />
                  </label>
                </div>
                <SegmentBodyEditor stage={selected} onChange={(next) => updateStage(selected.id, next)} />
              </Panel>
            )}
          </div>
        </div>
      ) : null}

      {step === "review" ? (
        <div className="grid gap-6">
          <Panel title="Review" description="Confirm order and content before saving.">
            <ol className="list-decimal space-y-3 pl-5 text-sm">
              {draft.stages.map((s, i) => (
                <li key={s.id} className="text-slate-800 dark:text-slate-200">
                  <div className="font-medium">
                    {i + 1}. {s.title || activityLabel(s)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{activityLabel(s)} · {s.timeboxMinutes} min</div>
                  <div className="mt-1 text-slate-600 dark:text-slate-400">{segmentPreviewLine(s)}</div>
                  <Button type="button" variant="ghost" size="sm" className="mt-1 h-8 px-2 text-xs" onClick={() => jumpToIssue({ message: "", stageId: s.id })}>
                    Edit in flow
                  </Button>
                </li>
              ))}
            </ol>
            {draft.stages.length === 0 ? <p className="text-sm text-slate-600 dark:text-slate-400">No activities yet.</p> : null}
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Overall budget {draft.timeboxMinutes} min · Activities total {stageSum} min
            </p>
          </Panel>

          <Panel title="Checks" description={issues.length ? "Fix the items below." : "All checks passed."}>
            {issues.length ? (
              <ul className="grid gap-2 text-sm">
                {issues.map((issue, i) => (
                  <li key={i} className="flex flex-wrap items-start gap-2 text-red-800 dark:text-red-200">
                    <span>{issue.message}</span>
                    {issue.stageId ? (
                      <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0 px-2 text-xs" onClick={() => jumpToIssue(issue)}>
                        Fix in flow
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-800 dark:text-emerald-200">Ready to save.</p>
            )}
          </Panel>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="add-activity-title">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h2 id="add-activity-title" className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Add activity
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pick one type. You can add more activities afterward.</p>
            <div className="mt-4 grid gap-2">
              {ACTIVITY_CHOICES.map((c) => (
                <button
                  key={c.kind}
                  type="button"
                  className="rounded-lg border border-slate-200 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
                  onClick={() => addStage(c.kind)}
                >
                  <div className="font-medium text-slate-900 dark:text-slate-50">{c.title}</div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{c.body}</div>
                </button>
              ))}
            </div>
            <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

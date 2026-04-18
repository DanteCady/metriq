"use client";

import * as React from "react";

import { BlockCard, Button, cn, Input, Panel, SegmentedControl, Textarea } from "@metriq/ui";

import type { EmployerAudition } from "../../mocks/employer/auditions";
import {
  ASSESSMENT_BLOCK_KINDS,
  LAB_STACK_PRESETS,
  type AssessmentBlock,
  type AssessmentBlockKind,
  type AssessmentStage,
  type AuditionDraft,
  type AuditionTemplate,
  type LabConfig,
  type LabStackPreset,
  blockKindLabel,
  blockSummary,
  createBlock,
  labStackPresetLabel,
  newStageId,
  normalizeLabConfig,
  seedStagesForTemplate,
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

const CODE_LANGS = ["typescript", "python", "sql", "bash", "plaintext"] as const;

function replaceStage(stages: AssessmentStage[], stageId: string, next: AssessmentStage): AssessmentStage[] {
  return stages.map((s) => (s.id === stageId ? next : s));
}

export function AuditionBlockEditor({ block, onChange }: { block: AssessmentBlock; onChange: (b: AssessmentBlock) => void }) {
  switch (block.kind) {
    case "instruction":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Briefing body</span>
            <Textarea
              value={block.config.body}
              onChange={(e) => onChange({ ...block, config: { ...block.config, body: e.target.value } })}
              rows={8}
              className="font-mono text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(block.config.requireAck)}
              onChange={(e) => onChange({ ...block, config: { ...block.config, requireAck: e.target.checked } })}
            />
            Candidate must acknowledge before continuing
          </label>
        </div>
      );
    case "written_response":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Prompt</span>
            <Textarea
              value={block.config.prompt}
              onChange={(e) => onChange({ ...block, config: { ...block.config, prompt: e.target.value } })}
              rows={4}
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Min words (optional)</span>
              <Input
                type="number"
                min={0}
                value={block.config.wordMin ?? ""}
                onChange={(e) =>
                  onChange({
                    ...block,
                    config: {
                      ...block.config,
                      wordMin: e.target.value === "" ? undefined : Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">Max words</span>
              <Input
                type="number"
                min={1}
                value={block.config.wordMax ?? ""}
                onChange={(e) =>
                  onChange({
                    ...block,
                    config: { ...block.config, wordMax: e.target.value === "" ? undefined : Number(e.target.value) },
                  })
                }
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Placeholder (optional)</span>
            <Input
              value={block.config.placeholder ?? ""}
              onChange={(e) => onChange({ ...block, config: { ...block.config, placeholder: e.target.value } })}
            />
          </label>
        </div>
      );
    case "single_choice":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Prompt</span>
            <Textarea
              value={block.config.prompt}
              onChange={(e) => onChange({ ...block, config: { ...block.config, prompt: e.target.value } })}
              rows={3}
            />
          </label>
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Options</span>
            {block.config.options.map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const options = [...block.config.options];
                    options[idx] = e.target.value;
                    onChange({ ...block, config: { ...block.config, options } });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={block.config.options.length <= 2}
                  onClick={() => {
                    const options = block.config.options.filter((_, i) => i !== idx);
                    let correctIndex = block.config.correctIndex;
                    if (correctIndex >= options.length) correctIndex = options.length - 1;
                    if (correctIndex === idx) correctIndex = 0;
                    onChange({ ...block, config: { ...block.config, options, correctIndex } });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              disabled={block.config.options.length >= 8}
              onClick={() =>
                onChange({
                  ...block,
                  config: { ...block.config, options: [...block.config.options, `Option ${block.config.options.length + 1}`] },
                })
              }
            >
              Add option
            </Button>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Correct option</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={block.config.correctIndex}
              onChange={(e) => onChange({ ...block, config: { ...block.config, correctIndex: Number(e.target.value) } })}
            >
              {block.config.options.map((_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(block.config.shuffle)}
              onChange={(e) => onChange({ ...block, config: { ...block.config, shuffle: e.target.checked } })}
            />
            Shuffle options for candidate
          </label>
        </div>
      );
    case "multi_choice":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Prompt</span>
            <Textarea
              value={block.config.prompt}
              onChange={(e) => onChange({ ...block, config: { ...block.config, prompt: e.target.value } })}
              rows={3}
            />
          </label>
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Options (check all correct)</span>
            {block.config.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.config.correctIndices.includes(idx)}
                  onChange={() => {
                    const set = new Set(block.config.correctIndices);
                    if (set.has(idx)) set.delete(idx);
                    else set.add(idx);
                    let correctIndices = [...set].sort((a, b) => a - b);
                    if (!correctIndices.length && block.config.options.length) correctIndices = [0];
                    onChange({ ...block, config: { ...block.config, correctIndices } });
                  }}
                />
                <Input
                  className="flex-1"
                  value={opt}
                  onChange={(e) => {
                    const options = [...block.config.options];
                    options[idx] = e.target.value;
                    onChange({ ...block, config: { ...block.config, options } });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={block.config.options.length <= 2}
                  onClick={() => {
                    const options = block.config.options.filter((_, i) => i !== idx);
                    const correctIndices = block.config.correctIndices
                      .filter((i) => i !== idx)
                      .map((i) => (i > idx ? i - 1 : i));
                    onChange({ ...block, config: { ...block.config, options, correctIndices } });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              disabled={block.config.options.length >= 8}
              onClick={() =>
                onChange({
                  ...block,
                  config: {
                    ...block.config,
                    options: [...block.config.options, `Option ${block.config.options.length + 1}`],
                  },
                })
              }
            >
              Add option
            </Button>
          </div>
        </div>
      );
    case "ordering":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Prompt</span>
            <Textarea
              value={block.config.prompt}
              onChange={(e) => onChange({ ...block, config: { ...block.config, prompt: e.target.value } })}
              rows={3}
            />
          </label>
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Ordered items (top = first)</span>
            {block.config.items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const items = [...block.config.items];
                    items[idx] = e.target.value;
                    onChange({ ...block, config: { ...block.config, items } });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={block.config.items.length <= 2}
                  onClick={() =>
                    onChange({
                      ...block,
                      config: { ...block.config, items: block.config.items.filter((_, i) => i !== idx) },
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() =>
                onChange({
                  ...block,
                  config: { ...block.config, items: [...block.config.items, `Item ${block.config.items.length + 1}`] },
                })
              }
            >
              Add item
            </Button>
          </div>
        </div>
      );
    case "code_snippet":
      return (
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Prompt</span>
            <Textarea
              value={block.config.prompt}
              onChange={(e) => onChange({ ...block, config: { ...block.config, prompt: e.target.value } })}
              rows={4}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Language</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={block.config.language}
              onChange={(e) => onChange({ ...block, config: { ...block.config, language: e.target.value } })}
            >
              {CODE_LANGS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Starter code (optional)</span>
            <Textarea
              value={block.config.starter ?? ""}
              onChange={(e) => onChange({ ...block, config: { ...block.config, starter: e.target.value } })}
              rows={5}
              className="font-mono text-sm"
            />
          </label>
        </div>
      );
    case "lab": {
      const cfg = normalizeLabConfig(block.config);
      const setCfg = (patch: Partial<LabConfig>) =>
        onChange({ ...block, config: normalizeLabConfig({ ...cfg, ...patch }) });
      return (
        <div className="grid gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Define the virtual environment and what the candidate must prove inside it. Metriq will provision from this
            spec when lab runners ship; today this is authoring-only.
          </p>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Base stack / image</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={cfg.stackPreset}
              onChange={(e) => setCfg({ stackPreset: e.target.value as LabStackPreset })}
            >
              {LAB_STACK_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {labStackPresetLabel(p)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">What is in the environment</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Runtimes, CLIs, repos, datasets, ports, and anything the candidate can use.
            </span>
            <Textarea
              value={cfg.environmentSetup}
              onChange={(e) => setCfg({ environmentSetup: e.target.value })}
              rows={5}
              placeholder="e.g. Ubuntu 24.04, Node 20, pnpm, cloned repo at /work/app, seeded Postgres on :5432…"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">What you are testing the candidate on</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Concrete outcomes, commands, or behaviors they must demonstrate in this VM.
            </span>
            <Textarea
              value={cfg.candidateTask}
              onChange={(e) => setCfg({ candidateTask: e.target.value })}
              rows={4}
              placeholder="e.g. Fix the failing test suite, implement the API in /work/app/src, document rollout risks…"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Provisioning notes (optional)</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Boot script, env vars, seed commands — until automation runs these, they guide implementation.
            </span>
            <Textarea
              value={cfg.provisioningNotes ?? ""}
              onChange={(e) => setCfg({ provisioningNotes: e.target.value.trim() ? e.target.value : undefined })}
              rows={3}
              placeholder="e.g. export DATABASE_URL=… && pnpm db:seed"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">Runner (preview)</span>
            <select
              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={cfg.runner}
              onChange={(e) =>
                setCfg({
                  runner: e.target.value === "container_tbd" ? "container_tbd" : "browser_stub",
                })
              }
            >
              <option value="browser_stub">Browser stub (preview)</option>
              <option value="container_tbd">Container / IDE (planned)</option>
            </select>
          </label>
        </div>
      );
    }
    default: {
      const _x: never = block;
      void _x;
      return null;
    }
  }
}

export type AuditionAssessmentBuilderProps = {
  draft: AuditionDraft;
  onDraftChange: (next: AuditionDraft) => void;
};

export function AuditionAssessmentBuilder({ draft, onDraftChange }: AuditionAssessmentBuilderProps) {
  const [selectedStageId, setSelectedStageId] = React.useState<string | null>(() => draft.stages[0]?.id ?? null);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(() => draft.stages[0]?.blocks[0]?.id ?? null);
  const [addKind, setAddKind] = React.useState<AssessmentBlockKind>("instruction");

  const stage = draft.stages.find((s) => s.id === selectedStageId) ?? null;

  React.useEffect(() => {
    if (!draft.stages.length) {
      setSelectedStageId(null);
      setSelectedBlockId(null);
      return;
    }
    if (!selectedStageId || !draft.stages.some((s) => s.id === selectedStageId)) {
      const first = draft.stages[0]!;
      setSelectedStageId(first.id);
      setSelectedBlockId(first.blocks[0]?.id ?? null);
    }
  }, [draft.stages, selectedStageId]);

  React.useEffect(() => {
    if (stage && selectedBlockId && !stage.blocks.some((b) => b.id === selectedBlockId)) {
      setSelectedBlockId(stage.blocks[0]?.id ?? null);
    }
  }, [stage, selectedBlockId]);

  const updateStage = (stageId: string, next: AssessmentStage) => {
    onDraftChange({ ...draft, stages: replaceStage(draft.stages, stageId, next) });
  };

  const selectStage = (id: string) => {
    setSelectedStageId(id);
    const s = draft.stages.find((x) => x.id === id);
    setSelectedBlockId(s?.blocks[0]?.id ?? null);
  };

  function moveBlock(s: AssessmentStage, index: number, delta: number) {
    const j = index + delta;
    if (j < 0 || j >= s.blocks.length) return;
    const blocks = [...s.blocks];
    const t = blocks[index]!;
    blocks[index] = blocks[j]!;
    blocks[j] = t;
    updateStage(s.id, { ...s, blocks });
  }

  function patchBlock(s: AssessmentStage, blockId: string, fn: (b: AssessmentBlock) => AssessmentBlock) {
    const blocks = s.blocks.map((b) => (b.id === blockId ? fn(b) : b));
    updateStage(s.id, { ...s, blocks });
  }

  return (
    <div className="mt-6 grid gap-6">
      <Panel title="Audition basics" description="The role or opening this assessment belongs to.">
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
            <span className="font-medium text-slate-800 dark:text-slate-200">Overall timebox (minutes)</span>
            <Input
              type="number"
              min={5}
              max={480}
              value={draft.timeboxMinutes}
              onChange={(e) => onDraftChange({ ...draft, timeboxMinutes: Number(e.target.value) || 0 })}
            />
          </label>
          <div className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Starting template</span>
            <SegmentedControl
              value={draft.template}
              onValueChange={(v) => {
                const template = v as AuditionTemplate;
                onDraftChange({ ...draft, template, stages: draft.stages });
              }}
              options={TEMPLATES.map((t) => ({ value: t.value, label: t.label }))}
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">{TEMPLATES.find((t) => t.value === draft.template)?.description}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() => onDraftChange({ ...draft, stages: seedStagesForTemplate(draft.template) })}
            >
              Reset stages from template
            </Button>
          </div>
        </div>
      </Panel>

      <Panel
        title="Build the assessment"
        description="This is what candidates do inside Metriq: each stage is a timed segment. Add blocks (instructions, writing, choices, code, lab stub) in order. Proof-aligned — no file uploads or external-only links in v1."
      >
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
          <li>Choose a stage on the left (or add one).</li>
          <li>Add blocks and fill in the content for each block on the right.</li>
          <li>Click a block card to edit its details below the card.</li>
        </ol>

        <div className="grid gap-6 lg:grid-cols-[minmax(220px,280px)_1fr]">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stages</div>
            <div className="flex flex-col gap-2">
              {draft.stages.map((s, idx) => (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-lg border bg-white p-3 transition-colors dark:bg-slate-950",
                    selectedStageId === s.id
                      ? "border-indigo-500 ring-2 ring-indigo-500/25 dark:border-indigo-400"
                      : "border-slate-200 dark:border-slate-800",
                  )}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => selectStage(s.id)}
                  >
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Stage {idx + 1}</div>
                    <div className="font-medium text-slate-900 dark:text-slate-50">{s.title || "Untitled"}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {s.blocks.length} block{s.blocks.length === 1 ? "" : "s"} · {s.timeboxMinutes} min
                    </div>
                  </button>
                  <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
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
                      className="text-red-700 dark:text-red-300"
                      disabled={draft.stages.length <= 1}
                      onClick={() => removeStage(s.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-1 w-full"
              onClick={() => {
                const s: AssessmentStage = {
                  id: newStageId(),
                  title: `Stage ${draft.stages.length + 1}`,
                  timeboxMinutes: 20,
                  blocks: [createBlock("instruction")],
                };
                onDraftChange({ ...draft, stages: [...draft.stages, s] });
                selectStage(s.id);
              }}
            >
              Add stage
            </Button>
          </div>

          <div className="min-h-[320px] rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            {!stage ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">Add a stage to begin.</p>
            ) : (
              <div className="grid gap-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Stage settings</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Shown to candidates as this segment’s heading and time limit.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">Stage title</span>
                      <Input value={stage.title} onChange={(e) => updateStage(stage.id, { ...stage, title: e.target.value })} />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">Stage timebox (min)</span>
                      <Input
                        type="number"
                        min={1}
                        max={240}
                        value={stage.timeboxMinutes}
                        onChange={(e) => updateStage(stage.id, { ...stage, timeboxMinutes: Number(e.target.value) || 1 })}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Blocks in this stage</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Each block is one step (read, write, answer, code, etc.). Candidates complete them top to bottom.</p>
                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">Block type to add</span>
                      <select
                        className="h-9 min-w-[11rem] rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                        value={addKind}
                        onChange={(e) => setAddKind(e.target.value as AssessmentBlockKind)}
                      >
                        {ASSESSMENT_BLOCK_KINDS.map((k) => (
                          <option key={k} value={k}>
                            {blockKindLabel(k)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const nb = createBlock(addKind);
                        updateStage(stage.id, { ...stage, blocks: [...stage.blocks, nb] });
                        setSelectedBlockId(nb.id);
                      }}
                    >
                      Add block
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {stage.blocks.map((b, bi) => (
                    <div
                      key={b.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedBlockId(b.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedBlockId(b.id);
                        }
                      }}
                      className={cn(
                        "rounded-lg outline-none transition-shadow",
                        selectedBlockId === b.id ? "ring-2 ring-indigo-500/40" : "",
                      )}
                    >
                      <BlockCard
                        title={b.title}
                        typeLabel={blockKindLabel(b.kind)}
                        meta={blockSummary(b)}
                        actions={
                          <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button type="button" variant="ghost" size="sm" disabled={bi === 0} onClick={() => moveBlock(stage, bi, -1)}>
                              Up
                            </Button>
                            <Button type="button" variant="ghost" size="sm" disabled={bi === stage.blocks.length - 1} onClick={() => moveBlock(stage, bi, 1)}>
                              Down
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-700 dark:text-red-300"
                              onClick={() => {
                                const blocks = stage.blocks.filter((x) => x.id !== b.id);
                                updateStage(stage.id, { ...stage, blocks });
                                if (selectedBlockId === b.id) setSelectedBlockId(blocks[0]?.id ?? null);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        }
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <label className="grid gap-1 text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Block label (shown in outline)</span>
                            <Input
                              value={b.title}
                              onChange={(e) => patchBlock(stage, b.id, (cur) => ({ ...cur, title: e.target.value } as AssessmentBlock))}
                            />
                          </label>
                          <label className="mt-2 grid gap-1 text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Block type</span>
                            <select
                              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                              value={b.kind}
                              onChange={(e) => {
                                const kind = e.target.value as AssessmentBlockKind;
                                const nb = createBlock(kind);
                                nb.id = b.id;
                                nb.title = b.title;
                                const blocks = stage.blocks.map((x) => (x.id === b.id ? nb : x));
                                updateStage(stage.id, { ...stage, blocks });
                              }}
                            >
                              {ASSESSMENT_BLOCK_KINDS.map((k) => (
                                <option key={k} value={k}>
                                  {blockKindLabel(k)}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        {selectedBlockId === b.id ? (
                          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Block content</p>
                            <AuditionBlockEditor block={b} onChange={(nb) => patchBlock(stage, b.id, () => nb)} />
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Click this card to edit prompts and options.</p>
                        )}
                      </BlockCard>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );

  function moveStage(stageId: string, dir: "up" | "down") {
    const idx = draft.stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= draft.stages.length) return;
    const next = [...draft.stages];
    const t = next[idx]!;
    next[idx] = next[j]!;
    next[j] = t;
    onDraftChange({ ...draft, stages: next });
  }

  function removeStage(stageId: string) {
    if (draft.stages.length <= 1) return;
    const next = draft.stages.filter((s) => s.id !== stageId);
    onDraftChange({ ...draft, stages: next });
    if (selectedStageId === stageId) {
      setSelectedStageId(next[0]?.id ?? null);
      setSelectedBlockId(next[0]?.blocks[0]?.id ?? null);
    }
  }
}

import type { EmployerAudition } from "../mocks/employer/auditions";

export type AuditionTemplate = EmployerAudition["template"];

export const ASSESSMENT_BLOCK_KINDS = [
  "instruction",
  "written_response",
  "single_choice",
  "multi_choice",
  "ordering",
  "code_snippet",
  "lab",
] as const;

export type AssessmentBlockKind = (typeof ASSESSMENT_BLOCK_KINDS)[number];

export type InstructionConfig = { body: string; requireAck?: boolean };
export type WrittenResponseConfig = {
  prompt: string;
  wordMin?: number;
  wordMax?: number;
  placeholder?: string;
};
export type SingleChoiceConfig = {
  prompt: string;
  options: string[];
  correctIndex: number;
  shuffle?: boolean;
};
export type MultiChoiceConfig = {
  prompt: string;
  options: string[];
  correctIndices: number[];
};
export type OrderingConfig = { prompt: string; items: string[] };
export type CodeSnippetConfig = { prompt: string; language: string; starter?: string };

export type LabRunner = "browser_stub" | "container_tbd";

/** Base stack Metriq will use to provision the lab VM when runners ship (authoring today). */
export const LAB_STACK_PRESETS = [
  "minimal",
  "node_20",
  "python_312",
  "go_121",
  "rust_stable",
  "java_21",
  "full_linux",
  "custom",
] as const;
export type LabStackPreset = (typeof LAB_STACK_PRESETS)[number];

/**
 * Virtual lab environment: what to provision, what the candidate does, and how it boots.
 * Execution is not live in v1 — this is the contract for future provisioning.
 */
export type LabConfig = {
  runner: LabRunner;
  stackPreset: LabStackPreset;
  /** What is installed or available (runtimes, CLIs, sample repo, datasets). */
  environmentSetup: string;
  /** What the candidate must complete or demonstrate in that environment. */
  candidateTask: string;
  /** Optional boot commands, env vars, seed data (until runners apply this automatically). */
  provisioningNotes?: string;
};

export function labStackPresetLabel(preset: LabStackPreset): string {
  switch (preset) {
    case "minimal":
      return "Minimal Linux";
    case "node_20":
      return "Node.js 20";
    case "python_312":
      return "Python 3.12";
    case "go_121":
      return "Go 1.21";
    case "rust_stable":
      return "Rust (stable)";
    case "java_21":
      return "Java 21";
    case "full_linux":
      return "Full Linux dev tools";
    case "custom":
      return "Custom (describe in setup)";
    default: {
      const _e: never = preset;
      return _e;
    }
  }
}

function isLabStackPreset(x: unknown): x is LabStackPreset {
  return typeof x === "string" && (LAB_STACK_PRESETS as readonly string[]).includes(x);
}

/** Default lab config for new blocks. */
export function defaultLabConfig(): LabConfig {
  return {
    runner: "browser_stub",
    stackPreset: "minimal",
    environmentSetup: "",
    candidateTask: "",
    provisioningNotes: undefined,
  };
}

/**
 * Coerce persisted or legacy lab config into the current shape.
 * Legacy drafts used a single `description` field — it becomes `environmentSetup`.
 */
export function normalizeLabConfig(raw: unknown): LabConfig {
  if (!raw || typeof raw !== "object") return defaultLabConfig();
  const o = raw as Record<string, unknown>;
  const runner: LabRunner = o.runner === "container_tbd" ? "container_tbd" : "browser_stub";
  const stackPreset: LabStackPreset = isLabStackPreset(o.stackPreset) ? o.stackPreset : "minimal";

  const env =
    typeof o.environmentSetup === "string"
      ? o.environmentSetup
      : typeof o.description === "string"
        ? o.description
        : "";
  const task = typeof o.candidateTask === "string" ? o.candidateTask : "";
  const notes = typeof o.provisioningNotes === "string" ? o.provisioningNotes : undefined;

  return {
    runner,
    stackPreset,
    environmentSetup: env,
    candidateTask: task,
    provisioningNotes: notes?.trim() ? notes : undefined,
  };
}

/** Migrate all lab blocks in a draft to the current LabConfig shape (safe for localStorage). */
export function normalizeDraftLabBlocks(draft: AuditionDraft): AuditionDraft {
  const stages = draft.stages.map((s) => ({
    ...s,
    blocks: s.blocks.map((b) => (b.kind === "lab" ? { ...b, config: normalizeLabConfig(b.config) } : b)),
  }));
  return { ...draft, stages };
}

export type AssessmentBlock =
  | { id: string; title: string; kind: "instruction"; config: InstructionConfig }
  | { id: string; title: string; kind: "written_response"; config: WrittenResponseConfig }
  | { id: string; title: string; kind: "single_choice"; config: SingleChoiceConfig }
  | { id: string; title: string; kind: "multi_choice"; config: MultiChoiceConfig }
  | { id: string; title: string; kind: "ordering"; config: OrderingConfig }
  | { id: string; title: string; kind: "code_snippet"; config: CodeSnippetConfig }
  | { id: string; title: string; kind: "lab"; config: LabConfig };

/** Employer-facing activity type for one segment (one stage). */
export const SEGMENT_KINDS = ["questionnaire", "written", "code", "lab", "drag_drop"] as const;
export type SegmentKind = (typeof SEGMENT_KINDS)[number];

export type AssessmentStage = {
  id: string;
  title: string;
  timeboxMinutes: number;
  /** When set, drives seeded blocks and segment UI; otherwise inferred from blocks or treated as mixed. */
  segmentKind?: SegmentKind;
  blocks: AssessmentBlock[];
};

export type AuditionDraft = {
  id: string;
  workspaceSlug: string;
  title: string;
  level: EmployerAudition["level"];
  template: AuditionTemplate;
  timeboxMinutes: number;
  stages: AssessmentStage[];
  updatedAt: string;
  status: "draft";
};

const STORAGE_KEY = "metriq.auditionDrafts.v1";

function safeParse(raw: string | null): AuditionDraft[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isAuditionDraft);
  } catch {
    return [];
  }
}

function isAuditionDraft(x: unknown): x is AuditionDraft {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.workspaceSlug === "string" &&
    typeof o.title === "string" &&
    typeof o.timeboxMinutes === "number" &&
    o.status === "draft" &&
    Array.isArray(o.stages)
  );
}

export function newDraftId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `local_${crypto.randomUUID()}`;
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function newBlockId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function newStageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function readAllDrafts(): AuditionDraft[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeAllDrafts(drafts: AuditionDraft[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    /* ignore quota */
  }
}

export function listDrafts(workspaceSlug: string): AuditionDraft[] {
  return readAllDrafts().filter((d) => d.workspaceSlug === workspaceSlug);
}

export function getDraft(workspaceSlug: string, id: string): AuditionDraft | null {
  return readAllDrafts().find((d) => d.workspaceSlug === workspaceSlug && d.id === id) ?? null;
}

export function upsertDraft(draft: AuditionDraft): void {
  const all = readAllDrafts().filter((d) => d.id !== draft.id);
  const next: AuditionDraft = { ...normalizeAuditionDraft(draft), updatedAt: new Date().toISOString() };
  writeAllDrafts([...all, next]);
}

export function deleteDraft(id: string): void {
  writeAllDrafts(readAllDrafts().filter((d) => d.id !== id));
}

export function defaultBlockConfig(kind: AssessmentBlockKind): AssessmentBlock["config"] {
  switch (kind) {
    case "instruction":
      return { body: "", requireAck: false };
    case "written_response":
      return { prompt: "", wordMax: 2000, placeholder: "" };
    case "single_choice":
      return { prompt: "", options: ["Option A", "Option B"], correctIndex: 0, shuffle: false };
    case "multi_choice":
      return { prompt: "", options: ["Option A", "Option B"], correctIndices: [0] };
    case "ordering":
      return { prompt: "", items: ["First item", "Second item"] };
    case "code_snippet":
      return { prompt: "", language: "typescript", starter: "" };
    case "lab":
      return defaultLabConfig();
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function defaultBlockTitle(kind: AssessmentBlockKind): string {
  switch (kind) {
    case "instruction":
      return "Briefing";
    case "written_response":
      return "Written response";
    case "single_choice":
      return "Single choice";
    case "multi_choice":
      return "Multiple choice";
    case "ordering":
      return "Ordering";
    case "code_snippet":
      return "Code";
    case "lab":
      return "Lab environment";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

export function createBlock(kind: AssessmentBlockKind): AssessmentBlock {
  const id = newBlockId();
  const title = defaultBlockTitle(kind);
  const config = defaultBlockConfig(kind);
  switch (kind) {
    case "instruction":
      return { id, title, kind: "instruction", config: config as InstructionConfig };
    case "written_response":
      return { id, title, kind: "written_response", config: config as WrittenResponseConfig };
    case "single_choice":
      return { id, title, kind: "single_choice", config: config as SingleChoiceConfig };
    case "multi_choice":
      return { id, title, kind: "multi_choice", config: config as MultiChoiceConfig };
    case "ordering":
      return { id, title, kind: "ordering", config: config as OrderingConfig };
    case "code_snippet":
      return { id, title, kind: "code_snippet", config: config as CodeSnippetConfig };
    case "lab":
      return { id, title, kind: "lab", config: config as LabConfig };
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

export function segmentKindLabel(kind: SegmentKind): string {
  switch (kind) {
    case "questionnaire":
      return "Questionnaire";
    case "written":
      return "Written response";
    case "code":
      return "Code";
    case "lab":
      return "Lab";
    case "drag_drop":
      return "Drag-and-drop";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

/** Non-instruction block kinds present in the stage. */
function nonInstructionKinds(stage: AssessmentStage): Set<AssessmentBlock["kind"]> {
  const s = new Set<AssessmentBlock["kind"]>();
  for (const b of stage.blocks) {
    if (b.kind !== "instruction") s.add(b.kind);
  }
  return s;
}

/**
 * Infer employer segment kind from block layout. Returns `mixed` when incompatible kinds are combined.
 */
export function inferSegmentKindFromBlocks(stage: AssessmentStage): SegmentKind | "mixed" | null {
  const kinds = nonInstructionKinds(stage);
  if (kinds.size === 0) return null;
  const allowedQ = new Set<AssessmentBlock["kind"]>(["single_choice", "multi_choice", "ordering"]);
  const isQuestionnaireOnly = [...kinds].every((k) => allowedQ.has(k));
  if (isQuestionnaireOnly) return "questionnaire";
  if (kinds.size === 1 && kinds.has("written_response")) return "written";
  if (kinds.size === 1 && kinds.has("code_snippet")) return "code";
  if (kinds.size === 1 && kinds.has("lab")) return "lab";
  if (kinds.size === 1 && kinds.has("ordering")) return "drag_drop";
  return "mixed";
}

export function effectiveSegmentKind(stage: AssessmentStage): SegmentKind | "mixed" | null {
  if (stage.segmentKind) return stage.segmentKind;
  return inferSegmentKindFromBlocks(stage);
}

export const QUESTIONNAIRE_BLOCK_KINDS: AssessmentBlockKind[] = ["single_choice", "multi_choice", "ordering"];

export function defaultTitleForSegmentKind(kind: SegmentKind): string {
  switch (kind) {
    case "questionnaire":
      return "Questionnaire";
    case "written":
      return "Written task";
    case "code":
      return "Code task";
    case "lab":
      return "Lab task";
    case "drag_drop":
      return "Ordering task";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

/** New segment with employer type set and proof-aligned default blocks. */
export function createSeededStageForSegmentKind(kind: SegmentKind): AssessmentStage {
  const id = newStageId();
  const instruction = (body: string, requireAck = true): AssessmentBlock => ({
    id: newBlockId(),
    title: "Candidate instructions",
    kind: "instruction",
    config: { body, requireAck },
  });

  switch (kind) {
    case "questionnaire":
      return {
        id,
        title: defaultTitleForSegmentKind(kind),
        timeboxMinutes: 20,
        segmentKind: kind,
        blocks: [
          instruction("Read each question and answer in order.", false),
          createBlock("single_choice"),
        ],
      };
    case "written":
      return {
        id,
        title: defaultTitleForSegmentKind(kind),
        timeboxMinutes: 25,
        segmentKind: kind,
        blocks: [
          instruction("Follow the prompt below. Your response stays inside Metriq.", true),
          {
            id: newBlockId(),
            title: "Written response",
            kind: "written_response",
            config: {
              prompt: "",
              wordMax: 2000,
              placeholder: "Write your response here…",
            },
          },
        ],
      };
    case "code":
      return {
        id,
        title: defaultTitleForSegmentKind(kind),
        timeboxMinutes: 30,
        segmentKind: kind,
        blocks: [
          instruction("Use the in-session editor. No external pastebins or repos in v1.", true),
          {
            id: newBlockId(),
            title: "Coding task",
            kind: "code_snippet",
            config: { prompt: "", language: "typescript", starter: "" },
          },
        ],
      };
    case "lab":
      return {
        id,
        title: defaultTitleForSegmentKind(kind),
        timeboxMinutes: 30,
        segmentKind: kind,
        blocks: [
          instruction("Complete the lab steps described below.", true),
          {
            id: newBlockId(),
            title: "Lab environment",
            kind: "lab",
            config: {
              runner: "browser_stub",
              stackPreset: "minimal",
              environmentSetup: "",
              candidateTask: "",
            },
          },
        ],
      };
    case "drag_drop":
      return {
        id,
        title: defaultTitleForSegmentKind(kind),
        timeboxMinutes: 15,
        segmentKind: kind,
        blocks: [
          instruction("Drag items into the correct order (in-session).", false),
          {
            id: newBlockId(),
            title: "Put in order",
            kind: "ordering",
            config: {
              prompt: "Arrange these in the correct order.",
              items: ["First step", "Second step", "Third step"],
            },
          },
        ],
      };
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

/** Attach inferred segmentKind to stages that are missing it (local migration). */
export function normalizeDraftSegmentKinds(draft: AuditionDraft): AuditionDraft {
  const stages = draft.stages.map((s) => {
    if (s.segmentKind) return s;
    const inferred = inferSegmentKindFromBlocks(s);
    if (inferred === null || inferred === "mixed") return s;
    return { ...s, segmentKind: inferred };
  });
  return { ...draft, stages };
}

/** Lab block schema upgrades + segment kind inference (call when loading a draft from storage). */
export function normalizeAuditionDraft(draft: AuditionDraft): AuditionDraft {
  return normalizeDraftSegmentKinds(normalizeDraftLabBlocks(draft));
}

export function seedStagesForTemplate(template: AuditionTemplate): AssessmentStage[] {
  const introBodies: Record<AuditionTemplate, string> = {
    WorkSample_Brief: "Summarize the business context, constraints, and success criteria before you propose a solution.",
    Debugging_Incident: "You are given logs and a short incident description. Read carefully before investigating.",
    PR_Review: "Review the pull request context and coding standards that apply to this repository.",
    DesignDoc_Mini: "Capture requirements, trade-offs, and rollout risks in a concise design note.",
    Data_Analysis: "Understand the dataset framing and the decision the business needs from your analysis.",
    Customer_Support_Triage: "Use the policy snippets and customer thread to prioritize your response.",
  };
  const body = introBodies[template] ?? introBodies.WorkSample_Brief;
  return [
    {
      id: newStageId(),
      title: "Context",
      timeboxMinutes: 15,
      segmentKind: "written",
      blocks: [
        {
          id: newBlockId(),
          title: "Scenario briefing",
          kind: "instruction",
          config: { body, requireAck: true },
        },
      ],
    },
    {
      id: newStageId(),
      title: "Core work",
      timeboxMinutes: 40,
      segmentKind: "written",
      blocks: [
        {
          id: newBlockId(),
          title: "Primary deliverable",
          kind: "written_response",
          config: {
            prompt: "Produce your main written response for this stage.",
            wordMin: 150,
            wordMax: 2000,
            placeholder: "Write here…",
          },
        },
      ],
    },
    {
      id: newStageId(),
      title: "Signal checks",
      timeboxMinutes: 15,
      segmentKind: "questionnaire",
      blocks: [
        {
          id: newBlockId(),
          title: "Knowledge check",
          kind: "single_choice",
          config: {
            prompt: "Which change most reduces operational risk before shipping?",
            options: ["Feature flag + gradual rollout", "Big-bang release on Friday", "Skip staging for speed"],
            correctIndex: 0,
            shuffle: true,
          },
        },
        {
          id: newBlockId(),
          title: "Prioritization",
          kind: "ordering",
          config: {
            prompt: "Order these investigation steps from first to last (candidate will reorder in-session).",
            items: ["Reproduce locally", "Form hypothesis", "Inspect logs/metrics", "Propose minimal fix"],
          },
        },
      ],
    },
  ];
}

export function createEmptyDraft(workspaceSlug: string, template: AuditionTemplate = "WorkSample_Brief"): AuditionDraft {
  const now = new Date().toISOString();
  return {
    id: newDraftId(),
    workspaceSlug,
    title: "",
    level: "Mid",
    template,
    timeboxMinutes: 60,
    stages: [],
    updatedAt: now,
    status: "draft",
  };
}

export type DraftValidationIssue = {
  message: string;
  stageId?: string;
  blockId?: string;
};

export function collectDraftValidationIssues(d: AuditionDraft): DraftValidationIssue[] {
  const issues: DraftValidationIssue[] = [];
  if (!d.title.trim()) issues.push({ message: "Audition title is required." });
  if (d.timeboxMinutes < 5 || d.timeboxMinutes > 480) issues.push({ message: "Timebox must be between 5 and 480 minutes." });
  if (!d.stages.length) issues.push({ message: "Add at least one activity to the flow." });

  for (const s of d.stages) {
    const segLabel = s.title.trim() || defaultTitleForResolvedSegment(s);
    if (!s.title.trim()) issues.push({ message: `Each activity needs a title.`, stageId: s.id });
    if (s.timeboxMinutes < 1 || s.timeboxMinutes > 240) {
      issues.push({ message: `Activity "${segLabel}" timebox must be 1–240 minutes.`, stageId: s.id });
    }
    if (!s.blocks.length) issues.push({ message: `Activity "${segLabel}" needs content.`, stageId: s.id });
    for (const b of s.blocks) {
      const ctx = { stageId: s.id, blockId: b.id };
      switch (b.kind) {
        case "instruction":
          if (!b.config.body.trim()) issues.push({ message: `Instructions in "${segLabel}" need body text.`, ...ctx });
          break;
        case "written_response":
          if (!b.config.prompt.trim()) issues.push({ message: `Written task in "${segLabel}" needs a prompt.`, ...ctx });
          if (b.config.wordMin != null && b.config.wordMax != null && b.config.wordMin > b.config.wordMax) {
            issues.push({ message: `Written task in "${segLabel}" has invalid word bounds.`, ...ctx });
          }
          break;
        case "single_choice":
          if (!b.config.prompt.trim()) issues.push({ message: `A question in "${segLabel}" needs a prompt.`, ...ctx });
          if (b.config.options.length < 2) issues.push({ message: `A question in "${segLabel}" needs at least two options.`, ...ctx });
          if (b.config.correctIndex < 0 || b.config.correctIndex >= b.config.options.length) {
            issues.push({ message: `A question in "${segLabel}" needs a valid correct answer.`, ...ctx });
          }
          break;
        case "multi_choice":
          if (!b.config.prompt.trim()) issues.push({ message: `A question in "${segLabel}" needs a prompt.`, ...ctx });
          if (b.config.options.length < 2) issues.push({ message: `A question in "${segLabel}" needs at least two options.`, ...ctx });
          if (!b.config.correctIndices.length) issues.push({ message: `A question in "${segLabel}" needs at least one correct option.`, ...ctx });
          for (const i of b.config.correctIndices) {
            if (i < 0 || i >= b.config.options.length) issues.push({ message: `A question in "${segLabel}" has invalid correct options.`, ...ctx });
          }
          break;
        case "ordering":
          if (!b.config.prompt.trim()) issues.push({ message: `Ordering task in "${segLabel}" needs a prompt.`, ...ctx });
          if (b.config.items.length < 2) issues.push({ message: `Ordering task in "${segLabel}" needs at least two items.`, ...ctx });
          break;
        case "code_snippet":
          if (!b.config.prompt.trim()) issues.push({ message: `Code task in "${segLabel}" needs a prompt.`, ...ctx });
          if (!b.config.language.trim()) issues.push({ message: `Code task in "${segLabel}" needs a language.`, ...ctx });
          break;
        case "lab": {
          const lab = normalizeLabConfig(b.config);
          if (!lab.environmentSetup.trim()) {
            issues.push({ message: `Lab in "${segLabel}" needs what is in the virtual environment.`, ...ctx });
          }
          if (!lab.candidateTask.trim()) {
            issues.push({ message: `Lab in "${segLabel}" needs what the candidate must do in that environment.`, ...ctx });
          }
          break;
        }
        default: {
          const _e: never = b;
          void _e;
        }
      }
    }
  }

  return issues;
}

function defaultTitleForResolvedSegment(s: AssessmentStage): string {
  const k = effectiveSegmentKind(s);
  if (k && k !== "mixed") return segmentKindLabel(k);
  return "Activity";
}

export function validateAuditionDraft(d: AuditionDraft): { ok: boolean; errors: string[] } {
  const issues = collectDraftValidationIssues(d);
  return { ok: issues.length === 0, errors: issues.map((i) => i.message) };
}

/** Replace stage content with a fresh seed for `kind` (same stage id). */
export function reseedStageForSegmentKind(stage: AssessmentStage, kind: SegmentKind): AssessmentStage {
  const seeded = createSeededStageForSegmentKind(kind);
  return {
    ...seeded,
    id: stage.id,
    title: stage.title.trim() ? stage.title : seeded.title,
    timeboxMinutes: stage.timeboxMinutes,
  };
}

export function blockKindLabel(kind: AssessmentBlockKind): string {
  switch (kind) {
    case "instruction":
      return "Instruction";
    case "written_response":
      return "Written response";
    case "single_choice":
      return "Single choice";
    case "multi_choice":
      return "Multiple choice";
    case "ordering":
      return "Ordering";
    case "code_snippet":
      return "Code snippet";
    case "lab":
      return "Lab";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

export function blockSummary(block: AssessmentBlock): string {
  switch (block.kind) {
    case "instruction":
      return block.config.body.trim() ? "Has briefing text" : "Empty briefing";
    case "written_response":
      return block.config.wordMax ? `Up to ${block.config.wordMax} words` : "Written";
    case "single_choice":
      return `${block.config.options.length} options`;
    case "multi_choice":
      return `${block.config.options.length} options · ${block.config.correctIndices.length} correct`;
    case "ordering":
      return `${block.config.items.length} items`;
    case "code_snippet":
      return block.config.language;
    case "lab": {
      const c = normalizeLabConfig(block.config);
      return `${labStackPresetLabel(c.stackPreset)} · ${c.runner === "browser_stub" ? "stub runner" : "container (planned)"}`;
    }
    default: {
      const _e: never = block;
      return _e;
    }
  }
}

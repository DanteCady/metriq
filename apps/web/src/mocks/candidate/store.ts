import type { MockArtifact, MockSubmission } from "./submission";
import { mockSubmissionDraft, mockSubmissionSubmitted } from "./submission";

const KEY = "metriq.demo.submissions.v1";

type StoreShape = Record<string, MockSubmission>;

function safeParse(json: string): StoreShape | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as StoreShape;
  } catch {
    return null;
  }
}

function load(): StoreShape {
  if (typeof window === "undefined") {
    return {
      [mockSubmissionDraft.id]: mockSubmissionDraft,
      [mockSubmissionSubmitted.id]: mockSubmissionSubmitted,
    };
  }
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    const seeded: StoreShape = {
      [mockSubmissionDraft.id]: mockSubmissionDraft,
      [mockSubmissionSubmitted.id]: mockSubmissionSubmitted,
    };
    window.localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
  return safeParse(raw) ?? {};
}

function save(next: StoreShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function demoListSubmissions(): MockSubmission[] {
  const store = load();
  return Object.values(store).sort((a, b) => a.id.localeCompare(b.id));
}

export function demoGetSubmission(submissionId: string): MockSubmission {
  const store = load();
  const existing = store[submissionId];
  if (existing) return existing;
  const created: MockSubmission = { id: submissionId, status: "draft", artifacts: [] };
  const next = { ...store, [submissionId]: created };
  save(next);
  return created;
}

export function demoAddArtifact(submissionId: string, artifact: Omit<MockArtifact, "id">): MockSubmission {
  const store = load();
  const existing = store[submissionId] ?? { id: submissionId, status: "draft", artifacts: [] };
  const nextArtifact: MockArtifact = { id: makeId("art"), ...artifact };
  const nextSub: MockSubmission = { ...existing, artifacts: [nextArtifact, ...existing.artifacts] };
  const next = { ...store, [submissionId]: nextSub };
  save(next);
  return nextSub;
}

export function demoRemoveArtifact(submissionId: string, artifactId: string): MockSubmission {
  const store = load();
  const existing = store[submissionId] ?? { id: submissionId, status: "draft", artifacts: [] };
  const nextSub: MockSubmission = { ...existing, artifacts: existing.artifacts.filter((a) => a.id !== artifactId) };
  const next = { ...store, [submissionId]: nextSub };
  save(next);
  return nextSub;
}

export function demoSubmit(submissionId: string): MockSubmission {
  const store = load();
  const existing = store[submissionId] ?? { id: submissionId, status: "draft", artifacts: [] };
  const nextSub: MockSubmission = { ...existing, status: "submitted" };
  const next = { ...store, [submissionId]: nextSub };
  save(next);
  return nextSub;
}


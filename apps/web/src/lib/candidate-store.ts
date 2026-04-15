/* eslint-disable no-restricted-globals */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Id } from "@metriq/types";

import {
  createEvaluationFixture,
  simulationsFixture,
  type ArtifactType,
  type EvaluationResult,
  type Simulation,
  type Submission,
  type SubmissionArtifact,
} from "./candidate-fixtures";

type CandidateState = {
  simulations: Simulation[];
  submissions: Record<Id, Submission>;
  results: Record<Id, EvaluationResult>;

  startSimulation: (simulationId: Id) => { submissionId: Id };
  upsertArtifact: (input: { submissionId: Id; artifactId?: Id; type: ArtifactType; label: string; content: string }) => void;
  removeArtifact: (input: { submissionId: Id; artifactId: Id }) => void;
  submitSubmission: (submissionId: Id) => void;
};

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function uniqueArtifactSeed(required: Array<{ label: string; type: ArtifactType }>): SubmissionArtifact[] {
  return required.map((a) => ({
    id: makeId("art"),
    type: a.type,
    label: a.label,
    content: "",
  }));
}

export const useCandidateStore = create<CandidateState>()(
  persist(
    (set, get) => ({
      simulations: simulationsFixture,
      submissions: {},
      results: {},

      startSimulation: (simulationId) => {
        const sim = get().simulations.find((s) => s.id === simulationId);
        if (!sim) {
          throw new Error("Simulation not found");
        }

        const submissionId = makeId("sub");
        const required = sim.sections.flatMap((s) => s.requiredArtifacts);

        const submission: Submission = {
          id: submissionId,
          simulationId: sim.id,
          status: "draft",
          startedAt: nowIso(),
          artifacts: uniqueArtifactSeed(required),
        };

        set((state) => ({
          submissions: { ...state.submissions, [submissionId]: submission },
        }));

        return { submissionId };
      },

      upsertArtifact: ({ submissionId, artifactId, type, label, content }) => {
        set((state) => {
          const existing = state.submissions[submissionId];
          if (!existing) return state;
          if (existing.status === "submitted") return state;

          const nextArtifacts = [...existing.artifacts];
          const idx = artifactId ? nextArtifacts.findIndex((a) => a.id === artifactId) : -1;

          if (idx >= 0) {
            nextArtifacts[idx] = { ...nextArtifacts[idx], type, label, content };
          } else {
            nextArtifacts.push({ id: makeId("art"), type, label, content });
          }

          return {
            submissions: {
              ...state.submissions,
              [submissionId]: { ...existing, artifacts: nextArtifacts },
            },
          };
        });
      },

      removeArtifact: ({ submissionId, artifactId }) => {
        set((state) => {
          const existing = state.submissions[submissionId];
          if (!existing) return state;
          if (existing.status === "submitted") return state;

          return {
            submissions: {
              ...state.submissions,
              [submissionId]: { ...existing, artifacts: existing.artifacts.filter((a) => a.id !== artifactId) },
            },
          };
        });
      },

      submitSubmission: (submissionId) => {
        const state = get();
        const submission = state.submissions[submissionId];
        if (!submission) {
          throw new Error("Submission not found");
        }
        if (submission.status === "submitted") return;

        const sim = state.simulations.find((s) => s.id === submission.simulationId);
        if (!sim) {
          throw new Error("Simulation not found");
        }

        set((prev) => ({
          submissions: {
            ...prev.submissions,
            [submissionId]: { ...prev.submissions[submissionId], status: "submitted", submittedAt: nowIso() },
          },
          results: {
            ...prev.results,
            [submissionId]: createEvaluationFixture(submissionId, sim),
          },
        }));
      },
    }),
    {
      name: "metriq-candidate-store",
      version: 1,
      partialize: (state) => ({
        submissions: state.submissions,
        results: state.results,
      }),
    },
  ),
);

export function selectSimulationById(simulationId: Id) {
  return (s: CandidateState) => s.simulations.find((sim) => sim.id === simulationId);
}

export function selectSubmissionById(submissionId: Id) {
  return (s: CandidateState) => s.submissions[submissionId];
}

export function selectResultBySubmissionId(submissionId: Id) {
  return (s: CandidateState) => s.results[submissionId];
}


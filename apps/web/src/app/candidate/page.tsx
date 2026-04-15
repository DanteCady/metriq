/* eslint-disable no-restricted-globals */
"use client";

import Link from "next/link";

import { AppShell, Badge, EmptyState, PageHeader, PageSection } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";

import { useCandidateStore } from "../../lib/candidate-store";

export default function CandidateLanding() {
  const simulations = useCandidateStore((s) => s.simulations);
  const submissions = useCandidateStore((s) => Object.values(s.submissions));

  const active = submissions.filter((s) => s.status === "draft").sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const completed = submissions
    .filter((s) => s.status === "submitted")
    .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));

  const recentCompleted = completed.slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        title="Candidate"
        description="Your simulations, submissions, and performance at a glance."
        actions={
          <Link href="/candidate/simulations">
            <Button size="sm">Browse simulations</Button>
          </Link>
        }
      />

      <div className="mt-6 grid gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <PageSection>
            <div className="text-sm text-slate-600 dark:text-slate-300">Available simulations</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{simulations.length}</div>
          </PageSection>
          <PageSection>
            <div className="text-sm text-slate-600 dark:text-slate-300">Active</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{active.length}</div>
          </PageSection>
          <PageSection>
            <div className="text-sm text-slate-600 dark:text-slate-300">Completed</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{completed.length}</div>
          </PageSection>
        </div>

        <PageSection
          title="Active submissions"
          description="Pick up where you left off. Draft submissions can be edited until you submit."
        >
          {active.length === 0 ? (
            <EmptyState
              title="No active submissions"
              description="Start a simulation to create a draft submission."
              actionLabel="Browse simulations"
              onAction={() => {
                location.assign("/candidate/simulations");
              }}
            />
          ) : (
            <div className="grid gap-2">
              {active.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{sub.id}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      Started {new Date(sub.startedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Draft</Badge>
                    <Link href={`/candidate/submissions/${sub.id}`}>
                      <Button variant="secondary" size="sm">
                        Continue
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageSection>

        <PageSection title="Recent results" description="Your latest submitted simulations and scores.">
          {recentCompleted.length === 0 ? (
            <EmptyState
              title="No results yet"
              description="Submit a simulation to get a score breakdown."
              actionLabel="Browse simulations"
              onAction={() => {
                location.assign("/candidate/simulations");
              }}
            />
          ) : (
            <div className="grid gap-2">
              {recentCompleted.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{sub.id}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      Submitted {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Submitted</Badge>
                    <Link href={`/candidate/results/${sub.id}`}>
                      <Button variant="secondary" size="sm">
                        View results
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PageSection>
      </div>
    </AppShell>
  );
}


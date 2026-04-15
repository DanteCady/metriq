"use client";

import Link from "next/link";
import { AppFrame } from "../../components/app-frame";
import { LoadingState, PageHeader, PageSection, StatCard } from "@metriq/ui";

import { trpc } from "../providers";

export default function CandidateLanding() {
  const dashboard = trpc.candidate.getDashboard.useQuery();

  return (
    <AppFrame>
      <PageHeader title="Candidate" description="Your dashboard" />
      <div className="mt-6 grid gap-4">
        {dashboard.isLoading ? <LoadingState /> : null}
        {dashboard.data ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Active simulations" value={dashboard.data.activeCount} />
            <StatCard label="Completed" value={dashboard.data.completedCount} />
            <StatCard label="Recent score" value={`${dashboard.data.recentScorePercent}%`} />
          </div>
        ) : null}
        <PageSection title="Next step" description="Browse simulations and start a submission.">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Head to{" "}
            <Link className="underline" href="/candidate/simulations">
              Simulations
            </Link>
            .
          </div>
        </PageSection>
      </div>
    </AppFrame>
  );
}


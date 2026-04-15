"use client";

import * as React from "react";
import Link from "next/link";

import { AppFrame } from "../../../components/app-frame";
import { EmptyState, LoadingState, PageHeader, SimulationCard } from "@metriq/ui";

import { trpc } from "../../providers";

export default function CandidateSimulationsPage() {
  const sims = trpc.simulation.list.useQuery();

  return (
    <AppFrame>
      <PageHeader title="Simulations" description="Browse and start a job simulation." />
      <div className="mt-6">
        {sims.isLoading ? <LoadingState /> : null}
        {sims.data?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {sims.data.map((s) => (
              <SimulationCard
                key={s.id}
                title={s.title}
                description={s.summary}
                difficulty={s.difficulty === "easy" ? "Easy" : s.difficulty === "medium" ? "Medium" : "Hard"}
                estimatedMinutes={s.estimatedMinutes}
                skills={s.skills}
                primaryActionLabel="View"
                onPrimaryAction={() => {
                  window.location.href = `/candidate/simulations/${s.id}`;
                }}
                secondaryActionLabel="Open"
                onSecondaryAction={() => {
                  window.open(`/candidate/simulations/${s.id}`, "_self");
                }}
              />
            ))}
          </div>
        ) : sims.data && sims.data.length === 0 ? (
          <EmptyState
            title="No simulations yet"
            description="Once admin creates simulations, they’ll show up here."
            actionLabel="Back to dashboard"
            onAction={() => {
              window.location.href = "/candidate";
            }}
          />
        ) : sims.isError ? (
          <EmptyState title="Couldn’t load simulations" description={sims.error.message} actionLabel="Retry" onAction={() => sims.refetch()} />
        ) : null}
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/candidate" className="underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </AppFrame>
  );
}


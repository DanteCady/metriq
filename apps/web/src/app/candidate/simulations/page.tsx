"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState, PageHeader, SimulationCard } from "@metriq/ui";

import { mockSimulations } from "../../../mocks/candidate/simulations";

export default function CandidateSimulationsPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="Simulations" description="Browse and start a job simulation." />
      <div className="mt-6">
        {mockSimulations.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {mockSimulations.map((s) => (
              <SimulationCard
                key={s.id}
                title={s.title}
                description={s.summary}
                difficulty={s.difficulty === "easy" ? "Easy" : s.difficulty === "medium" ? "Medium" : "Hard"}
                estimatedMinutes={s.estimatedMinutes}
                skills={s.skills}
                primaryActionLabel="Open simulation"
                onPrimaryAction={() => {
                  router.push(`/candidate/simulations/${s.id}`);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No simulations yet"
            description="Once admin creates simulations, they’ll show up here."
            actionLabel="Back to dashboard"
            onAction={() => {
              window.location.href = "/candidate";
            }}
          />
        )}
        <div className="mt-6 text-sm">
          <Link href="/candidate" className="font-medium text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </>
  );
}


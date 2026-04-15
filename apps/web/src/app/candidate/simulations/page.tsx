"use client";

import Link from "next/link";

import { AppShell, Badge, EmptyState, PageHeader, PageSection } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";

import { useCandidateStore } from "../../../lib/candidate-store";

export default function CandidateSimulationsPage() {
  const simulations = useCandidateStore((s) => s.simulations);

  return (
    <AppShell>
      <PageHeader
        title="Simulations"
        description="Choose a simulation to start. You can edit your work until submission."
        actions={
          <Link href="/candidate">
            <Button variant="secondary" size="sm">
              Back to dashboard
            </Button>
          </Link>
        }
      />

      <div className="mt-6 grid gap-4">
        <PageSection>
          {simulations.length === 0 ? (
            <EmptyState title="No simulations available" description="Check back later." />
          ) : (
            <div className="grid gap-3">
              {simulations.map((sim) => (
                <div
                  key={sim.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold">{sim.title}</div>
                      <Badge variant="outline">{sim.type.replaceAll("_", " ")}</Badge>
                      <Badge variant="secondary">{sim.difficulty}</Badge>
                      <Badge variant="secondary">{sim.estimatedMinutes}m</Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sim.summary}</div>
                    {sim.skills.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sim.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    <Link href={`/candidate/simulations/${sim.id}`}>
                      <Button>View details</Button>
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


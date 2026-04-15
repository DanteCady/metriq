"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppShell, Badge, EmptyState, PageHeader, PageSection } from "@metriq/ui";
import { Button } from "@metriq/ui/components/ui/button";

import { selectSimulationById, useCandidateStore } from "../../../../lib/candidate-store";

export default function CandidateSimulationDetailPage() {
  const router = useRouter();
  const params = useParams<{ simulationId: string }>();

  const simulationId = params.simulationId;
  const simulation = useCandidateStore(useMemo(() => selectSimulationById(simulationId), [simulationId]));
  const startSimulation = useCandidateStore((s) => s.startSimulation);

  return (
    <AppShell>
      <PageHeader
        title={simulation ? simulation.title : "Simulation"}
        description={simulation ? simulation.summary : "Loading…"}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/candidate/simulations">
              <Button variant="secondary" size="sm">
                Back
              </Button>
            </Link>
            {simulation ? (
              <Button
                size="sm"
                onClick={() => {
                  const { submissionId } = startSimulation(simulation.id);
                  router.push(`/candidate/submissions/${submissionId}`);
                }}
              >
                Start simulation
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        {!simulation ? (
          <PageSection>
            <EmptyState title="Simulation not found" description="Return to the simulations list to pick another." />
          </PageSection>
        ) : (
          <>
            <PageSection title="Overview">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{simulation.type.replaceAll("_", " ")}</Badge>
                <Badge variant="secondary">{simulation.difficulty}</Badge>
                <Badge variant="secondary">{simulation.estimatedMinutes} minutes</Badge>
              </div>
              {simulation.skills.length ? (
                <div className="mt-4">
                  <div className="text-sm font-semibold">Skills</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {simulation.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </PageSection>

            <PageSection title="Sections" description="Read through each section before starting.">
              <div className="grid gap-3">
                {simulation.sections.map((sec) => (
                  <div key={sec.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="text-sm font-semibold">{sec.title}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sec.instructions}</div>

                    {sec.requiredArtifacts.length ? (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Required artifacts</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sec.requiredArtifacts.map((a) => (
                            <Badge key={`${sec.id}-${a.label}`} variant="outline">
                              {a.label} · {a.type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </PageSection>
          </>
        )}
      </div>
    </AppShell>
  );
}


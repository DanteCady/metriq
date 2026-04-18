"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge, Button, PageHeader, PageSection } from "@metriq/ui";

import { mockSimulations } from "../../../../mocks/candidate/simulations";
import { demoGetSubmission } from "../../../../mocks/candidate/store";

export default function CandidateSimulationDetailPage() {
  const params = useParams<{ simulationId: string }>();
  const router = useRouter();
  const simulationId = params?.simulationId ?? "";

  const sim = React.useMemo(() => mockSimulations.find((s) => s.id === simulationId) ?? null, [simulationId]);

  return (
    <>
      <PageHeader
        title={sim?.title ?? "Simulation"}
        description={sim ? sim.summary : "Simulation not found."}
        actions={
          <Button
            onClick={async () => {
              const created = demoGetSubmission(`sub_${simulationId}_draft`);
              router.push(`/candidate/submissions/${created.id}`);
            }}
            disabled={!sim}
          >
            Start simulation
          </Button>
        }
      />
      <div className="mt-6 grid gap-4">
        {sim ? (
          <PageSection title="Overview">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{sim.type}</Badge>
              <Badge
                variant={
                  sim.difficulty === "easy"
                    ? "success"
                    : sim.difficulty === "medium"
                      ? "warning"
                      : sim.difficulty === "hard"
                        ? "destructive"
                        : "outline"
                }
              >
                {sim.difficulty === "easy" ? "Easy" : sim.difficulty === "medium" ? "Medium" : "Hard"}
              </Badge>
              <Badge variant="info" className="tabular-nums">
                {sim.estimatedMinutes} min
              </Badge>
              {sim.skills.map((sk) => (
                <Badge
                  key={sk}
                  variant="outline"
                  className="border-primary/20 bg-primary/[0.04] text-foreground dark:bg-primary/[0.08]"
                >
                  {sk}
                </Badge>
              ))}
            </div>
          </PageSection>
        ) : null}
        <PageSection title="How it works" description="This preview stores submissions in your browser so you can walk the flow end-to-end.">
          <div className="text-sm text-muted-foreground">
            Starting creates a draft submission. Add artifacts, submit, then view results.
          </div>
        </PageSection>
      </div>
    </>
  );
}


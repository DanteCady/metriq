"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { AppFrame } from "../../../../components/app-frame";
import { Badge, Button, LoadingState, PageHeader, PageSection } from "@metriq/ui";

import { trpc } from "../../../providers";

export default function CandidateSimulationDetailPage() {
  const params = useParams<{ simulationId: string }>();
  const router = useRouter();
  const simulationId = params?.simulationId ?? "";

  const sim = trpc.simulation.detail.useQuery({ simulationId }, { enabled: Boolean(simulationId) });
  const start = trpc.simulation.startSimulation.useMutation();

  return (
    <AppFrame>
      <PageHeader
        title={sim.data?.title ?? "Simulation"}
        description={sim.data ? sim.data.summary : "Loading simulation details…"}
        actions={
          <Button
            onClick={async () => {
              const res = await start.mutateAsync({ simulationId });
              router.push(`/candidate/submissions/${res.submissionId}`);
            }}
            disabled={!sim.data || start.isPending}
          >
            {start.isPending ? "Starting…" : "Start simulation"}
          </Button>
        }
      />
      <div className="mt-6 grid gap-4">
        {sim.isLoading ? <LoadingState /> : null}
        {sim.data ? (
          <PageSection title="Overview">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{sim.data.type}</Badge>
              <Badge variant="outline">{sim.data.difficulty}</Badge>
              <Badge variant="outline">{sim.data.estimatedMinutes} min</Badge>
              {sim.data.skills.map((sk) => (
                <Badge key={sk} variant="outline">
                  {sk}
                </Badge>
              ))}
            </div>
          </PageSection>
        ) : null}
        <PageSection title="How it works" description="This MVP uses a mock submission backend.">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Starting creates a draft submission. Add artifacts, submit, then view results.
          </div>
        </PageSection>
      </div>
    </AppFrame>
  );
}


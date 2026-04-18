"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge, Button, PageHeader, Panel, StatCard, Stagger, StaggerItem } from "@metriq/ui";

import { mockAuditions } from "../../mocks/candidate/auditions";
import { demoListSubmissions } from "../../mocks/candidate/store";
import { mockUniverse } from "../../mocks/universe";

export default function CandidateLanding() {
  const router = useRouter();
  const submissions = React.useMemo(() => demoListSubmissions(), []);

  const activeCount = mockAuditions.filter((a) => a.status === "active").length;
  const draftCount = submissions.filter((s) => s.status === "draft").length;
  const submittedCount = submissions.filter((s) => s.status === "submitted").length;

  const nextAudition = mockAuditions.find((a) => a.status === "active") ?? mockAuditions[0];
  const nextAuditionBlurb = nextAudition
    ? `${nextAudition.roleTitle} at ${nextAudition.companyName}. Estimated timebox ${nextAudition.estimatedMinutes} minutes — submit structured evidence for each stage.`
    : "";

  return (
    <>
      <PageHeader
        title="Candidate dashboard"
        description={`Your auditions and proof signals — preview data aligned with ${mockUniverse.orgName} hiring flows.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push("/candidate/auditions")}>Open auditions</Button>
            <Button variant="secondary" onClick={() => router.push("/candidate/proof")}>
              Proof profile
            </Button>
          </div>
        }
      />

      <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
        <StaggerItem>
          <StatCard label="Active auditions" value={activeCount} hint="Auditions currently in progress." />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Draft submissions" value={draftCount} hint="Evidence packages you can still edit." />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Submitted" value={submittedCount} hint="Ready for evaluation / results." />
        </StaggerItem>
      </Stagger>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Next up" description="Jump back into the highest leverage work.">
            <div className="grid gap-2 text-sm text-foreground">
              <Link href="/candidate/auditions" className="font-medium text-foreground underline-offset-4 hover:underline">
                Audition inbox
              </Link>
              <Link href="/candidate/submissions" className="font-medium text-foreground underline-offset-4 hover:underline">
                Submissions
              </Link>
              <Link href="/candidate/results" className="font-medium text-foreground underline-offset-4 hover:underline">
                Results
              </Link>
              <Link href="/candidate/simulations" className="font-medium text-foreground underline-offset-4 hover:underline">
                Simulations
              </Link>
            </div>
          </Panel>

          <Panel
            title="Proof profile"
            description="Curate evidence-backed highlights that employers can trust."
            actions={
              <Button size="sm" variant="secondary" onClick={() => router.push("/candidate/proof")}>
                Open
              </Button>
            }
          >
            Turn submissions into durable capability signals — grouped by what you can do, not when you did it.
          </Panel>
        </div>

        <Panel title="Activity" description="What to expect while reviewers at partner companies evaluate evidence.">
          {nextAudition ? (
            <div className="rounded-lg border border-border bg-muted/70 p-4 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Focused audition</div>
              <div className="mt-1 font-semibold text-foreground">{nextAudition.roleTitle}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{nextAudition.companyName}</div>
              <div className="mt-2 text-muted-foreground">{nextAuditionBlurb.slice(0, 160)}…</div>
              <div className="mt-3">
                <Button size="sm" onClick={() => router.push(`/candidate/auditions/${nextAudition.auditionId}`)}>
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No auditions in this preview slice.</p>
          )}
          <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <li>Evaluators anchor scores to artifacts you submit — completeness beats polish.</li>
            <li>Deadlines are shown per stage; submit early to leave room for iteration.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

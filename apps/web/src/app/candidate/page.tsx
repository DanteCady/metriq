"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, ChevronRight, CircleCheck, Film, Inbox, Sparkles, Trophy } from "lucide-react";

import { Badge, Button, PageHeader, Panel, StatCard, Stagger, StaggerItem, Surface } from "@metriq/ui";

import { mockAuditions } from "../../mocks/candidate/auditions";
import { demoListSubmissions } from "../../mocks/candidate/store";
import { mockUniverse } from "../../mocks/universe";

function QuickLink({
  href,
  title,
  hint,
  icon,
}: {
  href: string;
  title: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/60"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground group-hover:text-primary">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
    </Link>
  );
}

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
  const blurbDisplay =
    nextAuditionBlurb.length > 200 ? `${nextAuditionBlurb.slice(0, 200).trim()}…` : nextAuditionBlurb;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Auditions, submissions, and proof — preview data aligned with ${mockUniverse.orgName}.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push("/candidate/auditions")}>Browse auditions</Button>
            <Button variant="secondary" onClick={() => router.push("/candidate/proof")}>
              Proof profile
            </Button>
          </div>
        }
      />

      {nextAudition ? (
        <section className="relative mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-primary"
            aria-hidden
          />
          <div className="bg-gradient-to-br from-primary/[0.06] via-transparent to-info/[0.05] px-6 pb-6 pl-7 pt-6 dark:from-primary/[0.1] dark:to-info/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{nextAudition.roleTitle}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{nextAudition.companyName}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{blurbDisplay}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => router.push(`/candidate/auditions/${nextAudition.auditionId}`)}>
                Continue audition
              </Button>
              <Button variant="secondary" onClick={() => router.push("/candidate/auditions")}>
                All auditions
              </Button>
            </div>
            <ul className="mt-6 list-disc space-y-2 border-t border-border pt-4 pl-5 text-xs text-muted-foreground">
              <li>Evaluators anchor scores to artifacts — completeness beats polish.</li>
              <li>Deadlines are per stage; submit early to leave room to iterate.</li>
            </ul>
          </div>
        </section>
      ) : (
        <Surface className="mt-6 p-6">
          <p className="text-sm font-medium text-foreground">No auditions in this preview</p>
          <p className="mt-1 text-sm text-muted-foreground">When you are invited to an audition, it will appear here as the main next step.</p>
          <Button className="mt-4" onClick={() => router.push("/candidate/auditions")}>
            Go to auditions
          </Button>
        </Surface>
      )}

      <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
        <StaggerItem>
          <StatCard
            label="Active auditions"
            value={activeCount}
            hint="In progress or awaiting your action."
            icon={<Film className="size-5 text-primary" />}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Draft submissions"
            value={draftCount}
            hint="Evidence you can still edit before sending."
            icon={<Inbox className="size-5 text-primary" />}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Submitted"
            value={submittedCount}
            hint="In evaluation or results-ready."
            icon={<CircleCheck className="size-5 text-primary" />}
          />
        </StaggerItem>
      </Stagger>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Quick links" description="Jump to the surfaces you use most.">
          <nav className="grid gap-1" aria-label="Candidate shortcuts">
            <QuickLink
              href="/candidate/auditions"
              title="Audition inbox"
              hint="Invites, stages, and timeboxes"
              icon={<Film className="size-4" aria-hidden />}
            />
            <QuickLink
              href="/candidate/submissions"
              title="Submissions"
              hint="Draft and submitted evidence packages"
              icon={<Inbox className="size-4" aria-hidden />}
            />
            <QuickLink
              href="/candidate/results"
              title="Results"
              hint="Scores and feedback when available"
              icon={<Trophy className="size-4" aria-hidden />}
            />
            <QuickLink
              href="/candidate/simulations"
              title="Simulations"
              hint="Job-shaped practice scenarios"
              icon={<Sparkles className="size-4" aria-hidden />}
            />
          </nav>
        </Panel>

        <Panel
          title="Proof profile"
          description="Turn submissions into durable capability signals employers can trust."
          actions={
            <Button size="sm" variant="secondary" onClick={() => router.push("/candidate/proof")}>
              Open
            </Button>
          }
        >
          <p className="text-sm text-muted-foreground">
            Group highlights by what you can do — not a timeline of every screen you clicked.
          </p>
          <Button variant="ghost" className="mt-4 h-auto justify-start px-0 text-primary hover:text-primary/90" onClick={() => router.push("/candidate/proof")}>
            <BadgeCheck className="mr-2 size-4 shrink-0" aria-hidden />
            Build your proof profile
          </Button>
        </Panel>
      </div>
    </>
  );
}

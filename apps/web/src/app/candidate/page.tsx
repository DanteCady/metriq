import { AppShell, PageHeader, PageSection } from "@metriq/ui";

export default function CandidateLanding() {
  return (
    <AppShell>
      <PageHeader title="Candidate" description="Dashboard (coming next)" />
      <div className="mt-6 grid gap-4">
        <PageSection title="Status" description="This area will show active simulations and recent scores.">
          <div className="text-sm text-slate-600 dark:text-slate-300">Scaffolded route.</div>
        </PageSection>
      </div>
    </AppShell>
  );
}


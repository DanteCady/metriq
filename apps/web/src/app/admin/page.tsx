import { AppShell, PageHeader, PageSection } from "@metriq/ui";

export default function AdminLanding() {
  return (
    <AppShell>
      <PageHeader title="Admin" description="Simulation and rubric management (coming next)" />
      <div className="mt-6 grid gap-4">
        <PageSection title="Status" description="This area will manage simulations, rubrics, and reviews.">
          <div className="text-sm text-slate-600 dark:text-slate-300">Scaffolded route.</div>
        </PageSection>
      </div>
    </AppShell>
  );
}


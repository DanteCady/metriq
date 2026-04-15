import { AppShell, PageHeader, PageSection } from "@metriq/ui";

export default function EmployerLanding() {
  return (
    <AppShell>
      <PageHeader title="Employer" description="Hiring intelligence dashboard (coming next)" />
      <div className="mt-6 grid gap-4">
        <PageSection title="Status" description="This area will show talent pool insights and leaderboard.">
          <div className="text-sm text-slate-600 dark:text-slate-300">Scaffolded route.</div>
        </PageSection>
      </div>
    </AppShell>
  );
}


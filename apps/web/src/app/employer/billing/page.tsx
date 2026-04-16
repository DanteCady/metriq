import { Badge, PageHeader, Panel } from "@metriq/ui";

export default function EmployerBillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Subscription, invoices, and payment method — wired when org billing is implemented." />
      <div className="mt-6">
        <Panel title="Plan" description="Preview placeholder">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Organization-level billing will live here (seat-based SKUs, annual vs monthly, procurement contacts).
          </p>
          <Badge variant="secondary" className="mt-3">
            Preview
          </Badge>
        </Panel>
      </div>
    </>
  );
}

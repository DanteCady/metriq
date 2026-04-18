import Link from "next/link";

import { Badge, Button, PageHeader, Panel, Surface } from "@metriq/ui";

import { mockOrganization } from "../../../mocks/tenancy";
import { mockUniverse } from "../../../mocks/universe";

export default function EmployerBillingPage() {
  return (
    <>
      <PageHeader
        title="Billing"
        description={`${mockOrganization.name} — subscription, invoices, and payment method. Wired when org billing ships.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview</Badge>
          </div>
        }
        actions={
          <Button type="button" variant="secondary" disabled title="Disabled in preview.">
            Contact sales
          </Button>
        }
      />

      <p className="mt-4 text-sm text-muted-foreground">
        Org-level billing is separate from department workspaces. Seat-based SKUs and procurement contacts will live here.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Current plan" description="Seat-based access for your organization.">
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4">
            <div className="text-sm font-semibold text-foreground">Team</div>
            <p className="mt-1 text-xs text-muted-foreground">Preview placeholder — no charges in demo.</p>
            <Badge variant="outline" className="mt-3">
              Mock plan
            </Badge>
          </div>
        </Panel>

        <Panel title="Invoices" description="History and PDF downloads.">
          <p className="text-sm text-muted-foreground">No invoices in preview.</p>
          <Button type="button" className="mt-4" size="sm" variant="secondary" disabled title="Disabled in preview.">
            View invoice history
          </Button>
        </Panel>

        <Panel title="Payment method" description="Card on file or invoice terms.">
          <Surface className="border-dashed p-4">
            <p className="text-sm text-muted-foreground">Add a payment method when billing is enabled.</p>
            <Button type="button" className="mt-3" size="sm" disabled title="Disabled in preview.">
              Add payment method
            </Button>
          </Surface>
        </Panel>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Questions about procurement?{" "}
        <Link href={`mailto:${mockUniverse.supportEmail}`} className="font-medium text-primary hover:underline">
          Contact support
        </Link>{" "}
      </p>
    </>
  );
}

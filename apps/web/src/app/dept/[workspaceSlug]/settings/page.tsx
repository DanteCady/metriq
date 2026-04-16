import { Badge, Button, DataTable, DefinitionList, PageHeader, Panel, type DataTableColumn } from "@metriq/ui";

import { mockEmployerIntegrations, mockEmployerWebhooks, type IntegrationRow } from "../../../../mocks/employer/integrations";
import { mockEmployerAuditEvents, mockEmployerOrgProfile } from "../../../../mocks/employer/org-settings";
import { mockUniverse } from "../../../../mocks/universe";

const integrationColumns: DataTableColumn<IntegrationRow>[] = [
  {
    key: "name",
    header: "Integration",
    cell: (r) => (
      <div>
        <div className="font-medium text-slate-900 dark:text-slate-50">{r.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{r.detail}</div>
      </div>
    ),
  },
  { key: "cat", header: "Category", cell: (r) => <Badge variant="outline">{r.category}</Badge> },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <Badge variant={r.status === "connected" ? "success" : r.status === "beta" ? "warning" : "secondary"}>{r.status}</Badge>
    ),
  },
  {
    key: "act",
    header: "",
    align: "right",
    cell: (r) => (
      <Button type="button" size="sm" variant="secondary" disabled title="Integration actions are disabled in this preview build.">
        {r.status === "connected" ? "Manage" : "Connect"}
      </Button>
    ),
  },
];

const webhookColumns: DataTableColumn<(typeof mockEmployerWebhooks)[0]>[] = [
  { key: "url", header: "Endpoint", cell: (r) => <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{r.url}</span> },
  { key: "events", header: "Events", cell: (r) => <span className="text-xs text-slate-600 dark:text-slate-300">{r.events}</span> },
  {
    key: "last",
    header: "Last delivery",
    align: "right",
    cell: (r) => new Date(r.lastDelivery).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  },
  {
    key: "ok",
    header: "",
    align: "right",
    cell: (r) => <Badge variant={r.ok ? "success" : "destructive"}>{r.ok ? "OK" : "Failed"}</Badge>,
  },
];

export default function EmployerSettingsPage() {
  const orgItems = [
    { term: "Display name", description: mockEmployerOrgProfile.displayName },
    { term: "Legal name", description: mockEmployerOrgProfile.legalName },
    { term: "Workspace slug", description: mockEmployerOrgProfile.slug },
    { term: "Primary domain", description: mockEmployerOrgProfile.primaryDomain },
    { term: "Talent inbox", description: mockEmployerOrgProfile.supportEmail },
    { term: "Default timezone", description: mockEmployerOrgProfile.timezone },
    { term: "Data region", description: mockEmployerOrgProfile.dataRegion },
    { term: "SSO", description: `${mockEmployerOrgProfile.sso.provider} · not connected` },
    { term: "Audit retention", description: `${mockEmployerOrgProfile.auditRetentionDays} days` },
  ];

  return (
    <>
      <PageHeader
        title="Settings"
        description={`Organization profile, integrations, and security defaults for ${mockUniverse.orgName}.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Organization" description="Company profile and workspace metadata.">
          <DefinitionList items={orgItems} columns={2} />
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" disabled title="Editing organization settings is disabled in this preview build.">
              Save changes
            </Button>
            <Button type="button" variant="secondary" disabled title="Billing is disabled in this preview build.">
              Billing portal
            </Button>
          </div>
        </Panel>

        <Panel title="Recent audit activity" description="Immutable log of sensitive changes (subset).">
          <ul className="space-y-3 text-sm">
            {mockEmployerAuditEvents.map((e) => (
              <li key={e.id} className="flex flex-col gap-0.5 rounded-md border border-slate-100 p-3 dark:border-slate-800/80">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(e.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div className="font-medium text-slate-900 dark:text-slate-50">{e.actor}</div>
                <div className="text-slate-600 dark:text-slate-300">{e.action}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Integrations" description="ATS, calendar, and identity providers connected to this workspace.">
          <DataTable columns={integrationColumns} rows={mockEmployerIntegrations} getRowKey={(r) => r.id} density="comfortable" />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Webhooks" description="Outbound events for HRIS and internal automation.">
          <DataTable columns={webhookColumns} rows={mockEmployerWebhooks} getRowKey={(r) => r.id} density="compact" />
          <div className="mt-4">
            <Button type="button" variant="secondary" size="sm" disabled title="Adding webhooks is disabled in this preview build.">
              Add webhook
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

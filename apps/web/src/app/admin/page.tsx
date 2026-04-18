import { Badge, Button, DataTable, PageHeader, Panel, StatCard, type DataTableColumn } from "@metriq/ui";

import {
  mockAdminAuditTail,
  mockAdminModerationQueue,
  mockAdminRubricTemplates,
  mockAdminSimulationCatalog,
} from "../../mocks/admin/workspace";
import { mockUniverse } from "../../mocks/universe";

type SimRow = (typeof mockAdminSimulationCatalog)[0];
type RubRow = (typeof mockAdminRubricTemplates)[0];
type ModRow = (typeof mockAdminModerationQueue)[0];

const simColumns: DataTableColumn<SimRow>[] = [
  { key: "name", header: "Simulation", cell: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "ver", header: "Version", cell: (r) => <span className="font-mono text-xs">{r.version}</span> },
  {
    key: "status",
    header: "Status",
    cell: (r) => <Badge variant={r.status === "published" ? "success" : "secondary"}>{r.status}</Badge>,
  },
  {
    key: "updated",
    header: "Updated",
    align: "right",
    cell: (r) => new Date(r.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  },
];

const rubColumns: DataTableColumn<RubRow>[] = [
  { key: "name", header: "Template", cell: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "crit", header: "Criteria", align: "right", cell: (r) => <span className="tabular-nums">{r.criteria}</span> },
  { key: "org", header: "Owner", cell: (r) => <span className="text-sm text-muted-foreground">{r.org}</span> },
];

const modColumns: DataTableColumn<ModRow>[] = [
  { key: "type", header: "Type", cell: (r) => r.type },
  { key: "subj", header: "Subject", cell: (r) => <span className="text-sm text-foreground">{r.subject}</span> },
  {
    key: "pri",
    header: "",
    align: "right",
    cell: (r) => <Badge variant={r.priority === "P1" ? "destructive" : "warning"}>{r.priority}</Badge>,
  },
];

export default function AdminLanding() {
  return (
    <>
      <PageHeader
        title="Platform admin"
        description="Simulations, rubric templates, and moderation — operational view for the Metriq workspace."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
            <Badge variant="outline">{mockUniverse.orgName}</Badge>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Simulations" value={mockAdminSimulationCatalog.length} hint="Published + draft catalog entries." />
        <StatCard label="Rubric templates" value={mockAdminRubricTemplates.length} hint="Org-owned and platform defaults." />
        <StatCard label="Open moderation" value={mockAdminModerationQueue.length} hint="Needs triage this week." />
        <StatCard label="Audit events (24h)" value={mockAdminAuditTail.length} hint="Tail shown below is illustrative." />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Panel title="Simulation catalog" description="Versioned simulations candidates can be assigned.">
          <DataTable columns={simColumns} rows={mockAdminSimulationCatalog} getRowKey={(r) => r.id} density="compact" />
          <div className="mt-4">
            <Button type="button" size="sm" variant="secondary" disabled title="Authoring is disabled in this preview build.">
              New simulation
            </Button>
          </div>
        </Panel>

        <Panel title="Rubric templates" description="Criteria libraries shared across auditions.">
          <DataTable columns={rubColumns} rows={mockAdminRubricTemplates} getRowKey={(r) => r.id} density="compact" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Panel title="Moderation queue" description="Flags and sensitive reports awaiting platform review.">
          <DataTable columns={modColumns} rows={mockAdminModerationQueue} getRowKey={(r) => r.id} density="comfortable" />
        </Panel>

        <Panel title="Recent audit activity" description="High-sensitivity actions across the control plane.">
          <ul className="space-y-3 text-sm">
            {mockAdminAuditTail.map((e) => (
              <li key={e.id} className="rounded-md border border-border p-3">
                <div className="text-xs text-muted-foreground">
                  {new Date(e.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </div>
                <div className="font-medium text-foreground">{e.actor}</div>
                <div className="text-muted-foreground">{e.action}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

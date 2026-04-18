import { Badge, Button, DataTable, PageHeader, Panel, StatCard, type DataTableColumn } from "@metriq/ui";

import { mockEmployerTeamInvites, mockEmployerTeamMembers, type TeamMemberRow } from "../../../../mocks/employer/team-members";
import { mockUniverse } from "../../../../mocks/universe";

const memberColumns: DataTableColumn<TeamMemberRow>[] = [
  {
    key: "name",
    header: "Member",
    cell: (r) => (
      <div>
        <div className="font-medium text-foreground">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.email}</div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (r) => <Badge variant="secondary">{r.role}</Badge>,
  },
  {
    key: "reviews",
    header: "Reviews (30d)",
    align: "right",
    cell: (r) => <span className="tabular-nums text-foreground">{r.reviewsCompleted30d}</span>,
  },
  {
    key: "last",
    header: "Last active",
    align: "right",
    cell: (r) => (
      <span className="text-sm text-muted-foreground">
        {new Date(r.lastActiveAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </span>
    ),
  },
];

const inviteColumns: DataTableColumn<(typeof mockEmployerTeamInvites)[0]>[] = [
  { key: "email", header: "Email", cell: (r) => r.email },
  { key: "role", header: "Role", cell: (r) => <Badge variant="outline">{r.role}</Badge> },
  {
    key: "sent",
    header: "Sent",
    align: "right",
    cell: (r) => new Date(r.sentAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  },
];

export default function EmployerTeamPage() {
  return (
    <>
      <PageHeader
        title="Team"
        description={`Roles, access, and reviewer throughput for ${mockUniverse.orgName}.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active members" value={mockEmployerTeamMembers.length} hint="Seats in use on this workspace." />
        <StatCard label="Pending invites" value={mockEmployerTeamInvites.length} hint="Outstanding email invitations." />
        <StatCard label="Lead reviewers" value={mockEmployerTeamMembers.filter((m) => m.role === "Lead reviewer").length} hint="Own rubric calibration and escalations." />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <Panel title="Members" description="Reviewers, hiring managers, and admins with recent activity.">
          <DataTable columns={memberColumns} rows={mockEmployerTeamMembers} getRowKey={(r) => r.id} density="comfortable" />
        </Panel>

        <div className="grid gap-4">
          <Panel title="Invite people" description="Grant access with the right role — invites are email-based in production.">
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Work email</span>
                <input
                  readOnly
                  className="h-9 cursor-not-allowed rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground"
                  placeholder="name@company.com"
                  title="Invites are disabled in this preview build."
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Role</span>
                <select
                  disabled
                  className="h-9 cursor-not-allowed rounded-md border border-border bg-muted px-3 text-sm"
                  title="Invites are disabled in this preview build."
                  defaultValue="Reviewer"
                >
                  <option>Reviewer</option>
                  <option>Hiring manager</option>
                  <option>Admin</option>
                </select>
              </label>
              <Button type="button" disabled title="Invites are disabled in this preview build.">
                Send invite
              </Button>
            </div>
          </Panel>

          <Panel title="Pending invitations" description="Outstanding invites for this organization.">
            <DataTable
              columns={inviteColumns}
              rows={mockEmployerTeamInvites}
              getRowKey={(r) => r.email}
              density="compact"
            />
          </Panel>

          <Panel title="Permissions matrix" description="High-level map of what each role can do in Metriq.">
            <div className="overflow-x-auto text-sm">
              <table className="w-full min-w-[320px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="border-b border-border py-2 pr-3">Capability</th>
                    <th className="border-b border-border px-2 py-2 text-center">Reviewer</th>
                    <th className="border-b border-border px-2 py-2 text-center">Hiring mgr</th>
                    <th className="border-b border-border px-2 py-2 text-center">Admin</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {(
                    [
                      ["Score submissions", "Yes", "Yes", "Yes"],
                      ["Publish auditions", "—", "Yes", "Yes"],
                      ["Manage billing", "—", "—", "Yes"],
                      ["Export audit logs", "—", "—", "Yes"],
                    ] as const
                  ).map(([cap, r, h, a]) => (
                    <tr key={cap}>
                      <td className="border-b border-border py-2.5 pr-3">{cap}</td>
                      <td className="border-b border-border px-2 py-2.5 text-center">{r}</td>
                      <td className="border-b border-border px-2 py-2.5 text-center">{h}</td>
                      <td className="border-b border-border px-2 py-2.5 text-center">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, UserCheck, Users } from "lucide-react";

import { Badge, Button, DataTable, DataTableToolbar, PageHeader, Panel, StatCard, Surface } from "@metriq/ui";

import { deptPath } from "../../lib/dept-path";
import { mockOrganization, mockOrgSeatPool, mockWorkspaces, DEFAULT_WORKSPACE_SLUG } from "../../mocks/tenancy";

type WsRow = (typeof mockWorkspaces)[0];

function QuickCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground group-hover:text-primary">{title}</span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function EmployerOrgHomePage() {
  const router = useRouter();

  const wsColumns = React.useMemo(
    () => [
      {
        key: "name",
        header: "Workspace",
        cell: (r: WsRow) => (
          <div>
            <div className="font-medium text-foreground">{r.name}</div>
            <div className="font-mono text-xs text-muted-foreground">{r.slug}</div>
          </div>
        ),
      },
      {
        key: "seats",
        header: "Seats",
        align: "right" as const,
        cell: (r: WsRow) => (
          <span className="tabular-nums text-muted-foreground">
            {r.seatsUsed} / {r.seatLimit}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (r: WsRow) => (
          <Badge variant={r.status === "active" ? "success" : r.status === "trial" ? "warning" : "secondary"}>{r.status}</Badge>
        ),
      },
      {
        key: "open",
        header: "",
        align: "right" as const,
        cell: (r: WsRow) => (
          <Link
            href={deptPath(r.slug, "")}
            className="text-sm font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Open
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <PageHeader
        title="Organization"
        description={`${mockOrganization.name} — set up department workspaces, assign seats, then open a workspace to run auditions and hiring.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
            <Badge variant="outline">{mockOrganization.primaryDomain}</Badge>
          </div>
        }
        actions={
          <Button onClick={() => router.push(deptPath(DEFAULT_WORKSPACE_SLUG, ""))}>Open default workspace</Button>
        }
      />

      <p className="mt-4 rounded-lg border border-border border-l-4 border-l-primary bg-primary/[0.04] px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:bg-primary/[0.07]">
        <span className="font-medium text-foreground">How it fits together: </span>
        your <strong className="font-medium text-foreground">company</strong> owns billing and seats; each{" "}
        <strong className="font-medium text-foreground">workspace</strong> is an internal team (engineering, GTM, …) with its own pipeline and rubrics under{" "}
        <span className="font-mono text-xs text-foreground">/dept/…</span>.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Workspaces"
          value={mockWorkspaces.length}
          hint="Departments with isolated hiring context."
          icon={<Building2 className="size-5 text-primary" aria-hidden />}
        />
        <StatCard
          label="Purchased seats"
          value={mockOrgSeatPool.purchasedSeats}
          hint="Org-wide license pool."
          icon={<Users className="size-5 text-primary" aria-hidden />}
        />
        <StatCard
          label="Assigned seats"
          value={mockOrgSeatPool.assignedSeats}
          hint="People with access across workspaces."
          icon={<UserCheck className="size-5 text-primary" aria-hidden />}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-foreground">Jump to</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickCard href="/employer/workspaces" title="Workspaces" description="Add or review department workspaces." />
          <QuickCard href="/employer/seats" title="Seats" description="Who has access and in which workspace." />
          <QuickCard href="/employer/billing" title="Billing" description="Plan, invoices, and payment method." />
          <QuickCard href="/employer/security" title="Security" description="SSO, SCIM, and org-wide policy." />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Department workspaces" description="Each row opens that team’s hiring hub (auditions, pipeline, review).">
          <DataTable
            rows={mockWorkspaces}
            getRowKey={(r) => r.id}
            onRowClick={(r) => router.push(deptPath(r.slug, ""))}
            density="comfortable"
            toolbar={
              <DataTableToolbar
                left={<span className="text-sm text-muted-foreground">{mockWorkspaces.length} workspaces</span>}
              />
            }
            columns={wsColumns}
          />
          <div className="mt-4">
            <Button size="sm" variant="secondary" disabled title="Creating workspaces is disabled in this preview build.">
              Add workspace
            </Button>
          </div>
        </Panel>

        <Panel title="Seat allocation" description="Purchased seats vs limits per workspace (mock — enforcement comes later).">
          <ul className="space-y-2">
            {mockOrgSeatPool.allocatedByWorkspace.map((row) => {
              const pct = row.seatLimit > 0 ? Math.round((row.seatsUsed / row.seatLimit) * 100) : 0;
              return (
                <li key={row.slug}>
                  <Surface className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{row.name}</div>
                        <div className="text-xs text-muted-foreground">{pct}% of workspace seat cap in use</div>
                      </div>
                      <span className="shrink-0 tabular-nums text-sm font-medium text-foreground">
                        {row.seatsUsed} / {row.seatLimit}
                      </span>
                    </div>
                  </Surface>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => router.push("/employer/seats")}>
              Manage assignments
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-primary" onClick={() => router.push("/employer/workspaces")}>
              Workspace directory
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Next: Better Auth organization + SSO; enforce seat limits at invite and sign-in.
          </p>
        </Panel>
      </div>
    </>
  );
}

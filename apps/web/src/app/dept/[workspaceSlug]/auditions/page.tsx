"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Badge, Button, DataTable, PageHeader, Panel, Toolbar, ToolbarGroup } from "@metriq/ui";

import { trpc } from "../../../../app/providers";
import { deptPath } from "../../../../lib/dept-path";
import { listDrafts, type AuditionDraft } from "../../../../lib/audition-draft";
import type { EmployerAudition } from "../../../../mocks/employer/auditions";
import { mockEmployerAuditions } from "../../../../mocks/employer/auditions";

function draftToRow(d: AuditionDraft): EmployerAudition {
  return {
    id: d.id,
    title: d.title.trim() || "Untitled draft",
    level: d.level,
    template: d.template,
    status: "draft",
    timeboxMinutes: d.timeboxMinutes,
    createdAt: d.updatedAt,
  };
}

function isLocalDraftRow(id: string): boolean {
  return id.startsWith("local_");
}

function mapDbAudition(a: {
  id: string;
  title: string;
  level: string | null;
  template: string | null;
  status: string;
  timebox_minutes: number | null;
  created_at: unknown;
}): EmployerAudition {
  const created = new Date(a.created_at as string | number | Date);
  return {
    id: a.id,
    title: a.title,
    level: (a.level as EmployerAudition["level"]) ?? "Mid",
    template: (a.template as EmployerAudition["template"]) ?? "WorkSample_Brief",
    status:
      a.status === "published" ? "published" : a.status === "archived" ? "archived" : "draft",
    timeboxMinutes: a.timebox_minutes ?? 60,
    createdAt: created.toISOString(),
  };
}

export default function DeptAuditionsPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params?.workspaceSlug ?? "";
  const base = (p: string) => deptPath(slug, p);

  const { data: serverList = [] } = trpc.audition.list.useQuery(undefined, { enabled: Boolean(slug) });
  const dbIds = React.useMemo(() => new Set(serverList.map((a) => a.id)), [serverList]);

  /** Empty until mount — `listDrafts` reads localStorage and must not run during SSR (hydration mismatch). */
  const [draftRows, setDraftRows] = React.useState<EmployerAudition[]>([]);

  React.useEffect(() => {
    if (!slug) {
      setDraftRows([]);
      return;
    }
    setDraftRows(listDrafts(slug).map(draftToRow));
  }, [slug, pathname]);

  const rows = React.useMemo(() => {
    const byId = new Map<string, EmployerAudition>();
    for (const mock of mockEmployerAuditions) byId.set(mock.id, mock);
    for (const row of serverList) byId.set(row.id, mapDbAudition(row));
    for (const d of draftRows) byId.set(d.id, d);
    return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [draftRows, serverList]);

  return (
    <>
      <PageHeader
        title="Auditions"
        description="Create proof-aligned assessments (in-session text, choices, ordering, code, lab stubs). Drafts persist to the workspace database when the API is reachable."
        actions={
          <Button type="button" onClick={() => router.push(base("/auditions/new"))}>
            New audition
          </Button>
        }
      />

      <div className="mt-6 grid gap-4">
        <Toolbar
          left={
            <ToolbarGroup>
              <div className="text-sm text-muted-foreground">All auditions</div>
            </ToolbarGroup>
          }
          right={null}
        />

        <Panel title="Audition list" description="Published and draft auditions. Edit is enabled for drafts stored in the database or saved on this device.">
          <DataTable
            rows={rows}
            getRowKey={(r) => r.id}
            columns={[
              {
                key: "title",
                header: "Audition",
                cell: (r) => (
                  <div className="grid">
                    <div className="font-medium text-foreground">{r.title}</div>
                    <div className="text-sm text-muted-foreground">{r.template}</div>
                  </div>
                ),
              },
              { key: "level", header: "Level", cell: (r) => r.level },
              { key: "time", header: "Timebox", cell: (r) => `${r.timeboxMinutes} min` },
              {
                key: "status",
                header: "Status",
                cell: (r) => (
                  <Badge variant={r.status === "published" ? "success" : r.status === "draft" ? "outline" : "secondary"}>
                    {r.status}
                    {isLocalDraftRow(r.id) ? " · local" : null}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "",
                headerClassName: "text-right",
                className: "text-right",
                cell: (r) => (
                  <div className="flex justify-end gap-2">
                    {isLocalDraftRow(r.id) || dbIds.has(r.id) ? (
                      <Button size="sm" variant="secondary" type="button" onClick={() => router.push(base(`/auditions/${r.id}/edit`))}>
                        Edit
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" type="button" disabled title="Mock auditions have no editor in this preview build.">
                        Edit
                      </Button>
                    )}
                    <Button size="sm" type="button" onClick={() => router.push(base("/pipeline"))}>
                      Pipeline
                    </Button>
                    <Button size="sm" variant="secondary" type="button" onClick={() => router.push(base(`/auditions/${r.id}/invites`))}>
                      Invites
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState={{
              title: "No auditions yet",
              description: "Create your first audition and build a proof-aligned assessment.",
              actionLabel: "Create audition",
              onAction: () => router.push(base("/auditions/new")),
            }}
          />
          <div className="mt-3 text-sm text-muted-foreground">
            Tip: start from{" "}
            <Link className="underline" href={base("/auditions/new")}>
              New audition
            </Link>{" "}
            to open the assessment builder.
          </div>
        </Panel>
      </div>
    </>
  );
}

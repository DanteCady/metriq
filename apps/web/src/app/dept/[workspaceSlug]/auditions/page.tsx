"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Badge, Button, DataTable, PageHeader, Panel, Toolbar, ToolbarGroup } from "@metriq/ui";

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

export default function DeptAuditionsPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params?.workspaceSlug ?? "";
  const base = (p: string) => deptPath(slug, p);

  /** Empty until mount — `listDrafts` reads localStorage and must not run during SSR (hydration mismatch). */
  const [draftRows, setDraftRows] = React.useState<EmployerAudition[]>([]);

  React.useEffect(() => {
    if (!slug) {
      setDraftRows([]);
      return;
    }
    setDraftRows(listDrafts(slug).map(draftToRow));
  }, [slug, pathname]);

  const rows = React.useMemo(() => [...draftRows, ...mockEmployerAuditions], [draftRows]);

  return (
    <>
      <PageHeader
        title="Auditions"
        description="Create proof-aligned assessments (in-session text, choices, ordering, code, lab stubs). Local drafts are stored in this browser until API persistence lands."
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
              <div className="text-sm text-slate-600 dark:text-slate-300">All auditions</div>
            </ToolbarGroup>
          }
          right={null}
        />

        <Panel title="Audition list" description="Published and draft auditions. Edit is enabled for drafts saved on this device.">
          <DataTable
            rows={rows}
            getRowKey={(r) => r.id}
            columns={[
              {
                key: "title",
                header: "Audition",
                cell: (r) => (
                  <div className="grid">
                    <div className="font-medium text-slate-900 dark:text-slate-50">{r.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{r.template}</div>
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
                    {isLocalDraftRow(r.id) ? (
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
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
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

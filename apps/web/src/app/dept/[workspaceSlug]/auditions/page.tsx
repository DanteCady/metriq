"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge, Button, DataTable, PageHeader, Panel, Toolbar, ToolbarGroup } from "@metriq/ui";

import { deptPath } from "../../../../lib/dept-path";
import { mockEmployerAuditions } from "../../../../mocks/employer/auditions";

export default function DeptAuditionsPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const slug = params?.workspaceSlug ?? "";
  const base = (p: string) => deptPath(slug, p);

  return (
    <>
      <PageHeader
        title="Auditions"
        description="Create evidence-first assessments (work samples, debugging incidents, PR reviews, design docs) — fully customizable."
        actions={
          <Button
            onClick={() => {
              window.location.href = base("/auditions/new");
            }}
          >
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

        <Panel title="Audition list" description="Published and draft auditions.">
          <DataTable
            rows={mockEmployerAuditions}
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
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled
                      title="Audition editor is not available in this preview build."
                    >
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => (window.location.href = base("/pipeline"))}>
                      Pipeline
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState={{
              title: "No auditions yet",
              description: "Create your first audition from a template, then customize stages, deliverables, and rubric.",
              actionLabel: "Create audition",
              onAction: () => {
                window.location.href = base("/auditions/new");
              },
            }}
          />
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Tip: start from{" "}
            <Link className="underline" href={base("/auditions/new")}>
              a template
            </Link>
            , then customize everything.
          </div>
        </Panel>
      </div>
    </>
  );
}

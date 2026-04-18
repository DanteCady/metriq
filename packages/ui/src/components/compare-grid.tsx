import * as React from "react";

import { cn } from "../lib/cn";
import { Panel } from "./panel";

export type CompareColumn = {
  key: string;
  header: React.ReactNode;
  subheader?: React.ReactNode;
  meta?: React.ReactNode;
};

export type CompareGridRow = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  renderCell: (columnKey: string) => React.ReactNode;
};

export type CompareGridProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  columns: CompareColumn[];
  rows: CompareGridRow[];
  /**
   * Width of the left "row label" column.
   */
  labelColumnWidth?: number;
  className?: string;
};

export function CompareGrid({
  title = "Compare",
  description,
  actions,
  columns,
  rows,
  labelColumnWidth = 260,
  className,
}: CompareGridProps) {
  const template = React.useMemo(() => {
    const cols = columns.length;
    return `${labelColumnWidth}px repeat(${cols}, minmax(220px, 1fr))`;
  }, [columns.length, labelColumnWidth]);

  return (
    <Panel title={title} description={description} actions={actions} density="tight" className={className} contentClassName="p-0">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div
            className="grid border-b border-border bg-muted"
            style={{ gridTemplateColumns: template }}
          >
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Attribute
            </div>
            {columns.map((c) => (
              <div key={c.key} className="px-4 py-2">
                <div className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.header}
                </div>
                {c.subheader ? <div className="mt-1 text-xs text-muted-foreground">{c.subheader}</div> : null}
                {c.meta ? <div className="mt-1 text-xs text-muted-foreground">{c.meta}</div> : null}
              </div>
            ))}
          </div>

          {rows.map((r) => (
            <div
              key={r.key}
              className={cn("grid border-b border-border", "hover:bg-muted/70")}
              style={{ gridTemplateColumns: template }}
            >
              <div className="px-4 py-3">
                <div className="text-sm font-medium text-foreground">{r.label}</div>
                {r.description ? <div className="mt-1 text-sm text-muted-foreground">{r.description}</div> : null}
              </div>
              {columns.map((c) => (
                <div key={c.key} className="px-4 py-3">
                  <div className="text-sm text-foreground">{r.renderCell(c.key)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}


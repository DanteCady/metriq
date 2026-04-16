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
            className="grid border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
            style={{ gridTemplateColumns: template }}
          >
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              Attribute
            </div>
            {columns.map((c) => (
              <div key={c.key} className="px-4 py-2">
                <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  {c.header}
                </div>
                {c.subheader ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.subheader}</div> : null}
                {c.meta ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.meta}</div> : null}
              </div>
            ))}
          </div>

          {rows.map((r) => (
            <div
              key={r.key}
              className={cn("grid border-b border-slate-200 dark:border-slate-800", "hover:bg-slate-50 dark:hover:bg-slate-900/30")}
              style={{ gridTemplateColumns: template }}
            >
              <div className="px-4 py-3">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{r.label}</div>
                {r.description ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.description}</div> : null}
              </div>
              {columns.map((c) => (
                <div key={c.key} className="px-4 py-3">
                  <div className="text-sm text-slate-700 dark:text-slate-200">{r.renderCell(c.key)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}


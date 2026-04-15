import * as React from "react";

import { cn } from "../lib/cn";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { Surface } from "./surface";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, idx: number) => string;
  isLoading?: boolean;
  emptyState?: Pick<EmptyStateProps, "title" | "description" | "actionLabel" | "onAction" | "actionVariant">;
  className?: string;
};

export function DataTable<T>({ columns, rows, getRowKey, isLoading, emptyState, className }: DataTableProps<T>) {
  if (!isLoading && rows.length === 0 && emptyState) {
    return <EmptyState {...emptyState} className={className} />;
  }

  return (
    <Surface className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
                    c.headerClassName,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={getRowKey(row, idx)} className="group">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "border-b border-slate-200 px-4 py-3 text-sm text-slate-700 group-hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-900/30",
                        c.className,
                      )}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}


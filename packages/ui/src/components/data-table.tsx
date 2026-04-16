import * as React from "react";

import { cn } from "../lib/cn";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { Surface } from "./surface";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "right" | "center";
};

export type DataTableToolbarProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function DataTableToolbar({ left, right, className }: DataTableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800", className)}>
      <div className="min-w-0">{left}</div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, idx: number) => string;
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  emptyState?: Pick<EmptyStateProps, "title" | "description" | "actionLabel" | "onAction" | "actionVariant">;
  toolbar?: React.ReactNode;
  density?: "compact" | "comfortable";
  onRowClick?: (row: T, idx: number) => void;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading,
  error,
  emptyState,
  toolbar,
  density = "compact",
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (error) {
    return <ErrorState {...error} className={className} />;
  }

  if (!isLoading && rows.length === 0 && emptyState) {
    return <EmptyState {...emptyState} className={className} />;
  }

  const cellY = density === "compact" ? "py-2.5" : "py-3.5";
  const clickable = Boolean(onRowClick);

  return (
    <Surface className={cn("overflow-hidden", className)}>
      {toolbar ? <div>{toolbar}</div> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
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
                <tr
                  key={getRowKey(row, idx)}
                  className={cn(
                    "group",
                    clickable && "cursor-pointer",
                    clickable && "hover:bg-slate-50 dark:hover:bg-slate-900/30",
                  )}
                  onClick={clickable ? () => onRowClick?.(row, idx) : undefined}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "border-b border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200",
                        cellY,
                        c.align === "right" && "text-right tabular-nums",
                        c.align === "center" && "text-center",
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


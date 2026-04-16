import * as React from "react";

import { cn } from "../lib/cn";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { Panel } from "./panel";
import { ScoreBadge } from "./ui/score-badge";

export type RubricCriterion = {
  key: string;
  criterion: string;
  description?: string;
  weight?: number;
  score?: number;
  max?: number;
  notes?: React.ReactNode;
};

export type RubricTableProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  rows: RubricCriterion[];
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  emptyState?: Pick<EmptyStateProps, "title" | "description" | "actionLabel" | "onAction" | "actionVariant">;
  onRowClick?: (row: RubricCriterion) => void;
  className?: string;
};

function fmtWeight(w?: number) {
  if (typeof w !== "number" || !Number.isFinite(w)) return null;
  return w % 1 === 0 ? `${w}` : w.toFixed(2);
}

export function RubricTable({
  title = "Rubric",
  description,
  actions,
  rows,
  isLoading,
  error,
  emptyState,
  onRowClick,
  className,
}: RubricTableProps) {
  if (error) return <ErrorState {...error} className={className} />;
  if (!isLoading && rows.length === 0 && emptyState) return <EmptyState {...emptyState} className={className} />;

  const clickable = Boolean(onRowClick);

  return (
    <Panel title={title} description={description} actions={actions} density="tight" className={className} contentClassName="p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                Criterion
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                Weight
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                Score
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.key}
                  onClick={clickable ? () => onRowClick?.(r) : undefined}
                  className={cn(
                    "group",
                    clickable && "cursor-pointer",
                    clickable && "hover:bg-slate-50 dark:hover:bg-slate-900/30",
                  )}
                >
                  <td className="border-b border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900 dark:text-slate-50">{r.criterion}</div>
                      {r.description ? (
                        <div className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{r.description}</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="border-b border-slate-200 px-4 py-2.5 text-right text-sm tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    {fmtWeight(r.weight) ?? "—"}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-2.5 text-right dark:border-slate-800">
                    {typeof r.score === "number" ? <ScoreBadge score={r.score} max={r.max ?? 100} format="fraction" size="sm" /> : <span className="text-sm text-slate-500 dark:text-slate-400">—</span>}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    {r.notes ?? <span className="text-slate-500 dark:text-slate-400">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}


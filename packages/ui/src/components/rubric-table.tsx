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
              <th className="border-b border-border bg-muted px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Criterion
              </th>
              <th className="border-b border-border bg-muted px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Weight
              </th>
              <th className="border-b border-border bg-muted px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Score
              </th>
              <th className="border-b border-border bg-muted px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
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
                    clickable && "hover:bg-muted/70",
                  )}
                >
                  <td className="border-b border-border px-4 py-2.5 text-sm text-foreground">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">{r.criterion}</div>
                      {r.description ? (
                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="border-b border-border px-4 py-2.5 text-right text-sm tabular-nums text-foreground">
                    {fmtWeight(r.weight) ?? "—"}
                  </td>
                  <td className="border-b border-border px-4 py-2.5 text-right">
                    {typeof r.score === "number" ? <ScoreBadge score={r.score} max={r.max ?? 100} format="fraction" size="sm" /> : <span className="text-sm text-muted-foreground">—</span>}
                  </td>
                  <td className="border-b border-border px-4 py-2.5 text-sm text-foreground">
                    {r.notes ?? <span className="text-muted-foreground">—</span>}
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


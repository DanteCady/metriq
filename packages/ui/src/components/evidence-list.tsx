import * as React from "react";

import { cn } from "../lib/cn";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { Panel } from "./panel";
import { ScoreBadge } from "./ui/score-badge";

export type EvidenceListItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  /**
   * Optional evaluative summary to support evidence-first scanning.
   */
  score?: { value: number; max?: number; label?: string };
  status?: React.ReactNode;
  updatedAt?: React.ReactNode;
};

export type EvidenceListProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  items: EvidenceListItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  emptyState?: Pick<EmptyStateProps, "title" | "description" | "actionLabel" | "onAction" | "actionVariant">;
  className?: string;
};

export function EvidenceList({
  title = "Evidence",
  description,
  actions,
  items,
  selectedId,
  onSelect,
  isLoading,
  error,
  emptyState,
  className,
}: EvidenceListProps) {
  if (error) {
    return <ErrorState {...error} className={className} />;
  }

  if (!isLoading && items.length === 0 && emptyState) {
    return <EmptyState {...emptyState} className={className} />;
  }

  return (
    <Panel title={title} description={description} actions={actions} density="tight" className={className} contentClassName="p-0">
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">Loading…</div>
        ) : (
          items.map((item) => {
            const selected = selectedId === item.id;
            const clickable = Boolean(onSelect);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  "w-full text-left",
                  "px-4 py-3 transition-colors",
                  clickable && "hover:bg-slate-50 dark:hover:bg-slate-900/30",
                  selected && "bg-slate-50 dark:bg-slate-900/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{item.title}</div>
                      {item.status ? <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{item.status}</div> : null}
                    </div>
                    {item.subtitle ? (
                      <div className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.subtitle}</div>
                    ) : null}
                    {item.meta ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.meta}</div> : null}
                  </div>
                  <div className="shrink-0 text-right">
                    {item.score ? (
                      <div className="flex items-center justify-end gap-2">
                        {item.score.label ? <div className="text-xs text-slate-500 dark:text-slate-400">{item.score.label}</div> : null}
                        <ScoreBadge score={item.score.value} max={item.score.max ?? 100} format="fraction" />
                      </div>
                    ) : null}
                    {item.updatedAt ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.updatedAt}</div> : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Panel>
  );
}


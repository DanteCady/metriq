import * as React from "react";

import { cn } from "../lib/cn";
import { EmptyState, type EmptyStateProps } from "./empty-state";
import { Panel } from "./panel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type StageListItem = {
  id: string;
  title: string;
  description?: string;
  /**
   * "lab" | "simulation" | "work-sample" | etc (display-only).
   */
  typeLabel?: string;
  status?: React.ReactNode;
  meta?: React.ReactNode;
};

export type StageListEditorProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  stages: StageListItem[];
  isLoading?: boolean;
  emptyState?: Pick<EmptyStateProps, "title" | "description" | "actionLabel" | "onAction" | "actionVariant">;
  onAddStage?: () => void;
  onEditStage?: (id: string) => void;
  onRemoveStage?: (id: string) => void;
  onMoveStage?: (id: string, direction: "up" | "down") => void;
  className?: string;
};

export function StageListEditor({
  title = "Stages",
  description,
  actions,
  stages,
  isLoading,
  emptyState,
  onAddStage,
  onEditStage,
  onRemoveStage,
  onMoveStage,
  className,
}: StageListEditorProps) {
  if (!isLoading && stages.length === 0 && emptyState) {
    return <EmptyState {...emptyState} className={className} />;
  }

  return (
    <Panel
      title={title}
      description={description}
      actions={
        <div className="flex items-center gap-2">
          {actions}
          {onAddStage ? (
            <Button variant="secondary" size="sm" onClick={onAddStage}>
              Add stage
            </Button>
          ) : null}
        </div>
      }
      density="tight"
      className={className}
      contentClassName="p-0"
    >
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">Loading…</div>
        ) : (
          stages.map((s, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === stages.length - 1;
            return (
              <div key={s.id} className="flex items-start gap-3 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{s.title}</div>
                    {s.typeLabel ? <Badge variant="outline">{s.typeLabel}</Badge> : null}
                    {s.status ? <div className="text-xs text-slate-500 dark:text-slate-400">{s.status}</div> : null}
                  </div>
                  {s.description ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.description}</div> : null}
                  {s.meta ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{s.meta}</div> : null}
                </div>
                {(onMoveStage || onEditStage || onRemoveStage) ? (
                  <div className="shrink-0">
                    <div className="flex items-center gap-1">
                      {onMoveStage ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isFirst}
                            onClick={() => onMoveStage(s.id, "up")}
                            aria-label="Move up"
                            title="Move up"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLast}
                            onClick={() => onMoveStage(s.id, "down")}
                            aria-label="Move down"
                            title="Move down"
                          >
                            ↓
                          </Button>
                        </>
                      ) : null}
                      {onEditStage ? (
                        <Button variant="ghost" size="sm" onClick={() => onEditStage(s.id)}>
                          Edit
                        </Button>
                      ) : null}
                      {onRemoveStage ? (
                        <Button variant="ghost" size="sm" className={cn("text-red-700 hover:text-red-800 dark:text-red-200")} onClick={() => onRemoveStage(s.id)}>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}


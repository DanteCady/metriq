import * as React from "react";

import { cn } from "../lib/cn";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { LoadingState } from "./loading-state";
import { Panel } from "./panel";
import { ScoreBadge } from "./ui/score-badge";
import { ScoreBar } from "./ui/score-bar";

export type EvaluationCriterionScore = {
  key: string;
  label: string;
  score: number;
  max?: number;
  description?: string;
  weight?: number;
  notes?: React.ReactNode;
};

export type EvaluationBreakdownProps = {
  criteria: EvaluationCriterionScore[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  empty?: React.ReactNode;
  className?: string;
};

export function EvaluationBreakdown({
  criteria,
  title = "Score breakdown",
  description,
  isLoading,
  error,
  empty,
  className,
}: EvaluationBreakdownProps) {
  if (error) {
    return <ErrorState {...error} className={className} />;
  }

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (criteria.length === 0 && empty) {
    return <div className={className}>{empty}</div>;
  }

  return (
    <Panel title={title} description={description} density="tight" className={cn(className)} contentClassName="p-0">
      <div className="divide-y divide-border">
        {criteria.map((c) => (
          <div key={c.key} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-medium text-foreground">{c.label}</div>
                {typeof c.weight === "number" ? (
                  <div className="text-xs text-muted-foreground">w={c.weight}</div>
                ) : null}
              </div>
              {c.description ? <div className="mt-1 text-sm text-muted-foreground">{c.description}</div> : null}
              <div className="mt-2">
                <ScoreBar value={c.score} max={c.max ?? 100} tone="neutral" />
              </div>
              {c.notes ? <div className="mt-2 text-sm text-foreground">{c.notes}</div> : null}
            </div>
            <div className="shrink-0">
              <ScoreBadge score={c.score} max={c.max ?? 100} format="fraction" />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}


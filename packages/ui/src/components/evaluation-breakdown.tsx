import * as React from "react";

import { cn } from "../lib/cn";
import { ScoreBadge } from "./ui/score-badge";

export type EvaluationCriterionScore = {
  key: string;
  label: string;
  score: number;
  max?: number;
  description?: string;
  weight?: number;
};

export type EvaluationBreakdownProps = {
  criteria: EvaluationCriterionScore[];
  className?: string;
};

export function EvaluationBreakdown({ criteria, className }: EvaluationBreakdownProps) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950", className)}>
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Score breakdown</div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {criteria.map((c) => (
          <div key={c.key} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{c.label}</div>
                {typeof c.weight === "number" ? (
                  <div className="text-xs text-slate-500 dark:text-slate-400">w={c.weight}</div>
                ) : null}
              </div>
              {c.description ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.description}</div> : null}
            </div>
            <div className="shrink-0">
              <ScoreBadge score={c.score} max={c.max ?? 100} format="fraction" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


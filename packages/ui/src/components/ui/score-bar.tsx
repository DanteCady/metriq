import * as React from "react";

import { cn } from "../../lib/cn";

export type ScoreBarProps = {
  value: number;
  max?: number;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /**
   * When provided, renders a subtle threshold marker.
   */
  threshold?: number;
  tone?: "auto" | "neutral";
  className?: string;
};

export function ScoreBar({ value, max = 100, label, hint, threshold, tone = "auto", className }: ScoreBarProps) {
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = max > 0 ? Math.min(Math.max(safe, 0), max) : 0;
  const pct = max > 0 ? (clamped / max) * 100 : 0;

  const barTone =
    tone === "neutral"
      ? "bg-slate-900 dark:bg-slate-50"
      : pct >= 85
        ? "bg-emerald-600 dark:bg-emerald-500"
        : pct >= 70
          ? "bg-slate-900 dark:bg-slate-50"
          : pct >= 50
            ? "bg-amber-600 dark:bg-amber-500"
            : "bg-red-600 dark:bg-red-500";

  const thresholdPct = typeof threshold === "number" && max > 0 ? (threshold / max) * 100 : null;

  return (
    <div className={cn("w-full", className)}>
      {(label || hint) ? (
        <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="min-w-0 truncate font-medium text-slate-700 dark:text-slate-200">{label}</div>
          {hint ? <div className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">{hint}</div> : null}
        </div>
      ) : null}
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className={cn("h-full rounded-full", barTone)} style={{ width: `${pct}%` }} />
        {thresholdPct !== null ? (
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-slate-400/70 dark:bg-slate-500/70"
            style={{ left: `${Math.min(Math.max(thresholdPct, 0), 100)}%` }}
          />
        ) : null}
      </div>
    </div>
  );
}


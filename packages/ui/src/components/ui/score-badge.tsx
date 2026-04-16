import * as React from "react";

import { cn } from "../../lib/cn";

export type ScoreBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  score: number;
  max?: number;
  format?: "percent" | "fraction";
  size?: "sm" | "md";
  tone?: "auto" | "neutral";
};

export function ScoreBadge({
  score,
  max = 100,
  format = "percent",
  size = "md",
  tone = "auto",
  className,
  ...props
}: ScoreBadgeProps) {
  const safe = Number.isFinite(score) ? score : 0;
  const pct = max > 0 ? (safe / max) * 100 : 0;

  const autoTone =
    pct >= 85
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
      : pct >= 70
        ? "border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        : pct >= 50
          ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
          : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200";

  const neutralTone = "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50";

  const label = format === "fraction" ? `${safe}/${max}` : `${Math.round(pct)}%`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tabular-nums",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        tone === "neutral" ? neutralTone : autoTone,
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}


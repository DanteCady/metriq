import * as React from "react";

import { cn } from "../../lib/cn";

export type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ value, max = 100, label, className }: ProgressBarProps) {
  const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), max) : 0;
  const pct = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      {label ? <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">{label}</div> : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={max}>
        <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}


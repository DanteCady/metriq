import * as React from "react";

import { cn } from "../lib/cn";
import { Surface } from "./surface";

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <Surface className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{value}</div>
          {hint ? <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</div> : null}
        </div>
        {icon ? <div className="shrink-0 text-slate-500 dark:text-slate-400">{icon}</div> : null}
      </div>
    </Surface>
  );
}


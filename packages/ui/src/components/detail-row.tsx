import * as React from "react";

import { cn } from "../lib/cn";

export type DetailRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  helper?: React.ReactNode;
  className?: string;
};

export function DetailRow({ label, value, helper, className }: DetailRowProps) {
  return (
    <div className={cn("flex flex-col gap-1 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800", className)}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-sm text-slate-900 dark:text-slate-50">{value}</div>
      {helper ? <div className="text-sm text-slate-600 dark:text-slate-300">{helper}</div> : null}
    </div>
  );
}


import * as React from "react";

import { cn } from "../lib/cn";

export type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950", className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-200" />
      <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}


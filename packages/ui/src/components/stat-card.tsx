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
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
          {hint ? <div className="mt-2 text-sm text-muted-foreground">{hint}</div> : null}
        </div>
        {icon ? <div className="shrink-0 text-muted-foreground">{icon}</div> : null}
      </div>
    </Surface>
  );
}


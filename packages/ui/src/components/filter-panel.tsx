import * as React from "react";

import { cn } from "../lib/cn";
import { Surface } from "./surface";

export type FilterPanelProps = {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function FilterPanel({ title = "Filters", actions, children, className }: FilterPanelProps) {
  return (
    <Surface className={cn("p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{title}</div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="grid gap-3">{children}</div>
    </Surface>
  );
}


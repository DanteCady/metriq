import * as React from "react";

import { cn } from "../lib/cn";

export type CompareRowProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Low-level row primitive used by side-by-side compare layouts.
 * Use `CompareGrid` when you want a full header + grid shell.
 */
export function CompareRow({ label, description, children, className }: CompareRowProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className="w-[260px] shrink-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}


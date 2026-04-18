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
    <div className={cn("flex flex-col gap-1 border-b border-border py-3 last:border-b-0", className)}>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
      {helper ? <div className="text-sm text-muted-foreground">{helper}</div> : null}
    </div>
  );
}


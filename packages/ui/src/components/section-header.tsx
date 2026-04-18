import * as React from "react";

import { cn } from "../lib/cn";

export type SectionMetaItem = {
  label: string;
  value: React.ReactNode;
};

export type SectionHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: SectionMetaItem[];
  actions?: React.ReactNode;
  /**
   * Compact variant is useful inside dense panels and tables.
   */
  density?: "default" | "compact";
  className?: string;
};

export function SectionHeader({ title, description, meta, actions, density = "default", className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <div
          className={cn(
            "text-sm font-semibold text-foreground",
            density === "compact" && "text-sm",
          )}
        >
          {title}
        </div>
        {description ? (
          <div className={cn("mt-1 text-sm text-muted-foreground", density === "compact" && "text-sm")}>
            {description}
          </div>
        ) : null}
        {meta && meta.length > 0 ? (
          <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {meta.map((m) => (
              <div key={m.label} className="flex items-center gap-1">
                <dt className="font-medium">{m.label}</dt>
                <dd className="text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}


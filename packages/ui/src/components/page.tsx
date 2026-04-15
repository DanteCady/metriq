import * as React from "react";

import { cn } from "../lib/cn";
import { Surface } from "./surface";

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

export type PageSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function PageSection({ title, description, children, className }: PageSectionProps) {
  return (
    <Surface as="section" className={cn("p-5", className)}>
      {title ? (
        <div className="mb-4">
          <div className="text-sm font-semibold">{title}</div>
          {description ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</div> : null}
        </div>
      ) : null}
      {children}
    </Surface>
  );
}


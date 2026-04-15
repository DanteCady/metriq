import * as React from "react";

import { cn } from "../lib/cn";

export type DefinitionItem = {
  term: React.ReactNode;
  description: React.ReactNode;
};

export type DefinitionListProps = {
  items: DefinitionItem[];
  columns?: 1 | 2;
  className?: string;
};

export function DefinitionList({ items, columns = 1, className }: DefinitionListProps) {
  return (
    <dl className={cn(columns === 2 ? "grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2" : "space-y-4", className)}>
      {items.map((it, idx) => (
        <div key={idx}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{it.term}</dt>
          <dd className="mt-1 text-sm text-slate-900 dark:text-slate-50">{it.description}</dd>
        </div>
      ))}
    </dl>
  );
}


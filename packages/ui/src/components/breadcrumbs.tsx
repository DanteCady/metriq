import * as React from "react";

import { cn } from "../lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumbs" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}_${idx}`} className="flex min-w-0 items-center gap-2">
              {item.href && !isLast ? (
                <a href={item.href} className="truncate transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ) : (
                <span className={cn("truncate", isLast && "font-medium text-foreground")}>{item.label}</span>
              )}
              {!isLast ? <span className="select-none text-muted-foreground/50">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


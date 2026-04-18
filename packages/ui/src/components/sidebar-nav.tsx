import * as React from "react";

import { cn } from "../lib/cn";
import { Surface } from "./surface";

export type SidebarNavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
};

export type SidebarNavProps = {
  title?: string;
  items: SidebarNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  footer?: React.ReactNode;
  className?: string;
  /** Icon-only rail: labels use `sr-only`; links get `title` for hover tooltips. */
  collapsed?: boolean;
};

export function SidebarNav({ title, items, activeKey, onSelect, footer, className, collapsed }: SidebarNavProps) {
  const navLabel = title ?? "Sidebar";
  return (
    <Surface as="nav" className={cn(collapsed ? "p-2" : "p-3", className)} aria-label={navLabel}>
      {title ? (
        collapsed ? (
          <div className="sr-only">{title}</div>
        ) : (
          <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </div>
        )
      ) : null}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const common = cn(
            "relative flex w-full items-center gap-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            collapsed ? "justify-center px-2 py-2.5" : "px-2.5 py-2",
            item.disabled && "pointer-events-none opacity-50",
            isActive
              ? "bg-primary/[0.08] font-medium text-foreground shadow-sm ring-1 ring-primary/15 before:pointer-events-none before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          );

          const content = (
            <>
              {item.icon ? (
                <span className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground")}>{item.icon}</span>
              ) : null}
              <span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
              {item.badge && !collapsed ? <span className="shrink-0">{item.badge}</span> : null}
            </>
          );

          const tip = collapsed ? item.label : undefined;

          return (
            <li key={item.key}>
              {item.href ? (
                <a
                  href={item.href}
                  title={tip}
                  className={common}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    if (!onSelect) return;
                    e.preventDefault();
                    onSelect(item.key);
                  }}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  title={tip}
                  className={common}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect?.(item.key)}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {footer ? <div className="mt-3 border-t border-border pt-3">{footer}</div> : null}
    </Surface>
  );
}


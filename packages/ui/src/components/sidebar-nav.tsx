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
            "flex w-full items-center gap-2 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            collapsed ? "justify-center px-2 py-2.5" : "px-2.5 py-2",
            item.disabled && "pointer-events-none opacity-50",
            isActive
              ? "bg-muted font-medium text-foreground shadow-sm ring-1 ring-border/60"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          );

          const content = (
            <>
              {item.icon ? <span className="shrink-0 text-muted-foreground">{item.icon}</span> : null}
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


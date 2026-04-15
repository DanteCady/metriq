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
};

export function SidebarNav({ title, items, activeKey, onSelect, footer, className }: SidebarNavProps) {
  return (
    <Surface as="nav" className={cn("p-3", className)} aria-label={title ?? "Sidebar"}>
      {title ? <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</div> : null}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const common = cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
            item.disabled && "pointer-events-none opacity-50",
            isActive
              ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
          );

          const content = (
            <>
              {item.icon ? <span className="shrink-0 text-slate-500 dark:text-slate-400">{item.icon}</span> : null}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge ? <span className="shrink-0">{item.badge}</span> : null}
            </>
          );

          return (
            <li key={item.key}>
              {item.href ? (
                <a
                  href={item.href}
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
      {footer ? <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">{footer}</div> : null}
    </Surface>
  );
}


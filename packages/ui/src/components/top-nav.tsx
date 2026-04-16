import * as React from "react";

import { cn } from "../lib/cn";

export type TopNavLink = {
  key: string;
  label: string;
  href?: string;
  disabled?: boolean;
};

export type TopNavProps = {
  brand?: React.ReactNode;
  links?: TopNavLink[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  right?: React.ReactNode;
  className?: string;
};

export function TopNav({ brand, links = [], activeKey, onSelect, right, className }: TopNavProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[1400px] items-center gap-4 px-6 py-3", className)}>
      {brand ? <div className="shrink-0">{brand}</div> : null}
      {links.length ? (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 overflow-x-auto">
            {links.map((link) => {
              const isActive = link.key === activeKey;
              const common = cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
                link.disabled && "pointer-events-none opacity-50",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              );

              if (link.href) {
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    className={common}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      if (!onSelect) return;
                      e.preventDefault();
                      onSelect(link.key);
                    }}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <button
                  key={link.key}
                  type="button"
                  className={common}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect?.(link.key)}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="min-w-0 flex-1" />
      )}
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}


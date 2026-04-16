import * as React from "react";

import { cn } from "../lib/cn";

const TOPBAR_H = "3.5rem"; /* h-14 */

export type AppShellProps = {
  sidebar?: React.ReactNode;
  /** Classes on the desktop `<aside>` (e.g. width when collapsed). */
  sidebarAsideClassName?: string;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ sidebar, sidebarAsideClassName, topbar, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50",
        className,
      )}
    >
      {topbar ? (
        <header
          className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"
          style={{ minHeight: TOPBAR_H }}
        >
          {topbar}
        </header>
      ) : null}
      <div className="relative flex min-h-0 w-full flex-1">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-[60] focus:rounded-md focus:border focus:border-slate-200 focus:bg-white focus:px-3 focus:py-2 focus:text-sm font-medium text-slate-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:border-slate-700 dark:focus:bg-slate-900 dark:text-slate-50"
        >
          Skip to content
        </a>
        {sidebar ? (
          <aside
            className={cn(
              "hidden shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block",
              sidebarAsideClassName ?? "w-64",
            )}
          >
            <div
              className="sticky overflow-y-auto"
              style={{
                top: topbar ? TOPBAR_H : 0,
                maxHeight: topbar ? `calc(100dvh - ${TOPBAR_H})` : "100dvh",
              }}
            >
              {sidebar}
            </div>
          </aside>
        ) : null}
        <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

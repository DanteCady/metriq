import * as React from "react";

import { cn } from "../lib/cn";

export type AppShellProps = {
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ sidebar, topbar, children, className }: AppShellProps) {
  return (
    <div className={cn("min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50", className)}>
      {topbar ? <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">{topbar}</div> : null}
      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-6">
        {sidebar ? <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside> : null}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}


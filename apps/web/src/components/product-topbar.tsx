"use client";

import * as React from "react";
import { Bell, Menu, Search, Sparkles } from "lucide-react";

import { Badge, Breadcrumbs, Button } from "@metriq/ui";

export type ProductTopbarProps = {
  onOpenMobileNav: () => void;
  breadcrumbItems: { label: string; href?: string }[];
  topRight?: React.ReactNode;
};

export function ProductTopbar({ onOpenMobileNav, breadcrumbItems, topRight }: ProductTopbarProps) {
  return (
    <div className="flex h-14 w-full min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6">
      <Button
        type="button"
        className="shrink-0 lg:hidden"
        variant="ghost"
        size="sm"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="size-5 shrink-0" aria-hidden />
      </Button>
      <div className="min-w-0 flex-1 py-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
        Preview
      </Badge>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden border border-slate-200 px-2.5 sm:inline-flex dark:border-slate-700"
          disabled
          title="Search is not available in this preview build."
          aria-label="Search (preview, unavailable)"
        >
          <Search className="size-4 shrink-0" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden border border-slate-200 px-2.5 md:inline-flex dark:border-slate-700"
          disabled
          title="Notifications are not available in this preview build."
          aria-label="Notifications (preview, unavailable)"
        >
          <Bell className="size-4 shrink-0" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden border border-slate-200 px-2.5 lg:inline-flex dark:border-slate-700"
          disabled
          title="Quick actions are not available in this preview build."
          aria-label="Quick actions (preview, unavailable)"
        >
          <Sparkles className="size-4 shrink-0" aria-hidden />
        </Button>
      </div>
      {topRight ? <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">{topRight}</div> : null}
    </div>
  );
}

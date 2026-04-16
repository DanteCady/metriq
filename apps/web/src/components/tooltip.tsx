"use client";

import * as React from "react";

import { cn } from "@metriq/ui";

export type TooltipProps = {
  label: string;
  children: React.ReactNode;
  /** Where the tip appears relative to the trigger. */
  side?: "bottom" | "top";
  className?: string;
};

/**
 * Lightweight hover/focus tooltip for icon controls (no extra dependencies).
 * Named `group/tooltip` so nested Tailwind `group` usage does not clash.
 */
export function Tooltip({ label, children, side = "bottom", className }: TooltipProps) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-[100] w-max max-w-[min(260px,calc(100vw-1.5rem))] -translate-x-1/2",
          "rounded-md border border-border bg-popover px-2 py-1 text-left text-xs font-medium leading-snug text-popover-foreground shadow-md",
          "opacity-0 transition-opacity duration-150",
          "group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          side === "bottom" && "top-full mt-2",
          side === "top" && "bottom-full mb-2",
        )}
      >
        {label}
      </span>
    </span>
  );
}

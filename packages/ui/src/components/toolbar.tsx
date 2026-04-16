import * as React from "react";

import { cn } from "../lib/cn";

export type ToolbarProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function Toolbar({ left, right, className }: ToolbarProps) {
  if (!left && !right) return null;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      {left ? <div className="min-w-0">{left}</div> : <div className="min-w-0" />}
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export type ToolbarGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}


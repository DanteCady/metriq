import * as React from "react";

import { cn } from "../lib/cn";

export type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800/60", className)}
      style={style}
      aria-hidden="true"
    />
  );
}


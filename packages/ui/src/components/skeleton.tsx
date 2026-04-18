import * as React from "react";

import { cn } from "../lib/cn";

export type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted-foreground/15 dark:bg-muted-foreground/20", className)}
      style={style}
      aria-hidden="true"
    />
  );
}


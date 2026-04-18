import * as React from "react";

import { cn } from "../lib/cn";
import { Surface } from "./surface";

export type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <Surface className={cn("flex items-center gap-3 p-5", className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground dark:border-muted-foreground/30 dark:border-t-foreground" />
      <div className="text-sm text-muted-foreground">{label}</div>
    </Surface>
  );
}


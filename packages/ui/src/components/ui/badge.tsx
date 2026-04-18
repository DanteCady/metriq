import * as React from "react";

import { cn } from "../../lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "info";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variant === "default" && "border-border bg-muted text-foreground",
        variant === "secondary" && "border-border bg-card text-muted-foreground",
        variant === "outline" && "border-border bg-transparent text-muted-foreground",
        variant === "success" &&
          "border-success/30 bg-success/10 text-success dark:border-success/40 dark:bg-success/[0.15] dark:text-success",
        variant === "warning" &&
          "border-warning/35 bg-warning/12 text-warning dark:border-warning/40 dark:bg-warning/[0.14] dark:text-warning",
        variant === "destructive" &&
          "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/45 dark:bg-destructive/[0.15] dark:text-destructive",
        variant === "info" &&
          "border-info/30 bg-info/10 text-info dark:border-info/40 dark:bg-info/[0.15] dark:text-info",
        className,
      )}
      {...props}
    />
  );
}


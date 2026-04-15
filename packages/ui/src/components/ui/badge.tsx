import * as React from "react";

import { cn } from "../../lib/cn";

export type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-950",
  secondary: "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50",
  outline: "border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200",
  success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200",
};

export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}


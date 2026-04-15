import * as React from "react";

import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./ui/button";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonProps["variant"];
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "secondary",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700", className)}>
      <div className="mx-auto max-w-md">
        <div className="text-sm font-semibold">{title}</div>
        {description ? <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</div> : null}
        {actionLabel && onAction ? (
          <div className="mt-4 flex justify-center">
            <Button variant={actionVariant} onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}


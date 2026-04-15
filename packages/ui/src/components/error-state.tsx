import * as React from "react";

import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./ui/button";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonProps["variant"];
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description,
  actionLabel = "Try again",
  onAction,
  actionVariant = "secondary",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50/40 p-8 text-center dark:border-red-900/60 dark:bg-red-950/20", className)}>
      <div className="mx-auto max-w-md">
        <div className="text-sm font-semibold text-red-900 dark:text-red-200">{title}</div>
        {description ? <div className="mt-2 text-sm text-red-800/80 dark:text-red-200/80">{description}</div> : null}
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


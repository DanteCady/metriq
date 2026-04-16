import * as React from "react";

import { cn } from "../lib/cn";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { LoadingState } from "./loading-state";
import { InsetPanel } from "./panel";

export type EvidencePreviewProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  empty?: React.ReactNode;
  className?: string;
};

export function EvidencePreview({
  title = "Evidence",
  description,
  meta,
  actions,
  children,
  isLoading,
  error,
  empty,
  className,
}: EvidencePreviewProps) {
  if (error) {
    return <ErrorState {...error} className={className} />;
  }

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (!children && empty) {
    return <div className={className}>{empty}</div>;
  }

  return (
    <InsetPanel
      className={className}
      tone="emphasis"
      title={
        <div className="flex items-center gap-2">
          <span className="truncate">{title}</span>
        </div>
      }
      description={description}
      actions={actions}
      meta={
        meta
          ? [
              {
                label: "Context",
                value: <span className="truncate">{meta}</span>,
              },
            ]
          : undefined
      }
      contentClassName={cn("grid gap-4")}
    >
      {children}
    </InsetPanel>
  );
}


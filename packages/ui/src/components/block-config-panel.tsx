import * as React from "react";

import { cn } from "../lib/cn";
import { ErrorState, type ErrorStateProps } from "./error-state";
import { InsetPanel } from "./panel";
import { LoadingState } from "./loading-state";

export type BlockConfigPanelProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  error?: Pick<ErrorStateProps, "title" | "description" | "actionLabel" | "onAction">;
  empty?: React.ReactNode;
  className?: string;
};

export function BlockConfigPanel({
  title = "Configuration",
  description,
  actions,
  children,
  footer,
  isLoading,
  error,
  empty,
  className,
}: BlockConfigPanelProps) {
  if (error) return <ErrorState {...error} className={className} />;
  if (isLoading) return <LoadingState className={className} />;
  if (!children && empty) return <div className={className}>{empty}</div>;

  return (
    <InsetPanel
      className={className}
      tone="neutral"
      title={title}
      description={description}
      actions={actions}
      footer={footer}
      contentClassName={cn("grid gap-4")}
    >
      {children}
    </InsetPanel>
  );
}


import * as React from "react";

import { cn } from "../lib/cn";
import { SectionHeader, type SectionHeaderProps } from "./section-header";
import { Surface } from "./surface";

export type PanelProps = {
  title?: SectionHeaderProps["title"];
  description?: SectionHeaderProps["description"];
  meta?: SectionHeaderProps["meta"];
  actions?: SectionHeaderProps["actions"];
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Tight density is for tables, rubric, and evaluation surfaces.
   */
  density?: "default" | "tight";
  /**
   * Panels can optionally remove their outer border when nested inside another surface.
   */
  variant?: "default" | "borderless";
  className?: string;
  contentClassName?: string;
};

export function Panel({
  title,
  description,
  meta,
  actions,
  children,
  footer,
  density = "default",
  variant = "default",
  className,
  contentClassName,
}: PanelProps) {
  const pad = density === "tight" ? "p-4" : "p-5";

  return (
    <Surface
      className={cn(
        variant === "borderless" && "border-transparent bg-transparent dark:border-transparent dark:bg-transparent",
        className,
      )}
    >
      {title ? (
        <div className={cn("border-b border-slate-200 dark:border-slate-800", pad)}>
          <SectionHeader
            title={title}
            description={description}
            meta={meta}
            actions={actions}
            density={density === "tight" ? "compact" : "default"}
          />
        </div>
      ) : null}
      <div className={cn(pad, !title && pad, contentClassName)}>{children}</div>
      {footer ? (
        <div className={cn("border-t border-slate-200 dark:border-slate-800", pad)}>{footer}</div>
      ) : null}
    </Surface>
  );
}

export type InsetPanelProps = Omit<PanelProps, "variant"> & {
  /**
   * Inset panels read as "inside" a larger surface.
   */
  tone?: "neutral" | "emphasis";
};

export function InsetPanel({ tone = "neutral", density = "tight", className, ...props }: InsetPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/20",
        tone === "emphasis" && "bg-white dark:bg-slate-950",
        className,
      )}
    >
      <Panel
        {...props}
        density={density}
        variant="borderless"
        className="border-0 bg-transparent dark:bg-transparent"
      />
    </div>
  );
}


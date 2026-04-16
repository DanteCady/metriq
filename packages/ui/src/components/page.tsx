import * as React from "react";

import { cn } from "../lib/cn";
import { SectionHeader, type SectionHeaderProps } from "./section-header";
import { Surface } from "./surface";

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  meta?: React.ReactNode;
  /**
   * Optional right-aligned supplemental content (e.g. status, progress).
   * Rendered next to actions but visually lighter.
   */
  aside?: React.ReactNode;
};

export function PageHeader({ title, description, actions, eyebrow, meta, aside }: PageHeaderProps) {
  return (
    <header className="border-b border-border pb-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            {eyebrow ? (
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</div>
            ) : null}
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
            {meta ? <div className="mt-3">{meta}</div> : null}
          </div>
          {actions || aside ? (
            <div className="shrink-0">
              <div className="flex items-start justify-end gap-3">
                {aside ? <div className="pt-0.5 text-sm text-muted-foreground">{aside}</div> : null}
                {actions ? <div>{actions}</div> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export type PageSectionProps = {
  title?: SectionHeaderProps["title"];
  description?: SectionHeaderProps["description"];
  meta?: SectionHeaderProps["meta"];
  actions?: SectionHeaderProps["actions"];
  children: React.ReactNode;
  className?: string;
};

export function PageSection({ title, description, meta, actions, children, className }: PageSectionProps) {
  return (
    <Surface as="section" className={cn("p-5", className)}>
      {title ? (
        <SectionHeader title={title} description={description} meta={meta} actions={actions} className="mb-4" />
      ) : null}
      {children}
    </Surface>
  );
}


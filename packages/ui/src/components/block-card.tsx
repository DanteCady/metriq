import * as React from "react";

import { cn } from "../lib/cn";
import { Panel } from "./panel";
import { Badge } from "./ui/badge";

export type BlockCardProps = {
  title: string;
  description?: React.ReactNode;
  typeLabel?: string;
  status?: React.ReactNode;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function BlockCard({ title, description, typeLabel, status, icon, meta, actions, children, className }: BlockCardProps) {
  return (
    <Panel
      className={className}
      density="tight"
      title={
        <div className="flex items-center gap-2">
          {icon ? <div className="shrink-0 text-muted-foreground">{icon}</div> : null}
          <span className="truncate">{title}</span>
          {typeLabel ? <Badge variant="outline">{typeLabel}</Badge> : null}
          {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
        </div>
      }
      description={description}
      actions={actions}
      meta={
        meta
          ? [
              {
                label: "Details",
                value: <span className="truncate">{meta}</span>,
              },
            ]
          : undefined
      }
      contentClassName={cn("grid gap-3")}
    >
      {children}
    </Panel>
  );
}


import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Surface } from "./surface";

export type AuditionStatus = "invited" | "active" | "completed";

export type AuditionCardProps = {
  roleTitle: string;
  companyName: string;
  estimatedMinutes?: number;
  status: AuditionStatus;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

function statusBadge(status: AuditionStatus) {
  if (status === "active") return <Badge variant="default">Active</Badge>;
  if (status === "completed") return <Badge variant="secondary">Completed</Badge>;
  return <Badge variant="outline">Invited</Badge>;
}

export function AuditionCard({
  roleTitle,
  companyName,
  estimatedMinutes,
  status,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: AuditionCardProps) {
  return (
    <Surface className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold tracking-tight text-foreground">{roleTitle}</div>
            {statusBadge(status)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{companyName}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {estimatedMinutes != null ? <Badge variant="outline">{estimatedMinutes} min</Badge> : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
        {secondaryActionLabel && onSecondaryAction ? (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        ) : null}
      </div>
    </Surface>
  );
}


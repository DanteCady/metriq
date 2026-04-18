import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SimulationStatusPill, type SimulationStatus } from "./simulation-status-pill";
import { Surface } from "./surface";

export type SimulationCardProps = {
  title: string;
  description?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedMinutes?: number;
  skills?: string[];
  status?: SimulationStatus;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

export function SimulationCard({
  title,
  description,
  difficulty,
  estimatedMinutes,
  skills,
  status,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: SimulationCardProps) {
  const difficultyAccent =
    difficulty === "Easy"
      ? "border-t-2 border-t-success"
      : difficulty === "Medium"
        ? "border-t-2 border-t-warning"
        : difficulty === "Hard"
          ? "border-t-2 border-t-destructive"
          : "";

  return (
    <Surface className={cn("p-5", difficultyAccent, className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold tracking-tight text-foreground">{title}</div>
            {status ? <SimulationStatusPill status={status} /> : null}
          </div>
          {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
        </div>
      </div>

      {(difficulty || estimatedMinutes != null || (skills && skills.length)) ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {difficulty ? (
            <Badge
              variant={
                difficulty === "Easy"
                  ? "success"
                  : difficulty === "Medium"
                    ? "warning"
                    : difficulty === "Hard"
                      ? "destructive"
                      : "secondary"
              }
            >
              {difficulty}
            </Badge>
          ) : null}
          {estimatedMinutes != null ? (
            <Badge variant="info" className="tabular-nums">
              {estimatedMinutes} min
            </Badge>
          ) : null}
          {skills?.slice(0, 4).map((s) => (
            <Badge key={s} variant="outline" className="border-primary/20 bg-primary/[0.04] text-foreground dark:bg-primary/[0.08]">
              {s}
            </Badge>
          ))}
          {skills && skills.length > 4 ? <Badge variant="outline">+{skills.length - 4}</Badge> : null}
        </div>
      ) : null}

      {primaryActionLabel || secondaryActionLabel ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {primaryActionLabel && onPrimaryAction ? (
            <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </Surface>
  );
}


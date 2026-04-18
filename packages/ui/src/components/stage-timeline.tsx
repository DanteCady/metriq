import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type StageTimelineStatus = "locked" | "up_next" | "in_progress" | "completed";

export type StageTimelineStage = {
  id: string;
  title: string;
  objective?: string;
  estimatedMinutes?: number;
  status?: StageTimelineStatus;
};

export type StageTimelineProps = {
  stages: StageTimelineStage[];
  activeStageId?: string;
  onStageClick?: (stageId: string) => void;
  className?: string;
};

function statusPill(status?: StageTimelineStatus) {
  if (!status) return null;
  const label =
    status === "completed" ? "Completed" : status === "in_progress" ? "In progress" : status === "up_next" ? "Up next" : "Locked";
  const variant = status === "completed" ? "secondary" : status === "in_progress" ? "default" : "outline";
  return (
    <Badge variant={variant} className={cn(status === "locked" && "opacity-70")}>
      {label}
    </Badge>
  );
}

export function StageTimeline({ stages, activeStageId, onStageClick, className }: StageTimelineProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="text-sm font-semibold text-foreground">Stage map</div>
        <div className="mt-1 text-sm text-muted-foreground">Work progresses sequentially in MVP.</div>
      </div>
      <ol className="divide-y divide-border">
        {stages.map((s, idx) => {
          const active = s.id === activeStageId;
          const clickable = Boolean(onStageClick);
          const locked = s.status === "locked";
          return (
            <li key={s.id} className={cn("px-4 py-3", active && "bg-muted/30")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={cn("text-xs font-semibold tabular-nums text-muted-foreground")}>{idx + 1}</div>
                    <div className={cn("truncate text-sm font-medium text-foreground", locked && "opacity-70")}>
                      {s.title}
                    </div>
                    {statusPill(s.status)}
                    {s.estimatedMinutes != null ? (
                      <span className="text-xs text-muted-foreground">{s.estimatedMinutes} min</span>
                    ) : null}
                  </div>
                  {s.objective ? (
                    <div className={cn("mt-1 line-clamp-2 text-sm text-muted-foreground", locked && "opacity-70")}>
                      {s.objective}
                    </div>
                  ) : null}
                </div>
                {clickable ? (
                  <div className="shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={locked}
                      onClick={() => {
                        onStageClick?.(s.id);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}


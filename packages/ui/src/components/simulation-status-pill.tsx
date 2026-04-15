import * as React from "react";

import { Badge } from "./ui/badge";

export type SimulationStatus = "not_started" | "active" | "completed";

export type SimulationStatusPillProps = {
  status: SimulationStatus;
  className?: string;
};

export function SimulationStatusPill({ status, className }: SimulationStatusPillProps) {
  const label = status === "active" ? "Active" : status === "completed" ? "Completed" : "Not started";
  const variant = status === "completed" ? "success" : status === "active" ? "secondary" : "outline";
  return (
    <Badge className={className} variant={variant}>
      {label}
    </Badge>
  );
}


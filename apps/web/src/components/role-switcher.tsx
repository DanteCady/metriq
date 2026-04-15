"use client";

import * as React from "react";

import { SegmentedControl } from "@metriq/ui";
import type { Role } from "@metriq/types";

import { useRoleStore } from "../state/role-store";

const options: { value: Role; label: string }[] = [
  { value: "candidate", label: "Candidate" },
  { value: "employer", label: "Employer" },
  { value: "admin", label: "Admin" },
];

export function RoleSwitcher() {
  const role = useRoleStore((s) => s.role);
  const setRole = useRoleStore((s) => s.setRole);

  return (
    <SegmentedControl
      size="sm"
      value={role}
      options={options}
      onValueChange={(v) => setRole(v)}
    />
  );
}


import * as React from "react";

import { cn } from "../lib/cn";

export type SortOption<T extends string> = {
  value: T;
  label: string;
};

export type SortMenuProps<T extends string> = {
  label?: string;
  value: T;
  options: SortOption<T>[];
  onValueChange: (value: T) => void;
  className?: string;
};

export function SortMenu<T extends string>({ label = "Sort", value, options, onValueChange, className }: SortMenuProps<T>) {
  return (
    <label className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
        className={cn(
          "h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring dark:border-border dark:bg-card dark:text-foreground",
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}


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
    <label className={cn("flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300", className)}>
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
        className={cn(
          "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-slate-400/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
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


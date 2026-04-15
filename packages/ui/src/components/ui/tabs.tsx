import * as React from "react";

import { cn } from "../../lib/cn";

export type TabsOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type TabsProps<T extends string> = {
  value: T;
  options: TabsOption<T>[];
  onValueChange: (value: T) => void;
  className?: string;
};

export function Tabs<T extends string>({ value, options, onValueChange, className }: TabsProps<T>) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950", className)}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
              opt.disabled && "pointer-events-none opacity-50",
              isActive
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
            )}
            aria-pressed={isActive}
            onClick={() => onValueChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}


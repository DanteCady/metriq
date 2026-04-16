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
    <div className={cn("inline-flex items-center gap-1 rounded-lg border border-border bg-muted/60 p-1 dark:bg-muted/40", className)}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              opt.disabled && "pointer-events-none opacity-50",
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
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


import * as React from "react";

import { cn } from "../lib/cn";

export type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchInput({ className, value, onValueChange, placeholder = "Search…", ...props }: SearchInputProps) {
  return (
    <input
      {...props}
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:border-border dark:bg-card dark:text-foreground",
        className,
      )}
    />
  );
}


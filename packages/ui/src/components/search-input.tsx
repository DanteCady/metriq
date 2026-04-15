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
        "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
        "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500",
        className,
      )}
    />
  );
}


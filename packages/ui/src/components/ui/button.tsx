import * as React from "react";

import { cn } from "../../lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
        variant === "default" &&
          "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
        variant === "secondary" &&
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700",
        variant === "ghost" &&
          "bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800",
        variant === "destructive" &&
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
        size === "sm" && "h-8 px-3",
        size === "md" && "h-9 px-4",
        size === "lg" && "h-10 px-6",
        className,
      )}
      {...props}
    />
  );
}


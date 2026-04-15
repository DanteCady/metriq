import * as React from "react";

import { cn } from "../lib/cn";

export type SurfaceProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className"> & {
    className?: string;
  };

export function Surface<T extends React.ElementType = "div">({ as, className, ...props }: SurfaceProps<T>) {
  const Comp = as ?? "div";
  return (
    <Comp
      className={cn("rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950", className)}
      {...props}
    />
  );
}


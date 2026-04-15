import * as React from "react";

import { cn } from "../lib/cn";
import { Button } from "./ui/button";

export type DrawerProps = {
  open: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  side?: "right" | "left";
  footer?: React.ReactNode;
  className?: string;
};

export function Drawer({ open, title, description, children, onClose, side = "right", footer, className }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("absolute inset-y-0 w-[420px] max-w-[calc(100vw-3rem)]", side === "right" ? "right-0" : "left-0")}>
        <div className={cn("flex h-full flex-col border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950", className)}>
          {(title || description) ? (
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {title ? <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</div> : null}
                  {description ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</div> : null}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
          {children ? <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div> : null}
          {footer ? <div className="border-t border-slate-200 p-4 dark:border-slate-800">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}


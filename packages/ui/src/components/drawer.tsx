"use client";

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
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm dark:bg-foreground/35" onClick={onClose} />
      <div className={cn("absolute inset-y-0 w-[420px] max-w-[calc(100vw-3rem)]", side === "right" ? "right-0" : "left-0")}>
        <div
          className={cn(
            "flex h-full flex-col border border-border bg-popover text-popover-foreground shadow-xl shadow-black/10 dark:shadow-black/50",
            className,
          )}
        >
          {(title || description) ? (
            <div className="border-b border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {title ? <div className="text-base font-semibold tracking-tight text-foreground">{title}</div> : null}
                  {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
          {children ? <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div> : null}
          {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}


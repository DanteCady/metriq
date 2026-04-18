"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../lib/cn";
import { Button } from "./ui/button";

export type ModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({ open, title, description, children, onClose, footer, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220]" data-metriq-modal-overlay>
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm dark:bg-foreground/35" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-lg rounded-lg border border-border bg-popover text-popover-foreground shadow-lg shadow-black/5 dark:shadow-black/40",
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
          {children ? <div className="p-4">{children}</div> : null}
          {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}


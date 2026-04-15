import * as React from "react";

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
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn("w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950", className)}
        >
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
          {children ? <div className="p-4">{children}</div> : null}
          {footer ? <div className="border-t border-slate-200 p-4 dark:border-slate-800">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}


"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../lib/cn";

export type SidebarCollapsedTooltipProps = {
  label: string;
  children: React.ReactNode;
  /** Gap between trigger right edge and tooltip (px). */
  offset?: number;
};

/**
 * Fixed-position tooltip portaled to `document.body` so labels stay visible when the
 * sidebar rail uses `overflow-y-auto` (absolute tips would clip).
 */
export function SidebarCollapsedTooltip({ label, children, offset = 8 }: SidebarCollapsedTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShowTimer = React.useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  }, []);

  const updatePosition = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + offset });
  }, [offset]);

  const openSoon = React.useCallback(() => {
    clearShowTimer();
    showTimer.current = setTimeout(() => {
      updatePosition();
      setOpen(true);
    }, 120);
  }, [clearShowTimer, updatePosition]);

  const close = React.useCallback(() => {
    clearShowTimer();
    setOpen(false);
  }, [clearShowTimer]);

  React.useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePosition();
    const onReposition = () => updatePosition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onReposition);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, updatePosition, close]);

  const onBlurCapture = React.useCallback(
    (e: React.FocusEvent<HTMLSpanElement>) => {
      const next = e.relatedTarget;
      if (next && wrapRef.current?.contains(next as Node)) return;
      close();
    },
    [close],
  );

  return (
    <>
      <span
        ref={wrapRef}
        className="block w-full"
        onMouseEnter={openSoon}
        onMouseLeave={close}
        onFocusCapture={openSoon}
        onBlurCapture={onBlurCapture}
      >
        {children}
      </span>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                transform: "translateY(-50%)",
              }}
              className={cn(
                "pointer-events-none z-[200] max-w-[min(280px,calc(100vw-1rem))] rounded-md border border-border",
                "bg-popover px-2.5 py-1.5 text-left text-xs font-medium leading-snug text-popover-foreground shadow-md",
              )}
            >
              {label}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

"use client";

import * as React from "react";

export type ToastTone = "default" | "success" | "error";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  createdAt: number;
};

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  push: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function toneClasses(tone: ToastTone) {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-50";
  if (tone === "error") return "border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50";
  return "border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50";
}

function randomId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export type ToastProviderProps = {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDurationMs?: number;
};

export function ToastProvider({ children, maxToasts = 3, defaultDurationMs = 3500 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timersRef = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timersRef.current.get(id);
    if (handle) window.clearTimeout(handle);
    timersRef.current.delete(id);
  }, []);

  const clear = React.useCallback(() => {
    setToasts([]);
    for (const handle of timersRef.current.values()) window.clearTimeout(handle);
    timersRef.current.clear();
  }, []);

  const push = React.useCallback(
    (opts: ToastOptions) => {
      const id = randomId();
      const tone = opts.tone ?? "default";
      const createdAt = Date.now();
      const durationMs = opts.durationMs ?? defaultDurationMs;
      const item: ToastItem = { id, title: opts.title, description: opts.description, tone, createdAt };

      setToasts((prev) => [item, ...prev].slice(0, maxToasts));

      const handle = window.setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, handle);
      return id;
    },
    [defaultDurationMs, dismiss, maxToasts],
  );

  React.useEffect(() => () => clear(), [clear]);

  const value = React.useMemo<ToastContextValue>(() => ({ toasts, push, dismiss, clear }), [toasts, push, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  className?: string;
};

export function ToastViewport({ toasts, onDismiss, className }: ToastViewportProps) {
  if (!toasts.length) return null;

  return (
    <div className={["fixed bottom-4 right-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2", className].filter(Boolean).join(" ")}>
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-lg border p-3 shadow-sm backdrop-blur ${toneClasses(t.tone)}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{t.title}</div>
              {t.description ? <div className="mt-0.5 text-sm opacity-80">{t.description}</div> : null}
            </div>
            <button
              type="button"
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium opacity-70 hover:opacity-100"
              onClick={() => onDismiss(t.id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


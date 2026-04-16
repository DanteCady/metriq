import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type ArtifactKind = "text" | "link" | "fileRef" | "json";

export type ArtifactViewerProps = {
  kind: ArtifactKind;
  label?: string;
  value: string;
  /**
   * Optional href override for link artifacts (e.g. signed URL).
   */
  href?: string;
  actions?: React.ReactNode;
  className?: string;
};

function tryFormatJson(value: string) {
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return null;
  }
}

export function ArtifactViewer({ kind, label, value, href, actions, className }: ArtifactViewerProps) {
  const canOpen = kind === "link" && (href ?? value);
  const openUrl = href ?? value;
  const json = kind === "json" ? tryFormatJson(value) : null;

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{label ?? "Artifact"}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Badge variant="outline">{kind}</Badge>
            {kind === "link" ? <span className="truncate">{openUrl}</span> : null}
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            {actions}
            {canOpen ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.open(openUrl, "_blank", "noopener,noreferrer");
                }}
              >
                Open
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-4">
        {kind === "text" ? (
          <pre className="max-h-[420px] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
            <code>{value}</code>
          </pre>
        ) : kind === "json" ? (
          <pre className="max-h-[420px] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
            <code>{json ?? value}</code>
          </pre>
        ) : (
          <div className="break-all rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}


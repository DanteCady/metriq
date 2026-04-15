import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type SubmissionArtifactType = "text" | "link" | "fileRef";

export type SubmissionArtifactViewerProps = {
  type: SubmissionArtifactType;
  label?: string;
  value: string;
  className?: string;
};

export function SubmissionArtifactViewer({ type, label, value, className }: SubmissionArtifactViewerProps) {
  const header = (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{label ?? "Artifact"}</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          <Badge variant="outline">{type}</Badge>
        </div>
      </div>
      {type === "link" ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            window.open(value, "_blank", "noopener,noreferrer");
          }}
        >
          Open
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950", className)}>
      {header}
      <div className="mt-3">
        {type === "text" ? (
          <pre className="max-h-[360px] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
            <code>{value}</code>
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


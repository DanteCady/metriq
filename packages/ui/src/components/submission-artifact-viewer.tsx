import * as React from "react";

import { cn } from "../lib/cn";
import { ArtifactViewer, type ArtifactKind } from "./artifact-viewer";

export type SubmissionArtifactType = "text" | "link" | "fileRef";

export type SubmissionArtifactViewerProps = {
  type: SubmissionArtifactType;
  label?: string;
  value: string;
  className?: string;
};

export function SubmissionArtifactViewer({ type, label, value, className }: SubmissionArtifactViewerProps) {
  return <ArtifactViewer kind={type as ArtifactKind} label={label} value={value} className={cn(className)} />;
}


"use client";

import * as React from "react";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, EmptyState, PageHeader, useToast } from "@metriq/ui";

import { AuditionCreationWizard } from "../../../../../../components/employer/audition-creation-wizard";
import { deptPath } from "../../../../../../lib/dept-path";
import { trpc } from "../../../../../../app/providers";
import {
  collectDraftValidationIssues,
  getDraft,
  normalizeAuditionDraft,
  upsertDraft,
  validateAuditionDraft,
  type AssessmentStage,
  type AuditionDraft,
} from "../../../../../../lib/audition-draft";

function rowToDraft(
  row: {
    id: string;
    title: string;
    level: string | null;
    template: string | null;
    timebox_minutes: number | null;
    definition: unknown;
    updated_at: Date | string;
  },
  workspaceSlug: string,
): AuditionDraft {
  const def = row.definition as { stages?: AssessmentStage[] };
  const updated = row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at);
  return normalizeAuditionDraft({
    id: row.id,
    workspaceSlug,
    title: row.title,
    level: (row.level as AuditionDraft["level"]) ?? "Mid",
    template: (row.template as AuditionDraft["template"]) ?? "WorkSample_Brief",
    timeboxMinutes: row.timebox_minutes ?? 60,
    stages: def?.stages ?? [],
    updatedAt: updated.toISOString(),
    status: "draft",
  });
}

function DeptEditAuditionDraftContent() {
  const params = useParams<{ workspaceSlug: string; auditionId: string }>();
  const router = useRouter();
  const slug = params?.workspaceSlug ?? "";
  const auditionId = params?.auditionId ?? "";
  const { push: toast } = useToast();
  const upsertRemote = trpc.audition.upsertDraft.useMutation();

  const { data: serverRow, isLoading: serverLoading } = trpc.audition.byId.useQuery(
    { id: auditionId },
    { enabled: Boolean(slug && auditionId) },
  );

  const [draft, setDraft] = React.useState<AuditionDraft | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!slug || !auditionId) {
      setLoaded(true);
      setDraft(null);
      return;
    }
    if (serverLoading) return;
    if (serverRow) {
      setDraft(rowToDraft(serverRow, slug));
      setLoaded(true);
      return;
    }
    const raw = getDraft(slug, auditionId);
    setDraft(raw ? normalizeAuditionDraft(raw) : null);
    setLoaded(true);
  }, [slug, auditionId, serverRow, serverLoading]);

  const save = () => {
    if (!draft) return;
    const v = validateAuditionDraft(draft);
    if (!v.ok) {
      const detail = collectDraftValidationIssues(draft)
        .slice(0, 4)
        .map((i) => i.message)
        .join(" ");
      toast({ title: "Fix before saving", description: detail || v.errors.join(" "), tone: "error" });
      return;
    }
    void (async () => {
      try {
        await upsertRemote.mutateAsync({
          id: draft.id,
          title: draft.title.trim() || "Untitled",
          level: draft.level,
          template: draft.template,
          timeboxMinutes: draft.timeboxMinutes,
          stages: draft.stages,
        });
        toast({ title: "Saved", description: "Draft updated in the database.", tone: "success" });
      } catch {
        upsertDraft({ ...draft, workspaceSlug: slug });
        toast({ title: "Saved locally only", description: "API unavailable — stored in this browser.", tone: "default" });
      }
      upsertDraft({ ...draft, workspaceSlug: slug });
    })();
  };

  if (!loaded) {
    return <PageHeader title="Loading…" description="Opening draft." />;
  }

  if (!slug || !auditionId || !draft) {
    return (
      <EmptyState
        title="Draft not found"
        description="This draft is not in local storage on this browser. Create a new audition or pick a draft from the list."
        actionLabel="Auditions"
        onAction={() => router.push(deptPath(slug || "engineering", "/auditions"))}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Edit audition draft"
        description="Basics, flow, and review. Drafts sync to the workspace database when the API is available."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" type="button" onClick={() => router.push(deptPath(slug, "/auditions"))}>
              Back to list
            </Button>
            <Button variant="secondary" type="button" onClick={() => router.push(deptPath(slug, `/auditions/${auditionId}/invites`))}>
              Invites
            </Button>
            <Button type="button" onClick={save}>
              Save draft
            </Button>
          </div>
        }
      />

      <AuditionCreationWizard draft={draft} onDraftChange={setDraft} initialStep="flow" />
    </>
  );
}

export default function DeptEditAuditionDraftPage() {
  return (
    <Suspense fallback={<PageHeader title="Edit audition draft" description="Loading editor…" />}>
      <DeptEditAuditionDraftContent />
    </Suspense>
  );
}

"use client";

import * as React from "react";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, EmptyState, PageHeader, useToast } from "@metriq/ui";

import { AuditionCreationWizard } from "../../../../../../components/employer/audition-creation-wizard";
import { deptPath } from "../../../../../../lib/dept-path";
import {
  collectDraftValidationIssues,
  getDraft,
  normalizeAuditionDraft,
  upsertDraft,
  validateAuditionDraft,
  type AuditionDraft,
} from "../../../../../../lib/audition-draft";

function DeptEditAuditionDraftContent() {
  const params = useParams<{ workspaceSlug: string; auditionId: string }>();
  const router = useRouter();
  const slug = params?.workspaceSlug ?? "";
  const auditionId = params?.auditionId ?? "";
  const { push: toast } = useToast();

  const [draft, setDraft] = React.useState<AuditionDraft | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!slug || !auditionId) {
      setLoaded(true);
      setDraft(null);
      return;
    }
    const raw = getDraft(slug, auditionId);
    setDraft(raw ? normalizeAuditionDraft(raw) : null);
    setLoaded(true);
  }, [slug, auditionId]);

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
    upsertDraft({ ...draft, workspaceSlug: slug });
    toast({ title: "Saved", description: "Draft updated locally.", tone: "success" });
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
        description="Basics, flow, and review. Changes stay in this browser until backend persistence exists."
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

"use client";

import * as React from "react";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, PageHeader, useToast } from "@metriq/ui";

import { AuditionCreationWizard } from "../../../../../components/employer/audition-creation-wizard";
import { deptPath } from "../../../../../lib/dept-path";
import { collectDraftValidationIssues, createEmptyDraft, upsertDraft, validateAuditionDraft } from "../../../../../lib/audition-draft";

function DeptNewAuditionContent() {
  const params = useParams<{ workspaceSlug: string }>();
  const router = useRouter();
  const slug = params?.workspaceSlug ?? "";
  const { push: toast } = useToast();

  const [draft, setDraft] = React.useState(() => createEmptyDraft(""));

  React.useEffect(() => {
    if (!slug) return;
    setDraft((d) => ({ ...d, workspaceSlug: slug }));
  }, [slug]);

  const saveDraft = () => {
    if (!slug) {
      toast({ title: "Missing workspace", description: "Open this page from a department workspace.", tone: "error" });
      return;
    }
    const toSave = { ...draft, workspaceSlug: slug };
    const v = validateAuditionDraft(toSave);
    if (!v.ok) {
      const detail = collectDraftValidationIssues(toSave)
        .slice(0, 4)
        .map((i) => i.message)
        .join(" ");
      toast({
        title: "Fix before saving",
        description: detail || v.errors.join(" "),
        tone: "error",
      });
      return;
    }
    upsertDraft(toSave);
    setDraft(toSave);
    toast({ title: "Draft saved", description: "You can keep editing from the auditions list.", tone: "success" });
    router.push(deptPath(slug, `/auditions/${toSave.id}/edit`));
  };

  return (
    <>
      <PageHeader
        title="New audition"
        description="Basics, then an ordered flow of in-session activities (questionnaire, written work, code, lab, ordering). No external-only links or file uploads in v1."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="button" onClick={saveDraft}>
              Create draft
            </Button>
          </div>
        }
      />

      <AuditionCreationWizard draft={draft} onDraftChange={setDraft} />
    </>
  );
}

export default function DeptNewAuditionPage() {
  return (
    <Suspense
      fallback={<PageHeader title="New audition" description="Loading editor…" />}
    >
      <DeptNewAuditionContent />
    </Suspense>
  );
}

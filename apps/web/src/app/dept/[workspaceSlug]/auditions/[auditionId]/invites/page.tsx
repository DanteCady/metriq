"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button, EmptyState, Input, PageHeader, Panel, Textarea, useToast } from "@metriq/ui";

import { deptPath } from "../../../../../../lib/dept-path";
import { getDraft } from "../../../../../../lib/audition-draft";
import { mockEmployerAuditions } from "../../../../../../mocks/employer/auditions";

function resolveAudition(slug: string, auditionId: string) {
  const draft = getDraft(slug, auditionId);
  if (draft) {
    return {
      title: draft.title.trim() || "Untitled draft",
      status: "draft" as const,
      isLocalDraft: true,
    };
  }
  const mock = mockEmployerAuditions.find((a) => a.id === auditionId);
  if (mock) {
    return {
      title: mock.title,
      status: mock.status,
      isLocalDraft: false,
    };
  }
  return null;
}

const SAMPLE_SENT_INVITES = [
  { to: "jamie.chen@example.com", sentAt: "2026-04-12", status: "Delivered" },
  { to: "devon.singh@email.example", sentAt: "2026-04-11", status: "Opened" },
];

export default function DeptAuditionInvitesPage() {
  const params = useParams<{ workspaceSlug: string; auditionId: string }>();
  const router = useRouter();
  const { push: toast } = useToast();
  const slug = params?.workspaceSlug ?? "";
  const auditionId = params?.auditionId ?? "";

  const [origin, setOrigin] = React.useState("");
  const [emailList, setEmailList] = React.useState("");

  React.useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  const meta = slug && auditionId ? resolveAudition(slug, auditionId) : null;

  const inviteUrl = React.useMemo(() => {
    if (!origin || !slug || !auditionId) return "";
    const path = `/candidate/auditions?invite=${encodeURIComponent(auditionId)}&workspace=${encodeURIComponent(slug)}`;
    return `${origin}${path}`;
  }, [origin, slug, auditionId]);

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: label, tone: "success" });
    } catch {
      toast({ title: "Could not copy", description: "Select the text manually or try HTTPS.", tone: "error" });
    }
  };

  const emailTemplate = React.useMemo(() => {
    if (!meta) return "";
    const subject = `Invitation: ${meta.title} (Metriq audition)`;
    const body = [
      `Hi,`,
      ``,
      `You've been invited to complete an audition: ${meta.title}.`,
      ``,
      `Open this link to get started (you'll sign in or create a Metriq candidate account when delivery is wired up):`,
      inviteUrl,
      ``,
      `— ${slug ? `${slug} workspace` : "Hiring team"}`,
    ].join("\n");
    return `Subject: ${subject}\n\n${body}`;
  }, [meta, inviteUrl, slug]);

  const showSampleHistory = meta && !meta.isLocalDraft && meta.status === "published";

  if (!slug || !auditionId) {
    return (
      <EmptyState
        title="Missing audition"
        description="Open invites from an audition in your workspace."
        actionLabel="Auditions"
        onAction={() => router.push(deptPath("engineering", "/auditions"))}
      />
    );
  }

  if (!meta) {
    return (
      <EmptyState
        title="Audition not found"
        description="No saved draft or mock audition matches this ID."
        actionLabel="Back to auditions"
        onAction={() => router.push(deptPath(slug, "/auditions"))}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Invite candidates"
        description={`${meta.title} · ${meta.status}${meta.isLocalDraft ? " · local draft" : ""}`}
        eyebrow={<Link href={deptPath(slug, "/auditions")} className="text-muted-foreground underline">Auditions</Link>}
        actions={
          <div className="flex flex-wrap gap-2">
            {meta.isLocalDraft ? (
              <Button type="button" variant="secondary" onClick={() => router.push(deptPath(slug, `/auditions/${auditionId}/edit`))}>
                Edit draft
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={() => router.push(deptPath(slug, "/auditions"))}>
              Back to list
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-6">
        <Panel
          title="Candidate invite link"
          description="Share this URL. Candidates land in Metriq, authenticate, and open the assigned audition once invite redemption is connected to the API."
        >
          <div className="grid gap-3 sm:flex sm:items-end">
            <label className="grid min-w-0 flex-1 gap-1 text-sm">
              <span className="font-medium text-foreground">Link</span>
              <Input readOnly value={inviteUrl || "…"} className="font-mono text-xs sm:text-sm" />
            </label>
            <Button type="button" onClick={() => void copyText("Invite link", inviteUrl)} disabled={!inviteUrl}>
              Copy link
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Query params <code className="rounded bg-muted px-1">invite</code> and{" "}
            <code className="rounded bg-muted px-1">workspace</code> are the contract for deep-linking; the candidate app
            does not consume them yet in this preview build.
          </p>
        </Panel>

        <Panel
          title="Email invites"
          description="Paste addresses to prepare a batch. Outbound email and per-recipient tokens are not wired in this preview — copy the template and send from your mail client, or export later when delivery ships."
        >
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Email addresses</span>
            <span className="text-xs text-muted-foreground">Comma or newline separated.</span>
            <Textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              rows={4}
              placeholder="alex@company.com, sam@other.org"
              className="font-mono text-sm"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => void copyText("Email template", emailTemplate)} disabled={!emailTemplate}>
              Copy email template
            </Button>
            <Button
              type="button"
              onClick={() =>
                toast({
                  title: "Sending not available yet",
                  description: "Connect an email provider and invite tokens in the API to send from Metriq.",
                  tone: "default",
                })
              }
            >
              Send from Metriq (soon)
            </Button>
          </div>
        </Panel>

        {showSampleHistory ? (
          <Panel title="Recent invites" description="Illustrative rows for published mock auditions. Real tracking arrives with persistence.">
            <ul className="divide-y divide-border">
              {SAMPLE_SENT_INVITES.map((row) => (
                <li key={row.to} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span className="font-medium text-foreground">{row.to}</span>
                  <span className="text-xs text-muted-foreground">
                    {row.sentAt} · {row.status}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        ) : (
          <Panel
            title="Invite history"
            description="After you publish and connect delivery, sent invites, opens, and completions will appear here."
          >
            <p className="text-sm text-muted-foreground">
              {meta.isLocalDraft
                ? "Local drafts are not shareable as real invites until publish + backend exist. You can still copy the preview link to align with your hiring ops."
                : "No invite history in this preview for this audition."}
            </p>
          </Panel>
        )}
      </div>
    </>
  );
}

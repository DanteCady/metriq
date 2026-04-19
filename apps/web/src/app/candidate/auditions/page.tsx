"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuditionCard, EmptyState, PageHeader, Tabs } from "@metriq/ui";

import { trpc } from "../../../app/providers";
import { useNotify } from "../../../lib/use-notify";
import { mockAuditions } from "../../../mocks/candidate/auditions";

type AuditionStatus = "invited" | "active" | "completed";

type Row = {
  auditionId: string;
  roleTitle: string;
  companyName: string;
  estimatedMinutes: number;
  status: AuditionStatus;
  submissionId: string;
};

function CandidateAuditionInboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useNotify();
  const [tab, setTab] = React.useState<AuditionStatus>("active");

  const { data: apps = [], refetch } = trpc.candidate.myApplications.useQuery();
  const redeem = trpc.candidate.redeemInvite.useMutation();

  const inviteHandled = React.useRef(false);
  React.useEffect(() => {
    const token = searchParams.get("invite");
    if (!token || inviteHandled.current) return;
    inviteHandled.current = true;
    void redeem
      .mutateAsync({ token })
      .then(() => {
        notify.success({
          title: "Invite linked",
          description: "This audition is now on your list.",
          surface: "toast",
        });
        void refetch();
        router.replace("/candidate/auditions");
      })
      .catch((err) => {
        notify.fromTrpcError(err, { title: "Could not redeem invite" });
      });
  }, [searchParams, redeem, notify, router, refetch]);

  const rows = React.useMemo((): Row[] => {
    const fromDb: Row[] = apps.map((a) => ({
      auditionId: a.audition_id,
      roleTitle: a.audition_title,
      companyName: "Workspace application",
      estimatedMinutes: a.timebox_minutes ?? 60,
      status:
        a.audition_status === "published" && a.application_status === "active"
          ? "active"
          : a.application_status === "invited"
            ? "invited"
            : "active",
      submissionId: "",
    }));
    const fromMock: Row[] = mockAuditions.map((a) => ({
      auditionId: a.auditionId,
      roleTitle: a.roleTitle,
      companyName: a.companyName,
      estimatedMinutes: a.estimatedMinutes,
      status: a.status,
      submissionId: a.submissionId,
    }));
    const byId = new Map<string, Row>();
    for (const r of fromMock) byId.set(r.auditionId, r);
    for (const r of fromDb) byId.set(r.auditionId, r);
    return [...byId.values()];
  }, [apps]);

  const invited = rows.filter((r) => r.status === "invited");
  const active = rows.filter((r) => r.status === "active");
  const completed = rows.filter((r) => r.status === "completed");

  const error = null;

  return (
    <>
      <PageHeader
        title="Audition inbox"
        description="Pick up where you left off. Every audition is structured work that produces evaluable evidence."
        actions={
          <div className="text-xs font-medium text-muted-foreground">
            Audition-first candidate flow
          </div>
        }
      />

      <div className="mt-6 grid gap-4">
        {error ? <EmptyState title="Couldn’t load auditions" description={error} actionLabel="Retry" onAction={() => (window.location.href = "/candidate/auditions")} /> : null}

        {!error ? (
          <>
            <Tabs
              value={tab}
              onValueChange={setTab}
              options={[
                { value: "active", label: `Active (${active.length})` },
                { value: "invited", label: `Invited (${invited.length})` },
                { value: "completed", label: `Completed (${completed.length})` },
              ]}
            />
            {(() => {
              const list = tab === "invited" ? invited : tab === "completed" ? completed : active;
              if (list.length === 0) {
                return (
                  <EmptyState
                    title={tab === "active" ? "No active auditions" : tab === "invited" ? "No invitations yet" : "No completed auditions yet"}
                    description="Your auditions will appear here."
                  />
                );
              }
              return (
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((a) => (
                    <AuditionCard
                      key={a.auditionId}
                      roleTitle={a.roleTitle}
                      companyName={a.companyName}
                      estimatedMinutes={a.estimatedMinutes}
                      status={a.status}
                      primaryActionLabel={a.status === "completed" ? "View results" : a.status === "active" ? "Continue" : "Start"}
                      onPrimaryAction={() => {
                        if (a.status === "completed") {
                          router.push(`/candidate/auditions/${a.auditionId}/results?submissionId=${encodeURIComponent(a.submissionId)}`);
                          return;
                        }
                        router.push(`/candidate/auditions/${a.auditionId}?submissionId=${encodeURIComponent(a.submissionId)}`);
                      }}
                      secondaryActionLabel="Overview"
                      onSecondaryAction={() => router.push(`/candidate/auditions/${a.auditionId}?submissionId=${encodeURIComponent(a.submissionId)}`)}
                    />
                  ))}
                </div>
              );
            })()}
          </>
        ) : null}
      </div>
    </>
  );
}

export default function CandidateAuditionInboxPage() {
  return (
    <Suspense fallback={<PageHeader title="Audition inbox" description="Loading your inbox…" />}>
      <CandidateAuditionInboxContent />
    </Suspense>
  );
}


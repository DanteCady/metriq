"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AuditionCard, EmptyState, PageHeader, Tabs } from "@metriq/ui";

import { mockAuditions } from "../../../mocks/candidate/auditions";

type AuditionStatus = "invited" | "active" | "completed";

export default function CandidateAuditionInboxPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<AuditionStatus>("active");

  const rows = React.useMemo(() => {
    return mockAuditions.map((a) => ({
      auditionId: a.auditionId,
      roleTitle: a.roleTitle,
      companyName: a.companyName,
      estimatedMinutes: a.estimatedMinutes,
      status: a.status,
      submissionId: a.submissionId,
    }));
  }, []);

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
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
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


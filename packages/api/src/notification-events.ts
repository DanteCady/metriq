import type { Kysely } from "kysely";

import {
  auditionQueries,
  employerQueries,
  notificationQueries,
  workspaceQueries,
} from "@metriq/db";
import type { Database, DbScope } from "@metriq/db";

function logEmitFailure(event: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      scope: "metriq.notification_emit",
      event,
      error: err instanceof Error ? err.message : String(err),
      ts: new Date().toISOString(),
    }),
  );
}

/** Notify candidate + all employers in the workspace’s company when an invite is redeemed. */
export async function emitInviteRedeemed(
  db: Kysely<Database>,
  opts: {
    candidateId: string;
    candidateName: string;
    workspaceId: string;
    auditionId: string;
  },
  scope?: DbScope,
): Promise<void> {
  try {
    const audition = await auditionQueries.getAuditionById(db, opts.auditionId, undefined);
    const title = audition?.title ?? "Audition";

    await notificationQueries.insertNotification(
      db,
      {
        candidate_id: opts.candidateId,
        employer_id: null,
        workspace_id: null,
        category: "candidate.invite_redeemed",
        title: "You're enrolled",
        body: `You're enrolled in ${title}. Open your auditions to continue.`,
        link_href: "/candidate/auditions",
        read_at: null,
        metadata: { auditionId: opts.auditionId, workspaceId: opts.workspaceId },
      },
      scope,
    );

    const ws = await workspaceQueries.getWorkspaceById(db, opts.workspaceId, scope);
    if (!ws) return;

    const employers = await employerQueries.listEmployersByCompany(db, ws.company_id, scope);
    const body = `${opts.candidateName} joined via invite for ${title}.`;
    for (const emp of employers) {
      await notificationQueries.insertNotification(
        db,
        {
          candidate_id: null,
          employer_id: emp.id,
          workspace_id: opts.workspaceId,
          category: "employer.candidate_joined_invite",
          title: "New applicant via invite",
          body,
          link_href: null,
          read_at: null,
          metadata: { auditionId: opts.auditionId, candidateId: opts.candidateId },
        },
        scope,
      );
    }
  } catch (e) {
    logEmitFailure("emitInviteRedeemed", e);
  }
}

const DECISION_COPY: Record<"advance" | "hold" | "reject", { title: string; body: string }> = {
  advance: {
    title: "You're moving forward",
    body: "The hiring team advanced your submission to the next step.",
  },
  hold: {
    title: "Update on your submission",
    body: "The team requested changes or more detail before the next step.",
  },
  reject: {
    title: "Update on your application",
    body: "The team recorded a decision on your submission.",
  },
};

/** Notify the candidate when an employer records a pipeline decision (preview: audit trail still local). */
export async function emitSubmissionDecision(
  db: Kysely<Database>,
  opts: { candidateId: string; submissionId: string; decision: "advance" | "hold" | "reject" },
  scope?: DbScope,
): Promise<void> {
  try {
    const copy = DECISION_COPY[opts.decision];
    await notificationQueries.insertNotification(
      db,
      {
        candidate_id: opts.candidateId,
        employer_id: null,
        workspace_id: null,
        category: `candidate.submission_${opts.decision}`,
        title: copy.title,
        body: copy.body,
        link_href: "/candidate/submissions",
        read_at: null,
        metadata: { submissionId: opts.submissionId, decision: opts.decision },
      },
      scope,
    );
  } catch (e) {
    logEmitFailure("emitSubmissionDecision", e);
  }
}

/** Notify all employers in the company when an audition is published. */
export async function emitAuditionPublished(
  db: Kysely<Database>,
  opts: { workspaceId: string; auditionId: string; auditionTitle: string },
  scope?: DbScope,
): Promise<void> {
  try {
    const ws = await workspaceQueries.getWorkspaceById(db, opts.workspaceId, scope);
    if (!ws) return;
    const employers = await employerQueries.listEmployersByCompany(db, ws.company_id, scope);
    for (const emp of employers) {
      await notificationQueries.insertNotification(
        db,
        {
          candidate_id: null,
          employer_id: emp.id,
          workspace_id: opts.workspaceId,
          category: "audition.published",
          title: "Audition published",
          body: `${opts.auditionTitle} is live for candidates.`,
          link_href: null,
          read_at: null,
          metadata: { auditionId: opts.auditionId },
        },
        scope,
      );
    }
  } catch (e) {
    logEmitFailure("emitAuditionPublished", e);
  }
}

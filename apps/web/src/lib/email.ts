/**
 * Transactional email (invites, decisions) — integrate Resend / SES / Postmark.
 * Stub until Phase 8 + queue worker land.
 */
export async function sendTransactionalEmail(_input: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: boolean }> {
  return { ok: false };
}

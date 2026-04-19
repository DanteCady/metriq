export type IntegrationRow = {
  id: string;
  name: string;
  category: "ATS" | "Calendar" | "Identity" | "Webhooks";
  status: "connected" | "available" | "beta";
  detail: string;
};

export const mockEmployerIntegrations: IntegrationRow[] = [
  {
    id: "int_greenhouse",
    name: "Greenhouse",
    category: "ATS",
    status: "connected",
    detail: "Sandbox · requisitions sync nightly",
  },
  {
    id: "int_lever",
    name: "Lever",
    category: "ATS",
    status: "available",
    detail: "Import candidates and push decisions on close",
  },
  {
    id: "int_google_cal",
    name: "Google Calendar",
    category: "Calendar",
    status: "beta",
    detail: "Reviewer load · interview holds (preview)",
  },
  {
    id: "int_okta",
    name: "Okta SSO",
    category: "Identity",
    status: "available",
    detail: "SCIM provisioning planned next quarter",
  },
];

export const mockEmployerWebhooks = [
  { id: "wh_1", url: "https://hooks.demo.metriq.dev/metriq/decisions", events: "audition.decision.finalized", lastDelivery: "2026-04-15T08:02:00.000Z", ok: true },
  { id: "wh_2", url: "https://internal.demo.metriq.dev/hr/ingest", events: "submission.submitted", lastDelivery: "2026-04-14T19:44:00.000Z", ok: true },
];

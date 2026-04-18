import Link from "next/link";

import { Badge, Button, PageHeader, Panel, Surface } from "@metriq/ui";

import { mockOrganization } from "../../../mocks/tenancy";

const checklist = [
  "SAML / OIDC with Okta, Entra ID, or Google Workspace",
  "SCIM provisioning for users and group → workspace mapping",
  "Session length, MFA requirements, and device posture (later)",
];

export default function EmployerSecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        description={`${mockOrganization.name} — SSO, directory sync, and org-wide access policy. Department workspaces inherit these defaults.`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview</Badge>
          </div>
        }
        actions={
          <Link
            href="/employer/seats"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            View seat assignments
          </Link>
        }
      />

      <p className="mt-4 text-sm text-muted-foreground">
        Identity is configured once at the <strong className="font-medium text-foreground">organization</strong> level, then applies to every{" "}
        <strong className="font-medium text-foreground">workspace</strong> your teams use for hiring.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Single sign-on (SSO)" description="Require SSO for all org members (recommended before production).">
          <Surface className="border-dashed p-4">
            <p className="text-sm text-muted-foreground">Connect your IdP to centralize login and reduce password sprawl.</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary" aria-hidden>
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button type="button" className="mt-4" size="sm" disabled title="Disabled in preview.">
              Configure SSO
            </Button>
          </Surface>
        </Panel>

        <Panel title="Audit & sessions" description="Org-wide defaults for reviewers and hiring managers.">
          <Surface className="border-dashed p-4">
            <p className="text-sm text-muted-foreground">
              Export audit trails, set session timeouts, and define which roles can invite external candidates — preview only.
            </p>
            <Button type="button" className="mt-4" size="sm" variant="secondary" disabled title="Disabled in preview.">
              Open audit settings
            </Button>
          </Surface>
        </Panel>
      </div>
    </>
  );
}

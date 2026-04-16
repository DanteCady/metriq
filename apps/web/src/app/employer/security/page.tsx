import { Badge, PageHeader, Panel } from "@metriq/ui";

export default function EmployerSecurityPage() {
  return (
    <>
      <PageHeader title="Security" description="SSO, SCIM, audit policy, and session defaults — wired when org + SSO plugins land." />
      <div className="mt-6">
        <Panel title="Identity" description="Preview placeholder">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Connect Okta / Entra / Google Workspace for the organization, then inherit into department workspaces.
          </p>
          <Badge variant="secondary" className="mt-3">
            Preview
          </Badge>
        </Panel>
      </div>
    </>
  );
}

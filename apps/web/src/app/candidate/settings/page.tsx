import { Badge, Button, DefinitionList, PageHeader, Panel } from "@metriq/ui";

import { mockUniverse } from "../../../mocks/universe";

export default function CandidateSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, notifications, and privacy — preview build uses read-only sample data."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Account" description="Identity and contact details visible to hiring teams when you apply.">
          <DefinitionList
            columns={1}
            items={[
              { term: "Display name", description: mockUniverse.candidateNames[0] },
              { term: "Primary email", description: "riley.park@email.example" },
              { term: "Home organization", description: "Personal workspace" },
              { term: "Time zone", description: mockUniverse.timezone },
            ]}
          />
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" disabled title="Profile editing is disabled in this preview build.">
              Edit profile
            </Button>
          </div>
        </Panel>

        <Panel title="Notifications" description="Choose how Metriq reaches you about auditions and results.">
          <ul className="space-y-3 text-sm">
            {[
              { label: "Audition deadlines", on: true },
              { label: "Reviewer feedback published", on: true },
              { label: "Product updates", on: false },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800/80">
                <span className="text-slate-800 dark:text-slate-100">{row.label}</span>
                <Button type="button" size="sm" variant={row.on ? "default" : "secondary"} disabled title="Notification toggles are disabled in this preview build.">
                  {row.on ? "On" : "Off"}
                </Button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Privacy" description="Control what appears on your proof profile and exports.">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Proof highlights are curated by you. Employers only see cards you attach to shared auditions or explicit exports.
          </p>
          <div className="mt-4">
            <Button type="button" variant="secondary" size="sm" disabled title="Privacy controls are disabled in this preview build.">
              Manage visibility
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

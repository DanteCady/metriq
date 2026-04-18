import { Award, Download, FileText, Mail, MapPin, Phone, Share2, Sparkles, Star } from "lucide-react";

import { Badge, Button, DefinitionList, PageHeader, Panel, ScoreBadge, Surface } from "@metriq/ui";

import { mockCandidateAccountProfile } from "../../../mocks/candidate/account-profile";
import { mockUniverse } from "../../../mocks/universe";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${a}${b}`.toUpperCase();
}

export default function CandidateProfilePage() {
  const p = mockCandidateAccountProfile;
  const initials = initialsFromName(p.displayName);

  return (
    <>
      <PageHeader
        title="Profile"
        description="How you show up to hiring teams alongside auditions and proof — plus account basics. Preview data; editing is disabled."
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Preview data</Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled title="Disabled in preview.">
              Edit public profile
            </Button>
            <Button type="button" variant="secondary" disabled title="Disabled in preview.">
              <Share2 className="mr-2 size-4" aria-hidden />
              Share
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        <Surface className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/[0.07] via-card to-info/[0.05] p-6 md:p-8 dark:from-primary/[0.12] dark:to-info/[0.06]">
            <div
              className="pointer-events-none absolute inset-y-6 left-0 w-1 rounded-r-full bg-primary"
              aria-hidden
            />
            <div className="flex flex-col gap-6 pl-2 md:flex-row md:items-start md:gap-8 md:pl-4">
              <div
                className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold tracking-tight text-primary-foreground shadow-md ring-2 ring-primary/20 ring-offset-2 ring-offset-card md:size-32 md:text-3xl"
                aria-hidden
              >
                <span className="select-none">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{p.displayName}</h2>
                    <p className="mt-1 text-base text-muted-foreground md:text-lg">{p.headline}</p>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                        {p.location} · {mockUniverse.timezone.replace("_", " ")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                        {p.primaryEmail}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                        {p.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.openTo.map((label) => (
                    <Badge key={label} variant="outline" className="border-primary/25 bg-primary/[0.06] font-medium text-foreground dark:bg-primary/[0.1]">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
          <div className="grid gap-6">
            <Panel title="About" description="Short narrative — what you optimize for and how you like to work.">
              <p className="text-sm leading-relaxed text-muted-foreground">{p.about}</p>
            </Panel>

            <Panel title="Skills" description="Stack and practices reviewers see most in your artifacts.">
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Panel>

            <Panel title="Interests" description="Domains and causes — helps teams align on motivation, not only stack.">
              <div className="flex flex-wrap gap-2">
                {p.interests.map((item) => (
                  <Badge key={item} variant="outline" className="font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </Panel>

            <Panel title="Awards & recognition" description="Formal wins and standout loops (demo entries).">
              <ul className="space-y-3">
                {p.awards.map((a) => (
                  <li
                    key={a.id}
                    className="flex gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3 dark:bg-muted/20"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400">
                      <Award className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{a.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {a.year}
                        {a.issuer ? ` · ${a.issuer}` : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Past ratings" description="Aggregate rubric outcomes from submitted auditions and simulations.">
              <div className="grid gap-3 sm:grid-cols-2">
                {p.ratings.map((r) => {
                  const pct = r.max > 0 ? Math.round((r.score / r.max) * 100) : 0;
                  return (
                    <Surface key={r.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <Star className="size-3.5 text-amber-500" aria-hidden />
                            Rubric
                          </div>
                          <div className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{r.label}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{r.context}</div>
                        </div>
                        <ScoreBadge score={r.score} max={r.max} format="fraction" className="shrink-0" />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                        <span>{pct}% of points</span>
                        <span>{r.reviewCount} reviewers</span>
                      </div>
                    </Surface>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Panel
              title="Resume"
              description="Primary document attached to applications and shared previews."
              actions={
                <Button type="button" size="sm" variant="secondary" disabled title="Disabled in preview.">
                  <Download className="mr-1.5 size-3.5" aria-hidden />
                  Download
                </Button>
              }
            >
              <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 dark:bg-muted/15">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{p.resume.fileName}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {p.resume.updatedLabel} · {p.resume.pages} pages
                  </div>
                  <Button type="button" className="mt-3" size="sm" disabled title="Disabled in preview.">
                    Replace resume
                  </Button>
                </div>
              </div>
            </Panel>

            <Panel title="Account" description="Identity used across Metriq (preview — read only).">
              <DefinitionList
                columns={1}
                items={[
                  { term: "Display name", description: p.displayName },
                  { term: "Primary email", description: p.primaryEmail },
                  { term: "Home workspace", description: "Personal candidate workspace" },
                  { term: "Time zone", description: mockUniverse.timezone.replace("_", " ") },
                ]}
              />
            </Panel>

            <Panel title="Notifications" description="How Metriq reaches you about auditions and results.">
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Audition deadlines", on: true },
                  { label: "Reviewer feedback published", on: true },
                  { label: "Product updates", on: false },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-foreground">{row.label}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant={row.on ? "default" : "secondary"}
                      disabled
                      title="Notification toggles are disabled in this preview build."
                    >
                      {row.on ? "On" : "Off"}
                    </Button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Privacy" description="What employers can see by default.">
              <p className="text-sm text-muted-foreground">
                Proof highlights are curated by you. Employers see cards you attach to shared auditions or explicit exports — not every raw artifact.
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-4" disabled title="Privacy controls are disabled in this preview build.">
                Manage visibility
              </Button>
            </Panel>

            <Surface className="border-dashed p-4">
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <p>
                  In production, photo upload, verified links, and richer rating history would connect to your audition
                  archive — this layout is a structured preview of that experience.
                </p>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </>
  );
}

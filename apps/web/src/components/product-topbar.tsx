"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, Sparkles } from "lucide-react";

import { Badge, Breadcrumbs, Button, Modal, SearchInput, useToast } from "@metriq/ui";

import { DEFAULT_WORKSPACE_SLUG } from "../mocks/tenancy";
import { ThemeToggle } from "./theme-toggle";
import { Tooltip } from "./tooltip";

export type ProductTopbarProps = {
  onOpenMobileNav: () => void;
  breadcrumbItems: { label: string; href?: string }[];
  topRight?: React.ReactNode;
};

type SearchHit = { id: string; label: string; hint: string; href: string };

function searchCatalog(pathname: string): SearchHit[] {
  const norm = pathname.replace(/\/$/, "") || "/";
  if (norm.startsWith("/dept/")) {
    const m = norm.match(/^(\/dept\/[^/]+)/);
    const base = m?.[1] ?? `/dept/${DEFAULT_WORKSPACE_SLUG}`;
    return [
      { id: "home", label: "Workspace overview", hint: "Dashboard", href: base },
      { id: "aud", label: "Auditions", hint: "Roles and templates", href: `${base}/auditions` },
      { id: "pipe", label: "Pipeline", hint: "Candidates by stage", href: `${base}/pipeline` },
      { id: "rev", label: "Review queue", hint: "Submissions to score", href: `${base}/review` },
      { id: "cmp", label: "Compare", hint: "Side-by-side signal", href: `${base}/compare` },
      { id: "an", label: "Analytics", hint: "Funnel and rubric", href: `${base}/analytics` },
      { id: "tm", label: "Team", hint: "Members and invites", href: `${base}/team` },
      { id: "st", label: "Workspace settings", hint: "Integrations and audit", href: `${base}/settings` },
      { id: "org", label: "Organization console", hint: "Workspaces and seats", href: "/employer" },
    ];
  }
  if (norm.startsWith("/candidate")) {
    return [
      { id: "ch", label: "Candidate home", hint: "Overview", href: "/candidate" },
      { id: "caud", label: "My auditions", hint: "In progress and upcoming", href: "/candidate/auditions" },
      { id: "csub", label: "Submissions", hint: "Artifacts you submitted", href: "/candidate/submissions" },
      { id: "cres", label: "Results", hint: "Evaluated work", href: "/candidate/results" },
      { id: "cpr", label: "Proof profile", hint: "Evidence highlights", href: "/candidate/proof" },
      { id: "cset", label: "Settings", hint: "Preview preferences", href: "/candidate/settings" },
      { id: "csim", label: "Simulations", hint: "Practice runs", href: "/candidate/simulations" },
    ];
  }
  if (norm.startsWith("/employer")) {
    return [
      { id: "org", label: "Organization overview", hint: "KPIs and workspaces", href: "/employer" },
      { id: "ws", label: "Workspaces", hint: "Departments and status", href: "/employer/workspaces" },
      { id: "se", label: "Seats", hint: "Pool and allocation", href: "/employer/seats" },
      { id: "bi", label: "Billing", hint: "Stub — procurement", href: "/employer/billing" },
      { id: "sec", label: "Security", hint: "Stub — SSO defaults", href: "/employer/security" },
    ];
  }
  if (norm.startsWith("/admin")) {
    return [{ id: "adm", label: "Admin overview", hint: "Platform controls", href: "/admin" }];
  }
  return [
    { id: "login", label: "Sign in", hint: "Preview role picker", href: "/login" },
    { id: "cand", label: "Candidate preview", hint: "Mock candidate home", href: "/candidate" },
    { id: "emp", label: "Employer preview", hint: "Org console", href: "/employer" },
  ];
}

type Notif = { id: string; title: string; body: string; time: string; read: boolean };

const INITIAL_NOTIFICATIONS: Notif[] = [
  { id: "n1", title: "Reviews due", body: "Three submissions are waiting for a rubric score.", time: "12m ago", read: false },
  { id: "n2", title: "Audition milestone", body: "Intake is complete for the Senior Engineer work sample.", time: "1h ago", read: false },
  { id: "n3", title: "Seat invite sent", body: "jamie.chen@acme.test was invited to the workspace.", time: "Yesterday", read: true },
];

type QuickAction = { id: string; label: string; description: string; href?: string };

function quickActionList(pathname: string): QuickAction[] {
  const norm = pathname.replace(/\/$/, "") || "/";
  if (norm.startsWith("/dept/")) {
    const m = norm.match(/^(\/dept\/[^/]+)/);
    const base = m?.[1] ?? `/dept/${DEFAULT_WORKSPACE_SLUG}`;
    return [
      { id: "q1", label: "New audition", description: "Open the template chooser (preview).", href: `${base}/auditions/new` },
      { id: "q2", label: "Open pipeline", description: "Jump to candidate stages.", href: `${base}/pipeline` },
      { id: "q3", label: "Review queue", description: "Score the next submission.", href: `${base}/review` },
      { id: "q4", label: "Organization", description: "Workspaces, seats, billing stubs.", href: "/employer" },
    ];
  }
  if (norm.startsWith("/candidate")) {
    return [
      { id: "c1", label: "My auditions", description: "Continue an in-flight audition.", href: "/candidate/auditions" },
      { id: "c2", label: "Proof profile", description: "Curate evidence highlights.", href: "/candidate/proof" },
      { id: "c3", label: "Submissions", description: "See artifacts you shipped.", href: "/candidate/submissions" },
    ];
  }
  if (norm.startsWith("/employer")) {
    return [
      { id: "e1", label: "Add workspace", description: "Preview — opens workspaces table.", href: "/employer/workspaces" },
      { id: "e2", label: "Manage seats", description: "Preview — allocation mock.", href: "/employer/seats" },
      { id: "e3", label: "Default department", description: "Jump into hiring ops.", href: `/dept/${DEFAULT_WORKSPACE_SLUG}` },
    ];
  }
  return [
    { id: "a1", label: "Open candidate preview", description: "Mock candidate experience.", href: "/candidate" },
    { id: "a2", label: "Open employer preview", description: "Org console and departments.", href: "/employer" },
    { id: "a3", label: "Admin overview", description: "Platform surface.", href: "/admin" },
  ];
}

export function ProductTopbar({ onOpenMobileNav, breadcrumbItems, topRight }: ProductTopbarProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { push: toast } = useToast();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notif[]>(() => [...INITIAL_NOTIFICATIONS]);
  const [quickOpen, setQuickOpen] = React.useState(false);

  const catalog = React.useMemo(() => searchCatalog(pathname), [pathname]);
  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((h) => `${h.label} ${h.hint}`.toLowerCase().includes(q));
  }, [catalog, searchQuery]);

  React.useEffect(() => {
    if (!searchOpen) setSearchQuery("");
  }, [searchOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openSearch = () => setSearchOpen(true);

  const navigateHit = (hit: SearchHit) => {
    router.push(hit.href);
    setSearchOpen(false);
    toast({ title: "Navigated", description: hit.label, tone: "success" });
  };

  const markNotifRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast({ title: "Marked read", description: "Notifications are local mock data only.", tone: "default" });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotifOpen(false);
    toast({ title: "All caught up", description: "Every mock notification is marked read.", tone: "success" });
  };

  const runQuick = (a: QuickAction) => {
    if (a.href) router.push(a.href);
    setQuickOpen(false);
    toast({ title: a.label, description: a.description, tone: "default" });
  };

  return (
    <>
      <div className="flex h-14 w-full min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Tooltip label="Open navigation menu" className="shrink-0 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <Menu className="size-5 shrink-0" aria-hidden />
          </Button>
        </Tooltip>
        <div className="min-w-0 flex-1 py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
          Preview
        </Badge>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip label="Color theme: switch light or dark">
            <ThemeToggle />
          </Tooltip>
          <Tooltip label="Search and jump to a page (preview)">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="hidden border border-border px-2.5 sm:inline-flex"
              onClick={openSearch}
              aria-label="Search and jump (preview)"
            >
              <Search className="size-4 shrink-0" aria-hidden />
            </Button>
          </Tooltip>
          <Tooltip label="Notifications (preview, local mock data)">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="relative hidden border border-border px-2.5 md:inline-flex"
              onClick={() => setNotifOpen(true)}
              aria-label="Notifications (preview)"
            >
              <Bell className="size-4 shrink-0" aria-hidden />
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Button>
          </Tooltip>
          <Tooltip label="Quick actions and shortcuts (preview)">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="hidden border border-border px-2.5 lg:inline-flex"
              onClick={() => setQuickOpen(true)}
              aria-label="Quick actions (preview)"
            >
              <Sparkles className="size-4 shrink-0" aria-hidden />
            </Button>
          </Tooltip>
        </div>
        {topRight ? <div className="flex shrink-0 items-center gap-2 border-l border-border pl-3">{topRight}</div> : null}
      </div>

      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Jump to"
        description="Preview search — pick a shortcut. No server index yet."
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setSearchOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <SearchInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Filter shortcuts…" autoFocus />
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <li className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No matches. Try another word or clear the filter.
              </li>
            ) : (
              filtered.map((hit) => (
                <li key={hit.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col rounded-md border border-transparent px-3 py-2 text-left hover:border-border hover:bg-muted/60"
                    onClick={() => navigateHit(hit)}
                  >
                    <span className="text-sm font-medium text-foreground">{hit.label}</span>
                    <span className="text-xs text-muted-foreground">{hit.hint}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </Modal>

      <Modal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notifications"
        description="Mock inbox for the preview build."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all read
            </Button>
            <Button type="button" size="sm" onClick={() => setNotifOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className={`flex w-full flex-col rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  n.read
                    ? "border-border/60 bg-muted/40"
                    : "border-foreground/15 bg-muted"
                }`}
                onClick={() => {
                  if (!n.read) markNotifRead(n.id);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{n.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                {!n.read ? <span className="mt-1 text-xs font-medium text-muted-foreground">Tap to mark read</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        title="Quick actions"
        description="One-tap shortcuts — same routes as the sidebar, mocked for demos."
        footer={
          <Button type="button" variant="secondary" size="sm" onClick={() => setQuickOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {quickActionList(pathname).map((a) => (
            <Button key={a.id} type="button" variant="secondary" className="h-auto flex-col items-start gap-1 py-3 text-left" onClick={() => runQuick(a)}>
              <span className="font-medium">{a.label}</span>
              <span className="text-xs font-normal text-muted-foreground">{a.description}</span>
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
}

"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Sparkles } from "lucide-react";

import { Badge, Breadcrumbs, Button, Modal, useToast } from "@metriq/ui";

import { DEFAULT_WORKSPACE_SLUG } from "../mocks/tenancy";
import { ThemeToggle } from "./theme-toggle";
import { Tooltip } from "./tooltip";

export type ProductTopbarProps = {
  onOpenMobileNav: () => void;
  breadcrumbItems: { label: string; href?: string }[];
  topRight?: React.ReactNode;
};

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

  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notif[]>(() => [...INITIAL_NOTIFICATIONS]);
  const [quickMenuOpen, setQuickMenuOpen] = React.useState(false);
  const quickWrapRef = React.useRef<HTMLDivElement>(null);

  const quickActions = React.useMemo(() => quickActionList(pathname), [pathname]);

  React.useEffect(() => {
    if (!quickMenuOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (quickWrapRef.current?.contains(e.target as Node)) return;
      setQuickMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [quickMenuOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    setQuickMenuOpen(false);
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
        <Badge variant="secondary" className="hidden shrink-0 md:inline-flex">
          Preview
        </Badge>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5 dark:bg-muted/20">
          <Tooltip label="Color theme: switch light or dark">
            <ThemeToggle />
          </Tooltip>
          <Tooltip label="Notifications (preview, local mock data)">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="relative hidden border-0 bg-transparent px-2.5 shadow-none hover:bg-background/80 dark:hover:bg-background/10 md:inline-flex"
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
          <div ref={quickWrapRef} className="relative">
            <Tooltip label="Quick actions">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="inline-flex border-0 bg-transparent px-2 shadow-none hover:bg-background/80 dark:hover:bg-background/10"
                aria-label="Quick actions"
                aria-haspopup="menu"
                aria-expanded={quickMenuOpen}
                onClick={() => setQuickMenuOpen((o) => !o)}
              >
                <Sparkles className="size-4 shrink-0" aria-hidden />
                <ChevronDown className="ml-0.5 size-3.5 opacity-70" aria-hidden />
              </Button>
            </Tooltip>
            {quickMenuOpen ? (
              <div
                role="menu"
                aria-label="Quick actions"
                className="absolute right-0 top-full z-[100] mt-1 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg"
              >
                {quickActions.map((a) => (
                  <button
                    key={a.id}
                    role="menuitem"
                    type="button"
                    className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    onClick={() => runQuick(a)}
                  >
                    <span className="font-medium text-foreground">{a.label}</span>
                    <span className="text-xs leading-snug text-muted-foreground">{a.description}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {topRight ? <div className="flex shrink-0 items-center gap-2 border-l border-border pl-3">{topRight}</div> : null}
      </div>

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
    </>
  );
}

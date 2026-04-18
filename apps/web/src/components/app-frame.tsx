"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Film,
  GitCompare,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  Lock,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { AppShell, Button, Drawer, MainContentTransition, SidebarNav, type SidebarNavItem } from "@metriq/ui";

import { workspaceLabel } from "../mocks/tenancy";

import { ProductTopbar } from "./product-topbar";

const SIDEBAR_COLLAPSED_KEY = "metriq.sidebar.collapsed.v1";

export const APP_FRAME_NAV_ICONS = [
  "layoutDashboard",
  "clapperboard",
  "inbox",
  "trophy",
  "badgeCheck",
  "settings",
  "kanban",
  "clipboardCheck",
  "barChart",
  "users",
  "shield",
  "gitCompare",
  "sparkles",
  "building2",
  "creditCard",
  "lock",
] as const;

export type AppFrameNavIcon = (typeof APP_FRAME_NAV_ICONS)[number];

export type AppFrameNavItem = {
  key: string;
  label: string;
  href: string;
  disabled?: boolean;
  icon?: AppFrameNavIcon;
};

export type AppFrameNavGroup = {
  title?: string;
  items: AppFrameNavItem[];
};

export type AppFrameProps = {
  children: React.ReactNode;
  /** Flat list used for active matching when `navGroups` is omitted. */
  navItems: AppFrameNavItem[];
  /** Optional grouped sidebar; when set, sidebar renders these sections (still flatten for active key). */
  navGroups?: AppFrameNavGroup[];
  topRight?: React.ReactNode;
  sidebarTitle?: string;
};

const ICON_MAP: Record<AppFrameNavIcon, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  clapperboard: Film,
  inbox: Inbox,
  trophy: Trophy,
  badgeCheck: BadgeCheck,
  settings: Settings,
  kanban: KanbanSquare,
  clipboardCheck: ClipboardCheck,
  barChart: BarChart3,
  users: Users,
  shield: Shield,
  gitCompare: GitCompare,
  sparkles: Sparkles,
  building2: Building2,
  creditCard: CreditCard,
  lock: Lock,
};

function NavIcon({ name }: { name?: AppFrameNavIcon }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  return <Icon className="size-4 shrink-0" aria-hidden />;
}

function flattenNavItems(navItems: AppFrameNavItem[], navGroups?: AppFrameNavGroup[]): AppFrameNavItem[] {
  if (navGroups?.length) return navGroups.flatMap((g) => g.items);
  return navItems;
}

function activeKeyFromPath(pathname: string, items: AppFrameNavItem[]) {
  const match = items
    .filter((i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.key ?? items[0]?.key ?? undefined;
}

const SEGMENT_LABELS: Record<string, string> = {
  candidate: "Candidate",
  employer: "Employer",
  dept: "Department",
  admin: "Admin",
  auditions: "Auditions",
  submissions: "Submissions",
  results: "Results",
  proof: "Proof profile",
  settings: "Settings",
  pipeline: "Pipeline",
  review: "Review",
  analytics: "Analytics",
  team: "Team",
  simulations: "Simulations",
  stages: "Stages",
  submit: "Submit",
  evaluation: "Evaluation",
  compare: "Compare",
  new: "New",
  workspaces: "Workspaces",
  seats: "Seats",
  billing: "Billing",
  security: "Security",
};

function segmentLabel(segment: string, index: number, parts: string[]): string {
  if (parts[0] === "dept" && index === 1) return workspaceLabel(segment);
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (segment.length > 18 || /^[a-f0-9-]{10,}$/i.test(segment)) {
    const parent = parts[index - 1];
    if (parent === "auditions") return "Audition";
    if (parent === "stages") return "Stage";
    if (parent === "submissions") return "Submission";
    if (parent === "results") return "Result";
    return "View";
  }
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  const items: { label: string; href?: string }[] = [{ label: "Metriq", href: "/" }];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]!;
    acc += `/${seg}`;
    const isLast = i === parts.length - 1;
    items.push({
      label: segmentLabel(seg, i, parts),
      href: isLast ? undefined : acc,
    });
  }
  return items;
}

function toSidebarItems(items: AppFrameNavItem[]): SidebarNavItem[] {
  return items.map((i) => ({
    key: i.key,
    label: i.label,
    href: i.href,
    disabled: i.disabled,
    icon: <NavIcon name={i.icon} />,
  }));
}

export function AppFrame({ children, navItems, navGroups, topRight, sidebarTitle = "Navigation" }: AppFrameProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sidebarHydrated, setSidebarHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (raw === "1") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
    setSidebarHydrated(true);
  }, []);

  const persistCollapsed = React.useCallback((next: boolean) => {
    setSidebarCollapsed(next);
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const flatItems = React.useMemo(() => flattenNavItems(navItems, navGroups), [navItems, navGroups]);
  const activeKey = activeKeyFromPath(pathname, flatItems);
  const groups = navGroups?.length ? navGroups : [{ title: sidebarTitle, items: navItems }];

  const sidebarInner = (
    <div className="flex h-full min-h-[calc(100dvh-3.5rem)] flex-col gap-2 p-2">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {groups.map((group, idx) => (
          <SidebarNav
            key={group.title ?? `nav-${idx}`}
            title={group.title}
            items={toSidebarItems(group.items)}
            activeKey={activeKey}
            collapsed={sidebarCollapsed}
            className="border-border shadow-sm"
          />
        ))}
      </div>
      <div className="shrink-0 border-t border-border pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden w-full justify-center lg:flex"
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => persistCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight className="size-4" aria-hidden /> : <ChevronLeft className="size-4" aria-hidden />}
        </Button>
      </div>
    </div>
  );

  return (
    <AppShell
      sidebarAsideClassName={sidebarCollapsed && sidebarHydrated ? "w-[4.25rem]" : "w-64"}
      topbar={
        <ProductTopbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          breadcrumbItems={buildBreadcrumbs(pathname)}
          topRight={topRight}
        />
      }
      sidebar={sidebarInner}
    >
      <MainContentTransition routeKey={pathname} className="mx-auto w-full max-w-[1600px]">
        {children}
      </MainContentTransition>
      <Drawer
        open={mobileNavOpen}
        title={sidebarTitle}
        description="Navigate"
        side="left"
        onClose={() => setMobileNavOpen(false)}
      >
        <div className="space-y-2">
          {groups.map((group, idx) => (
            <SidebarNav
              key={`drawer-${group.title ?? idx}`}
              title={group.title}
              items={toSidebarItems(group.items)}
              activeKey={activeKey}
              onSelect={(key) => {
                const item = flatItems.find((i) => i.key === key);
                if (item?.href) router.push(item.href);
                setMobileNavOpen(false);
              }}
              className="border-0 bg-transparent shadow-none dark:bg-transparent"
            />
          ))}
        </div>
      </Drawer>
    </AppShell>
  );
}

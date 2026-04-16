"use client";

import * as React from "react";
import Link from "next/link";

import { AppFrame, type AppFrameNavGroup, type AppFrameNavItem } from "./app-frame";
import { deptPath } from "../lib/dept-path";
import { workspaceLabel } from "../mocks/tenancy";

function buildDeptNav(workspaceSlug: string): { navItems: AppFrameNavItem[]; navGroups: AppFrameNavGroup[] } {
  const p = (suffix: string) => deptPath(workspaceSlug, suffix);
  const navItems: AppFrameNavItem[] = [
    { key: "dept-dashboard", label: "Dashboard", href: p(""), icon: "layoutDashboard" },
    { key: "dept-auditions", label: "Auditions", href: p("/auditions"), icon: "clapperboard" },
    { key: "dept-pipeline", label: "Pipeline", href: p("/pipeline"), icon: "kanban" },
    { key: "dept-review", label: "Review", href: p("/review"), icon: "clipboardCheck" },
    { key: "dept-compare", label: "Compare", href: p("/compare"), icon: "gitCompare" },
    { key: "dept-analytics", label: "Analytics", href: p("/analytics"), icon: "barChart" },
    { key: "dept-team", label: "Team", href: p("/team"), icon: "users" },
    { key: "dept-settings", label: "Settings", href: p("/settings"), icon: "settings" },
  ];
  const navGroups: AppFrameNavGroup[] = [
    {
      title: "Operate",
      items: [
        { key: "dept-dashboard", label: "Dashboard", href: p(""), icon: "layoutDashboard" },
        { key: "dept-auditions", label: "Auditions", href: p("/auditions"), icon: "clapperboard" },
        { key: "dept-pipeline", label: "Pipeline", href: p("/pipeline"), icon: "kanban" },
        { key: "dept-review", label: "Review", href: p("/review"), icon: "clipboardCheck" },
        { key: "dept-compare", label: "Compare", href: p("/compare"), icon: "gitCompare" },
      ],
    },
    {
      title: "Workspace",
      items: [
        { key: "dept-analytics", label: "Analytics", href: p("/analytics"), icon: "barChart" },
        { key: "dept-team", label: "Team", href: p("/team"), icon: "users" },
        { key: "dept-settings", label: "Settings", href: p("/settings"), icon: "settings" },
      ],
    },
  ];
  return { navItems, navGroups };
}

export function DeptWorkspaceFrame({ workspaceSlug, children }: { workspaceSlug: string; children: React.ReactNode }) {
  const { navItems, navGroups } = React.useMemo(() => buildDeptNav(workspaceSlug), [workspaceSlug]);
  const title = workspaceLabel(workspaceSlug);

  return (
    <AppFrame
      navItems={navItems}
      navGroups={navGroups}
      sidebarTitle={title}
      topRight={
        <Link href="/employer" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Organization
        </Link>
      }
    >
      {children}
    </AppFrame>
  );
}

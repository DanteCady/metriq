import * as React from "react";

import { AppFrame, type AppFrameNavGroup, type AppFrameNavItem } from "../../components/app-frame";

const navItems: AppFrameNavItem[] = [
  { key: "org-home", label: "Overview", href: "/employer", icon: "layoutDashboard" },
  { key: "org-workspaces", label: "Workspaces", href: "/employer/workspaces", icon: "building2" },
  { key: "org-seats", label: "Seats", href: "/employer/seats", icon: "users" },
  { key: "org-billing", label: "Billing", href: "/employer/billing", icon: "creditCard" },
  { key: "org-security", label: "Security", href: "/employer/security", icon: "lock" },
];

const navGroups: AppFrameNavGroup[] = [
  {
    title: "Organization",
    items: [
      { key: "org-home", label: "Overview", href: "/employer", icon: "layoutDashboard" },
      { key: "org-workspaces", label: "Workspaces", href: "/employer/workspaces", icon: "building2" },
      { key: "org-seats", label: "Seats", href: "/employer/seats", icon: "users" },
    ],
  },
  {
    title: "Administration",
    items: [
      { key: "org-billing", label: "Billing", href: "/employer/billing", icon: "creditCard" },
      { key: "org-security", label: "Security", href: "/employer/security", icon: "lock" },
    ],
  },
];

export default function EmployerOrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame navItems={navItems} navGroups={navGroups} sidebarTitle="Organization">
      {children}
    </AppFrame>
  );
}

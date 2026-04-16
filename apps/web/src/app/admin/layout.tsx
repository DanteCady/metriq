import * as React from "react";

import { AppFrame, type AppFrameNavItem } from "../../components/app-frame";

const navItems: AppFrameNavItem[] = [{ key: "admin-dashboard", label: "Overview", href: "/admin", icon: "shield" }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame navItems={navItems} sidebarTitle="Admin">
      {children}
    </AppFrame>
  );
}

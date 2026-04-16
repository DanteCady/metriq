import type { Metadata } from "next";
import * as React from "react";

import { AppFrame, type AppFrameNavItem } from "../../components/app-frame";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const navItems: AppFrameNavItem[] = [{ key: "admin-dashboard", label: "Overview", href: "/admin", icon: "shield" }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame navItems={navItems} sidebarTitle="Admin">
      {children}
    </AppFrame>
  );
}

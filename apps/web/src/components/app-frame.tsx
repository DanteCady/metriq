"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { Role } from "@metriq/types";
import { AppShell, SidebarNav, TopNav } from "@metriq/ui";

import { useRoleStore } from "../state/role-store";
import { RoleSwitcher } from "./role-switcher";

function navForRole(role: Role) {
  if (role === "candidate") {
    return [
      { key: "candidate-home", label: "Dashboard", href: "/candidate" },
      { key: "candidate-sims", label: "Simulations", href: "/candidate/simulations" },
    ];
  }
  if (role === "employer") {
    return [{ key: "employer-home", label: "Employer", href: "/employer" }];
  }
  return [{ key: "admin-home", label: "Admin", href: "/admin" }];
}

function activeKeyFromPath(pathname: string, role: Role) {
  if (role === "candidate") {
    if (pathname.startsWith("/candidate/simulations")) return "candidate-sims";
    return "candidate-home";
  }
  if (role === "employer") return "employer-home";
  return "admin-home";
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const role = useRoleStore((s) => s.role);
  const pathname = usePathname() ?? "/";

  const links = navForRole(role);
  const activeKey = activeKeyFromPath(pathname, role);

  return (
    <AppShell
      topbar={
        <TopNav
          brand={<div className="text-sm font-semibold tracking-tight">Metriq</div>}
          links={links}
          activeKey={activeKey}
          right={<RoleSwitcher />}
        />
      }
      sidebar={<SidebarNav title="Navigation" items={links} activeKey={activeKey} />}
    >
      {children}
    </AppShell>
  );
}


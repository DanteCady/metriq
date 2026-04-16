import type { Metadata } from "next";
import * as React from "react";

import { AppFrame, type AppFrameNavGroup, type AppFrameNavItem } from "../../components/app-frame";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const navItems: AppFrameNavItem[] = [
  { key: "candidate-dashboard", label: "Dashboard", href: "/candidate", icon: "layoutDashboard" },
  { key: "candidate-auditions", label: "Auditions", href: "/candidate/auditions", icon: "clapperboard" },
  { key: "candidate-submissions", label: "Submissions", href: "/candidate/submissions", icon: "inbox" },
  { key: "candidate-simulations", label: "Simulations", href: "/candidate/simulations", icon: "sparkles" },
  { key: "candidate-results", label: "Results", href: "/candidate/results", icon: "trophy" },
  { key: "candidate-proof", label: "Proof profile", href: "/candidate/proof", icon: "badgeCheck" },
  { key: "candidate-settings", label: "Settings", href: "/candidate/settings", icon: "settings" },
];

const navGroups: AppFrameNavGroup[] = [
  {
    title: "Work",
    items: [
      { key: "candidate-dashboard", label: "Dashboard", href: "/candidate", icon: "layoutDashboard" },
      { key: "candidate-auditions", label: "Auditions", href: "/candidate/auditions", icon: "clapperboard" },
      { key: "candidate-submissions", label: "Submissions", href: "/candidate/submissions", icon: "inbox" },
      { key: "candidate-simulations", label: "Simulations", href: "/candidate/simulations", icon: "sparkles" },
    ],
  },
  {
    title: "Outcomes",
    items: [
      { key: "candidate-results", label: "Results", href: "/candidate/results", icon: "trophy" },
      { key: "candidate-proof", label: "Proof profile", href: "/candidate/proof", icon: "badgeCheck" },
    ],
  },
  {
    title: "Account",
    items: [{ key: "candidate-settings", label: "Settings", href: "/candidate/settings", icon: "settings" }],
  },
];

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame navItems={navItems} navGroups={navGroups} sidebarTitle="Candidate">
      {children}
    </AppFrame>
  );
}

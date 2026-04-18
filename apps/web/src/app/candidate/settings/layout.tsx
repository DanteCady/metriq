import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Candidate profile, resume, and account preferences (preview).",
};

export default function CandidateProfileSettingsLayout({ children }: { children: ReactNode }) {
  return children;
}

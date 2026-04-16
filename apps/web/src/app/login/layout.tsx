import type { Metadata } from "next";

import { RouteSegmentMotion } from "../../components/route-segment-motion";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Access Metriq: proof-of-work hiring with rubric-backed auditions and evidence-first review. Choose your workspace role to continue.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <RouteSegmentMotion>{children}</RouteSegmentMotion>;
}

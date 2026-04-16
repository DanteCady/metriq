"use client";

import { RoutePageEnter } from "@metriq/ui";

export default function CandidateTemplate({ children }: { children: React.ReactNode }) {
  return <RoutePageEnter>{children}</RoutePageEnter>;
}

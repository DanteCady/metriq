"use client";

import { RoutePageEnter } from "@metriq/ui";

export default function EmployerTemplate({ children }: { children: React.ReactNode }) {
  return <RoutePageEnter>{children}</RoutePageEnter>;
}

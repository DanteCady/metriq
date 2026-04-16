"use client";

import { RoutePageEnter } from "@metriq/ui";

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <RoutePageEnter>{children}</RoutePageEnter>;
}

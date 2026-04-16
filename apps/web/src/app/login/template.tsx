"use client";

import { RoutePageEnter } from "@metriq/ui";

export default function LoginTemplate({ children }: { children: React.ReactNode }) {
  return <RoutePageEnter>{children}</RoutePageEnter>;
}

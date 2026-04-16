"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { MainContentTransition } from "@metriq/ui";

/**
 * Path-keyed shell motion for route groups that do not use {@link AppFrame}
 * (e.g. auth). Keeps transitions consistent with the rest of the app.
 */
export function RouteSegmentMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  return <MainContentTransition routeKey={pathname}>{children}</MainContentTransition>;
}

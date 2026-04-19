"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

import type { Role } from "@metriq/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@metriq/api";
import { ToastProvider } from "@metriq/ui";

import { AppNotificationProvider } from "../lib/app-notifications";

export const trpc = createTRPCReact<AppRouter>();

/** Seeded demo org slug (`company.slug`); must match `METRIQ_ORG_SLUG` — set in root `.env`, no code default. */
function clientOrgSlug(): string | undefined {
  const v = process.env.NEXT_PUBLIC_METRIQ_ORG_SLUG?.trim();
  return v || undefined;
}

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
}

function roleFromPathname(pathname: string): Role {
  if (pathname.startsWith("/employer") || pathname.startsWith("/dept")) return "employer";
  if (pathname.startsWith("/admin")) return "admin";
  return "candidate";
}

function roleFromDocumentCookie(): Role | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )metriq\\.role=([^;]+)/);
  const v = m ? decodeURIComponent(m[1] ?? "") : "";
  if (v === "candidate" || v === "employer" || v === "admin") return v;
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const role = roleFromDocumentCookie() ?? roleFromPathname(pathname);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1 },
        },
      }),
  );
  const trpcClient = React.useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          headers() {
            const h: Record<string, string> = { "x-metriq-role": role satisfies Role };
            const org = clientOrgSlug();
            if (org) {
              h["x-metriq-org-slug"] = org;
            }
            if (typeof window !== "undefined") {
              const m = window.location.pathname.match(/^\/dept\/([^/]+)/);
              if (m?.[1]) {
                h["x-metriq-workspace-slug"] = m[1];
              }
            }
            return h;
          },
        }),
      ],
    });
  }, [role]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <AppNotificationProvider>{children}</AppNotificationProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </ToastProvider>
    </ThemeProvider>
  );
}


import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_WORKSPACE_SLUG } from "./src/mocks/tenancy";

const ROLE_COOKIE = "metriq.role";

type Role = "candidate" | "employer" | "admin";

function parseRole(value: string | undefined): Role | null {
  if (value === "candidate" || value === "employer" || value === "admin") return value;
  return null;
}

function roleHome(role: Role) {
  if (role === "employer") return "/employer";
  if (role === "admin") return "/admin";
  return "/candidate";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = parseRole(req.cookies.get(ROLE_COOKIE)?.value);

  // Public assets / internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // Login is always allowed.
  if (pathname === "/login") return NextResponse.next();

  // Root redirects to role home (or login).
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = role ? roleHome(role) : "/login";
    return NextResponse.redirect(url);
  }

  // Guard role areas.
  if (pathname.startsWith("/candidate")) {
    if (role !== "candidate") {
      const url = req.nextUrl.clone();
      url.pathname = role ? roleHome(role) : "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/employer")) {
    if (role !== "employer") {
      const url = req.nextUrl.clone();
      url.pathname = role ? roleHome(role) : "/login";
      return NextResponse.redirect(url);
    }
    const isOrgConsole =
      pathname === "/employer" ||
      pathname.startsWith("/employer/workspaces") ||
      pathname.startsWith("/employer/seats") ||
      pathname.startsWith("/employer/billing") ||
      pathname.startsWith("/employer/security");
    if (!isOrgConsole) {
      const suffix = pathname.replace(/^\/employer/, "") || "";
      const url = req.nextUrl.clone();
      url.pathname = `/dept/${DEFAULT_WORKSPACE_SLUG}${suffix}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dept")) {
    if (role !== "employer") {
      const url = req.nextUrl.clone();
      url.pathname = role ? roleHome(role) : "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = role ? roleHome(role) : "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Everything else requires a role; redirect to login if missing.
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};


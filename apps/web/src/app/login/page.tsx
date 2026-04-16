"use client";

import * as React from "react";

import { Button, PageHeader, Panel } from "@metriq/ui";

import { ThemeToggle } from "../../components/theme-toggle";
import { Tooltip } from "../../components/tooltip";

type Role = "candidate" | "employer" | "admin";

function setRoleCookie(role: Role) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `metriq.role=${role}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
}

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <Tooltip label="Color theme: switch light or dark" side="top">
          <ThemeToggle />
        </Tooltip>
      </div>
      <div className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="Sign in"
          description="Temporary auth scaffold: choose a role to enter the production UI. This will be replaced by real authentication."
        />

        <div className="mt-6 grid gap-4">
          <Panel title="Continue as" description="Select your role to enter the app.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                onClick={() => {
                  setRoleCookie("candidate");
                  window.location.href = "/candidate";
                }}
              >
                Candidate
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setRoleCookie("employer");
                  window.location.href = "/employer";
                }}
              >
                Employer
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setRoleCookie("admin");
                  window.location.href = "/admin";
                }}
              >
                Admin
              </Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Cookie: <span className="font-mono">metriq.role</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}


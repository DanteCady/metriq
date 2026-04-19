import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeptWorkspaceFrame } from "../../../components/dept-workspace-frame";
import { resolveDeptWorkspace } from "../../../server/tenancy";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function DeptWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const resolved = await resolveDeptWorkspace(workspaceSlug);
  if (!resolved) notFound();
  return <DeptWorkspaceFrame workspaceSlug={workspaceSlug}>{children}</DeptWorkspaceFrame>;
}

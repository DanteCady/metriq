import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeptWorkspaceFrame } from "../../../components/dept-workspace-frame";
import { getWorkspaceBySlug } from "../../../mocks/tenancy";

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
  if (!getWorkspaceBySlug(workspaceSlug)) notFound();
  return <DeptWorkspaceFrame workspaceSlug={workspaceSlug}>{children}</DeptWorkspaceFrame>;
}

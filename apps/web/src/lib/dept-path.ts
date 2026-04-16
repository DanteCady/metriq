/** Build a department-scoped path: `/dept/{slug}/...` */
export function deptPath(workspaceSlug: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!normalized || normalized === "/") return `/dept/${workspaceSlug}`;
  return `/dept/${workspaceSlug}${normalized}`;
}

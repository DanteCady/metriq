export type RequiredArtifact =
  | { kind: "link"; label: string }
  | { kind: "text"; label: string }
  | { kind: "fileRef"; label: string };

export function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

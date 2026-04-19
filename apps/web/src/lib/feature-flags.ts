/** Feature flags — replace with PostHog / LaunchDarkly / env-driven config in production. */
export function isFlagEnabled(key: string): boolean {
  return process.env[`METRIQ_FLAG_${key}`] === "1";
}

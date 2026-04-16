/**
 * Shared motion tokens for Framer Motion. Use with `motion` from `framer-motion`
 * when you need custom animations outside the `@metriq/ui` wrappers.
 */
export const motionEase = [0.16, 1, 0.3, 1] as const;

export const motionDurations = {
  /** Primary UI reveals */
  enter: 0.4,
  /** Lists, dense grids */
  item: 0.32,
  /** Main column on in-app navigations (keep snappy) */
  route: 0.24,
} as const;

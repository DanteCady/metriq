"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "../lib/cn";
import { motionDurations, motionEase } from "../lib/motion-presets";

type DivMotionProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition">;

export type FadeInProps = DivMotionProps & {
  /** Seconds before the transition starts */
  delay?: number;
};

/**
 * Soft fade + slight vertical travel on mount. Honors `prefers-reduced-motion`.
 */
export function FadeIn({ className, delay = 0, children, ...props }: FadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: motionDurations.enter, delay, ease: motionEase }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type StaggerProps = DivMotionProps & {
  /** Delay between each child (seconds) */
  stagger?: number;
  /** Delay before the first child animates */
  delayChildren?: number;
};

/**
 * Parent for `StaggerItem` children. Stagger runs on mount.
 */
export function Stagger({ className, stagger = 0.06, delayChildren = 0.04, children, ...props }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: reduceMotion
            ? { staggerChildren: 0, delayChildren: 0 }
            : { staggerChildren: stagger, delayChildren },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type StaggerItemProps = DivMotionProps;

/**
 * Child of `Stagger`. Animates in sync with the parent's stagger.
 */
export function StaggerItem({ className, children, ...props }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: motionDurations.item, ease: motionEase },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type RevealOnViewProps = FadeInProps & {
  /** Only animate the first time the element enters the viewport */
  once?: boolean;
  /** Intersection ratio 0–1 */
  amount?: number | "some" | "all";
};

/**
 * Like `FadeIn`, but triggers when scrolled into view (good for long pages).
 */
export function RevealOnView({
  className,
  delay = 0,
  once = true,
  amount = 0.2,
  children,
  ...props
}: RevealOnViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: motionDurations.enter, delay, ease: motionEase }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type MainContentTransitionProps = DivMotionProps & {
  /**
   * Stable key for the active route (e.g. `pathname`). When it changes, the
   * shell replays a short transition without fighting nested `FadeIn` opacity
   * (this uses **translate only** on the outer wrapper).
   */
  routeKey: string;
};

/**
 * Subtle main-column motion on navigations. Uses translate only so nested
 * `FadeIn` / opacity-based reveals still read cleanly.
 */
export function MainContentTransition({ routeKey, className, children, ...props }: MainContentTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={routeKey}
      className={cn(className)}
      initial={reduceMotion ? false : { y: 8 }}
      animate={{ y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: motionDurations.route, ease: motionEase }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type RoutePageEnterProps = DivMotionProps;

/**
 * Opacity-only entrance for `template.tsx` wrappers. Pairs with
 * {@link MainContentTransition} (translate on the shell) without stacking
 * vertical motion on the same view.
 */
export function RoutePageEnter({ className, children, ...props }: RoutePageEnterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.28, delay: 0.02, ease: motionEase }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

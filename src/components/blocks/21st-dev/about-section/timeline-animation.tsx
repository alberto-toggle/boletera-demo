"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, RefObject } from "react";

interface TimelineContentProps {
  as?: "div" | "span" | "a" | "figure" | "button";
  children: ReactNode;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants: Variants;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button";
}

/** Local replacement for the unavailable registry dependency. */
export function TimelineContent({
  as = "div", animationNum, timelineRef, customVariants, children, ...props
}: TimelineContentProps) {
  const visible = useInView(timelineRef, { once: true, amount: 0.1 });
  const reducedMotion = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={reducedMotion ? false : "hidden"}
      animate={visible || reducedMotion ? "visible" : "hidden"}
      variants={reducedMotion ? { visible: { opacity: 1, y: 0, filter: "none" } } : customVariants}
      custom={animationNum}
      {...props}
    >
      {children}
    </Component>
  );
}

"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StickyScrollItem {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const reducedMotion = useReducedMotion();
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "rgb(15 23 42)", // slate-900
    "rgb(0 0 0)", // black
    "rgb(23 23 23)", // neutral-900
  ];

  const linearGradients = [
    "linear-gradient(to bottom right, rgb(6 182 212), rgb(16 185 129))", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, rgb(236 72 153), rgb(99 102 241))", // pink-500 to indigo-500
    "linear-gradient(to bottom right, rgb(249 115 22), rgb(234 179 8))", // orange-500 to yellow-500
  ];

  const backgroundGradient = linearGradients[activeCard % linearGradients.length];

  return (
    <motion.div
      tabIndex={0}
      role="region"
      aria-label="Contenido que se revela al desplazarse"
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="@container h-[30rem] overflow-y-auto overscroll-y-contain flex justify-center relative gap-6 rounded-md p-4 sm:p-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      ref={ref}
    >
      <div className="relative flex min-w-0 flex-1 items-start px-2">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={false}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
                animate={{
                  opacity: reducedMotion || activeCard === index ? 1 : 0.5,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={false}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
                animate={{
                  opacity: reducedMotion || activeCard === index ? 1 : 0.5,
                }}
                className="text-lg text-slate-300 max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
              {item.content && <div className="mt-6 h-60 overflow-hidden rounded-md @min-[700px]:hidden" style={{ background: linearGradients[index % linearGradients.length] }}>{item.content}</div>}
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "hidden @min-[700px]:block shrink-0 h-60 w-80 rounded-md bg-white sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[Math.min(activeCard, content.length - 1)]?.content ?? null}
      </div>
    </motion.div>
  );
};

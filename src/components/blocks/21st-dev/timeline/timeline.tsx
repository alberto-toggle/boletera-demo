"use client";
import {
  useReducedMotion,
  type UseScrollOptions,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data, scrollContainer }: { data: readonly TimelineEntry[]; scrollContainer?: UseScrollOptions["container"] }) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="@container w-full bg-white dark:bg-neutral-950 font-sans @min-[768px]:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 @min-[768px]:px-8 @min-[1024px]:px-10">
        <h2 className="text-lg @min-[768px]:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Changelog from my journey
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm @min-[768px]:text-base max-w-sm">
          I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
          a timeline of my journey.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 @min-[768px]:pt-40 @min-[768px]:gap-10"
          >
            <div className="sticky flex flex-col @min-[768px]:flex-row z-10 items-center top-40 self-start max-w-xs @min-[1024px]:max-w-sm @min-[768px]:w-full">
              <div className="h-10 absolute left-3 @min-[768px]:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden @min-[768px]:block text-xl @min-[768px]:pl-20 @min-[768px]:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 @min-[768px]:pl-4 w-full">
              <h3 className="@min-[768px]:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute @min-[768px]:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: reducedMotion ? height : heightTransform,
              opacity: reducedMotion ? 1 : opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

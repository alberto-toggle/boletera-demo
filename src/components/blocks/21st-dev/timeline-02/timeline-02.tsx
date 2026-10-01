"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
}

interface TimelineProps {
  items: readonly TimelineItem[];
  className?: string;
}

export const Timeline = ({
  items,
  className,
}: TimelineProps) => {
  const [selectedIndex, setActiveIndex] = useState(() => Math.min(2, Math.max(0, items.length - 1)));
  const activeIndex = Math.min(selectedIndex, items.length - 1);
  const reducedMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const activeItem = items[activeIndex];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeRef = buttonRefs.current[activeIndex];
    const list = listRef.current;
    if (activeRef && list) {
      list.scrollTo({
        top: activeRef.offsetTop - list.clientHeight / 2 + activeRef.offsetHeight / 2,
        left: activeRef.offsetLeft - list.clientWidth / 2 + activeRef.offsetWidth / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [activeIndex, reducedMotion]);

  if (!activeItem) return <p className="text-sm text-muted-foreground">No hay hitos para mostrar.</p>;

  return (
    <div className={cn("@container w-full", className)}>
      <div className="grid grid-cols-12 gap-6">
        <div className="relative flex flex-col items-center shrink-0 w-full @min-[900px]:w-auto @min-[900px]:col-span-1 col-span-12">
          <div
            ref={listRef}
            role="group"
            aria-label="Seleccionar año"
            className="relative flex flex-row @min-[900px]:flex-col gap-6 @min-[900px]:h-105 overflow-auto no-scrollbar @min-[768px]:snap-y snap-x @min-[900px]:py-40 @min-[900px]:px-0 px-40 snap-mandatory w-full"
            
          >
            {items.map((item, index) => (
              <Button
                aria-pressed={activeIndex === index}
                variant={activeIndex === index ? "default" : "outline"}
                key={item.year}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "rounded-full px-5! transition-all duration-300 motion-reduce:transition-none shrink-0 snap-center",
                )}
              >
                <span className="text-sm font-medium tracking-tight">
                  {item.year}
                </span>
              </Button>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background to-transparent pointer-events-none z-10 @min-[900px]:block hidden" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent pointer-events-none z-10 @min-[900px]:block hidden" />
        </div>

        <div className="flex-1 flex flex-col @min-[900px]:flex-row items-center gap-12 @min-[900px]:gap-24 w-full overflow-hidden @min-[900px]:col-span-11 col-span-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.year}
              initial={reducedMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reducedMotion ? 0 : -20 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeInOut" }}
              className="flex-1 grid @min-[900px]:grid-cols-11 grid-cols-1 items-center gap-6 w-full"
            >
              <div className="flex-1 flex flex-col items-start gap-3 @min-[1100px]:ps-10 @min-[1100px]:pe-16 @min-[900px]:col-span-6">
                <Badge
                  variant="secondary"
                  className="rounded-full h-6 px-2 py-1 font-normal"
                >
                  {activeItem.badge}
                </Badge>
                <h2 className="text-5xl @min-[768px]:text-5xl @min-[900px]:text-8xl font-medium tracking-tight text-foreground">
                  {activeItem.year}
                </h2>
                <h3 className="text-2xl font-medium text-foreground leading-tight">
                  {activeItem.title}
                </h3>
                <p className="@min-[640px]:text-lg text-base text-muted-foreground leading-relaxed max-w-xl">
                  {activeItem.description}
                </p>
              </div>

              <div className="w-full flex flex-col gap-4 @min-[900px]:ps-5 @min-[900px]:col-span-5">
                <div className="w-full rounded-lg overflow-hidden bg-muted max-h-68 @min-[768px]:max-h-91 aspect-11/9 @min-[768px]:aspect-6/3 @min-[900px]:aspect-11/9">
                  <Image
                    width={1200}
                    height={900}
                    unoptimized
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {activeItem.link && (
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:-rotate-45 duration-200 transition-all" />
                  </a>
                )}


              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

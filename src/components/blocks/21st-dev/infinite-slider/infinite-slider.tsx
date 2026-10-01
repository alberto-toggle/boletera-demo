'use client';

import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect, type ReactNode } from 'react';
import useMeasure from 'react-use-measure';

export interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  paused?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  paused = false,
  className,
}: InfiniteSliderProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ref, { width, height }] = useMeasure();
  const reducedMotion = useReducedMotion();
  const translation = useMotionValue(0);
  const currentDuration = hovered ? durationOnHover ?? duration : duration;
  const distance = (direction === 'horizontal' ? width : height) + gap;

  useEffect(() => {
    if (reducedMotion) {
      translation.set(0);
      return;
    }
    if (paused || focused || distance <= gap || currentDuration <= 0) return;

    const from = reverse ? -distance : 0;
    const to = reverse ? 0 : -distance;
    let current = Math.max(-distance, Math.min(0, translation.get()));
    if (current === to) current = from;
    translation.set(current);

    let disposed = false;
    let controls: ReturnType<typeof animate> | undefined;
    const loop = () => {
      if (disposed) return;
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
      });
    };

    controls = animate(translation, [current, to], {
      ease: 'linear',
      duration: currentDuration * Math.abs((to - current) / distance),
      onComplete: loop,
    });
    return () => {
      disposed = true;
      controls?.stop();
    };
  }, [translation, currentDuration, distance, gap, reverse, paused, focused, reducedMotion]);

  const groupStyle = {
    gap,
    flexDirection: direction === 'horizontal' ? 'row' as const : 'column' as const,
  };

  return (
    <div
      className={cn(reducedMotion ? 'overflow-auto' : 'overflow-hidden', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          ...groupStyle,
        }}
      >
        <div ref={ref} className="flex shrink-0 items-center" style={groupStyle}>
          {children}
        </div>
        {!reducedMotion && (
          <div aria-hidden="true" inert className="flex shrink-0 items-center" style={groupStyle}>
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
}

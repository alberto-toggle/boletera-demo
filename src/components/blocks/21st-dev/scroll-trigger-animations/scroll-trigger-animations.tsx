'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  HTMLMotionProps,
  MapInputRange,
  motion,
  MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
  type UseScrollOptions,
} from 'framer-motion';
interface ContainerScrollAnimationContextValue {
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
}
const ContainerScrollAnimationContext = React.createContext<
  ContainerScrollAnimationContextValue | undefined
>(undefined);

export function useContainerScrollAnimationContext() {
  const context = React.useContext(ContainerScrollAnimationContext);
  if (!context) {
    throw new Error(
      'useContainerScrollAnimationContext must be used within a ContainerScrollAnimationContextProvider',
    );
  }
  return context;
}

export function ContainerScrollAnimation({
  spacerClass,
  container,
  offset,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  spacerClass?: string;
  container?: UseScrollOptions['container'];
  offset?: UseScrollOptions['offset'];
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    container,
    offset,
  });
  return (
    <ContainerScrollAnimationContext.Provider value={{ scrollYProgress, reducedMotion }}>
      <div ref={scrollRef} className={cn('relative', className)} {...props}>
        {children}
        <div className={cn('w-full h-96', spacerClass)} />
      </div>
    </ContainerScrollAnimationContext.Provider>
  );
}

export function ContainerScrollInsetX({
  insetRange = [48, 0],
  inputRange = [0, 1],
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & { insetRange?: number[]; inputRange?: number[] }) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const xInset = useTransform(scrollYProgress, inputRange, insetRange);
  const clipPath = useMotionTemplate`inset(0px ${xInset}px)`;
  return (
    <motion.div
      className={className}
      style={{ clipPath: reducedMotion ? 'none' : clipPath, ...style }}
      {...props}
    />
  );
}
export function ContainerScrollInsetY({
  insetRange = [48, 0],
  inputRange = [0, 1],
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & { insetRange?: number[]; inputRange?: number[] }) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const yInset = useTransform(scrollYProgress, inputRange, insetRange);
  const clipPath = useMotionTemplate`inset(${yInset}px 0px)`;
  return (
    <motion.div
      className={className}
      style={{ clipPath: reducedMotion ? 'none' : clipPath, ...style }}
      {...props}
    />
  );
}

export function ContainerScrollInset({
  inputRange = [0, 1],
  insetRangeY = [45, 0],
  insetXRange = [45, 0],
  roundednessRange = [16, 16],
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & {
  inputRange?: MapInputRange;
  insetRangeY?: number[];
  insetXRange?: number[];
  roundednessRange?: number[];
}) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const insetY = useTransform(scrollYProgress, inputRange, insetRangeY);
  const insetX = useTransform(scrollYProgress, inputRange, insetXRange);
  const roundedness = useTransform(
    scrollYProgress,
    inputRange,
    roundednessRange,
  );

  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;
  return (
    <motion.div
      className={className}
      style={{ clipPath: reducedMotion ? 'none' : clipPath, ...style }}
      {...props}
    />
  );
}

export function ContainerScrollTranslate({
  yRange = [0, 384],
  inputRange = [0, 1],
  style,
  className,
  ...props
}: HTMLMotionProps<'div'> & { yRange?: number[]; inputRange?: number[] }) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const y = useTransform(scrollYProgress, inputRange, yRange);
  return (
    <motion.div
      style={{ y: reducedMotion ? 0 : y, ...style }}
      className={cn('relative', className)}
      {...props}
    />
  );
}

export function ContainerScrollScale({
  scaleRange = [1.2, 1],
  inputRange = [0, 1],
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & { scaleRange?: number[]; inputRange?: number[] }) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const scale = useTransform(scrollYProgress, inputRange, scaleRange);
  return (
    <motion.div className={className} style={{ scale: reducedMotion ? 1 : scale, ...style }} {...props} />
  );
}
export function ContainerScrollRadius({
  radiusRange = [9999, 16],
  inputRange = [0, 1],
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & {
  radiusRange?: number[];
  inputRange?: number[];
}) {
  const { scrollYProgress, reducedMotion } = useContainerScrollAnimationContext();
  const borderRadius = useTransform(scrollYProgress, inputRange, radiusRange);
  return (
    <motion.div
      layout={!reducedMotion}
      className={className}
      style={{ borderRadius: reducedMotion ? radiusRange.at(-1) : borderRadius, ...style }}
      {...props}
    />
  );
}

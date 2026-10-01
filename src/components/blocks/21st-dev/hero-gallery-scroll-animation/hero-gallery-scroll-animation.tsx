"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type UseScrollOptions,
} from "framer-motion"

import { cn } from "@/lib/utils"

const bentoGridVariants = cva(
  "relative grid gap-4 [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right",
  {
    variants: {
      variant: {
        default: `
          grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
          [&>*:first-child]:col-span-8 @min-[768px]:[&>*:first-child]:col-span-6 [&>*:first-child]:row-span-3
          [&>*:nth-child(2)]:col-span-2 @min-[768px]:[&>*:nth-child(2)]:row-span-2 [&>*:nth-child(2)]:hidden @min-[768px]:[&>*:nth-child(2)]:block
          [&>*:nth-child(3)]:col-span-2 @min-[768px]:[&>*:nth-child(3)]:row-span-2 [&>*:nth-child(3)]:hidden @min-[768px]:[&>*:nth-child(3)]:block
          [&>*:nth-child(4)]:col-span-4 @min-[768px]:[&>*:nth-child(4)]:col-span-3
          [&>*:nth-child(5)]:col-span-4 @min-[768px]:[&>*:nth-child(5)]:col-span-3
        `,
        threeCells: `
          grid-cols-2 grid-rows-2
          [&>*:first-child]:col-span-2
      `,
        fourCells: `
        grid-cols-3 grid-rows-2
        [&>*:first-child]:col-span-1
        [&>*:nth-child(2)]:col-span-2
        [&>*:nth-child(3)]:col-span-2
      `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
  reducedMotion: boolean
}
const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)
function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    )
  }
  return context
}
const ContainerScroll = ({
  container,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { container?: UseScrollOptions["container"] }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    container,
    offset: ["start start", "end end"],
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, reducedMotion }}>
      <div
        ref={scrollRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof bentoGridVariants>
>(({ variant, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(bentoGridVariants({ variant }), className)}
      {...props}
    />
  )
})
BentoGrid.displayName = "BentoGrid"

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress, reducedMotion } = useContainerScrollContext()
    const translate = useTransform(scrollYProgress, [0.1, 0.9], ["-35%", "0%"])
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate: reducedMotion ? "0%" : translate, scale: reducedMotion ? 1 : scale, ...style }}
        {...props}
      ></motion.div>
    )
  }
)
BentoCell.displayName = "BentoCell"

const ContainerScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress, reducedMotion } = useContainerScrollContext()
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const [hidden, setHidden] = React.useState(false)
    useMotionValueEvent(scrollYProgress, "change", (progress) => setHidden(progress >= 0.5))
    return (
      <motion.div
        ref={ref}
        inert={!reducedMotion && hidden}
        aria-hidden={!reducedMotion && hidden}
        className={cn("absolute left-1/2 top-1/2 w-[min(90%,36rem)]", className)}
        style={{
          translate: "-50% -50%",
          scale: reducedMotion ? 1 : scale,
          opacity: reducedMotion ? 1 : opacity,
          ...style,
        }}
        {...props}
      />
    )
  }
)
ContainerScale.displayName = "ContainerScale"
export { ContainerScroll, BentoGrid, BentoCell, ContainerScale }

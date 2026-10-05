"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import styles from "./circular-testimonials.module.css";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
export interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return (
    minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  );
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = false,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  // Color & font config
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex % testimonials.length],
    [activeIndex, testimonials],
  );

  // Responsive gap calculation
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width),
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay && !paused && !reduced && testimonialsLength > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current)
        clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, paused, reduced, testimonialsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (testimonialsLength < 2) return;
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  const handlePrev = useCallback(() => {
    if (testimonialsLength < 2) return;
    setActiveIndex(
      (prev) => (prev - 1 + testimonialsLength) % testimonialsLength,
    );
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = Math.min(calculateGap(containerWidth), containerWidth * 0.2);
    const maxStickUp = gap * 0.8;
    // const zIndex = testimonialsLength - Math.abs(offset);
    const isActive = index === activeIndex;
    const isLeft =
      (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants for quote
  const quoteVariants = {
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -20 },
  };

  if (!activeTestimonial) return null;

  return (
    <div
      className={styles["testimonial-container"]}
      role="region"
      aria-label="Testimonios"
      aria-roledescription="carrusel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          if (event.key === "ArrowLeft") handlePrev();
          else handleNext();
        }
      }}
    >
      <div className={styles["testimonial-grid"]}>
        {/* Images */}
        <div className={styles["image-container"]} ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <Image
              unoptimized
              width={600}
              height={800}
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              className={styles["testimonial-image"]}
              data-index={index}
              style={getImageStyle(index)}
            />
          ))}
        </div>
        {/* Content */}
        <div className={styles["testimonial-content"]}>
          <div
            aria-live={autoplay && !paused ? "off" : "polite"}
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={quoteVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: reduced ? 0 : 0.3, ease: "easeInOut" }}
              >
                <h3
                  className={styles["name"]}
                  style={{ color: colorName, fontSize: fontSizeName }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className={styles["designation"]}
                  style={{
                    color: colorDesignation,
                    fontSize: fontSizeDesignation,
                  }}
                >
                  {activeTestimonial.designation}
                </p>
                <motion.p
                  className={styles["quote"]}
                  style={{ color: colorTestimony, fontSize: fontSizeQuote }}
                >
                  {activeTestimonial.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{
                        filter: reduced ? "none" : "blur(10px)",
                        opacity: reduced ? 1 : 0,
                        y: reduced ? 0 : 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: reduced ? 0 : 0.22,
                        ease: "easeInOut",
                        delay: reduced ? 0 : 0.025 * i,
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
          {autoplay && !reduced && testimonialsLength > 1 && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="mt-4 cursor-pointer self-start text-sm underline underline-offset-4"
              style={{ color: colorName }}
            >
              {paused ? "Reanudar" : "Pausar"}
            </button>
          )}
          <div className={styles["arrow-buttons"]}>
            <button
              type="button"
              disabled={testimonialsLength < 2}
              className={styles["arrow-button"]}
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Testimonio anterior"
            >
              <FaArrowLeft size={28} color={colorArrowFg} />
            </button>
            <button
              type="button"
              disabled={testimonialsLength < 2}
              className={styles["arrow-button"]}
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Siguiente testimonio"
            >
              <FaArrowRight size={28} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CardData {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

const cards: CardData[] = [
  {
    id: 1,
    title: "Liquid Motion",
    description:
      "Experience the fluid dynamics of modern web interactions with physics-based animations.",
    category: "Animation",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    author: { name: "Alex Rivera", avatar: "https://github.com/shadcn.png" },
    date: "Dec 12, 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Glassmorphism",
    description:
      "Blur the lines between layers with advanced backdrop filters and transparency effects.",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    author: { name: "Sarah Chen", avatar: "https://github.com/shadcn.png" },
    date: "Dec 10, 2024",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Dark Mode",
    description:
      "Easy on the eyes, elegant in appearance. A seamless transition to the dark side.",
    category: "Theme",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
    author: { name: "Mike Johnson", avatar: "https://github.com/shadcn.png" },
    date: "Dec 8, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Micro-Interactions",
    description:
      "Delightful details that make the difference between good and great user experience.",
    category: "UX",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    author: { name: "Emily Davis", avatar: "https://github.com/shadcn.png" },
    date: "Dec 5, 2024",
    readTime: "3 min read",
  },
  {
    id: 5,
    title: "Responsive Layouts",
    description:
      "Fluid grids that adapt to any screen size, ensuring your content looks perfect everywhere.",
    category: "Layout",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    author: { name: "David Kim", avatar: "https://github.com/shadcn.png" },
    date: "Dec 3, 2024",
    readTime: "7 min read",
  },
];

export function CardsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const x = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  useMotionValueEvent(x, "change", setPosition);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const measure = () => {
      const limit = Math.max(0, track.scrollWidth - container.clientWidth);
      setWidth(limit);
      x.stop();
      x.set(Math.max(-limit, Math.min(0, x.get())));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(track);
    const frame = requestAnimationFrame(measure);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); x.stop(); };
  }, [x]);

  const scrollTo = (direction: "left" | "right") => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.clientWidth || 0;
    const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width

    let newX =
      direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    // Clamp values
    newX = Math.max(Math.min(newX, 0), -width);

    x.stop();
    if (reducedMotion) { x.set(newX); return; }
    animate(x, newX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <div className="@container w-full max-w-6xl mx-auto p-4 sm:p-8 relative group/slider">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 opacity-100">
        <button
          type="button"
          disabled={position >= -1}
          onClick={() => scrollTo("left")}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95 motion-reduce:transition-none motion-reduce:transform-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 opacity-100">
        <button
          type="button"
          disabled={position <= -width + 1}
          onClick={() => scrollTo("right")}
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all active:scale-95 motion-reduce:transition-none motion-reduce:transform-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        ref={containerRef}
        role="region"
        aria-label="Cards slider"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollTo(event.key === "ArrowLeft" ? "left" : "right");
          }
        }}
        className="cursor-grab active:cursor-grabbing overflow-hidden py-4 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          ref={trackRef}
          drag="x"
          onDragStart={() => x.stop()}
          dragMomentum={false}
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0}
          style={{ x, touchAction: "pan-y" }}
          className="flex w-max gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="w-[min(320px,calc(100cqw-2rem))] shrink-0"
              whileHover={reducedMotion ? undefined : { y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="group relative h-full gap-0 py-0 overflow-hidden rounded-3xl border-border/50 bg-card/30 backdrop-blur-md transition-all duration-500 motion-reduce:transition-none hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    draggable={false}
                    loading="lazy"
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-background/50 backdrop-blur-md border-white/10 text-xs font-medium px-3 py-1"
                    >
                      {card.category}
                    </Badge>
                  </div>

                  {/* Hover Overlay Action */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <motion.button
                      type="button"
                      disabled
                      title="Demo only"
                      className="flex items-center gap-2 rounded-full bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 px-5 py-2 text-sm font-semibold text-black shadow-lg"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 flex flex-1 flex-col gap-4 justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {card.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-border/50 ring-2 ring-background">
                        <AvatarImage
                          src={card.author.avatar}
                          alt={card.author.name}
                        />
                        <AvatarFallback>{card.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          {card.author.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {card.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{card.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

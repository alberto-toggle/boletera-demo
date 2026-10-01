"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "./hero-gallery-scroll-animation";
import { heroGalleryImages } from "./hero-gallery-data";

type Variant = "default" | "fourCells" | "threeCells";

function GalleryPreview({ variant }: { variant: Variant }) {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const dark = variant === "threeCells";
  const count = variant === "default" ? 5 : variant === "fourCells" ? 4 : 3;
  const expand = () => container.current?.scrollTo({ top: (container.current?.clientHeight ?? 0) * 2.5, behavior: reducedMotion ? "instant" : "smooth" });

  return (
    <div ref={container} tabIndex={0} role="region" aria-label="Hero con galería animada"
      className={`@container relative h-[min(80svh,800px)] min-h-96 overflow-y-auto overscroll-y-contain rounded-xl [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${dark ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-800"}`}>
      <ContainerScroll container={container} className={reducedMotion ? "h-[100cqh]" : "h-[350cqh]"}>
        <div className="sticky top-0 h-[100cqh] overflow-hidden">
          <BentoGrid variant={variant} className="h-full w-full p-4">
            {heroGalleryImages.slice(0, count).map((src, index) => (
              <BentoCell key={src} className="relative min-h-0 overflow-hidden rounded-xl shadow-xl">
                <Image src={src} alt={`Imagen de la galería ${index + 1}`} fill unoptimized sizes="(max-width: 768px) 100vw, 70vw" className="object-cover object-center" />
              </BentoCell>
            ))}
          </BentoGrid>
          <ContainerScale className="z-10 text-center">
            <h2 className="text-4xl font-bold tracking-tighter @min-[640px]:text-5xl">Your Animated Hero</h2>
            <p className="my-6 text-sm @min-[640px]:text-base">
              Yet another hero section, this time with scroll trigger animations,
              animating the hero content with motion.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={expand} className="bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">Get Started</Button>
              <Button onClick={expand} variant="link" className="px-4 py-2 font-medium text-current">Learn more</Button>
            </div>
          </ContainerScale>
        </div>
      </ContainerScroll>
    </div>
  );
}

export default function HeroGalleryDemo() {
  const [variant, setVariant] = useState<Variant>("default");
  return (
    <div>
      <div role="group" aria-label="Variantes de la galería" className="mb-4 flex flex-wrap gap-2">
        {(["default", "fourCells", "threeCells"] as const).map((value, index) => (
          <Button key={value} variant={variant === value ? "default" : "outline"} aria-pressed={variant === value} onClick={() => setVariant(value)}>
            {5 - index} imágenes{value === "threeCells" ? " · Oscuro" : ""}
          </Button>
        ))}
      </div>
      <GalleryPreview key={variant} variant={variant} />
    </div>
  );
}

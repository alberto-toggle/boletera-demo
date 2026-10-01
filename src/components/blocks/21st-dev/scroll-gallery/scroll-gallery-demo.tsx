"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ScrollGallery } from "./scroll-gallery";
import { scrollGallerySlides } from "./scroll-gallery-data";

export default function ScrollGalleryDemo() {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={setScroller}
      tabIndex={0}
      role="region"
      aria-label="Galería con desplazamiento vertical"
      className="h-[min(75svh,760px)] min-h-80 w-full overflow-y-auto overscroll-y-contain rounded-xl bg-black text-white [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {reducedMotion ? (
        <div>
          {scrollGallerySlides.map((slide) => (
            <figure key={slide.image} className="relative h-[100cqh]">
              <Image src={slide.image} alt={slide.title} fill unoptimized sizes="100vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-6 text-xl">{slide.title}</figcaption>
            </figure>
          ))}
        </div>
      ) : scroller ? (
        <ScrollGallery
          slides={scrollGallerySlides}
          variant="studio"
          embedded
          containerQuery
          scroller={scroller}
          prefixLabel="Featured"
          showLink={false}
          classNames={{
            infoInner: "gap-4 px-4 @min-[700px]:px-9",
            prefix: "hidden @min-[700px]:block",
            prefixText: "text-[18px] @min-[700px]:text-[28px]",
            title: "h-10 flex-1 max-[1000px]:h-10",
            titleText: "text-[22px] max-[1000px]:text-[22px] @min-[700px]:text-[28px]",
          }}
        />
      ) : null}
    </div>
  );
}

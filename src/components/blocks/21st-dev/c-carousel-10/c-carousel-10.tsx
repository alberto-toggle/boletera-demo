"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const ITEMS_COUNT = 10;

export function Carousel10() {
  const reducedMotion = useReducedMotion();
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index, !!reducedMotion);
    },
    [mainApi, thumbApi, reducedMotion],
  );

  const subscribe = useCallback((notify: () => void) => {
    if (!mainApi) return () => {};
    mainApi.on("select", notify);
    mainApi.on("reInit", notify);
    return () => {
      mainApi.off("select", notify);
      mainApi.off("reInit", notify);
    };
  }, [mainApi]);
  const selectedIndex = useSyncExternalStore(subscribe, () => mainApi?.selectedScrollSnap() ?? 0, () => 0);

  useEffect(() => {
    thumbApi?.scrollTo(selectedIndex, !!reducedMotion);
  }, [thumbApi, selectedIndex, reducedMotion]);

  return (
    <div className="@container flex w-full max-w-2xl items-center justify-center p-4">
      <div className="group relative w-full overflow-hidden rounded-xl">
        {/* Main Carousel */}
        <Carousel setApi={setMainApi} className="w-full" tabIndex={0} aria-label="Galería de imágenes">
          <CarouselContent>
            {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  <Image unoptimized
                    src={`https://picsum.photos/seed/carousel-${index + 60}/1200/675?grayscale`}
                    alt={`Fotografía ${index + 1}`}
                    width={1200}
                    height={675}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Overlay Thumbnails Container */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4 transition-opacity duration-300">
          <div className="relative mx-auto w-full max-w-md">
            <Carousel
              aria-label="Miniaturas"
              setApi={setThumbApi}
              opts={{
                containScroll: "keepSnaps",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 flex-row">
                {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/4 pl-2 @min-[640px]:basis-1/8"
                  >
                    <button
                      type="button"
                      onClick={() => onThumbClick(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-pressed={index === selectedIndex}
                      className={cn(
                        "relative block w-full cursor-pointer aspect-square overflow-hidden rounded-md border-2 transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                        index === selectedIndex
                          ? "border-white opacity-100 ring-2 ring-black/20"
                          : "border-white/40 opacity-50 hover:opacity-80",
                      )}
                    >
                      <Image unoptimized
                        src={`https://picsum.photos/seed/carousel-${index + 60}/200/200?grayscale`}
                        alt=""
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Carousel10;
